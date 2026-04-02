"use client";

import { useState, useEffect, useCallback } from "react";

type NetworkStatus = "online" | "offline" | "unstable";

export default function NetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>("online");
  const [showBanner, setShowBanner] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkConnection = useCallback(async () => {
    if (!navigator.onLine) {
      setStatus("offline");
      setShowBanner(true);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus("online");
        setShowBanner(false);
        setRetryCount(0);
      } else {
        setStatus("unstable");
        setShowBanner(true);
      }
    } catch {
      setStatus("unstable");
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setRetryCount((prev) => prev + 1);
      checkConnection();
    };

    const handleOffline = () => {
      setStatus("offline");
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    checkConnection();
    const interval = setInterval(checkConnection, 10000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection]);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] px-4 py-3 text-center text-sm font-medium transition-all ${
        status === "offline"
          ? "bg-red-500 text-white"
          : "bg-yellow-500 text-yellow-900"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {status === "offline" ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span>Pas de connexion internet. Veuillez vérifier votre connexion.</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Connexion instable. Tentative de reconnexion automatique...</span>
            {retryCount > 0 && <span className="ml-1">(#{retryCount})</span>}
          </>
        )}
      </div>
    </div>
  );
}
