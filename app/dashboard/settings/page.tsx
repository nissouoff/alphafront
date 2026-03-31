"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDashboardData } from "../layout";

type Theme = "simple" | "dark" | "blue";
type Language = "fr" | "ar" | "en";

interface BlockedClient {
  phone: string;
  reason: string;
  blockedAt: string;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme, getThemeClasses } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { landings } = useDashboardData();
  const [activeTab, setActiveTab] = useState("general");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [saving, setSaving] = useState(false);
  const [blockedClients, setBlockedClients] = useState<BlockedClient[]>([]);
  const styles = getThemeClasses();

  const loadBlockedClients = () => {
    const stored = localStorage.getItem("blocked_clients");
    if (stored) {
      setBlockedClients(JSON.parse(stored));
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast.success(`Thème ${newTheme === "simple" ? "Simple" : newTheme === "dark" ? "Sombre" : "Bleu"} appliqué !`);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast.success(`Langue changée !`);
  };

  const unblockClient = (phone: string) => {
    const updated = blockedClients.filter(c => c.phone !== phone);
    setBlockedClients(updated);
    localStorage.setItem("blocked_clients", JSON.stringify(updated));
    toast.success("Client débloqué !");
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Paramètres enregistrés !");
      setSaving(false);
    }, 500);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "SUPPRIMER") {
      toast.error("Veuillez taper SUPPRIMER pour confirmer");
      return;
    }
    try {
      toast.success("Compte supprimé (démo)");
      logout();
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte");
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${styles.text}`}>Paramètres</h1>
        <p className={styles.textMuted}>Gérez vos préférences</p>
      </div>

      <div className={`${styles.card} rounded-2xl border ${styles.border} overflow-hidden`}>
        <div className={`border-b ${styles.border}`}>
          <nav className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-6 py-4 font-medium ${activeTab === "general" ? "text-indigo-400 border-b-2 border-indigo-400" : `${styles.textMuted} hover:text-white`}`}
            >
              Général
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`px-6 py-4 font-medium ${activeTab === "appearance" ? "text-indigo-400 border-b-2 border-indigo-400" : `${styles.textMuted} hover:text-white`}`}
            >
              Apparence
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-4 font-medium ${activeTab === "notifications" ? "text-indigo-400 border-b-2 border-indigo-400" : `${styles.textMuted} hover:text-white`}`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("language")}
              className={`px-6 py-4 font-medium ${activeTab === "language" ? "text-indigo-400 border-b-2 border-indigo-400" : `${styles.textMuted} hover:text-white`}`}
            >
              Langue
            </button>
            <button
              onClick={() => { setActiveTab("blocked"); loadBlockedClients(); }}
              className={`px-6 py-4 font-medium ${activeTab === "blocked" ? "text-indigo-400 border-b-2 border-indigo-400" : `${styles.textMuted} hover:text-white`}`}
            >
              Clients bloqués
            </button>
            <button
              onClick={() => setActiveTab("danger")}
              className={`px-6 py-4 font-medium ${activeTab === "danger" ? "text-red-400 border-b-2 border-red-400" : `${styles.textMuted} hover:text-white`}`}
            >
              Zone dangereuse
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${styles.text} mb-4`}>Informations du compte</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${styles.textMuted} mb-2`}>Nom</label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className={`w-full px-4 py-3 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${styles.textMuted} mb-2`}>Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className={`w-full px-4 py-3 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} opacity-50 cursor-not-allowed`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium rounded-xl transition-colors"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </>
                  ) : "Enregistrer"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${styles.text} mb-2`}>Thème</h3>
                <p className={`${styles.textMuted} mb-6`}>Choisissez le thème qui vous convient</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleThemeChange("simple")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === "simple"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : `${styles.border} hover:border-indigo-400`
                    }`}
                  >
                    <div className="w-full h-20 rounded-lg bg-zinc-100 mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-zinc-200"></div>
                    </div>
                    <p className={`font-medium ${styles.text}`}>Simple</p>
                    <p className={`text-sm ${styles.textMuted}`}>Thème clair par défaut</p>
                  </button>

                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : `${styles.border} hover:border-indigo-400`
                    }`}
                  >
                    <div className="w-full h-20 rounded-lg bg-zinc-800 mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-zinc-700 rounded-lg shadow-sm border border-zinc-600"></div>
                    </div>
                    <p className={`font-medium ${styles.text}`}>Sombre</p>
                    <p className={`text-sm ${styles.textMuted}`}>Facile pour les yeux</p>
                  </button>

                  <button
                    onClick={() => handleThemeChange("blue")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === "blue"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : `${styles.border} hover:border-indigo-400`
                    }`}
                  >
                    <div className="w-full h-20 rounded-lg bg-blue-600 mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-sm border border-blue-400"></div>
                    </div>
                    <p className={`font-medium ${styles.text}`}>Bleu</p>
                    <p className={`text-sm ${styles.textMuted}`}>Couleurs professionnelles</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${styles.text} mb-4`}>Préférences de notification</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-xl">
                    <div>
                      <p className={`font-medium ${styles.text}`}>Notifications de commandes</p>
                      <p className={`text-sm ${styles.textMuted}`}>Recevoir une notification pour chaque nouvelle commande</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-xl">
                    <div>
                      <p className={`font-medium ${styles.text}`}>Notifications de paiements</p>
                      <p className={`text-sm ${styles.textMuted}`}>Être notifié lors des paiements reçus</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-xl">
                    <div>
                      <p className={`font-medium ${styles.text}`}>Newsletter</p>
                      <p className={`text-sm ${styles.textMuted}`}>Recevoir des nouvelles et mises à jour</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${styles.text} mb-2`}>Langue</h3>
                <p className={`${styles.textMuted} mb-6`}>Choisissez la langue de l'interface</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      language === "fr"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : `${styles.border} hover:border-indigo-400`
                    }`}
                  >
                    <p className={`text-2xl mb-2`}>🇫🇷</p>
                    <p className={`font-medium ${styles.text}`}>Français</p>
                  </button>

                  <button
                    onClick={() => handleLanguageChange("ar")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      language === "ar"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : `${styles.border} hover:border-indigo-400`
                    }`}
                  >
                    <p className={`text-2xl mb-2`}>🇸🇦</p>
                    <p className={`font-medium ${styles.text}`}>العربية</p>
                  </button>

                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      language === "en"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : `${styles.border} hover:border-indigo-400`
                    }`}
                  >
                    <p className={`text-2xl mb-2`}>🇬🇧</p>
                    <p className={`font-medium ${styles.text}`}>English</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "blocked" && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${styles.text} mb-4`}>Clients bloqués</h3>
                {blockedClients.length === 0 ? (
                  <p className={`${styles.textMuted} text-center py-8`}>Aucun client bloqué</p>
                ) : (
                  <div className="space-y-3">
                    {blockedClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-zinc-700 rounded-xl">
                        <div>
                          <p className={`font-medium ${styles.text}`}>{client.phone}</p>
                          <p className={`text-sm ${styles.textMuted}`}>{client.reason}</p>
                          <p className={`text-xs ${styles.textMuted}`}>Bloqué le {new Date(client.blockedAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <button
                          onClick={() => unblockClient(client.phone)}
                          className="px-4 py-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors"
                        >
                          Débloquer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "danger" && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${styles.text} mb-2`}>Zone dangereuse</h3>
                <p className={`${styles.textMuted} mb-6`}>Ces actions sont irréversibles. Veuillez procéder avec précaution.</p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Supprimer mon compte
                  </button>
                ) : (
                  <div className="p-6 border border-red-500/50 rounded-xl bg-red-500/10">
                    <p className={`${styles.text} font-medium mb-4`}>
                      Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
                    </p>
                    <p className={`text-sm ${styles.textMuted} mb-4`}>
                      Tapez "SUPPRIMER" pour confirmer
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="SUPPRIMER"
                      className={`w-full px-4 py-3 rounded-xl border ${styles.border} ${styles.bg} ${styles.text} focus:outline-none focus:ring-2 focus:ring-red-500 mb-4`}
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "SUPPRIMER"}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                      >
                        Confirmer la suppression
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className={`px-6 py-3 border ${styles.border} ${styles.text} font-medium rounded-xl transition-colors hover:bg-zinc-700/50`}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
