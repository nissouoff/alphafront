"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { updateOrderStatus, deleteOrder } from "@/lib/api";
import { useDashboardData } from "../layout";

type OrderStatus = 'pending' | 'processing' | 'paid' | 'returned' | 'deleted';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  processing: 'En cours',
  paid: 'Payée',
  returned: 'Retournée',
  deleted: 'Supprimée',
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  paid: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  returned: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  deleted: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

interface BlockedClient {
  phone: string;
  reason: string;
  blockedAt: string;
}

export default function OrdersPage() {
  const { getThemeClasses } = useTheme();
  const { t } = useLanguage();
  const { landings, orders, loading } = useDashboardData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [landingFilter, setLandingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blockedClients, setBlockedClients] = useState<BlockedClient[]>([]);
  const styles = getThemeClasses();

  useEffect(() => {
    const stored = localStorage.getItem("blocked_clients");
    if (stored) {
      setBlockedClients(JSON.parse(stored));
    }
  }, []);

  const getLandingName = (slug: string) => {
    const landing = landings.find(l => l.slug === slug);
    return landing?.name || 'Inconnu';
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesLanding = landingFilter === 'all' || order.landingSlug === landingFilter;
    const matchesSearch = searchQuery === '' || 
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery);
    return matchesStatus && matchesLanding && matchesSearch;
  });

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      window.location.reload();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    try {
      await deleteOrder(orderId);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Erreur lors de la suppression de la commande');
    }
  };

  const handleBlockClient = () => {
    if (!selectedOrder || !blockReason) return;
    
    const newBlockedClient: BlockedClient = {
      phone: selectedOrder.phone,
      reason: blockReason,
      blockedAt: new Date().toISOString()
    };
    
    const updated = [...blockedClients, newBlockedClient];
    setBlockedClients(updated);
    localStorage.setItem("blocked_clients", JSON.stringify(updated));
    
    setShowBlockModal(false);
    setBlockReason("");
    handleStatusChange(selectedOrder.id, 'returned');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par ID, nom ou téléphone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-1 px-4 py-3 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-3 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="paid">Payée</option>
          <option value="returned">Retournée</option>
          <option value="deleted">Supprimée</option>
        </select>
        <select
          value={landingFilter}
          onChange={(e) => setLandingFilter(e.target.value)}
          className={`px-4 py-3 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="all">Tous les projets</option>
          {landings.map(landing => (
            <option key={landing.id} value={landing.slug}>{landing.name}</option>
          ))}
        </select>
      </div>

      <div className={`${styles.card} rounded-2xl border ${styles.border} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${styles.border}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textMuted}`}>ID</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textMuted}`}>Client</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textMuted}`}>Projet</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textMuted}`}>Montant</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textMuted}`}>Statut</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textMuted}`}>Date</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textMuted}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${styles.border}`}>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`px-6 py-12 text-center ${styles.textMuted}`}>
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = order.status as OrderStatus;
                  return (
                    <tr key={order.id} className="hover:bg-zinc-700/30 transition-colors">
                      <td className={`px-6 py-4 text-sm ${styles.text}`}>
                        #{order.id?.slice(-6) || '?'}
                      </td>
                      <td className={`px-6 py-4 text-sm ${styles.text}`}>
                        <div>
                          <p className="font-medium">{order.customerName || 'N/A'}</p>
                          <p className={`text-xs ${styles.textMuted}`}>{order.phone || 'N/A'}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${styles.text}`}>
                        {getLandingName(order.landingSlug)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${styles.text} font-medium`}>
                        {order.total ? `${order.total} DA` : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text}`}>
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${styles.textMuted}`}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                          >
                            Voir
                          </button>
                          {order.status !== 'deleted' && (
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${styles.card} rounded-2xl border ${styles.border} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${styles.border} flex justify-between items-center`}>
              <h2 className={`text-xl font-bold ${styles.text}`}>Commande #{selectedOrder.id?.slice(-6)}</h2>
              <button onClick={() => setSelectedOrder(null)} className={`${styles.textMuted} hover:text-white`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Client</p>
                  <p className={`${styles.text} font-medium`}>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Téléphone</p>
                  <p className={`${styles.text} font-medium`}>{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Projet</p>
                  <p className={`${styles.text} font-medium`}>{getLandingName(selectedOrder.landingSlug)}</p>
                </div>
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Montant</p>
                  <p className={`${styles.text} font-medium`}>{selectedOrder.total ? `${selectedOrder.total} DA` : 'N/A'}</p>
                </div>
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Wilaya</p>
                  <p className={`${styles.text}`}>{selectedOrder.wilaya}</p>
                </div>
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Commune</p>
                  <p className={`${styles.text}`}>{selectedOrder.commune}</p>
                </div>
              </div>

              {selectedOrder.address && (
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Adresse</p>
                  <p className={`${styles.text}`}>{selectedOrder.address}</p>
                </div>
              )}

              {selectedOrder.note && (
                <div>
                  <p className={`text-sm ${styles.textMuted}`}>Note</p>
                  <p className={`${styles.text}`}>{selectedOrder.note}</p>
                </div>
              )}

              <div>
                <p className={`text-sm ${styles.textMuted} mb-2`}>Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedOrder.status === 'pending' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    En attente
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedOrder.status === 'processing' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    En cours
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'paid')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedOrder.status === 'paid' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    Payée
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'returned')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedOrder.status === 'returned' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    Retournée
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedOrder.status === 'deleted' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-700">
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Bloquer ce client
                </button>
              </div>

              <div className={`text-sm ${styles.textMuted}`}>
                <p>Créé: {formatDate(selectedOrder.createdAt)}</p>
                <p>Modifié: {formatDate(selectedOrder.updatedAt || '')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBlockModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className={`${styles.card} rounded-2xl border ${styles.border} p-6 w-full max-w-md`}>
            <h3 className={`text-lg font-bold ${styles.text} mb-4`}>Bloquer le client</h3>
            <p className={`text-sm ${styles.textMuted} mb-4`}>
              Vous êtes sur le point de bloquer {selectedOrder.phone}. Veuillez fournir une raison.
            </p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Raison du blocage..."
              className={`w-full px-4 py-3 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 h-24`}
            />
            <div className="flex gap-3">
              <button
                onClick={handleBlockClient}
                disabled={!blockReason}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg font-medium transition-colors"
              >
                Bloquer
              </button>
              <button
                onClick={() => setShowBlockModal(false)}
                className={`flex-1 px-4 py-2 border ${styles.border} ${styles.text} rounded-lg font-medium hover:bg-zinc-700/50 transition-colors`}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
