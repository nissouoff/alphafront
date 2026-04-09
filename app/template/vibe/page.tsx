"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Star, X, Globe } from "lucide-react";

type Language = 'fr' | 'ar';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  biography: string;
  photos: string[];
  mainPhoto: number;
  isOnSale?: boolean;
  oldPrice?: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface VibeContent {
  logo: string;
  brandName: string;
  brandNameAr: string;
  heroTitle: string;
  heroTitleAr: string;
  heroSubtitle: string;
  heroSubtitleAr: string;
  ctaButton: string;
  ctaButtonAr: string;
  feature1Title: string;
  feature1TitleAr: string;
  feature1Desc: string;
  feature1DescAr: string;
  feature2Title: string;
  feature2TitleAr: string;
  feature2Desc: string;
  feature2DescAr: string;
  feature3Title: string;
  feature3TitleAr: string;
  feature3Desc: string;
  feature3DescAr: string;
  featuresSectionTitle: string;
  featuresSectionTitleAr: string;
  featuresSectionSubtitle: string;
  featuresSectionSubtitleAr: string;
  reviewsTitle: string;
  reviewsTitleAr: string;
  offerTitle: string;
  offerTitleAr: string;
  offerSubtitle: string;
  offerSubtitleAr: string;
  faq1Question: string;
  faq1QuestionAr: string;
  faq1Answer: string;
  faq1AnswerAr: string;
  faq2Question: string;
  faq2QuestionAr: string;
  faq2Answer: string;
  faq2AnswerAr: string;
  faq3Question: string;
  faq3QuestionAr: string;
  faq3Answer: string;
  faq3AnswerAr: string;
  footerText: string;
  footerTextAr: string;
  showFeatures: boolean;
  showReviews: boolean;
  showOffer: boolean;
  showFaq: boolean;
  showTrustBar: boolean;
  showGuarantee: boolean;
  guaranteeText: string;
  guaranteeTextAr: string;
  trustBarText: string;
  trustBarTextAr: string;
}

const UI = {
  fr: {
    buyNow: 'Acheter maintenant',
    fastDelivery: 'Livraison rapide',
    returnHome: 'Retour à l\'accueil',
    writeReview: 'Écrire un avis',
    yourName: 'Votre nom',
    yourComment: 'Votre commentaire',
    sendReview: 'Envoyer',
    loading: 'Chargement...',
    addPhoto: 'Ajouter une photo',
    limitedOffer: 'Offre limitée',
    faq: 'Questions fréquentes',
    contactUs: 'Contactez-nous',
    securePayment: 'Paiement sécurisé',
    freeShipping: 'Livraison gratuite',
    support247: 'Support 24/7',
    reviews: 'Avis clients',
    features: 'Nos avantages',
    howItWorks: 'Comment ça marche ?',
  },
  ar: {
    buyNow: 'اشتري الآن',
    fastDelivery: 'توصيل سريع',
    returnHome: 'العودة للرئيسية',
    writeReview: 'اكتب تقييم',
    yourName: 'اسمك',
    yourComment: 'تعليقك',
    sendReview: 'إرسال',
    loading: 'جاري التحميل...',
    addPhoto: 'إضافة صورة',
    limitedOffer: 'عرض محدود',
    faq: 'الأسئلة الشائعة',
    contactUs: 'تواصل معنا',
    securePayment: 'دفع آمن',
    freeShipping: 'شحن مجاني',
    support247: 'دعم على مدار الساعة',
    reviews: 'آراء العملاء',
    features: 'مميزاتنا',
    howItWorks: 'كيف يعمل؟',
  },
};

const DEFAULT_CONTENT: VibeContent = {
  logo: '',
  brandName: 'Vibe',
  brandNameAr: 'فايب',
  heroTitle: 'Boost ton quotidien avec un produit unique',
  heroTitleAr: 'عزز يومك مع منتج فريد',
  heroSubtitle: 'Une solution moderne, rapide et efficace conçue pour des résultats visibles immédiatement.',
  heroSubtitleAr: 'حل عصري وسريع وفعال مصمم لنتائج فورية.',
  ctaButton: 'Acheter maintenant',
  ctaButtonAr: 'اشتري الآن',
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
  featuresSectionTitle: 'Pourquoi choisir ce produit ?',
  featuresSectionTitleAr: 'لماذا تختار هذا المنتج؟',
  featuresSectionSubtitle: 'Pensé pour la performance maximale',
  featuresSectionSubtitleAr: 'مصمم لأفضل أداء',
  reviewsTitle: 'Avis clients',
  reviewsTitleAr: 'آراء العملاء',
  offerTitle: 'Offre limitée',
  offerTitleAr: 'عرض محدود',
  offerSubtitle: 'Ne rate pas cette opportunité',
  offerSubtitleAr: 'لا تفوت هذه الفرصة',
  faq1Question: 'Livraison ?',
  faq1QuestionAr: 'التوصيل؟',
  faq1Answer: 'Livraison rapide sous 24-48h partout en Algérie.',
  faq1AnswerAr: 'توصيل سريع خلال 24-48 ساعة في جميع أنحاء الجزائر.',
  faq2Question: 'Garantie ?',
  faq2QuestionAr: 'الضمان؟',
  faq2Answer: 'Garantie satisfait ou remboursé sous 30 jours.',
  faq2AnswerAr: 'ضمان استرداد الأموال خلال 30 يوماً.',
  faq3Question: 'Utilisation ?',
  faq3QuestionAr: 'الاستخدام؟',
  faq3Answer: 'Simple et intuitif, adapté à tous les niveaux.',
  faq3AnswerAr: 'بسيط وسهل، مناسب للجميع.',
  footerText: '© 2026 - Tous droits réservés',
  footerTextAr: '© 2026 - جميع الحقوق محفوظة',
  showFeatures: true,
  showReviews: true,
  showOffer: true,
  showFaq: true,
  showTrustBar: true,
  showGuarantee: false,
  guaranteeText: 'Garantie satisfait ou remboursé sous 30 jours',
  guaranteeTextAr: 'ضمان استرداد الأموال خلال 30 يوماً',
  trustBarText: '+10 000 clients satisfaits • Livraison rapide • Support 24/7',
  trustBarTextAr: '+10 000 عميل سعيد • توصيل سريع • دعم على مدار الساعة',
};

export default function VibeTemplatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <VibeTemplate />
    </Suspense>
  );
}

function VibeTemplate() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [landingSlug, setLandingSlug] = useState('');
  const [lang, setLang] = useState<Language>('fr');

  const t = UI[lang];

  const getText = (fr: string, ar: string) => lang === 'ar' ? ar : fr;

  const [content, setContent] = useState<VibeContent>(DEFAULT_CONTENT);

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isPreview = searchParams.get('preview') === 'true';
  const isEditMode = searchParams.get('editMode') === 'true' || (typeof window !== 'undefined' && localStorage.getItem('isVibeEditMode') === 'true');
  
  const editableStyle = isEditMode ? "cursor-pointer ring-2 ring-purple-400 ring-offset-2 rounded transition-all" : "";
  
  const handleEditClick = (field: string) => {
    if (isEditMode) {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'selectField', field }, '*');
      } else {
        window.dispatchEvent(new CustomEvent('selectField', { detail: { field } }));
      }
    }
  };

  useEffect(() => {
    if (isPreview || isEditMode) {
      loadData();
    } else {
      loadData();
    }
  }, [isPreview, isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'updateContent') {
        const { content: newContent, product: newProduct } = event.data;
        if (newContent) setContent(prev => ({ ...prev, ...newContent }));
        if (newProduct) setProducts([newProduct]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isEditMode]);

  const loadData = async () => {
    const landingId = searchParams.get('id');
    if (!landingId) {
      setError('ID manquant');
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/public/landing/${landingId}?preview=true`);
      
      if (!response.ok) {
        throw new Error('Failed to load landing');
      }
      
      const result = await response.json();
      const landing = result.landing || result;
      if (landing) {
        setLandingSlug(landing.slug || landingId);
        if (landing.content) {
          setContent({ ...DEFAULT_CONTENT, ...landing.content });
        }
        if (landing.products && landing.products.length > 0) {
          setProducts(landing.products);
        }
        if (landing.reviews) {
          setReviews(landing.reviews);
        }
      }
    } catch (err) {
      console.error('Error loading landing:', err);
      setError('Erreur lors du chargement');
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    
    const landingId = searchParams.get('id');
    if (!landingId) return;
    
    setSubmittingReview(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/landing/${landingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.review) {
          setReviews([result.review, ...reviews]);
        }
        setReviewForm({ name: '', rating: 5, comment: '' });
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
    setSubmittingReview(false);
  };

  const handleOrder = () => {
    const landingId = searchParams.get('id') || '';
    const product = products[0];
    if (product) {
      const orderData = {
        name: product.name,
        price: product.price,
        photo: product.photos && product.photos.length > 0 ? product.photos[0] : '',
        description: product.description || '',
        landingId: landingSlug || landingId,
      };
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      window.location.href = `/template/vibe/order?lang=${lang}&id=${landingSlug || landingId}`;
    }
  };

  const nextPhoto = () => {
    if (products[0]?.photos?.length > 1) {
      setCurrentPhotoIndex((prev) => 
        prev === products[0].photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (products[0]?.photos?.length > 1) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? products[0].photos.length - 1 : prev - 1
      );
    }
  };

  const photos = products[0]?.photos || [];
  const hasMultiplePhotos = photos.length > 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-orange-500 hover:underline">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white font-['Poppins',sans-serif] ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header with Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {content.logo && (
              <img src={content.logo} alt={getText(content.brandName, content.brandNameAr)} className="h-8 w-auto" />
            )}
            <span className="font-bold text-lg">{getText(content.brandName, content.brandNameAr)}</span>
          </div>
          
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            <span className={lang === 'ar' ? 'text-orange-400' : ''}>FR</span>
            <span className="text-gray-500">/</span>
            <span className={lang === 'ar' ? '' : 'text-orange-400'}>AR</span>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-24 grid md:grid-cols-2 items-center gap-10 px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${editableStyle}`}
            onClick={() => handleEditClick('heroTitle')}
          >
            {getText(content.heroTitle, content.heroTitleAr)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 mb-6 text-base md:text-lg"
            onClick={() => handleEditClick('heroSubtitle')}
          >
            {getText(content.heroSubtitle, content.heroSubtitleAr)}
          </motion.p>

          <ul className="space-y-3 mb-8">
            <li className={`flex items-center gap-2 ${editableStyle}`} onClick={() => handleEditClick('feature1Title')}>
              <Check className="text-orange-500 w-5 h-5" />
              {getText(content.feature1Title, content.feature1TitleAr)}
            </li>
            <li className={`flex items-center gap-2 ${editableStyle}`} onClick={() => handleEditClick('feature2Title')}>
              <Check className="text-orange-500 w-5 h-5" />
              {getText(content.feature2Title, content.feature2TitleAr)}
            </li>
            <li className={`flex items-center gap-2 ${editableStyle}`} onClick={() => handleEditClick('feature3Title')}>
              <Check className="text-orange-500 w-5 h-5" />
              {getText(content.feature3Title, content.feature3TitleAr)}
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); if (!isEditMode) handleOrder(); }}
              className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-2xl shadow-xl font-semibold transition-colors ${editableStyle}`}
            >
              <span onClick={(e) => { e.stopPropagation(); handleEditClick('ctaButton'); }}>{getText(content.ctaButton, content.ctaButtonAr)}</span>
            </button>
            <span className="text-sm text-gray-400">{t.fastDelivery}</span>
          </div>
        </div>

        {/* PHOTO CAROUSEL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative w-full max-w-md mx-auto">
            {photos.length > 0 ? (
              <>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,115,0,0.4)]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPhotoIndex}
                      src={photos[currentPhotoIndex]}
                      alt={`${products[0].name} ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                  {products[0]?.price && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {products[0].price} DA
                    </div>
                  )}
                </div>
                {hasMultiplePhotos && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${index === currentPhotoIndex ? 'bg-orange-500' : 'bg-gray-600'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-[0_0_40px_rgba(255,115,0,0.4)]">
                <span className="text-8xl">🚀</span>
              </div>
            )}
          </div>
          {products[0]?.name && (
            <h2 className="text-xl md:text-2xl font-bold text-white text-center">
              {products[0].name}
            </h2>
          )}
        </motion.div>
      </section>

      {/* GUARANTEE */}
      {content.showGuarantee && (
        <section className="py-6 px-6 bg-green-900/20 border-y border-green-800">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-green-400 font-medium">{getText(content.guaranteeText, content.guaranteeTextAr)}</span>
          </div>
        </section>
      )}

      {/* TRUST BAR */}
      {content.showTrustBar !== false && (
        <section className="py-4 text-center text-sm text-gray-400 border-y border-gray-800" onClick={() => handleEditClick('trustBarText')}>
          <p className={editableStyle}>{getText(content.trustBarText, content.trustBarTextAr)}</p>
        </section>
      )}

      {/* FEATURES */}
      {content.showFeatures !== false && (
        <section className="py-16 md:py-24 px-6 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${editableStyle}`} onClick={() => handleEditClick('featuresSectionTitle')}>
              {getText(content.featuresSectionTitle, content.featuresSectionTitleAr)}
            </h2>
            <p className={`text-gray-400 mb-12 ${editableStyle}`} onClick={() => handleEditClick('featuresSectionSubtitle')}>
              {getText(content.featuresSectionSubtitle, content.featuresSectionSubtitleAr)}
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${editableStyle}`} onClick={() => handleEditClick('feature1Title')}>
                  {getText(content.feature1Title, content.feature1TitleAr)}
                </h3>
                <p className={`text-gray-400 ${editableStyle}`} onClick={() => handleEditClick('feature1Desc')}>
                  {getText(content.feature1Desc, content.feature1DescAr)}
                </p>
              </div>
              
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${editableStyle}`} onClick={() => handleEditClick('feature2Title')}>
                  {getText(content.feature2Title, content.feature2TitleAr)}
                </h3>
                <p className={`text-gray-400 ${editableStyle}`} onClick={() => handleEditClick('feature2Desc')}>
                  {getText(content.feature2Desc, content.feature2DescAr)}
                </p>
              </div>
              
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💪</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${editableStyle}`} onClick={() => handleEditClick('feature3Title')}>
                  {getText(content.feature3Title, content.feature3TitleAr)}
                </h3>
                <p className={`text-gray-400 ${editableStyle}`} onClick={() => handleEditClick('feature3Desc')}>
                  {getText(content.feature3Desc, content.feature3DescAr)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OFFER */}
      {content.showOffer !== false && (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl p-8 md:p-12 border border-orange-500/30 text-center">
            <div className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold mb-6 animate-pulse">
              🔥 {t.limitedOffer}
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${editableStyle}`} onClick={() => handleEditClick('offerTitle')}>
              {getText(content.offerTitle, content.offerTitleAr)}
            </h2>
            <p className={`text-gray-400 mb-8 ${editableStyle}`} onClick={() => handleEditClick('offerSubtitle')}>
              {getText(content.offerSubtitle, content.offerSubtitleAr)}
            </p>
            
            {products[0]?.price && (
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-8">
                {products[0].price} DA
              </div>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); if (!isEditMode) handleOrder(); }}
              className={`bg-orange-500 hover:bg-orange-600 px-10 py-6 text-lg rounded-2xl shadow-xl font-semibold transition-colors ${editableStyle}`}
            >
              <span onClick={(e) => { e.stopPropagation(); handleEditClick('ctaButton'); }}>{getText(content.ctaButton, content.ctaButtonAr)}</span>
            </button>
          </div>
        </section>
      )}

      {/* REVIEWS */}
      {content.showReviews !== false && (
        <section className="py-20 px-6 text-center bg-gradient-to-b from-black to-gray-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {t.reviews}
          </h2>
          
          {reviews.length > 0 ? (
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 text-left">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">{review.comment}</p>
                  <p className="text-orange-400 font-medium text-sm">{review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-8">{lang === 'ar' ? 'لا توجد تقييمات بعد' : 'Aucun avis pour le moment'}</p>
          )}
          
          {!showReviewForm ? (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              {t.writeReview}
            </button>
          ) : (
            <form onSubmit={handleReviewSubmit} className="max-w-md mx-auto bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <input
                type="text"
                value={reviewForm.name}
                onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                placeholder={t.yourName}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white mb-4 focus:border-orange-500 focus:outline-none"
              />
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                    className="text-2xl"
                  >
                    {star <= reviewForm.rating ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-600">★</span>
                    )}
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                placeholder={t.yourComment}
                required
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white mb-4 focus:border-orange-500 focus:outline-none resize-none"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {t.sendReview}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* FAQ */}
      {content.showFaq !== false && (
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {t.faq}
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h3 
                className={`font-semibold mb-2 ${editableStyle}`}
                onClick={() => handleEditClick('faq1Question')}
              >
                {getText(content.faq1Question, content.faq1QuestionAr)}
              </h3>
              <p 
                className={`text-gray-400 text-sm ${editableStyle}`}
                onClick={() => handleEditClick('faq1Answer')}
              >
                {getText(content.faq1Answer, content.faq1AnswerAr)}
              </p>
            </div>
            <div className="border-b border-gray-800 pb-4">
              <h3 
                className={`font-semibold mb-2 ${editableStyle}`}
                onClick={() => handleEditClick('faq2Question')}
              >
                {getText(content.faq2Question, content.faq2QuestionAr)}
              </h3>
              <p 
                className={`text-gray-400 text-sm ${editableStyle}`}
                onClick={() => handleEditClick('faq2Answer')}
              >
                {getText(content.faq2Answer, content.faq2AnswerAr)}
              </p>
            </div>
            <div className="border-b border-gray-800 pb-4">
              <h3 
                className={`font-semibold mb-2 ${editableStyle}`}
                onClick={() => handleEditClick('faq3Question')}
              >
                {getText(content.faq3Question, content.faq3QuestionAr)}
              </h3>
              <p 
                className={`text-gray-400 text-sm ${editableStyle}`}
                onClick={() => handleEditClick('faq3Answer')}
              >
                {getText(content.faq3Answer, content.faq3AnswerAr)}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-gray-500 border-t border-gray-800" onClick={() => handleEditClick('footerText')}>
        {getText(content.footerText, content.footerTextAr)}
      </footer>
    </div>
  );
}
