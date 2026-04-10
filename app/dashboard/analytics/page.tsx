"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { getLandings } from "@/lib/api";

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export default function AnalyticsPage() {
  const { getThemeClasses } = useTheme();
  const { t } = useLanguage();
  const styles = getThemeClasses();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [loading, setLoading] = useState(true);
  const [landings, setLandings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLandings("all");
        setLandings(result.landings || []);
        if (result.orders) {
          setOrders(result.orders);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const landingPages = landings.filter((l: any) => l.isLanding === true);
  const boutiques = landings.filter((l: any) => l.isLanding === false);

  const totalViews = landings.reduce((sum, l) => sum + (l.views || 0), 0);
  const landingViews = landingPages.reduce((sum, l) => sum + (l.views || 0), 0);
  const boutiqueViews = boutiques.reduce((sum, l) => sum + (l.views || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const returnedOrders = orders.filter((o) => o.status === 'returned');
  const deletedOrders = orders.filter((o) => o.status === 'deleted');

  const calculateRevenue = (orderList: any[]) => {
    return orderList.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  };

  const totalRevenue = calculateRevenue(paidOrders);
  const pendingRevenue = calculateRevenue(pendingOrders);
  const lossFromReturns = calculateRevenue(returnedOrders);
  
  const conversionRate = totalViews > 0 ? ((orders.length / totalViews) * 100).toFixed(2) : '0';
  
  const ordersByLanding: Record<string, { total: number; count: number; paid: number }> = {};
  orders.forEach((order) => {
    const key = order.landingSlug || order.landingId || 'Unknown';
    if (!ordersByLanding[key]) {
      ordersByLanding[key] = { total: 0, count: 0, paid: 0 };
    }
    ordersByLanding[key].count++;
    ordersByLanding[key].total += parseFloat(order.total || 0);
    if (order.status === 'paid') {
      ordersByLanding[key].paid += parseFloat(order.total || 0);
    }
  });

  const topConvertingLandings = Object.entries(ordersByLanding)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topRevenueLandings = Object.entries(ordersByLanding)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.paid - a.paid)
    .slice(0, 5);

  const publishedLandings = landingPages.filter((l) => l.isPublished).length;
  const publishedBoutiques = boutiques.filter((l) => l.isPublished).length;

  const avgOrderValue = paidOrders.length > 0 ? (totalRevenue / paidOrders.length).toFixed(2) : '0';
  
  const returnRate = orders.length > 0 ? ((returnedOrders.length / orders.length) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${styles.text}`}>Analytics</h1>
          <p className={styles.textMuted}>Analyse complète de vos performances</p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? 'bg-indigo-500 text-white'
                  : `${styles.textMuted} hover:bg-zinc-700`
              }`}
            >
              {filter === 'today' ? 'Aujourd\'hui' : filter === 'week' ? '7 jours' : filter === 'month' ? '30 jours' : 'Tout'}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${styles.card} rounded-xl p-5 border ${styles.border}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={styles.textMuted}>Revenus totaux</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{totalRevenue.toLocaleString()} DA</p>
          <p className={`text-sm ${styles.textMuted} mt-1`}>{paidOrders.length} commandes payées</p>
        </div>

        <div className={`${styles.card} rounded-xl p-5 border ${styles.border}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={styles.textMuted}>Revenus en attente</span>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{pendingRevenue.toLocaleString()} DA</p>
          <p className={`text-sm ${styles.textMuted} mt-1`}>{pendingOrders.length} commandes en attente</p>
        </div>

        <div className={`${styles.card} rounded-xl p-5 border ${styles.border}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={styles.textMuted}>Pertes (retours)</span>
            <span className="text-2xl">📉</span>
          </div>
          <p className="text-3xl font-bold text-red-400">{lossFromReturns.toLocaleString()} DA</p>
          <p className={`text-sm ${styles.textMuted} mt-1`}>{returnedOrders.length} retours ({returnRate}%)</p>
        </div>

        <div className={`${styles.card} rounded-xl p-5 border ${styles.border}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={styles.textMuted}>Valeur moyenne</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-blue-400">{avgOrderValue} DA</p>
          <p className={`text-sm ${styles.textMuted} mt-1`}>par commande</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`${styles.card} rounded-xl p-4 border ${styles.border} text-center`}>
          <p className="text-3xl mb-1">👁</p>
          <p className={`text-2xl font-bold ${styles.text}`}>{totalViews.toLocaleString()}</p>
          <p className={styles.textMuted}>Vues totales</p>
        </div>
        <div className={`${styles.card} rounded-xl p-4 border ${styles.border} text-center`}>
          <p className="text-3xl mb-1">🛒</p>
          <p className={`text-2xl font-bold ${styles.text}`}>{orders.length}</p>
          <p className={styles.textMuted}>Commandes totales</p>
        </div>
        <div className={`${styles.card} rounded-xl p-4 border ${styles.border} text-center`}>
          <p className="text-3xl mb-1">📄</p>
          <p className={`text-2xl font-bold ${styles.text}`}>{publishedLandings}</p>
          <p className={styles.textMuted}>Landings en ligne</p>
        </div>
        <div className={`${styles.card} rounded-xl p-4 border ${styles.border} text-center`}>
          <p className="text-3xl mb-1">🏪</p>
          <p className={`text-2xl font-bold ${styles.text}`}>{publishedBoutiques}</p>
          <p className={styles.textMuted}>Boutiques en ligne</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders by Status */}
        <div className={`${styles.card} rounded-xl p-6 border ${styles.border}`}>
          <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Commandes par statut</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className={styles.text}>En attente</span>
              </div>
              <span className="font-bold text-yellow-400">{pendingOrders.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className={styles.text}>Payées</span>
              </div>
              <span className="font-bold text-green-400">{paidOrders.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span className={styles.text}>Retournées</span>
              </div>
              <span className="font-bold text-orange-400">{returnedOrders.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className={styles.text}>Supprimées</span>
              </div>
              <span className="font-bold text-red-400">{deletedOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Views Distribution */}
        <div className={`${styles.card} rounded-xl p-6 border ${styles.border}`}>
          <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Distribution des vues</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className={styles.textMuted}>Landings ({landingViews})</span>
                <span className={styles.text}>{totalViews > 0 ? ((landingViews / totalViews) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full transition-all" style={{ width: `${totalViews > 0 ? (landingViews / totalViews) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className={styles.textMuted}>Boutiques ({boutiqueViews})</span>
                <span className={styles.text}>{totalViews > 0 ? ((boutiqueViews / totalViews) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-3">
                <div className="bg-pink-500 h-3 rounded-full transition-all" style={{ width: `${totalViews > 0 ? (boutiqueViews / totalViews) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl">
            <div className="flex items-center justify-between">
              <span className={styles.textMuted}>Taux de conversion</span>
              <span className="text-xl font-bold text-indigo-400">{conversionRate}%</span>
            </div>
            <p className={`text-xs ${styles.textMuted} mt-1`}>{orders.length} commandes / {totalViews} vues</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Converting */}
        <div className={`${styles.card} rounded-xl p-6 border ${styles.border}`}>
          <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>🏆 Top conversions</h2>
          {topConvertingLandings.length === 0 ? (
            <p className={`text-center ${styles.textMuted} py-8`}>Aucune donnée disponible</p>
          ) : (
            <div className="space-y-3">
              {topConvertingLandings.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 border ${styles.border} rounded-xl`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-zinc-400/20 text-zinc-400' :
                      'bg-zinc-700 text-zinc-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={styles.text}>{item.name || 'Landing'}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${styles.text}`}>{item.count}</p>
                    <p className={`text-xs ${styles.textMuted}`}>commandes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Revenue */}
        <div className={`${styles.card} rounded-xl p-6 border ${styles.border}`}>
          <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>💎 Top revenus</h2>
          {topRevenueLandings.length === 0 ? (
            <p className={`text-center ${styles.textMuted} py-8`}>Aucune donnée disponible</p>
          ) : (
            <div className="space-y-3">
              {topRevenueLandings.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 border ${styles.border} rounded-xl`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-zinc-400/20 text-zinc-400' :
                      'bg-zinc-700 text-zinc-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={styles.text}>{item.name || 'Landing'}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">{item.paid.toLocaleString()} DA</p>
                    <p className={`text-xs ${styles.textMuted}`}>{item.count} cmd</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
