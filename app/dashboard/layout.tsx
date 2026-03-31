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

const bg = "bg-zinc-900";
const text = "text-white";
const textMuted = "text-zinc-400";
const card = "bg-zinc-800";
const border = "border-zinc-700";

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

    orders
      .filter((o) => o.status === "pending")
      .slice(0, 10)
      .forEach((order) => {
        // Match by landingSlug OR landingId
        const landing = landings.find((l) => 
          l.slug === order.landingSlug || l.id === order.landingId || l.id === order.landingSlug
        );
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
    if (returnedCount > 0) {
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
    if (pathname === "/dashboard") return t("dashboard");
    if (pathname.startsWith("/dashboard/landings")) return t("landings");
    if (pathname.startsWith("/dashboard/boutiques")) return t("boutiques");
    if (pathname.startsWith("/dashboard/orders")) return "Commandes";
    if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
    if (pathname.startsWith("/dashboard/settings")) return t("settings");
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
    <div className={`min-h-screen ${bg} ${isDetailPage ? '' : 'flex'}`}>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 z-[200] flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
          </svg>
          Pas de connexion internet
        </div>
      )}

      {!isDetailPage && (
        <aside className={`w-64 ${card} border-r ${border} flex flex-col fixed top-0 left-0 h-full z-50`}>
          <div className={`p-6 border-b ${border}`}>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className={`text-xl font-bold ${text}`}>ShopLaunch</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard") ? "bg-indigo-500/20 text-indigo-400 rounded-xl font-medium" : `${textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t("dashboard")}
            </Link>

            <Link href="/dashboard/landings" className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/landings") ? "bg-indigo-500/20 text-indigo-400 rounded-xl font-medium" : `${textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t("landings")}
            </Link>

            <Link href="/dashboard/boutiques" className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/boutiques") ? "bg-indigo-500/20 text-indigo-400 rounded-xl font-medium" : `${textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {t("boutiques")}
            </Link>

            <Link href="/dashboard/analytics" className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/analytics") ? "bg-indigo-500/20 text-indigo-400 rounded-xl font-medium" : `${textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>

            <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 ${isActive("/dashboard/settings") ? "bg-indigo-500/20 text-indigo-400 rounded-xl font-medium" : `${textMuted} hover:bg-zinc-700/50 rounded-xl transition-colors`}`}>
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
      )}

      <div className={`flex-1 ${isDetailPage ? '' : 'ml-64'}`}>
        <header className={`${card} border-b ${border} px-8 py-4 flex items-center justify-between`}>
            <div>
              <h1 className={`text-2xl font-bold ${text}`}>{getPageTitle()}</h1>
              <p className={textMuted}>{t("welcome")}, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={notifRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 rounded-xl hover:bg-zinc-700/50 transition-colors relative`}>
                  <svg className={`w-6 h-6 ${text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 top-full mt-2 w-80 ${card} border ${border} rounded-xl shadow-xl z-50 overflow-hidden`}>
                    <div className={`p-4 border-b ${border}`}>
                      <h3 className={`font-semibold ${text}`}>Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
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
                              className={`flex items-start gap-3 p-4 hover:bg-zinc-700/50 transition-colors border-b ${border} last:border-0`}
                            >
                              <span className="text-xl">{notif.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p className={`text-sm font-medium ${text} truncate`}>{notif.title}</p>
                                  <span className={`text-xs ${textMuted} whitespace-nowrap`}>
                                    {new Date(notif.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm ${textMuted} flex-1`}>
                                    {isLong ? `${notif.message.slice(0, 50)}...` : notif.message}
                                  </p>
                                  {isLong && <span className="text-xs text-indigo-400 whitespace-nowrap">voir plus</span>}
                                </div>
                                <p className={`text-xs ${textMuted} mt-1`}>
                                  {new Date(notif.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                </p>
                              </div>
                            </Link>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`font-medium ${text}`}>{user?.name}</p>
                  <p className={`text-sm ${textMuted}`}>{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

        <div className="p-8">{children}</div>
      </div>
    </div>
    </DashboardContext.Provider>
  );
}
