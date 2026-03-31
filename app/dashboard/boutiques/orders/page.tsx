"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrders, getLandings, Order, updateOrderStatus, Landing } from "@/lib/api";

type OrderStatus = 'pending' | 'processing' | 'paid' | 'returned';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  processing: 'En cours',
  paid: 'Payée',
  returned: 'Retournée',
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  paid: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  returned: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
};

interface BlockedClient {
  phone: string;
  reason: string;
  blockedAt: string;
}

interface ReturnData {
  returnLoss: string;
  blockReason: string;
  blockCustomer: boolean;
}

export default function BoutiqueOrdersPage() {
  const { user, loading, logout } = useAuth();
  const { getThemeClasses } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [landings, setLandings] = useState<Landing[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [landingFilter, setLandingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [returnLoss, setReturnLoss] = useState("");
  const [blockedClients, setBlockedClients] = useState<BlockedClient[]>([]);
  const [landingsOpen, setLandingsOpen] = useState(true);
  const [boutiquesOpen, setBoutiquesOpen] = useState(true);
  const styles = getThemeClasses();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [ordersResult, landingsResult] = await Promise.all([
        getOrders(),
        getLandings()
      ]);
      setOrders(ordersResult.orders);
      const boutiques = landingsResult.landings.filter((l: Landing) => l.isLanding === false);
      setLandings(boutiques);
      
      const stored = localStorage.getItem("blocked_clients");
      if (stored) {
        setBlockedClients(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (newStatus === 'returned') {
      setShowBlockModal(true);
      return;
    }
    
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleBlockAndReturn = async (blockCustomer: boolean) => {
    if (!selectedOrder) return;
    
    try {
      await updateOrderStatus(selectedOrder.id, 'returned', returnLoss, blockCustomer ? blockReason : undefined);
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'returned' } : o));
      setSelectedOrder({ ...selectedOrder, status: 'returned' });
      
      if (blockCustomer && selectedOrder.phone) {
        const newBlocked: BlockedClient = {
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const isBoutiqueOrder = landings.some(l => l.slug === order.landingSlug);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesLanding = landingFilter === 'all' || order.landingSlug === landingFilter;
    const matchesSearch = searchQuery === "" || 
      (order.productName && order.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.phone && order.phone.includes(searchQuery));
    return isBoutiqueOrder && matchesStatus && matchesLanding && matchesSearch;
  });

  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    paid: filteredOrders.filter(o => o.status === 'paid').length,
    returned: filteredOrders.filter(o => o.status === 'returned').length,
  };

  const parsePrice = (price: string) => {
    const num = parseFloat(price?.replace(/[^0-9.]/g, '') || '0');
    return isNaN(num) ? 0 : num;
  };

  const totalRevenue = filteredOrders
    .filter(o => ['paid'].includes(o.status))
    .reduce((sum, o) => sum + parsePrice(o.productPrice), 0);

  const confirmedOrders = filteredOrders.filter(o => ['paid'].includes(o.status)).length;

  const getLandingName = (landingSlug: string) => {
    const landing = landings.find(l => l.slug === landingSlug);
    return landing?.name || 'Boutique';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${styles.bg}`}>
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${styles.bg} flex`}>
      <aside className={`w-64 ${styles.card} border-r ${styles.border} flex flex-col`}>
        <div className={`p-6 border-b ${styles.border}`}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={`text-xl font-bold ${styles.text}`}>ShopLaunch</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 ${styles.textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t("dashboard")}
          </Link>
          
          <div>
            <button 
              onClick={() => setLandingsOpen(!landingsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 ${styles.textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("landings")}
              </div>
              <svg className={`w-4 h-4 transition-transform ${landingsOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {landingsOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <Link href="/dashboard/landings" className={`flex items-center gap-2 px-4 py-2 text-sm ${styles.textMuted} hover:bg-zinc-700/50 rounded-lg transition-colors`}>
                  <span>📄</span> {t("landings")}
                </Link>
                <Link href="/dashboard/landings/orders" className={`flex items-center gap-2 px-4 py-2 text-sm ${styles.textMuted} hover:bg-zinc-700/50 rounded-lg transition-colors`}>
                  <span>📋</span> {t("orders")}
                </Link>
              </div>
            )}
          </div>

          <div>
            <button 
              onClick={() => setBoutiquesOpen(!boutiquesOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 bg-pink-500/20 text-pink-400 rounded-xl font-medium`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t("boutiques")}
              </div>
              <svg className={`w-4 h-4 transition-transform ${boutiquesOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {boutiquesOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <Link href="/dashboard/boutiques" className={`flex items-center gap-2 px-4 py-2 text-sm ${styles.textMuted} hover:bg-zinc-700/50 rounded-lg transition-colors`}>
                  <span>🏪</span> {t("boutiques")}
                </Link>
                <Link href="/dashboard/boutiques/orders" className={`flex items-center justify-between px-4 py-2 text-sm bg-pink-500/20 text-pink-400 rounded-lg font-medium`}>
                  <span className="flex items-center gap-2"><span>📋</span> {t("orders")}</span>
                  {stats.pending > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pending}</span>
                  )}
                </Link>
              </div>
            )}
          </div>

          <Link href="/dashboard/analytics" className={`flex items-center gap-3 px-4 py-3 ${styles.textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t("analytics")}
          </Link>
          
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 ${styles.textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("settings")}
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-700">
          <button onClick={logout} className={`flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t("logout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <header className={`${styles.card} border-b ${styles.border} px-8 py-4`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-pink-400">🏪</span>
            <h1 className={`text-2xl font-bold ${styles.text}`}>{t("orders")} - {t("boutiques")}</h1>
          </div>
          <p className={styles.textMuted}>{t("boutiques")} - {filteredOrders.length} {t("orders").toLowerCase()}</p>
        </header>

        <div className="p-8 overflow-auto h-[calc(100vh-80px)]">
          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                <div className={`${styles.card} rounded-xl p-4 border ${styles.border}`}>
                  <p className={`text-sm ${styles.textMuted} mb-1`}>Total</p>
                  <p className={`text-2xl font-bold ${styles.text}`}>{stats.total}</p>
                </div>
                <div className={`${styles.card} rounded-xl p-4 border ${styles.border}`}>
                  <p className="text-sm text-yellow-400 mb-1">{t("pending")}</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <div className={`${styles.card} rounded-xl p-4 border ${styles.border}`}>
                  <p className="text-sm text-blue-400 mb-1">{t("processing")}</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.processing}</p>
                </div>
                <div className={`${styles.card} rounded-xl p-4 border ${styles.border}`}>
                  <p className="text-sm text-green-400 mb-1">{t("paid")}</p>
                  <p className="text-2xl font-bold text-green-400">{stats.paid}</p>
                </div>
                <div className={`${styles.card} rounded-xl p-4 border ${styles.border}`}>
                  <p className="text-sm text-orange-400 mb-1">{t("returned")}</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.returned}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className={`${styles.card} rounded-xl p-6 border ${styles.border}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm ${styles.textMuted}`}>{t("orders")} {t("paid")}</p>
                      <p className={`text-2xl font-bold ${styles.text}`}>{confirmedOrders}</p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.card} rounded-xl p-6 border ${styles.border}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm ${styles.textMuted}`}>{t("revenue")}</p>
                      <p className={`text-2xl font-bold ${styles.text}`}>{totalRevenue.toFixed(2)} DA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-4 py-2 ${styles.card} border ${styles.border} rounded-xl focus:ring-2 focus:ring-pink-500`}
                  />
                </div>
                <select
                  value={landingFilter}
                  onChange={(e) => setLandingFilter(e.target.value)}
                  className={`px-4 py-2 ${styles.card} border ${styles.border} rounded-xl focus:ring-2 focus:ring-pink-500`}
                >
                  <option value="all">{t("boutiques")}</option>
                  {landings.map(l => (
                    <option key={l.id} value={l.slug}>{l.name}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 ${styles.card} border ${styles.border} rounded-xl focus:ring-2 focus:ring-pink-500`}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">{t("pending")}</option>
                  <option value="processing">{t("processing")}</option>
                  <option value="paid">{t("paid")}</option>
                  <option value="returned">{t("returned")}</option>
                </select>
              </div>

              {filteredOrders.length === 0 ? (
                <div className={`${styles.card} rounded-2xl p-12 border ${styles.border} text-center`}>
                  <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className={`text-2xl font-bold ${styles.text} mb-2`}>Aucune commande</h2>
                  <p className={styles.textMuted}>Les commandes de vos boutiques apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const statusConfig = STATUS_COLORS[order.status as OrderStatus] || STATUS_COLORS.pending;
                    const isPending = order.status === 'pending';
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`${styles.card} rounded-xl p-4 border ${isPending ? 'border-red-500/50 bg-red-500/5' : styles.border} cursor-pointer hover:border-pink-500/50 transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl overflow-hidden flex-shrink-0">
                            {order.productPhoto ? (
                              <img src={order.productPhoto} alt={order.productName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">🏪</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                                {STATUS_LABELS[order.status as OrderStatus] || order.status}
                              </span>
                              <span className="text-xs text-zinc-500">#{order.id}</span>
                              <span className="text-xs text-pink-400">{getLandingName(order.landingSlug)}</span>
                            </div>
                            <p className={`font-medium ${styles.text} truncate`}>{order.productName}</p>
                            <p className={`text-sm ${styles.textMuted}`}>
                              {order.customerName} {order.customer_firstname || ''} • {order.wilaya}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`font-bold text-lg ${styles.text}`}>{order.productPrice}</p>
                            <p className={`text-sm ${styles.textMuted}`}>{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-zinc-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto border border-zinc-700" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Commande #{selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl overflow-hidden">
                  {selectedOrder.productPhoto ? (
                    <img src={selectedOrder.productPhoto} alt={selectedOrder.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🏪</div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg text-white">{selectedOrder.productName}</p>
                  <p className="font-bold text-xl text-pink-400">{selectedOrder.productPrice} DZD</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-700/50 rounded-xl">
                <h3 className="font-semibold text-white mb-3">Client</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-zinc-400">Nom:</span> <span className="text-white">{selectedOrder.customerName}</span></p>
                  <p><span className="text-zinc-400">Prénom:</span> <span className="text-white">{selectedOrder.customer_firstname || '-'}</span></p>
                  <p><span className="text-zinc-400">Téléphone:</span> <span className="text-white">{selectedOrder.phone}</span></p>
                  <p><span className="text-zinc-400">Wilaya:</span> <span className="text-white">{selectedOrder.wilaya}</span></p>
                  {selectedOrder.commune && <p><span className="text-zinc-400">Commune:</span> <span className="text-white">{selectedOrder.commune}</span></p>}
                  {selectedOrder.address && <p><span className="text-zinc-400">Adresse:</span> <span className="text-white">{selectedOrder.address}</span></p>}
                  {selectedOrder.note && <p><span className="text-zinc-400">Note:</span> <span className="text-white">{selectedOrder.note}</span></p>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">Statut</h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrder.status === status
                          ? `${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text} border ${STATUS_COLORS[status].border}`
                          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBlockModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-zinc-800 rounded-2xl max-w-md w-full p-6 border border-zinc-700">
            <h3 className="text-xl font-bold text-white mb-4">Confirmer le retour</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Prix de perte (DZD)</label>
              <input
                type="number"
                value={returnLoss}
                onChange={(e) => setReturnLoss(e.target.value)}
                placeholder="Ex: 500"
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Motif de blocage (optionnel)</label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Ex: Retour de marchandise"
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              />
            </div>
            <p className="text-zinc-400 mb-4">
              Voulez-vous bloquer le client {selectedOrder.phone} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleBlockAndReturn(true)}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                Bloquer et retourner
              </button>
              <button
                onClick={() => handleBlockAndReturn(false)}
                className="flex-1 px-4 py-3 bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                Retourner sans bloquer
              </button>
            </div>
            <button
              onClick={() => setShowBlockModal(false)}
              className={`w-full mt-3 px-4 py-3 border ${styles.border} ${styles.text} font-medium rounded-xl transition-colors hover:bg-zinc-700/50`}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
