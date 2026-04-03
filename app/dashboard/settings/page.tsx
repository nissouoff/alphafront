"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

type Theme = "simple" | "dark" | "blue" | "orange";
type Language = "fr" | "ar" | "en";

interface BlockedClient {
  phone: string;
  reason: string;
  blockedAt: string;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [saving, setSaving] = useState(false);
  const [blockedClients, setBlockedClients] = useState<BlockedClient[]>([]);

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          bg: "bg-zinc-900",
          card: "bg-zinc-800 border-zinc-700",
          text: "text-zinc-100",
          textMuted: "text-zinc-400",
          input: "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400",
          border: "border-zinc-700",
          button: "bg-zinc-700",
          buttonHover: "bg-zinc-600",
          inputBg: "bg-zinc-800",
          textHover: "hover:text-zinc-100",
        };
      case "blue":
        return {
          bg: "bg-blue-950",
          card: "bg-blue-900/50 border-blue-700",
          text: "text-blue-100",
          textMuted: "text-blue-300",
          input: "bg-blue-800/50 border-blue-600 text-white placeholder-blue-300",
          border: "border-blue-700",
          button: "bg-blue-600",
          buttonHover: "bg-blue-500",
          inputBg: "bg-blue-900/50",
          textHover: "hover:text-blue-100",
        };
      case "orange":
        return {
          bg: "bg-zinc-950",
          card: "bg-zinc-900 border-orange-500/30",
          text: "text-orange-50",
          textMuted: "text-orange-200/60",
          input: "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400",
          border: "border-orange-500/30",
          button: "bg-orange-500",
          buttonHover: "bg-orange-400",
          inputBg: "bg-zinc-800",
          textHover: "hover:text-orange-100",
        };
      default:
        return {
          bg: "bg-zinc-50",
          card: "bg-white border-zinc-200",
          text: "text-zinc-900",
          textMuted: "text-zinc-500",
          input: "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400",
          border: "border-zinc-200",
          button: "bg-zinc-100 border-b-2 border-zinc-900",
          buttonHover: "bg-zinc-200",
          inputBg: "bg-white",
          textHover: "hover:text-zinc-700",
        };
    }
  };

  const classes = getThemeClasses();

  const loadBlockedClients = () => {
    const stored = localStorage.getItem("blocked_clients");
    if (stored) {
      setBlockedClients(JSON.parse(stored));
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const themeNames = {
      simple: "Simple",
      dark: "Sombre",
      blue: "Bleu",
      orange: "Orange"
    };
    toast.success(`Theme ${themeNames[newTheme]} applique !`);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast.success(`Langue changee !`);
  };

  const unblockClient = (phone: string) => {
    const updated = blockedClients.filter(c => c.phone !== phone);
    setBlockedClients(updated);
    localStorage.setItem("blocked_clients", JSON.stringify(updated));
    toast.success("Client debloque !");
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Parametres enregistres !");
      setSaving(false);
    }, 500);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "SUPPRIMER") {
      toast.error("Veuillez taper SUPPRIMER pour confirmer");
      return;
    }
    try {
      toast.success("Compte supprime (demo)");
      logout();
    } catch {
      toast.error("Erreur lors de la suppression du compte");
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "appearance", label: "Apparence" },
    { id: "notifications", label: "Notifs" },
    { id: "language", label: "Langue" },
    { id: "blocked", label: "Bloques" },
    { id: "danger", label: "Danger" },
  ];

  return (
    <div className={`min-h-screen ${classes.bg}`}>
      <div className="mb-6">
        <h1 className={`text-2xl sm:text-3xl font-bold ${classes.text}`}>Parametres</h1>
        <p className={`text-sm sm:text-base ${classes.textMuted}`}>Gerez vos preferences</p>
      </div>

      {/* Mobile Tab Selector */}
      <div className="mb-4 sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value);
            if (e.target.value === "blocked") loadBlockedClients();
          }}
          className={`w-full p-3 rounded-xl border ${classes.border} ${classes.input} text-base`}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      <div className={`${classes.card} rounded-2xl border ${classes.border} overflow-hidden`}>
        {/* Desktop Tabs */}
        <div className={`border-b ${classes.border} hidden sm:block`}>
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "blocked") loadBlockedClients();
                }}
                className={`px-4 sm:px-6 py-3 sm:py-4 font-medium whitespace-nowrap text-sm transition-colors ${
                  activeTab === tab.id
                    ? `${classes.button} border-b-2`
                    : `${classes.textMuted} ${classes.textHover}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "general" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${classes.text} mb-4`}>Informations du compte</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${classes.textMuted} mb-2`}>Nom</label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className={`w-full px-4 py-3 rounded-xl border ${classes.border} ${classes.input} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${classes.textMuted} mb-2`}>Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className={`w-full px-4 py-3 rounded-xl border ${classes.border} ${classes.input} opacity-50 cursor-not-allowed`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${classes.text} mb-2`}>Theme</h3>
                <p className={`${classes.textMuted} mb-6`}>Choisissez le theme qui vous convient</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {/* Simple Theme */}
                  <button
                    onClick={() => handleThemeChange("simple")}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      theme === "simple"
                        ? "border-orange-500 bg-orange-500/10"
                        : `${classes.border} hover:border-orange-500`
                    }`}
                  >
                    <div className="w-full h-16 sm:h-20 rounded-lg bg-zinc-100 mb-2 sm:mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-zinc-200"></div>
                    </div>
                    <p className={`font-medium text-sm sm:text-base ${classes.text}`}>Simple</p>
                    <p className={`text-xs sm:text-sm ${classes.textMuted}`}>Theme clair</p>
                  </button>

                  {/* Dark Theme */}
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-orange-500 bg-orange-500/10"
                        : `${classes.border} hover:border-orange-500`
                    }`}
                  >
                    <div className="w-full h-16 sm:h-20 rounded-lg bg-zinc-800 mb-2 sm:mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-zinc-700 rounded-lg shadow-sm border border-zinc-600"></div>
                    </div>
                    <p className={`font-medium text-sm sm:text-base ${classes.text}`}>Sombre</p>
                    <p className={`text-xs sm:text-sm ${classes.textMuted}`}>Facile pour les yeux</p>
                  </button>

                  {/* Blue Theme */}
                  <button
                    onClick={() => handleThemeChange("blue")}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      theme === "blue"
                        ? "border-orange-500 bg-orange-500/10"
                        : `${classes.border} hover:border-orange-500`
                    }`}
                  >
                    <div className="w-full h-16 sm:h-20 rounded-lg bg-blue-600 mb-2 sm:mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-sm border border-blue-400"></div>
                    </div>
                    <p className={`font-medium text-sm sm:text-base ${classes.text}`}>Bleu</p>
                    <p className={`text-xs sm:text-sm ${classes.textMuted}`}>Couleurs pro</p>
                  </button>

                  {/* Orange Theme */}
                  <button
                    onClick={() => handleThemeChange("orange")}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      theme === "orange"
                        ? "border-orange-500 bg-orange-500/10"
                        : `${classes.border} hover:border-orange-500`
                    }`}
                  >
                    <div className="w-full h-16 sm:h-20 rounded-lg bg-zinc-900 mb-2 sm:mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm border border-orange-400"></div>
                    </div>
                    <p className={`font-medium text-sm sm:text-base ${classes.text}`}>Orange</p>
                    <p className={`text-xs sm:text-sm ${classes.textMuted}`}>Orange et noir</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold ${classes.text} mb-4`}>Preferences de notification</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { title: "Notifications de commandes", desc: "Recevoir une notification pour chaque nouvelle commande" },
                    { title: "Notifications de paiements", desc: "Etre notifie lors des paiements recus" },
                    { title: "Newsletter", desc: "Recevoir des nouvelles et mises a jour" },
                  ].map((item, index) => (
                    <div key={index} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border ${classes.border} rounded-xl gap-3`}>
                      <div>
                        <p className={`font-medium ${classes.text}`}>{item.title}</p>
                        <p className={`text-sm ${classes.textMuted}`}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${classes.text} mb-2`}>Langue</h3>
                <p className={`${classes.textMuted} mb-6`}>Choisissez la langue de l&apos;interface</p>
                
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { code: "fr", flag: "FR", name: "Francais" },
                    { code: "ar", flag: "DZ", name: "Arabe" },
                    { code: "en", flag: "GB", name: "English" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as Language)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                        language === lang.code
                          ? "border-orange-500 bg-orange-500/10"
                          : `${classes.border} hover:border-orange-500`
                      }`}
                    >
                      <p className="text-xl sm:text-2xl mb-1 sm:mb-2">{lang.flag === "FR" ? "🇫🇷" : lang.flag === "DZ" ? "🇩🇿" : "🇬🇧"}</p>
                      <p className={`font-medium text-xs sm:text-base ${classes.text}`}>{lang.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "blocked" && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold ${classes.text} mb-4`}>Clients bloques</h3>
                {blockedClients.length === 0 ? (
                  <p className={`${classes.textMuted} text-center py-8`}>Aucun client bloque</p>
                ) : (
                  <div className="space-y-3">
                    {blockedClients.map((client, index) => (
                      <div key={index} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border ${classes.border} rounded-xl gap-3`}>
                        <div>
                          <p className={`font-medium ${classes.text}`}>{client.phone}</p>
                          <p className={`text-sm ${classes.textMuted}`}>{client.reason}</p>
                          <p className={`text-xs ${classes.textMuted}`}>Bloque le {new Date(client.blockedAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <button
                          onClick={() => unblockClient(client.phone)}
                          className="px-4 py-2 text-orange-500 hover:bg-orange-500/20 rounded-lg transition-colors text-sm"
                        >
                          Debloquer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "danger" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${classes.text} mb-2`}>Zone dangereuse</h3>
                <p className={`${classes.textMuted} mb-6`}>Ces actions sont irreversibles.</p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Supprimer mon compte
                  </button>
                ) : (
                  <div className="p-4 sm:p-6 border border-red-500/50 rounded-xl bg-red-500/10">
                    <p className={`${classes.text} font-medium mb-4`}>
                      Etes-vous sur de vouloir supprimer votre compte ? Cette action est irreversibile.
                    </p>
                    <p className={`text-sm ${classes.textMuted} mb-4`}>
                      Tapez SUPPRIMER pour confirmer
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="SUPPRIMER"
                      className={`w-full px-4 py-3 rounded-xl border ${classes.border} ${classes.input} focus:outline-none focus:ring-2 focus:ring-red-500 mb-4`}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "SUPPRIMER"}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className={`px-6 py-3 border ${classes.border} ${classes.text} font-medium rounded-xl transition-colors hover:${classes.card}`}
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
    </div>
  );
}
