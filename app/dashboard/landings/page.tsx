"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { deleteLanding, getOrders, Order } from "@/lib/api";
import { useDashboardData } from "../layout";

const ITEMS_PER_PAGE = 6;

export default function LandingsPage() {
  const { getThemeClasses } = useTheme();
  const { t } = useLanguage();
  const { landings, orders, loading: dataLoading } = useDashboardData();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const styles = getThemeClasses();

  const getPendingCount = (slug: string) => {
    return orders.filter((o: any) => o.landingSlug === slug && o.status === 'pending').length;
  };

  const filteredLandings = useMemo(() => {
    return landings.filter((l: any) => l.isLanding === true);
  }, [landings]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredLandings.length / ITEMS_PER_PAGE);
  }, [filteredLandings.length]);

  const paginatedLandings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLandings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLandings, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLandings.length]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    
    setDeleting(id);
    try {
      await deleteLanding(id);
      toast.success(t("deleteSuccess"));
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || t("deleteError"));
    } finally {
      setDeleting(null);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      cosmetic: '💄',
      fashion: '👗',
      food: '🍎',
      tech: '📱',
      home: '🏠',
      sport: '💪',
      jewelry: '💎',
      services: '⚡',
    };
    return icons[type] || '📄';
  };

  if (dataLoading) {
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
          <h1 className={`text-2xl font-bold ${styles.text}`}>{t("landings")}</h1>
          <p className={styles.textMuted}>{filteredLandings.length} landing{filteredLandings.length > 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/templates-landing"
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t("create")}
        </Link>
      </div>

      {filteredLandings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLandings.map((landing: any) => (
            <div key={landing.id} className={`${styles.card} rounded-2xl border ${styles.border} overflow-hidden hover:shadow-lg transition-all relative`}>
              {getPendingCount(landing.slug) > 0 && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                  {getPendingCount(landing.slug)}
                </span>
              )}
              <div className="h-32 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {landing.content?.logo ? (
                  <img src={landing.content.logo} alt={landing.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-5xl">{getTypeIcon(landing.type)}</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-semibold ${styles.text}`}>{landing.name}</h3>
                    <p className={`text-sm ${styles.textMuted} capitalize`}>{landing.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    landing.isPublished 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {landing.isPublished ? t("online") : t("offline")}
                  </span>
                </div>
                <div className={`flex items-center gap-4 text-sm ${styles.textMuted} mb-4`}>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {landing.views || 0} {t("views")}
                  </span>
                  <span>{landing.updatedAt ? new Date(landing.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link 
                    href={`/dashboard/landing/${landing.id}`}
                    target="_blank"
                    className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                    title="Analytique"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Stats
                  </Link>
                  {landing.isPublished && (
                    <button
                      onClick={() => window.open(`/template/${landing.type}?id=${landing.id}`, '_blank')}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                      title={t("view")}
                    >
                      {t("view")}
                    </button>
                  )}
                  <Link 
                    href={`/editor/landing?id=${landing.id}&template=${landing.type}`}
                    className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {t("edit")}
                  </Link>
                  <button
                    onClick={() => handleDelete(landing.id)}
                    disabled={deleting === landing.id}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                    title={t("delete")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-700 text-white hover:bg-zinc-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-indigo-500 text-white'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-700 text-white hover:bg-zinc-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={`${styles.card} rounded-2xl p-12 border ${styles.border} text-center`}>
          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${styles.text} mb-2`}>{t("noLanding")}</h2>
          <p className={`${styles.textMuted} mb-6`}>{t("createFirstLanding")}</p>
          <Link
            href="/templates-landing"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t("createFirstLanding")}
          </Link>
        </div>
      )}
    </>
  );
}
