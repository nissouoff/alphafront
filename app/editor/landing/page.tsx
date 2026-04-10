"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getLanding, updateLanding, publishLanding, unpublishLanding, Product } from "@/lib/api";

interface LandingContent {
  logo: string;
  brandName: string;
  brandNameAr?: string;
  heroTitle: string;
  heroTitleAr?: string;
  heroSubtitle: string;
  heroSubtitleAr?: string;
  ctaButton: string;
  ctaButtonAr?: string;
  contactEmail: string;
  contactWhatsapp: string;
  contactInstagram: string;
  contactFacebook: string;
  footerText: string;
  footerTextAr?: string;
  heroBgColor: string;
  ctaBgColor: string;
  heroTextColor: string;
  ctaTextColor: string;
  textColor: string;
  heroTextSize: string;
  ctaTextSize: string;
  productNameSize: string;
  productPriceSize: string;
  heroSubtitleSize: string;
  sectionBg: string;
  showStats: boolean;
  showReviews: boolean;
  showGuarantee: boolean;
  guaranteeText?: string;
  guaranteeTextAr?: string;
  showTrustBar?: boolean;
  trustBarText?: string;
  trustBarTextAr?: string;
  satisfactionRate?: string;
  clientsCount?: string;
  feature1Title?: string;
  feature1TitleAr?: string;
  feature1Desc?: string;
  feature1DescAr?: string;
  feature2Title?: string;
  feature2TitleAr?: string;
  feature2Desc?: string;
  feature2DescAr?: string;
  feature3Title?: string;
  feature3TitleAr?: string;
  feature3Desc?: string;
  feature3DescAr?: string;
  faq1Question?: string;
  faq1QuestionAr?: string;
  faq1Answer?: string;
  faq1AnswerAr?: string;
  faq2Question?: string;
  faq2QuestionAr?: string;
  faq2Answer?: string;
  faq2AnswerAr?: string;
  faq3Question?: string;
  faq3QuestionAr?: string;
  faq3Answer?: string;
  faq3AnswerAr?: string;
  featuresSectionTitle?: string;
  featuresSectionTitleAr?: string;
  featuresSectionSubtitle?: string;
  featuresSectionSubtitleAr?: string;
  offerTitle?: string;
  offerTitleAr?: string;
  offerSubtitle?: string;
  offerSubtitleAr?: string;
  reviewsTitle?: string;
  reviewsTitleAr?: string;
  ctaFinalTitle?: string;
  ctaFinalTitleAr?: string;
  ctaFinalSubtitle?: string;
  ctaFinalSubtitleAr?: string;
  collectionBadge?: string;
  collectionBadgeAr?: string;
  collectionTitle?: string;
  collectionTitleAr?: string;
  collectionDescription?: string;
  collectionDescriptionAr?: string;
  fastDeliveryText?: string;
  fastDeliveryTextAr?: string;
  cashOnDeliveryText?: string;
  cashOnDeliveryTextAr?: string;
  questionText?: string;
  questionTextAr?: string;
  helpText?: string;
  helpTextAr?: string;
  supportText?: string;
  supportTextAr?: string;
  supportGuarantee?: string;
  supportGuaranteeAr?: string;
  paymentText?: string;
  exploreButton?: string;
  exploreButtonAr?: string;
}

const DEFAULT_CONTENT: LandingContent = {
  logo: '',
  brandName: 'Ma Marque',
  brandNameAr: 'علامتي',
  heroTitle: 'Votre beauté commence ici',
  heroTitleAr: 'جمالك يبدأ من هنا',
  heroSubtitle: 'Découvrez notre collection exclusive de soins cosmétiques naturels.',
  heroSubtitleAr: 'اكتشف مجموعتنا الحصرية من مستحضرات التجميل الطبيعية.',
  ctaButton: 'Commander maintenant',
  ctaButtonAr: 'اطلب الآن',
  contactEmail: 'contact@exemple.com',
  contactWhatsapp: '',
  contactInstagram: '',
  contactFacebook: '',
  footerText: 'Des soins naturels pour une peau radieuse.',
  footerTextAr: 'عناية طبيعية لبشرة مشرقة.',
  heroBgColor: 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50',
  ctaBgColor: 'bg-gradient-to-r from-rose-500 to-orange-500',
  heroTextColor: 'text-zinc-900',
  ctaTextColor: 'text-white',
  textColor: 'text-zinc-700',
  heroTextSize: 'text-5xl',
  ctaTextSize: 'text-lg',
  productNameSize: 'text-3xl',
  productPriceSize: 'text-4xl',
  heroSubtitleSize: 'text-xl',
  sectionBg: 'bg-white',
  showStats: true,
  showReviews: true,
  showGuarantee: false,
  guaranteeText: 'Garantie 30 jours',
  guaranteeTextAr: 'ضمان 30 يوماً',
  showTrustBar: true,
  trustBarText: 'Paiement sécurisé',
  trustBarTextAr: 'دفع آمن',
  satisfactionRate: '98',
  clientsCount: '15K+',
  feature1Title: 'Rapide',
  feature1TitleAr: 'سريع',
  feature1Desc: 'Résultats visibles immédiatement',
  feature1DescAr: 'نتائج فورية',
  feature2Title: 'Simple',
  feature2TitleAr: 'سهل',
  feature2Desc: 'Utilisable par tout le monde',
  feature2DescAr: 'مناسب للجميع',
  feature3Title: 'Puissant',
  feature3TitleAr: 'فعال',
  feature3Desc: 'Performance haut niveau',
  feature3DescAr: 'أداء عالي',
  faq1Question: 'Livraison ?',
  faq1QuestionAr: 'التوصيل؟',
  faq1Answer: 'Livraison rapide sous 24-48h partout en Algérie.',
  faq1AnswerAr: 'توصيل سريع خلال 24-48 ساعة في الجزائر.',
  faq2Question: 'Garantie ?',
  faq2QuestionAr: 'الضمان؟',
  faq2Answer: 'Garantie satisfait ou remboursé sous 30 jours.',
  faq2AnswerAr: 'ضمان استرداد الأموال خلال 30 يوماً.',
  faq3Question: 'Utilisation ?',
  faq3QuestionAr: 'الاستخدام؟',
  faq3Answer: 'Simple et intuitif, adapté à tous les niveaux.',
  faq3AnswerAr: 'بسيط وسهل، مناسب للجميع.',
  featuresSectionTitle: 'Titre section avantages',
  featuresSectionTitleAr: 'عنوان قسم المميزات',
  featuresSectionSubtitle: 'Sous-titre section avantages',
  featuresSectionSubtitleAr: 'وصف قسم المميزات',
  offerTitle: 'Offre limitée',
  offerTitleAr: 'عرض محدود',
  offerSubtitle: 'Sous-titre offre',
  offerSubtitleAr: 'وصف العرض',
  reviewsTitle: 'Avis clients',
  reviewsTitleAr: 'آراء العملاء',
  collectionBadge: 'Collection Printemps 2026',
  collectionBadgeAr: 'مجموعة ربيع 2026',
  collectionTitle: 'Collection Exclusive',
  collectionTitleAr: 'مجموعة حصرية',
  collectionDescription: 'Des soins cosmétiques de haute qualité, formulés avec des ingrédients naturels soigneusement sélectionnés.',
  collectionDescriptionAr: 'العناية بمستحضرات التجميل عالية الجودة',
  fastDeliveryText: 'Livraison rapide',
  fastDeliveryTextAr: 'توصيل سريع',
  cashOnDeliveryText: 'Paiement à la livraison',
  cashOnDeliveryTextAr: 'الدفع عند الاستلام',
  questionText: 'Une question ?',
  questionTextAr: 'سؤال؟',
  helpText: 'Besoin d\'aide ?',
  helpTextAr: 'تحتاج مساعدة؟',
  supportText: 'Notre équipe est disponible 7j/7 pour répondre à toutes vos questions',
  supportTextAr: 'فريقنا متاح 7/7 للإجابة على جميع أسئلتك',
  supportGuarantee: 'Réponse garantie sous 24h',
  supportGuaranteeAr: 'ضمان الرد خلال 24 ساعة',
  ctaFinalTitle: 'Prête à transformer votre peau ?',
  ctaFinalTitleAr: 'هل أنت مستعدة لتحويل بشرتك؟',
  ctaFinalSubtitle: 'Rejoignez plus de 15K+ utilisatrices satisfaites et découvrez l\'excellence Skinova.',
  ctaFinalSubtitleAr: 'انضمي إلى أكثر من 15K+ مستخدمة satisfaites واكتشفي تميز Skinova.',
};

const FIELD_LABELS: Record<string, string> = {
  brandName: 'Nom de la marque (FR)',
  brandNameAr: 'Nom de la marque (AR)',
  heroTitle: 'Titre principal (FR)',
  heroTitleAr: 'Titre principal (AR)',
  heroSubtitle: 'Sous-titre (FR)',
  heroSubtitleAr: 'Sous-titre (AR)',
  ctaButton: 'Texte du bouton (FR)',
  ctaButtonAr: 'Texte du bouton (AR)',
  footerText: 'Texte footer (FR)',
  footerTextAr: 'Texte footer (AR)',
  trustBarText: 'Texte trust bar (FR)',
  trustBarTextAr: 'Texte trust bar (AR)',
  guaranteeText: 'Texte garantie (FR)',
  guaranteeTextAr: 'Texte garantie (AR)',
  satisfactionRate: 'Taux de satisfaction',
  clientsCount: 'Nombre de clients',
  feature1Title: 'Titre avantage 1 (FR)',
  feature1TitleAr: 'Titre avantage 1 (AR)',
  feature1Desc: 'Description avantage 1 (FR)',
  feature1DescAr: 'Description avantage 1 (AR)',
  feature2Title: 'Titre avantage 2 (FR)',
  feature2TitleAr: 'Titre avantage 2 (AR)',
  feature2Desc: 'Description avantage 2 (FR)',
  feature2DescAr: 'Description avantage 2 (AR)',
  feature3Title: 'Titre avantage 3 (FR)',
  feature3TitleAr: 'Titre avantage 3 (AR)',
  feature3Desc: 'Description avantage 3 (FR)',
  feature3DescAr: 'Description avantage 3 (AR)',
  faq1Question: 'Question FAQ 1 (FR)',
  faq1QuestionAr: 'Question FAQ 1 (AR)',
  faq1Answer: 'Réponse FAQ 1 (FR)',
  faq1AnswerAr: 'Réponse FAQ 1 (AR)',
  faq2Question: 'Question FAQ 2 (FR)',
  faq2QuestionAr: 'Question FAQ 2 (AR)',
  faq2Answer: 'Réponse FAQ 2 (FR)',
  faq2AnswerAr: 'Réponse FAQ 2 (AR)',
  faq3Question: 'Question FAQ 3 (FR)',
  faq3QuestionAr: 'Question FAQ 3 (AR)',
  faq3Answer: 'Réponse FAQ 3 (FR)',
  faq3AnswerAr: 'Réponse FAQ 3 (AR)',
  featuresSectionTitle: 'Titre section avantages (FR)',
  featuresSectionTitleAr: 'Titre section avantages (AR)',
  featuresSectionSubtitle: 'Sous-titre section avantages (FR)',
  featuresSectionSubtitleAr: 'Sous-titre section avantages (AR)',
  offerTitle: 'Titre offre (FR)',
  offerTitleAr: 'Titre offre (AR)',
  offerSubtitle: 'Sous-titre offre (FR)',
  offerSubtitleAr: 'Sous-titre offre (AR)',
  reviewsTitle: 'Titre avis (FR)',
  reviewsTitleAr: 'Titre avis (AR)',
  collectionBadge: 'Badge collection (FR)',
  collectionBadgeAr: 'Badge collection (AR)',
  collectionTitle: 'Titre collection (FR)',
  collectionTitleAr: 'Titre collection (AR)',
  collectionDescription: 'Description collection (FR)',
  collectionDescriptionAr: 'Description collection (AR)',
  fastDeliveryText: 'Livraison rapide (FR)',
  fastDeliveryTextAr: 'Livraison rapide (AR)',
  cashOnDeliveryText: 'Paiement à la livraison (FR)',
  cashOnDeliveryTextAr: 'Paiement à la livraison (AR)',
  questionText: 'Une question ? (FR)',
  questionTextAr: 'Une question ? (AR)',
  helpText: 'Besoin d\'aide ? (FR)',
  helpTextAr: 'Besoin d\'aide ? (AR)',
  supportText: 'Texte support (FR)',
  supportTextAr: 'Texte support (AR)',
  supportGuarantee: 'Garantie support (FR)',
  supportGuaranteeAr: 'Garantie support (AR)',
  ctaFinalTitle: 'Titre CTA final (FR)',
  ctaFinalTitleAr: 'Titre CTA final (AR)',
  ctaFinalSubtitle: 'Sous-titre CTA final (FR)',
  ctaFinalSubtitleAr: 'Sous-titre CTA final (AR)',
  paymentText: 'Paiement à la livraison',
  exploreButton: 'Bouton Explorer (FR)',
  exploreButtonAr: 'Bouton Explorer (AR)',
  collection2026Text: 'Collection Exclusive 2026',
  collection2026TextAr: 'مجموعة حصرية 2026',
};

export default function LandingEditorPage() {
  const searchParams = useSearchParams();
  const landingId = searchParams.get('id');
  const template = searchParams.get('template') || 'cosmetic';
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'product' | 'contact' | 'preview'>('content');
  const [isPublished, setIsPublished] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const [content, setContent] = useState<LandingContent>(DEFAULT_CONTENT);
  const [product, setProduct] = useState<Product>({
    id: '',
    name: 'Nouveau Produit',
    price: '2990',
    description: 'Description du produit...',
    biography: '',
    photos: [],
    mainPhoto: 0,
    stock: 100,
    unlimitedStock: true,
    isOnSale: false,
    oldPrice: '',
  });

  useEffect(() => {
    loadLanding();
  }, [landingId]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'selectField') {
        const field = event.data.field;
        setSelectedField(field);
        setActiveTab('content');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'updateContent',
        content,
        product
      }, '*');
    }
  }, [content, product]);

  const loadLanding = async () => {
    if (!landingId) {
      setLoading(false);
      return;
    }

    try {
      const result = await getLanding(landingId);
      if (result.landing) {
        const landing = result.landing;
        setIsPublished(landing.isPublished || landing.is_published || false);
        
        if (landing.content) {
          setContent({ ...DEFAULT_CONTENT, ...landing.content });
        }
        if (landing.products && landing.products.length > 0) {
          const loadedProduct = landing.products[0];
          setProduct({
            ...loadedProduct,
            photos: loadedProduct.photos || [],
            mainPhoto: loadedProduct.mainPhoto || 0,
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!landingId) return;
    
    setSaving(true);
    try {
      const productToSave = {
        ...product,
        photos: product.photos || [],
        mainPhoto: product.mainPhoto || 0,
      };
      await updateLanding(landingId, {
        content,
        products: [productToSave],
      });
      toast.success('Modifications enregistrées !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde');
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!landingId) return;
    
    if (!product.name || !product.price || !product.photos || product.photos.length === 0) {
      toast.error('Ajoutez un produit avec une photo avant de publier');
      setActiveTab('product');
      return;
    }
    
    setPublishing(true);
    try {
      await handleSave();
      await publishLanding(landingId);
      setIsPublished(true);
      toast.success('Landing page publiée avec succès !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la publication');
    }
    setPublishing(false);
  };

  const handleUnpublish = async () => {
    if (!landingId) return;
    
    setPublishing(true);
    try {
      await unpublishLanding(landingId);
      setIsPublished(false);
      toast.success('Landing page dépubliée');
    } catch (error: any) {
      toast.error(error.message || 'Erreur');
    }
    setPublishing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'photo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (field === 'logo') {
        setContent(prev => ({ ...prev, logo: base64 }));
      } else {
        setProduct(prev => ({
          ...prev,
          photos: [...prev.photos, base64],
          mainPhoto: prev.photos.length,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    setProduct(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      mainPhoto: prev.mainPhoto === index ? 0 : (prev.mainPhoto > index ? prev.mainPhoto - 1 : prev.mainPhoto),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!landingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Landing non trouvée</h1>
          <Link href="/templates-landing" className="text-purple-400 hover:text-purple-300">
            Retour aux templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-800 border-b border-zinc-700 shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors p-2 -ml-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold truncate">{content.brandName}</h1>
              <p className="text-xs sm:text-sm text-zinc-400 hidden sm:block">Éditeur Landing</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => window.open(`/template/${template}?id=${landingId}`, '_blank')}
              className="p-2 sm:px-3 sm:py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors flex items-center gap-1 sm:gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">Aperçu</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 sm:px-3 sm:py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              <span className="hidden sm:inline">Enregistrer</span>
            </button>

            {isPublished ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="hidden sm:inline px-2 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-medium">Publiée</span>
                <span className="sm:hidden w-2 h-2 bg-green-500 rounded-full"></span>
                <button onClick={handleUnpublish} disabled={publishing} className="px-2 sm:px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm">Dépub</button>
              </div>
            ) : (
              <button onClick={handlePublish} disabled={publishing} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-1 sm:gap-2 text-sm">
                {publishing ? <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
                <span className="hidden sm:inline">Publier</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-zinc-800/50 border-b border-zinc-700 overflow-x-auto">
        <div className="px-2 sm:px-4 md:px-6">
          <div className="flex gap-1 sm:gap-4 md:gap-8 min-w-max">
            {[
              { id: 'content', label: 'Contenu', icon: '📝' },
              { id: 'product', label: 'Produit', icon: '🛍️' },
              { id: 'contact', label: 'Contact', icon: '📞' },
              { id: 'preview', label: 'Aperçu', icon: '👁️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Selected Field Editor */}
            {selectedField && (
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-purple-300 font-medium">
                      {FIELD_LABELS[selectedField] || selectedField}
                    </span>
                  </div>
                  <button onClick={() => setSelectedField(null)} className="text-zinc-400 hover:text-white text-xl">×</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Français</label>
                    {selectedField === 'heroSubtitle' || selectedField === 'footerText' ? (
                      <textarea
                        value={(content[selectedField as keyof LandingContent] as string) ?? ''}
                        onChange={(e) => setContent(prev => ({ ...prev, [selectedField]: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-zinc-900 border border-purple-500/50 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={(content[selectedField as keyof LandingContent] as string) ?? ''}
                        onChange={(e) => setContent(prev => ({ ...prev, [selectedField]: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-900 border border-purple-500/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">العربية</label>
                    {selectedField === 'heroSubtitle' || selectedField === 'footerText' ? (
                      <textarea
                        value={(content[`${selectedField}Ar` as keyof LandingContent] as string) ?? ''}
                        onChange={(e) => setContent(prev => ({ ...prev, [`${selectedField}Ar`]: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-zinc-900 border border-purple-500/50 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none text-right"
                        dir="rtl"
                      />
                    ) : (
                      <input
                        type="text"
                        value={(content[`${selectedField}Ar` as keyof LandingContent] as string) ?? ''}
                        onChange={(e) => setContent(prev => ({ ...prev, [`${selectedField}Ar`]: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-900 border border-purple-500/50 rounded-lg text-white focus:border-purple-500 focus:outline-none text-right"
                        dir="rtl"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Identité de la marque</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    {content.logo ? (
                      <div className="relative">
                        <img src={content.logo} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" />
                        <button onClick={() => setContent(prev => ({ ...prev, logo: '' }))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">×</button>
                      </div>
                    ) : (
                      <label className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-zinc-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                        <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                      </label>
                    )}
                    {!content.logo && (
                      <label className="text-sm text-zinc-400 cursor-pointer hover:text-white">
                        Ajouter un logo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nom de la marque (FR)</label>
                    <input type="text" value={content.brandName} onChange={(e) => setContent(prev => ({ ...prev, brandName: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nom de la marque (AR) العربية</label>
                    <input type="text" value={content.brandNameAr || ''} onChange={(e) => setContent(prev => ({ ...prev, brandNameAr: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Titre principal (FR)</label>
                    <input type="text" value={content.heroTitle} onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Titre principal (AR) العربية</label>
                    <input type="text" value={content.heroTitleAr || ''} onChange={(e) => setContent(prev => ({ ...prev, heroTitleAr: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Sous-titre (FR)</label>
                    <textarea value={content.heroSubtitle} onChange={(e) => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))} rows={2} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Sous-titre (AR) العربية</label>
                    <textarea value={content.heroSubtitleAr || ''} onChange={(e) => setContent(prev => ({ ...prev, heroSubtitleAr: e.target.value }))} rows={2} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base resize-none text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Texte du bouton (FR)</label>
                    <input type="text" value={content.ctaButton} onChange={(e) => setContent(prev => ({ ...prev, ctaButton: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Texte du bouton (AR) العربية</label>
                    <input type="text" value={content.ctaButtonAr || ''} onChange={(e) => setContent(prev => ({ ...prev, ctaButtonAr: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base text-right" dir="rtl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Tab */}
        {activeTab === 'product' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Informations du produit</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nom du produit</label>
                    <input type="text" value={product.name} onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Prix (DA)</label>
                    <input type="text" value={product.price} onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                  </div>
                </div>
                <div className="border-t border-zinc-700 pt-4 sm:pt-6">
                  <label className="flex items-start gap-3 cursor-pointer mb-4">
                    <input type="checkbox" checked={product.isOnSale || false} onChange={(e) => setProduct(prev => ({ ...prev, isOnSale: e.target.checked, oldPrice: e.target.checked && !prev.oldPrice ? prev.price : prev.oldPrice }))} className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-red-500 focus:ring-red-500 mt-0.5" />
                    <span className="text-white font-medium">Produit en solde</span>
                  </label>
                  {product.isOnSale && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-2">Ancien prix (DA)</label>
                          <input type="text" value={product.oldPrice || ''} onChange={(e) => setProduct(prev => ({ ...prev, oldPrice: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-red-500 focus:outline-none text-sm" placeholder="Ex: 5000" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-2">Réduction</label>
                          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-red-400 font-bold text-base sm:text-lg">
                            {product.oldPrice && product.price ? `-${Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice)) * 100)}%` : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                  <textarea value={product.description} onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none text-sm sm:text-base" />
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Stock</h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={product.unlimitedStock || false} onChange={(e) => setProduct(prev => ({ ...prev, unlimitedStock: e.target.checked }))} className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-green-500 focus:ring-green-500 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Stock illimité</span>
                    <p className="text-xs text-zinc-500 mt-1">Cochez si le produit est disponible sans limite</p>
                  </div>
                </label>
                {!product.unlimitedStock && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Quantité en stock</label>
                    <input type="number" value={product.stock || 0} onChange={(e) => setProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" min="0" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Options d&apos;affichage</h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showStats !== false} onChange={(e) => setContent(prev => ({ ...prev, showStats: e.target.checked }))} className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-rose-500 focus:ring-rose-500 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Afficher les statistiques</span>
                    <p className="text-xs text-zinc-500 mt-1">Basé sur les avis clients et commandes</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showReviews !== false} onChange={(e) => setContent(prev => ({ ...prev, showReviews: e.target.checked }))} className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-rose-500 focus:ring-rose-500 mt-0.5" />
                  <span className="text-white font-medium">Afficher les commentaires clients</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showGuarantee || false} onChange={(e) => setContent(prev => ({ ...prev, showGuarantee: e.target.checked }))} className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-green-500 focus:ring-green-500 mt-0.5" />
                  <span className="text-white font-medium">Afficher la garantie</span>
                </label>
                {content.showGuarantee && (
                  <div className="ml-8 mt-2 space-y-2">
                    <input
                      type="text"
                      value={content.guaranteeText || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, guaranteeText: e.target.value }))}
                      placeholder="Texte garantie (FR)"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:border-green-500 focus:outline-none text-sm"
                    />
                    <input
                      type="text"
                      value={content.guaranteeTextAr || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, guaranteeTextAr: e.target.value }))}
                      placeholder="Texte garantie (AR) العربية"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:border-green-500 focus:outline-none text-sm text-right"
                      dir="rtl"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Photos du produit</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
                {product.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img src={photo} alt={`Photo ${index + 1}`} className={`w-full aspect-square object-cover rounded-lg sm:rounded-xl ${product.mainPhoto === index ? 'ring-2 ring-purple-500' : ''}`} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-lg sm:rounded-xl">
                      <button onClick={() => setProduct(prev => ({ ...prev, mainPhoto: index }))} className="px-2 py-1 bg-white text-black text-xs rounded-lg">Principal</button>
                      <button onClick={() => handleRemovePhoto(index)} className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg">Supprimer</button>
                    </div>
                    {product.mainPhoto === index && <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] sm:text-xs rounded-lg sm:rounded-md">Principal</span>}
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-zinc-600 rounded-lg sm:rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  <span className="text-xs sm:text-sm text-zinc-500 mt-1 sm:mt-2">Ajouter</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'photo')} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Informations de contact</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">WhatsApp</label>
                  <input type="text" value={content.contactWhatsapp} onChange={(e) => setContent(prev => ({ ...prev, contactWhatsapp: e.target.value }))} placeholder="+213 555 123 456" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Instagram</label>
                  <input type="text" value={content.contactInstagram} onChange={(e) => setContent(prev => ({ ...prev, contactInstagram: e.target.value }))} placeholder="@votre_compte" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                  <input type="email" value={content.contactEmail} onChange={(e) => setContent(prev => ({ ...prev, contactEmail: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab - Always mounted to prevent reload */}
        <div className={`h-[calc(100vh-160px)] bg-white rounded-xl overflow-hidden border border-zinc-700 relative ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
          <iframe
            ref={iframeRef}
            src={`/template/${template}?id=${landingId}&editMode=true`}
            className="w-full h-full border-0"
            title="Preview"
          />
          <div className="absolute bottom-4 left-4 px-3 py-2 bg-purple-500/90 text-white text-sm rounded-lg shadow-lg">
            Cliquez sur le texte pour l&apos;éditer
          </div>
        </div>
      </main>
    </div>
  );
}
