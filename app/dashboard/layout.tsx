"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef, useMemo, createContext, useContext } from "react";
import { getLandings, getOrders, Landing } from "@/lib/api";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  link?: string;
  createdAt: string;
}

interface DashboardData {
  landings: Landing[];
  orders: any[];
  loading: boolean;
  refetch: () => void;
}

const DashboardContext = createContext<DashboardData>({
  landings: [],
  orders: [],
  loading: true,
  refetch: () => {},
});

export const useDashboardData = () => useContext(DashboardContext);

interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType>({
  pageTitle: '',
  setPageTitle: () => {},
});

export const usePageTitle = () => useContext(PageTitleContext);

const bg = "bg-[var(--theme-bg)]";
const text = "text-[var(--theme-text)]";
const textMuted = "text-[var(--theme-text-muted)]";
const card = "bg-[var(--theme-card)]";
const border = "border-[var(--theme-border)]";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const notifRef = useRef<HTMLDivElement>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [landings, setLandings] = useState<Landing[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [landingsResult, ordersResult] = await Promise.all([
        getLandings("all"),
        getOrders(),
      ]);
      setLandings(landingsResult.landings || []);
      setOrders(ordersResult.orders || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Poll for updates every 5 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      getOrders().then((ordersResult) => {
        setOrders(ordersResult.orders || []);
      }).catch(console.error);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [user]);

  const refetch = () => {
    fetchData();
  };

  const notifications = useMemo<Notification[]>(() => {
    const newNotifications: Notification[] = [];
    const now = new Date();

    // Only show notifications if we have both landings AND orders
    if (landings.length === 0) {
      return newNotifications;
    }

    orders
      .filter((o) => o.status === "pending")
      .slice(0, 10)
      .forEach((order) => {
        // Match by landingSlug OR landingId
        const landing = landings.find((l) => 
          l.slug === order.landingSlug || l.id === order.landingId || l.id === order.landingSlug
        );
        
        // Only create notification if landing exists and belongs to user
        if (!landing) return;
        
        const isLanding = landing?.isLanding === true;
        newNotifications.push({
          id: order.id,
          type: "pending",
          title: `Nouvelle commande #${order.id?.slice(-6) || "?"}`,
          message: `${order.customerName || "Client"} - ${order.total || order.productPrice || "0"} DA - ${order.wilaya || "Wilaya non spécifiée"}`,
          icon: "🔔",
          link: isLanding
            ? `/dashboard/landing/${landing?.id || order.landingId}`
            : `/dashboard/boutique/${landing?.id || order.landingId}`,
          createdAt: order.createdAt || now.toISOString(),
        });
      });

    const paidCount = orders.filter((o) => o.status === "paid").length;
    const milestones = [100, 1000, 10000, 100000, 1000000];
    milestones.forEach((milestone) => {
      if (paidCount >= milestone && paidCount < milestone * 1.1) {
        newNotifications.push({
          id: `milestone-${milestone}`,
          type: "milestone",
          title: "🎉 Bravo !",
          message: `Vous avez atteint ${milestone.toLocaleString()} commandes payées !`,
          icon: "🏆",
          link: "/dashboard",
          createdAt: now.toISOString(),
        });
      }
    });

    const returnedCount = orders.filter((o) => o.status === "returned").length;
    if (returnedCount > 0 && landings.length > 0) {
      newNotifications.push({
        id: "returned",
        type: "warning",
        title: "⚠️ Commandes retournées",
        message: `${returnedCount} commande${returnedCount > 1 ? "s" : ""} retournée${returnedCount > 1 ? "s" : ""} nécessitent votre attention`,
        icon: "📦",
        link: "/dashboard/orders",
        createdAt: now.toISOString(),
      });
    }

    return newNotifications;
  }, [orders, landings]);

  const pendingCount = notifications.filter((n) => n.type === "pending").length;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const isDetailPage = pathname.includes('/landing/') || pathname.includes('/boutique/');

  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    if (pathname === "/dashboard") return t("dashboard");
    if (pathname.startsWith("/dashboard/landings")) return t("landings");
    if (pathname.startsWith("/dashboard/boutiques")) return t("boutiques");
    if (pathname.startsWith("/dashboard/orders")) return "Commandes";
    if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
    if (pathname.startsWith("/dashboard/settings")) return t("settings");
    if (pathname.includes("/dashboard/landing/")) {
      return "Landing";
    }
    if (pathname.includes("/dashboard/boutique/")) {
      return "Boutique";
    }
    return t("dashboard");
  };

  if (authLoading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ landings, orders, loading, refetch: fetchData }}>
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
    <div className={`min-h-screen bg-[var(--theme-bg)] ${isDetailPage ? '' : 'flex'}`}>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 z-[200] flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
          </svg>
          Pas de connexion internet
        </div>
      )}

      {!isDetailPage && (
        <>
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[var(--theme-card)] rounded-xl text-[var(--theme-text)]"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            w-64 bg-[var(--theme-sidebar)] border-r border-[var(--theme-border)] flex flex-col fixed top-0 left-0 h-full z-50
            transform transition-transform duration-300 ease-in-out
            lg:translate-x-0
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className={`p-4 md:p-6 border-b ${border}`}>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--theme-button)] rounded-xl flex items-center justify-center text-white">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className={`text-lg md:text-xl font-bold ${text}`}>ShopLaunch</span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard") ? "bg-[var(--theme-button)]/20 text-[var(--theme-button)] rounded-xl font-medium" : `${textMuted} hover:bg-[var(--theme-card)]/80 rounded-xl transition-colors`}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t("dashboard")}
              </Link>

              <Link href="/dashboard/landings" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/landings") ? "bg-[var(--theme-button)]/20 text-[var(--theme-button)] rounded-xl font-medium" : `${textMuted} hover:bg-[var(--theme-card)]/80 rounded-xl transition-colors`}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("landings")}
              </Link>

              <Link href="/dashboard/boutiques" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/boutiques") ? "bg-[var(--theme-button)]/20 text-[var(--theme-button)] rounded-xl font-medium" : `${textMuted} hover:bg-[var(--theme-card)]/80 rounded-xl transition-colors`}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t("boutiques")}
              </Link>

              <Link href="/dashboard/analytics" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/analytics") ? "bg-[var(--theme-button)]/20 text-[var(--theme-button)] rounded-xl font-medium" : `${textMuted} hover:bg-[var(--theme-card)]/80 rounded-xl transition-colors`}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>

              <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/settings") ? "bg-[var(--theme-button)]/20 text-[var(--theme-button)] rounded-xl font-medium" : `${textMuted} hover:bg-[var(--theme-card)]/80 rounded-xl transition-colors`}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t("settings")}
              </Link>
            </nav>

            <div className="p-4 border-t border-[var(--theme-border)]">
              <button onClick={logout} className={`flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6 4H7m6 4v1a3 3 0 11-6 0v-1" />
                </svg>
                {t("logout")}
              </button>
            </div>
          </aside>
        </>
      )}

      <div className={`flex-1 ${isDetailPage ? '' : 'lg:ml-64'}`}>
        <header className={`bg-[var(--theme-header)] border-b border-[var(--theme-border)] px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between`}>
            <div className="ml-10 lg:ml-0 flex items-center gap-2 md:gap-4">
              {isDetailPage && (
                <button 
                  onClick={() => router.push(pathname.includes('/dashboard/landing/') ? '/dashboard/landings' : '/dashboard/boutiques')} 
                  className={`p-2 hover:bg-[var(--theme-card)] rounded-lg ${textMuted} transition-colors`}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className={`text-lg md:text-xl lg:text-2xl font-bold ${text}`}>{getPageTitle()}</h1>
                {!isDetailPage && <p className={`text-xs md:text-sm ${textMuted} hidden sm:block`}>{t("welcome")}, {user?.name}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative" ref={notifRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 rounded-xl hover:bg-[var(--theme-card)] transition-colors relative`}>
                  <svg className={`w-5 h-5 md:w-6 md:h-6 ${text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 top-full mt-2 w-72 md:w-80 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl shadow-xl z-50 overflow-hidden`}>
                    <div className={`p-3 md:p-4 border-b border-[var(--theme-border)]`}>
                      <h3 className={`font-semibold ${text}`}>Notifications</h3>
                    </div>
                    <div className="max-h-64 md:max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className={`p-4 text-center ${textMuted}`}>Aucune notification</p>
                      ) : (
                        notifications.map((notif) => {
                          const isLong = notif.message.length > 50;
                          return (
                            <Link
                              key={notif.id}
                              href={notif.link || "#"}
                              onClick={() => setShowNotifications(false)}
                              className={`flex items-start gap-3 p-3 md:p-4 hover:bg-[var(--theme-bg)]/50 transition-colors border-b border-[var(--theme-border)] last:border-0`}
                            >
                              <span className="text-lg md:text-xl">{notif.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p className={`text-sm font-medium ${text} truncate`}>{notif.title}</p>
                                  <span className={`text-xs ${textMuted} whitespace-nowrap`}>
                                    {new Date(notif.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className={`text-xs md:text-sm ${textMuted} flex-1`}>
                                    {isLong ? `${notif.message.slice(0, 50)}...` : notif.message}
                                  </p>
                                  {isLong && <span className="text-xs text-[var(--theme-button)] whitespace-nowrap">voir plus</span>}
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--theme-button)] rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className={`font-medium ${text} text-sm`}>{user?.name}</p>
                  <p className={`text-xs ${textMuted}`}>{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
    </PageTitleContext.Provider>
    </DashboardContext.Provider>
  );
}
