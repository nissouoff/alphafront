"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "fr" | "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  refreshPage: () => void;
}

const translations = {
  fr: {
    dashboard: "Tableau de bord",
    landings: "Landing Pages",
    boutiques: "Boutiques",
    orders: "Commandes",
    analytics: "Analytique",
    settings: "Paramètres",
    logout: "Déconnexion",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    publish: "Publier",
    unpublish: "Dépublier",
    online: "En ligne",
    offline: "Hors ligne",
    pending: "En attente",
    processing: "En cours",
    paid: "Payée",
    returned: "Retournée",
    cancelled: "Annulée",
    views: "vues",
    totalOrders: "Total commandes",
    pendingOrders: "Commandes en attente",
    revenue: "Revenus",
    language: "Langue",
    profile: "Profil",
    blockedClients: "Clients bloqués",
    unblock: "Débloquer",
    blockClient: "Bloquer le client",
    blockReason: "Motif du blocage",
    stock: "Stock",
    unlimitedStock: "Stock illimité",
    limitedStock: "Stock limité",
    quantity: "Quantité",
    addProduct: "Ajouter un produit",
    productName: "Nom du produit",
    productPrice: "Prix",
    productDescription: "Description",
    selectTemplate: "Sélectionner un template",
    landingPage: "Landing Page",
    fullShop: "Boutique Complète",
    landingPageDesc: "Un seul produit en vente",
    fullShopDesc: "Plusieurs produits en vente",
    createNewProject: "Créer un nouveau projet",
    quickActions: "Actions rapides",
    noLanding: "Aucune landing page",
    noBoutique: "Aucune boutique",
    seeAllLandings: "Voir toutes les landing pages",
    seeAllBoutiques: "Voir toutes les boutiques",
    myProfile: "Modifier mon profil",
    shareShop: "Partager ma boutique",
    connectDomain: "Connecter un domaine",
    helpCenter: "Centre d'aide",
    welcome: "Bienvenue",
    newLanding: "Nouvelle landing",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ?",
    deleteSuccess: "Supprimé avec succès",
    deleteError: "Erreur lors de la suppression",
    view: "Voir",
    share: "Partager",
    linkCopied: "Lien copié !",
    createFirstBoutique: "Créer ma première boutique",
    createFirstLanding: "Créer ma première landing page",
    analytics: "Analytique",
    settings: "Paramètres",
    noOrderFound: "Aucune commande trouvée",
    noOrders: "Aucune commande",
    settingsSaved: "Paramètres sauvegardés !",
    skip: "Passer",
    next: "Suivant",
    previous: "Précédent",
    finish: "Terminer",
  },
  ar: {
    dashboard: "لوحة التحكم",
    landings: "صفحات الهبوط",
    boutiques: "المتاجر",
    orders: "الطلبات",
    analytics: "التحليلات",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    create: "إنشاء",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    publish: "نشر",
    unpublish: "إلغاء النشر",
    online: "متصل",
    offline: "غير متصل",
    pending: "قيد الانتظار",
    processing: "قيد التنفيذ",
    paid: "مدفوعة",
    returned: "مرتجعة",
    cancelled: "ملغاة",
    views: "مشاهدات",
    totalOrders: "إجمالي الطلبات",
    pendingOrders: "الطلبات المعلقة",
    revenue: "الإيرادات",
    language: "اللغة",
    profile: "الملف الشخصي",
    blockedClients: "العملاء المحظورون",
    unblock: "إلغاء الحظر",
    blockClient: "حظر العميل",
    blockReason: "سبب الحظر",
    stock: "المخزون",
    unlimitedStock: "مخزون غير محدود",
    limitedStock: "مخزون محدود",
    quantity: "الكمية",
    addProduct: "إضافة منتج",
    productName: "اسم المنتج",
    productPrice: "السعر",
    productDescription: "الوصف",
    selectTemplate: "اختر قالب",
    landingPage: "صفحة هبوط",
    fullShop: "متجر كامل",
    landingPageDesc: "منتج واحد للبيع",
    fullShopDesc: "منتجات متعددة للبيع",
    createNewProject: "إنشاء مشروع جديد",
    quickActions: "إجراءات سريعة",
    noLanding: "لا توجد صفحة هبوط",
    noBoutique: "لا توجد متجر",
    seeAllLandings: "عرض جميع صفحات الهبوط",
    seeAllBoutiques: "عرض جميع المتاجر",
    myProfile: "ملفي الشخصي",
    shareShop: "مشاركة متجري",
    connectDomain: "توصيل نطاق",
    helpCenter: "مركز المساعدة",
    welcome: "مرحبا",
    newLanding: "صفحة هبوط جديدة",
    confirmDelete: "هل أنت متأكد من الحذف؟",
    deleteSuccess: "تم الحذف بنجاح",
    deleteError: "خطأ في الحذف",
    view: "عرض",
    share: "مشاركة",
    linkCopied: "تم نسخ الرابط!",
    createFirstBoutique: "إنشاء متجري الأول",
    createFirstLanding: "إنشاء صفحة الهبوط الأولى",
    analytics: "التحليلات",
    settings: "الإعدادات",
    noOrderFound: "لا توجد طلبات",
    noOrders: "لا توجد طلبات",
    settingsSaved: "تم حفظ الإعدادات!",
    skip: "تخطي",
    next: "التالي",
    previous: "السابق",
    finish: "إنهاء",
  },
  en: {
    dashboard: "Dashboard",
    landings: "Landing Pages",
    boutiques: "Shops",
    orders: "Orders",
    analytics: "Analytics",
    settings: "Settings",
    logout: "Logout",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    publish: "Publish",
    unpublish: "Unpublish",
    online: "Online",
    offline: "Offline",
    pending: "Pending",
    processing: "Processing",
    paid: "Paid",
    returned: "Returned",
    cancelled: "Cancelled",
    views: "views",
    totalOrders: "Total orders",
    pendingOrders: "Pending orders",
    revenue: "Revenue",
    language: "Language",
    profile: "Profile",
    blockedClients: "Blocked clients",
    unblock: "Unblock",
    blockClient: "Block client",
    blockReason: "Block reason",
    stock: "Stock",
    unlimitedStock: "Unlimited stock",
    limitedStock: "Limited stock",
    quantity: "Quantity",
    addProduct: "Add product",
    productName: "Product name",
    productPrice: "Price",
    productDescription: "Description",
    selectTemplate: "Select template",
    landingPage: "Landing Page",
    fullShop: "Full Shop",
    landingPageDesc: "Single product for sale",
    fullShopDesc: "Multiple products for sale",
    createNewProject: "Create new project",
    quickActions: "Quick actions",
    noLanding: "No landing pages",
    noBoutique: "No shops",
    seeAllLandings: "See all landing pages",
    seeAllBoutiques: "See all shops",
    myProfile: "Edit my profile",
    shareShop: "Share my shop",
    connectDomain: "Connect domain",
    helpCenter: "Help center",
    welcome: "Welcome",
    newLanding: "New landing",
    confirmDelete: "Are you sure you want to delete?",
    deleteSuccess: "Deleted successfully",
    deleteError: "Error deleting",
    view: "View",
    share: "Share",
    linkCopied: "Link copied!",
    createFirstBoutique: "Create my first shop",
    createFirstLanding: "Create my first landing page",
    orders: "Orders",
    analytics: "Analytics",
    settings: "Settings",
    noOrderFound: "No orders found",
    noOrders: "No orders",
    settingsSaved: "Settings saved!",
    skip: "Skip",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["fr", "ar", "en"].includes(saved)) {
      setLanguageState(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    window.location.reload();
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, refreshPage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
