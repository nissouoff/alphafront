"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useDashboardData } from "../layout";

export default function AnalyticsPage() {
  const { getThemeClasses } = useTheme();
  const { t } = useLanguage();
  const { landings, orders, loading } = useDashboardData();
  const styles = getThemeClasses();

  const landingPages = landings.filter(l => l.isLanding === true);
  const boutiques = landings.filter(l => l.isLanding === false);

  const totalViews = landings.reduce((sum, l) => sum + (l.views || 0), 0);
  const landingViews = landingPages.reduce((sum, l) => sum + (l.views || 0), 0);
  const boutiqueViews = boutiques.reduce((sum, l) => sum + (l.views || 0), 0);
  const publishedLandings = landingPages.filter(l => l.isPublished).length;
  const publishedBoutiques = boutiques.filter(l => l.isPublished).length;

  const stats = [
    { label: "Total vues", value: totalViews.toString(), icon: "👁", color: "bg-blue-500" },
    { label: "Landing pages", value: `${landingPages.length} (${publishedLandings} en ligne)`, icon: "📄", color: "bg-purple-500" },
    { label: "Boutiques", value: `${boutiques.length} (${publishedBoutiques} en ligne)`, icon: "🏪", color: "bg-pink-500" },
  ];

  const topLandings = [...landings]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.card} rounded-2xl p-6 border ${styles.border}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-3xl font-bold ${styles.text} mb-1`}>{stat.value}</p>
            <p className={styles.textMuted}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${styles.card} rounded-2xl p-6 border ${styles.border}`}>
          <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Vues par type</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className={styles.textMuted}>Landings</span>
                <span className={styles.text}>{landingViews.toLocaleString()}</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${totalViews > 0 ? (landingViews / totalViews) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className={styles.textMuted}>Boutiques</span>
                <span className={styles.text}>{boutiqueViews.toLocaleString()}</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${totalViews > 0 ? (boutiqueViews / totalViews) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.card} rounded-2xl p-6 border ${styles.border}`}>
          <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Commandes</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={styles.textMuted}>En attente</span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={styles.textMuted}>Payées</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                {orders.filter(o => o.status === 'paid').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={styles.textMuted}>Retournées</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                {orders.filter(o => o.status === 'returned').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} rounded-2xl p-6 border ${styles.border}`}>
        <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Top pages</h2>
        {topLandings.length === 0 ? (
          <p className={`text-center ${styles.textMuted} py-8`}>Aucune donnée disponible</p>
        ) : (
          <div className="space-y-3">
            {topLandings.map((landing, index) => (
              <div key={landing.id} className={`flex items-center justify-between p-4 border ${styles.border} rounded-xl`}>
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-zinc-400/20 text-zinc-400' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-zinc-700 text-zinc-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className={`font-medium ${styles.text}`}>{landing.name}</p>
                    <p className={`text-sm ${styles.textMuted} capitalize`}>{landing.type} - {landing.isLanding ? 'Landing' : 'Boutique'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg`}>👁</span>
                  <span className={`font-semibold ${styles.text}`}>{landing.views?.toLocaleString() || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
