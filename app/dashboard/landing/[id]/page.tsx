"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getLanding, Landing, Order, updateOrderStatus, updateLanding, deleteOrder, getOrders } from "@/lib/api";
import toast from "react-hot-toast";

type OrderStatus = 'pending' | 'processing' | 'paid' | 'returned' | 'deleted';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  processing: 'Confirmée',
  paid: 'Payée',
  returned: 'Retournée',
  deleted: 'Supprimée',
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  processing: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  paid: { bg: 'bg-green-500/20', text: 'text-green-400' },
  returned: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  deleted: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

const bg = "bg-zinc-900";
const text = "text-white";
const textMuted = "text-zinc-400";
const card = "bg-zinc-800";
const border = "border-zinc-700";

const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const navigateTo = (url: string) => {
  if (isSafari) {
    window.location.href = url;
  } else {
    const win = window.open();
    if (win) win.location.href = url;
  }
};

export default function LandingDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const landingId = params.id as string;
  
  const [landing, setLanding] = useState<Landing | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'settings'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [returnLoss, setReturnLoss] = useState("");
  const [blockedClients, setBlockedClients] = useState<any[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [settingsForm, setSettingsForm] = useState({ name: '', slug: '', brandName: '' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [graphPeriod, setGraphPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [ordersView, setOrdersView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [landingData, ordersData] = await Promise.all([
          getLanding(landingId),
          getOrders()
        ]);
        setLanding(landingData.landing);
        setSettingsForm({
          name: landingData.landing?.name || '',
          slug: landingData.landing?.slug || '',
          brandName: landingData.landing?.content?.brandName || landingData.landing?.name || '',
        });
        const filteredOrders = (ordersData.orders || []).filter((o: Order) => 
          o.landingSlug === landingData.landing?.slug || 
          o.landingId === landingId ||
          o.landingSlug === landingId
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    
    if (landingId) {
      fetchData();
    }
  }, [landingId]);

  useEffect(() => {
    if (!landingId || !user) return;
    
    const pollOrders = async () => {
      try {
        const ordersData = await getOrders();
        const filteredOrders = (ordersData.orders || []).filter((o: Order) => 
          o.landingSlug === landing?.slug || 
          o.landingId === landingId ||
          o.landingSlug === landingId
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error polling orders:', error);
      }
    };
    
    const interval = setInterval(pollOrders, 5000);
    return () => clearInterval(interval);
  }, [landingId, landing?.slug, user]);

  useEffect(() => {
    const stored = localStorage.getItem("blocked_clients");
    if (stored) {
      setBlockedClients(JSON.parse(stored));
    }
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!isOnline) {
      toast.error("Pas de connexion internet");
      return;
    }
    
    if (newStatus === 'returned') {
      setSelectedOrder(orders.find(o => o.id === orderId) || null);
      setShowBlockModal(true);
      return;
    }
    
    setUpdatingStatus(orderId);
    
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setSelectedOrder(null);
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleBlockAndReturn = async (blockCustomer: boolean) => {
    if (!selectedOrder || !isOnline) return;
    
    setUpdatingStatus(selectedOrder.id);
    
    try {
      await updateOrderStatus(selectedOrder.id, 'returned', returnLoss, blockCustomer ? blockReason : undefined);
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'returned' } : o));
      
      if (blockCustomer && selectedOrder.phone) {
        const newBlocked = {
          phone: selectedOrder.phone,
          reason: blockReason || "Retour de commande",
          blockedAt: new Date().toISOString(),
        };
        const updated = [...blockedClients, newBlocked];
        setBlockedClients(updated);
        localStorage.setItem("blocked_clients", JSON.stringify(updated));
      }
      
      setShowBlockModal(false);
      setBlockReason("");
      setReturnLoss("");
      setSelectedOrder(null);
      toast.success("Commande retournée");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const updates: any = {
        name: settingsForm.name,
        slug: settingsForm.slug,
        content: {
          ...landing?.content,
          brandName: settingsForm.brandName,
        }
      };
      
      await updateLanding(landingId, updates);
      setLanding(prev => prev ? { 
        ...prev, 
        name: settingsForm.name,
        slug: settingsForm.slug,
        content: { ...prev.content, brandName: settingsForm.brandName }
      } : null);
      setSettingsSuccess(true);
      toast.success("Paramètres sauvegardés");
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUnblock = (phone: string) => {
    const updated = blockedClients.filter(c => c.phone !== phone);
    setBlockedClients(updated);
    localStorage.setItem("blocked_clients", JSON.stringify(updated));
    toast.success("Client débloqué");
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      setSelectedOrder(null);
      toast.success("Commande supprimée");
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    paid: orders.filter(o => o.status === 'paid').length,
    returned: orders.filter(o => o.status === 'returned').length,
    deleted: orders.filter(o => o.status === 'deleted').length,
  };

  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.productPrice?.replace(/[^0-9.]/g, '') || '0'), 0);

  const totalLoss = orders
    .filter(o => o.status === 'returned')
    .reduce((sum, o) => sum + parseFloat(o.returnLoss || o.productPrice?.replace(/[^0-9.]/g, '') || '0'), 0);

  const profit = totalRevenue - totalLoss;

  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.customerName?.toLowerCase().includes(query) ||
        o.phone?.toLowerCase().includes(query) ||
        o.id?.toLowerCase().includes(query) ||
        o.productName?.toLowerCase().includes(query)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }
    
    const statusOrder: Record<string, number> = { pending: 0, processing: 1, paid: 2, returned: 3, deleted: 4 };
    filtered.sort((a, b) => {
      const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return filtered;
  };

  const getGraphData = () => {
    const now = new Date();
    const data: { label: string; orders: number; revenue: number }[] = [];
    
    if (graphPeriod === 'day') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOrders = orders.filter(o => o.createdAt?.startsWith(dateStr));
        data.push({
          label: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
          orders: dayOrders.length,
          revenue: dayOrders.filter(o => o.status === 'paid').reduce((sum, o) => sum + parseFloat(o.productPrice?.replace(/[^0-9.]/g, '') || '0'), 0),
        });
      }
    } else if (graphPeriod === 'month') {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toISOString().substring(0, 7);
        const monthOrders = orders.filter(o => o.createdAt?.startsWith(monthStr));
        data.push({
          label: date.toLocaleDateString('fr-FR', { month: 'short' }),
          orders: monthOrders.length,
          revenue: monthOrders.filter(o => o.status === 'paid').reduce((sum, o) => sum + parseFloat(o.productPrice?.replace(/[^0-9.]/g, '') || '0'), 0),
        });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const yearOrders = orders.filter(o => o.createdAt?.startsWith(String(year)));
        data.push({
          label: String(year),
          orders: yearOrders.length,
          revenue: yearOrders.filter(o => o.status === 'paid').reduce((sum, o) => sum + parseFloat(o.productPrice?.replace(/[^0-9.]/g, '') || '0'), 0),
        });
      }
    }
    
    return data;
  };

  const graphData = getGraphData();
  const maxOrders = Math.max(...graphData.map(d => d.orders), 1);

  if (authLoading || loading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg}`}>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 z-[200] flex items-center justify-center gap-2 text-sm">
          Pas de connexion internet
        </div>
      )}

      <header className={`${card} border-b ${border} px-4 py-3 sm:px-6 sm:py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button onClick={() => router.push('/dashboard/landings')} className={`p-2 hover:bg-zinc-700 rounded-lg ${textMuted} flex-shrink-0`}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className={`text-lg sm:text-2xl font-bold ${text} truncate`}>{landing?.name || 'Loading...'}</h1>
              <p className={`text-xs sm:text-sm ${textMuted} hidden sm:block`}>{landing?.type} • {landing?.isPublished ? 'En ligne' : 'Hors ligne'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {landing?.isPublished && (
              <button
                onClick={() => navigateTo(`/shop/${landing.slug}`)}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                title="Voir le site"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
            <Link 
              href={`/editor/${landing?.type}?id=${landingId}&type=landing`}
              className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              title="Modifier"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-6">
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -webkit-tap-highlight-color-transparent">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-sm ${
              activeTab === 'orders' ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            }`}
          >
            Commandes
            {stats.pending > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.pending}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
              activeTab === 'analytics' ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            }`}
          >
            Analytique
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
              activeTab === 'settings' ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            }`}
          >
            Paramètres
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1 relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="pending">En attente</option>
                  <option value="processing">Confirmée</option>
                  <option value="paid">Payée</option>
                  <option value="returned">Retournée</option>
                </select>
                <div className="flex bg-zinc-800 border border-zinc-700 rounded-xl p-1">
                  <button
                    onClick={() => setOrdersView('grid')}
                    className={`p-2 rounded-lg transition-colors ${ordersView === 'grid' ? 'bg-indigo-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                    title="Vue grille"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setOrdersView('list')}
                    className={`p-2 rounded-lg transition-colors ${ordersView === 'list' ? 'bg-indigo-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                    title="Vue liste"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {getFilteredOrders().length === 0 ? (
              <div className={`${card} rounded-xl sm:rounded-2xl p-8 sm:p-12 border ${border} text-center`}>
                <p className={textMuted}>Aucune commande trouvée</p>
              </div>
            ) : ordersView === 'grid' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                {getFilteredOrders().map((order) => {
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all -webkit-tap-highlight-color-transparent active:scale-95 ${order.status === 'pending' ? 'ring-2 ring-red-500' : ''}`}
                    >
                      {order.productPhoto ? (
                        <img src={order.productPhoto} alt={order.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl">📄</span>
                        </div>
                      )}
                      {order.status === 'pending' && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {getFilteredOrders().map((order) => {
                  const statusConfig = STATUS_COLORS[order.status as OrderStatus] || STATUS_COLORS.pending;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`${card} rounded-xl p-3 sm:p-4 border ${order.status === 'pending' ? 'border-red-500/50' : border} cursor-pointer hover:border-indigo-500/50 transition-colors -webkit-tap-highlight-color-transparent`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg overflow-hidden flex-shrink-0">
                          {order.productPhoto ? (
                            <img src={order.productPhoto} alt={order.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">📄</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              {STATUS_LABELS[order.status as OrderStatus] || order.status}
                            </span>
                            <span className="text-xs text-zinc-500">#{order.id?.slice(-6)}</span>
                          </div>
                          <p className={`font-medium ${text} text-sm sm:text-base truncate`}>{order.productName}</p>
                          <p className={`text-xs sm:text-sm ${textMuted} hidden sm:block`}>
                            {order.customerName} • {order.phone} • {order.wilaya}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-bold text-base sm:text-lg ${text}`}>{order.productPrice} DA</p>
                          <p className={`text-xs ${textMuted}`}>{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-3 sm:space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
              <div className={`${card} rounded-xl p-3 sm:p-5 border ${border}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="text-xs text-zinc-400">Vues</span>
                </div>
                <p className={`text-xl sm:text-3xl font-bold ${text}`}>{landing?.views || 0}</p>
              </div>
              <div className={`${card} rounded-xl p-3 sm:p-5 border ${border}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="text-xs text-zinc-400">Total</span>
                </div>
                <p className={`text-xl sm:text-3xl font-bold ${text}`}>{stats.total}</p>
              </div>
              <div className={`${card} rounded-xl p-3 sm:p-5 border ${border}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-zinc-400">En attente</span>
                </div>
                <p className={`text-xl sm:text-3xl font-bold text-yellow-400`}>{stats.pending}</p>
              </div>
              <div className={`${card} rounded-xl p-3 sm:p-5 border ${border}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-zinc-400">Confirmées</span>
                </div>
                <p className={`text-xl sm:text-3xl font-bold text-blue-400`}>{stats.processing}</p>
              </div>
              <div className={`${card} rounded-xl p-3 sm:p-5 border ${border}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-zinc-400">Payées</span>
                </div>
                <p className={`text-xl sm:text-3xl font-bold text-green-400`}>{stats.paid}</p>
              </div>
              <div className={`${card} rounded-xl p-3 sm:p-5 border ${border}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-zinc-400">Revenus</span>
                </div>
                <p className={`text-lg sm:text-2xl font-bold text-green-400`}>{totalRevenue.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-zinc-500">DA</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className={`${card} rounded-xl p-4 sm:p-5 border ${border} bg-gradient-to-br from-red-500/10 to-red-600/5`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-400">Pertes</span>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold text-red-400`}>{totalLoss.toLocaleString()} DA</p>
              </div>
              <div className={`${card} rounded-xl p-4 sm:p-5 border ${border}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${profit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-400">Bénéfice Net</span>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{profit.toLocaleString()} DA</p>
              </div>
            </div>

            <div className={`${card} rounded-xl p-4 sm:p-6 border ${border}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className={`text-base sm:text-lg font-semibold ${text}`}>Graphique des ventes</h3>
                <div className="flex gap-1 sm:gap-2">
                  <button onClick={() => setGraphPeriod('day')} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg ${graphPeriod === 'day' ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}>7J</button>
                  <button onClick={() => setGraphPeriod('month')} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg ${graphPeriod === 'month' ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}>6M</button>
                  <button onClick={() => setGraphPeriod('year')} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg ${graphPeriod === 'year' ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}>5A</button>
                </div>
              </div>
              <div className="flex items-end gap-1 sm:gap-3 h-32 sm:h-48">
                {graphData.map((data, idx) => {
                  const heightPercent = (data.orders / maxOrders) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center justify-end h-full gap-1 sm:gap-2">
                        <div className={`w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 min-h-[2px]`} style={{ height: `${Math.max(heightPercent, data.orders > 0 ? 10 : 2)}%` }}></div>
                        <span className="text-[8px] sm:text-xs text-zinc-500">{data.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 sm:space-y-6">
            <div className={`${card} rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${border}`}>
              <h3 className={`text-base sm:text-lg font-semibold ${text} mb-4`}>Informations</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Nom</label>
                  <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">URL</label>
                  <input type="text" value={settingsForm.slug} onChange={(e) => setSettingsForm({ ...settingsForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Nom de marque</label>
                  <input type="text" value={settingsForm.brandName} onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <button onClick={handleSaveSettings} disabled={savingSettings} className={`w-full px-4 py-3 font-medium rounded-xl ${savingSettings ? 'bg-zinc-600 text-zinc-400' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}>
                  {savingSettings ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                {settingsSuccess && <p className="text-green-400 text-sm text-center">Paramètres sauvegardés!</p>}
              </div>
            </div>

            <div className={`${card} rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${border}`}>
              <h3 className={`text-base sm:text-lg font-semibold ${text} mb-4`}>Clients bloqués</h3>
              {blockedClients.length === 0 ? <p className={textMuted}>Aucun client bloqué</p> : (
                <div className="space-y-3">
                  {blockedClients.map((client, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-700/50 rounded-lg gap-2">
                      <div>
                        <p className="font-medium text-white">{client.phone}</p>
                        <p className="text-xs sm:text-sm text-zinc-400">{client.reason || 'Motif non spécifié'}</p>
                      </div>
                      <button onClick={() => handleUnblock(client.phone)} className="px-3 py-1.5 text-sm bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg">Débloquer</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-zinc-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-auto border border-zinc-700" onClick={e => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-zinc-700 flex items-center justify-between sticky top-0 bg-zinc-800">
              <h2 className="text-lg sm:text-xl font-bold text-white">Commande #{selectedOrder.id?.slice(-6)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden">
                  {selectedOrder.productPhoto ? <img src={selectedOrder.productPhoto} alt={selectedOrder.productName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl">📄</div>}
                </div>
                <div>
                  <p className="font-bold text-base sm:text-lg text-white">{selectedOrder.productName}</p>
                  <p className="font-bold text-lg sm:text-xl text-indigo-400">{selectedOrder.productPrice} DA</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-zinc-700/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">Client</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <p><span className="text-zinc-400">Nom:</span> <span className="text-white">{selectedOrder.customerName}</span></p>
                  <p><span className="text-zinc-400">Prénom:</span> <span className="text-white">{selectedOrder.customer_firstname || '-'}</span></p>
                  <p><span className="text-zinc-400">Téléphone:</span> <span className="text-white">{selectedOrder.phone}</span></p>
                  <p><span className="text-zinc-400">Wilaya:</span> <span className="text-white">{selectedOrder.wilaya}</span></p>
                  {selectedOrder.commune && <p><span className="text-zinc-400">Commune:</span> <span className="text-white">{selectedOrder.commune}</span></p>}
                  {selectedOrder.address && <p><span className="text-zinc-400">Adresse:</span> <span className="text-white">{selectedOrder.address}</span></p>}
                  {selectedOrder.note && <p><span className="text-zinc-400">Note:</span> <span className="text-white">{selectedOrder.note}</span></p>}
                  <p><span className="text-zinc-400">Date:</span> <span className="text-white">{formatDateTime(selectedOrder.createdAt).date}</span></p>
                  <p><span className="text-zinc-400">Heure:</span> <span className="text-white">{formatDateTime(selectedOrder.createdAt).time}</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3 text-sm sm:text-base">Statut</h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as OrderStatus[])
                    .filter(status => status !== 'deleted')
                    .map(status => (
                    <button key={status} onClick={() => handleStatusUpdate(selectedOrder.id, status)} disabled={updatingStatus !== null}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${selectedOrder.status === status ? `${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text} border` : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>

              {selectedOrder.status !== 'deleted' && (
                <div className="pt-4 border-t border-zinc-700">
                  <button onClick={() => handleDeleteOrder(selectedOrder.id)} className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer la commande
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showBlockModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-zinc-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4 sm:p-6 border border-zinc-700 max-h-[90vh] overflow-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Confirmer le retour</h3>
            <div className="mb-3 sm:mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Prix de perte (DA)</label>
              <input type="number" value={returnLoss} onChange={(e) => setReturnLoss(e.target.value)} placeholder="Ex: 500" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white text-sm" />
            </div>
            <div className="mb-3 sm:mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Motif de blocage</label>
              <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Ex: Retour de marchandise" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-700 border border-zinc-600 rounded-xl text-white text-sm" />
            </div>
            <p className="text-zinc-400 mb-3 sm:mb-4 text-sm">Voulez-vous bloquer le client {selectedOrder.phone} ?</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button onClick={() => handleBlockAndReturn(true)} className="flex-1 px-4 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl text-sm">Bloquer et retourner</button>
              <button onClick={() => handleBlockAndReturn(false)} className="flex-1 px-4 py-2.5 sm:py-3 bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-xl text-sm">Retourner sans bloquer</button>
            </div>
            <button onClick={() => { setShowBlockModal(false); setBlockReason(""); setReturnLoss(""); }} className="w-full mt-2 sm:mt-3 px-4 py-2.5 sm:py-3 border border-zinc-600 text-zinc-400 hover:bg-zinc-700 rounded-xl text-sm">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
