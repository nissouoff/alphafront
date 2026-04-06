import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const FETCH_TIMEOUT = 20000;
const MAX_RETRIES = 3;

interface ApiResponse<T = unknown> {
  message?: string;
  user?: T;
  token?: string;
  errors?: Record<string, string[]>;
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && (error.name === 'AbortError' || error.message.includes('fetch') || error.message.includes('network') || (typeof window !== 'undefined' && !navigator.onLine))) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchWithRetry(url, options, retries - 1);
    }
    
    if (error.name === 'AbortError') {
      throw new Error('La connexion est lente. Veuillez patienter...');
    }
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Problème de connexion. Vérifiez votre internet.');
    }
    throw error;
  }
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  name: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  if (!response.ok) {
    if (contentType?.includes('application/json')) {
      try {
        const data = JSON.parse(text);
        const errorMessage = data.errors 
          ? Object.values(data.errors).flat().join(', ') 
          : data.message || `Erreur ${response.status}`;
        throw new Error(errorMessage);
      } catch (e) {
        throw e;
      }
    }
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  if (!text) {
    return {} as T;
  }
  
  if (contentType?.includes('application/json')) {
    return JSON.parse(text) as T;
  }
  
  return text as unknown as T;
}

export async function login(email: string, password: string): Promise<ApiResponse<FirebaseUser>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user: FirebaseUser = {
      uid: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || null,
    };

    localStorage.setItem('auth_user', JSON.stringify(user));

    return {
      message: 'Connexion réussie !',
      user,
      token: data.session?.access_token,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Échec de la connexion');
  }
}

export async function register(name: string, email: string, password: string): Promise<ApiResponse<FirebaseUser>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    const user: FirebaseUser = {
      uid: data.user?.id || '',
      email: data.user?.email,
      name,
    };

    if (data.user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }

    return {
      message: 'Inscription réussie !',
      user,
      token: data.session?.access_token,
    };
  } catch (error: any) {
    console.error('Register error:', error);
    throw new Error(error.message || "Échec de l'inscription");
  }
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  localStorage.removeItem('auth_user');
}

export async function getCurrentUser(): Promise<FirebaseUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  return {
    uid: user.id,
    email: user.email,
    name: user.user_metadata?.name || null,
  };
}

export async function getCurrentUserToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export function getStoredUser(): FirebaseUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('auth_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setUser(user: FirebaseUser): void {
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem('auth_user');
}

export interface Landing {
  id: string;
  name: string;
  slug: string;
  type: string;
  isLanding: boolean;
  content: Record<string, any>;
  products: Product[];
  isPublished: boolean;
  is_published?: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  biography: string;
  photos: string[];
  mainPhoto: number;
  stock: number;
  unlimitedStock: boolean;
  isOnSale?: boolean;
  oldPrice?: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getCurrentUserToken();
  if (!token) {
    throw new Error('Non authentifié. Veuillez vous reconnecter.');
  }
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function getLandings(type?: 'landing' | 'boutique' | 'all'): Promise<{ landings: Landing[] }> {
  const headers = await getAuthHeaders();
  let url = `${API_URL}/landings`;
  if (type && type !== 'all') {
    url += `?type=${type}`;
  }
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

export async function createLanding(name: string, type: string, isLanding: boolean = true): Promise<{ landing: Landing; message: string } | any> {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/landings`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, type, isLanding }),
  });
  const result = await handleResponse(response);
  console.log('Create landing result:', result);
  return result;
}

export async function getLanding(id: string): Promise<{ landing: Landing }> {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/landings/${id}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

export async function updateLanding(id: string | null, data: Partial<Landing>): Promise<{ landing: Landing; message: string }> {
  const headers = await getAuthHeaders();
  if (id) {
    const response = await fetchWithRetry(`${API_URL}/landings/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } else {
    const response = await fetchWithRetry(`${API_URL}/landings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
}

export async function deleteLanding(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/landings/${id}`, {
    method: 'DELETE',
    headers,
  });
  return handleResponse(response);
}

export async function publishLanding(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/landings/${id}/publish`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
}

export async function unpublishLanding(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/landings/${id}/unpublish`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
}

export async function uploadImage(file: File, folder: string = 'general'): Promise<{ url: string }> {
  const token = await getCurrentUserToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const response = await fetchWithRetry(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
}

export interface Order {
  id: string;
  landingId: string;
  landingSlug?: string;
  productId?: string;
  productName?: string;
  productPrice?: string;
  productPhoto?: string;
  quantity: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerWilaya?: string;
  customerCommune?: string;
  customerAddress?: string;
  phone?: string;
  wilaya?: string;
  commune?: string;
  address?: string;
  status: 'pending' | 'processing' | 'paid' | 'returned' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export async function getOrders(landingId?: string): Promise<{ orders: Order[] }> {
  const headers = await getAuthHeaders();
  let url = `${API_URL}/orders`;
  if (landingId) {
    url += `?landing_id=${landingId}`;
  }
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

export async function updateOrderStatus(orderId: string, status: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}

export async function createOrder(orderData: {
  landingId: string;
  productId?: string;
  productName?: string;
  productPrice?: string;
  productPhoto?: string;
  quantity?: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    wilaya?: string;
    commune?: string;
    address?: string;
  };
  shippingAddress?: string;
}): Promise<{ order: Order; message: string }> {
  const response = await fetchWithRetry(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
}

export async function deleteOrder(orderId: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/orders/${orderId}`, {
    method: 'DELETE',
    headers,
  });
  return handleResponse(response);
}

export async function resetPassword(email: string): Promise<{ message: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
  });
  
  if (error) throw error;
  return { message: 'Email de réinitialisation envoyé !' };
}

export async function updatePassword(newPassword: string): Promise<{ message: string }> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
  return { message: 'Mot de passe mis à jour !' };
}

export async function updateUserProfile(name: string): Promise<{ message: string }> {
  const { error } = await supabase.auth.updateUser({
    data: { name },
  });
  
  if (error) throw error;
  
  const currentUser = getStoredUser();
  if (currentUser) {
    setUser({ ...currentUser, name });
  }
  
  return { message: 'Profil mis à jour !' };
}
