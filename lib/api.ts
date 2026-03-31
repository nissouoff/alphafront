import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { auth, db, saveUserToRTDB } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = unknown> {
  message?: string;
  user?: T;
  token?: string;
  errors?: Record<string, string[]>;
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    localStorage.setItem('auth_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
    }));

    return {
      message: 'Connexion réussie !',
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      },
      token: await user.getIdToken(),
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Identifiants incorrects');
  }
}

export async function register(name: string, email: string, password: string): Promise<ApiResponse<FirebaseUser>> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });
    
    await saveUserToRTDB(user.uid, name, email);

    localStorage.setItem('auth_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: name,
    }));

    return {
      message: 'Inscription réussie !',
      user: {
        uid: user.uid,
        email: user.email,
        name: name,
      },
      token: await user.getIdToken(),
    };
  } catch (error: any) {
    console.error('Register error:', error);
    throw new Error(error.message || 'Erreur lors de l\'inscription');
  }
}

export async function logout(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('auth_user');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export async function getCurrentUserToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export async function uploadImage(file: File, folder: string = 'general'): Promise<{ url: string }> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await user.getIdToken();
  
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ image: base64, folder }),
  });

  const data = await handleResponse(response);
  
  return { url: base64 };
}

export function setUser(user: FirebaseUser): void {
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function getStoredUser(): FirebaseUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
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
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

export async function createLanding(name: string, type: string, isLanding: boolean = true): Promise<{ landing: Landing; message: string } | any> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/landings`, {
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
  const response = await fetch(`${API_URL}/landings/${id}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

export async function updateLanding(id: string, data: Partial<Landing>): Promise<{ landing: Landing; message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/landings/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteLanding(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/landings/${id}`, {
    method: 'DELETE',
    headers,
  });
  return handleResponse(response);
}

export async function publishLanding(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/landings/${id}/publish`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
}

export async function unpublishLanding(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/landings/${id}/unpublish`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
}

export async function getPublicLanding(slug: string): Promise<{ landing: Landing }> {
  const response = await fetch(`${API_URL}/shop/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

export async function trackView(slug: string, ip?: string): Promise<void> {
  await fetch(`${API_URL}/shop/${slug}/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip }),
  });
}

export async function addReview(slug: string, name: string, rating: number, comment?: string): Promise<void> {
  await fetch(`${API_URL}/shop/${slug}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rating, comment }),
  });
}

interface OrderPayload {
  productId?: string;
  productName: string;
  productPrice: string;
  productPhoto?: string | null;
  quantity: number;
  customerName: string;
  customer_firstname?: string;
  phone: string;
  wilaya: string;
  commune?: string;
  address?: string;
  note?: string;
}

export async function createOrder(slug: string, data: OrderPayload): Promise<{ message: string; order: any }> {
  const response = await fetch(`${API_URL}/shop/${slug}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export interface Order {
  id: string;
  landingSlug: string;
  landingName?: string;
  productId: string;
  productName: string;
  productPrice: string;
  productPhoto?: string | null;
  quantity: number;
  total?: string;
  customerName: string;
  customer_firstname?: string;
  phone: string;
  wilaya: string;
  commune?: string;
  address?: string;
  note?: string;
  status: string;
  returnLoss?: string;
  returnReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function getOrders(limit?: number, landingSlug?: string): Promise<{ orders: Order[] }> {
  const headers = await getAuthHeaders();
  let url = `${API_URL}/orders`;
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (landingSlug) params.append('landingSlug', landingSlug);
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  returnLoss?: string,
  blockReason?: string
): Promise<{ message: string }> {
  try {
    const headers = await getAuthHeaders();
    const body: any = { status };
    if (returnLoss) body.returnLoss = returnLoss;
    if (blockReason) body.blockReason = blockReason;
    
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const text = await response.text();
      let message = `Erreur ${response.status}`;
      try {
        const data = JSON.parse(text);
        message = data.message || message;
      } catch {}
      throw new Error(message);
    }
    
    return await response.json();
  } catch (error: any) {
    if (error.message.includes('Non authentifié')) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw error;
  }
}

export async function deleteOrder(orderId: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'DELETE',
    headers,
  });
  return handleResponse(response);
}

export async function getWilayas(): Promise<{ wilayas: string[] }> {
  const response = await fetch(`${API_URL}/wilayas`);
  return handleResponse(response);
}
