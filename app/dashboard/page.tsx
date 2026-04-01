"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useDashboardData } from "./layout";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { getThemeClasses } = useTheme();
  const { t } = useLanguage();
  const { landings, orders, loading } = useDashboardData();
  const styles = getThemeClasses();

  const handleAction = (action: string) => {
    toast.success(`Fonctionnalité "${action}" en cours de développement !`);
  };

  const landingPages = landings.filter(l => l.isLanding === true);
  const boutiques = landings.filter(l => l.isLanding === false);
  
  const totalViews = landings.reduce((sum, l) => sum + (l.views || 0), 0);
  const publishedLandings = landingPages.filter(l => l.isPublished).length;
  const publishedBoutiques = boutiques.filter(l => l.isPublished).length;

  const stats = [
    { label: t("landings"), value: landingPages.length.toString(), icon: "📄", color: "bg-blue-500" },
    { label: t("boutiques"), value: boutiques.length.toString(), icon: "🏪", color: "bg-pink-500" },
    { label: t("online"), value: (publishedLandings + publishedBoutiques).toString(), icon: "✅", color: "bg-green-500" },
    { label: t("views"), value: totalViews.toString(), icon: "👁", color: "bg-purple-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.card} rounded-xl md:rounded-2xl p-4 md:p-6 border ${styles.border}`}>
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${styles.text} mb-1`}>{stat.value}</p>
            <p className={`text-xs md:text-sm ${styles.textMuted}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className={`${styles.card} rounded-xl md:rounded-2xl p-4 md:p-6 border ${styles.border}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-base md:text-lg font-semibold ${styles.text}`}>{t("landings")}</h2>
            <Link href="/templates-landing" className="px-3 md:px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">{t("create")}</span>
            </Link>
          </div>
          {landingPages.length === 0 ? (
            <p className={`${styles.textMuted} text-center py-4 md:py-8`}>{t("noLanding")}</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {landingPages.slice(0, 3).map((landing) => (
                <div key={landing.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border ${styles.border} rounded-xl`}>
                  <div className="min-w-0">
                    <p className={`font-medium ${styles.text} truncate`}>{landing.name}</p>
                    <p className={`text-xs md:text-sm ${styles.textMuted}`}>{landing.isPublished ? t("online") : t("offline")}</p>
                  </div>
                  <Link href={`/editor/landing?id=${landing.id}&template=${landing.type}`} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs md:text-sm rounded-lg whitespace-nowrap">
                    {t("edit")}
                  </Link>
                </div>
              ))}
              {landingPages.length > 3 && (
                <Link href="/dashboard/landings" className={`block text-center ${styles.textMuted} text-xs md:text-sm hover:underline`}>
                  {t("seeAllLandings")} ({landingPages.length})
                </Link>
              )}
            </div>
          )}
        </div>

        <div className={`${styles.card} rounded-xl md:rounded-2xl p-4 md:p-6 border ${styles.border}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-base md:text-lg font-semibold ${styles.text}`}>{t("boutiques")}</h2>
            <Link href="/templates" className="px-3 md:px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">{t("create")}</span>
            </Link>
          </div>
          {boutiques.length === 0 ? (
            <p className={`${styles.textMuted} text-center py-4 md:py-8`}>{t("noBoutique")}</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {boutiques.slice(0, 3).map((boutique) => (
                <div key={boutique.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border ${styles.border} rounded-xl`}>
                  <div className="min-w-0">
                    <p className={`font-medium ${styles.text} truncate`}>{boutique.name}</p>
                    <p className={`text-sm ${styles.textMuted}`}>{boutique.isPublished ? t("online") : t("offline")}</p>
                  </div>
                  <Link href={`/editor/${boutique.type}?id=${boutique.id}&type=boutique`} className="px-3 py-1 bg-pink-500/20 text-pink-400 text-sm rounded-lg">
                    {t("edit")}
                  </Link>
                </div>
              ))}
              {boutiques.length > 3 && (
                <Link href="/dashboard/boutiques" className={`block text-center ${styles.textMuted} text-sm hover:underline`}>
                  {t("seeAllBoutiques")} ({boutiques.length})
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.card} rounded-2xl p-6 border ${styles.border} mb-8`}>
        <h2 className={`text-lg font-semibold ${styles.text} mb-6`}>{t("createNewProject")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/templates-landing"
            className={`flex items-center gap-4 p-6 border-2 border-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors`}
          >
            <div className="w-16 h-16 bg-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-3xl">📄</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-zinc-900">{t("landingPage")}</p>
              <p className="text-sm text-zinc-600">{t("landingPageDesc")}</p>
            </div>
          </Link>
          <Link 
            href="/templates"
            className={`flex items-center gap-4 p-6 border-2 border-pink-500 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors`}
          >
            <div className="w-16 h-16 bg-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🏪</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-zinc-900">{t("fullShop")}</p>
              <p className="text-sm text-zinc-600">{t("fullShopDesc")}</p>
            </div>
          </Link>
        </div>
      </div>

      <div className={`${styles.card} rounded-2xl p-6 border ${styles.border}`}>
        <h2 className={`text-lg font-semibold ${styles.text} mb-6`}>{t("quickActions")}</h2>
        <div className="space-y-3">
          <Link href="/dashboard/settings" className={`flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-700/50 transition-colors`}>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className={styles.text}>{t("myProfile")}</span>
          </Link>
          <button onClick={() => handleAction("Partager")} className={`flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-700/50 transition-colors w-full`}>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className={styles.text}>{t("shareShop")}</span>
          </button>
          <button onClick={() => handleAction("Domaine")} className={`flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-700/50 transition-colors w-full`}>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className={styles.text}>{t("connectDomain")}</span>
          </button>
          <button onClick={() => handleAction("Aide")} className={`flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-700/50 transition-colors w-full`}>
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={styles.text}>{t("helpCenter")}</span>
          </button>
        </div>
      </div>
    </>
  );
}
