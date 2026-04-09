"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
  stock?: number;
  unlimitedStock?: boolean;
}

interface Content {
  logo: string;
  brandName: string;
  brandNameAr?: string;
  heroTitle: string;
  heroTitleAr?: string;
  heroSubtitle: string;
  heroSubtitleAr?: string;
  ctaButton: string;
  ctaButtonAr?: string;
  exploreButton: string;
  exploreButtonAr?: string;
  collection2026Text: string;
  collection2026TextAr?: string;
  contactEmail: string;
  contactWhatsapp: string;
  contactInstagram: string;
  contactFacebook: string;
  footerText: string;
  footerTextAr?: string;
  showHeader: boolean;
  showHeroTitle: boolean;
  showHeroSubtitle: boolean;
  showProductSection: boolean;
  showReviews: boolean;
  showFAQ: boolean;
  heroBgColor: string;
  ctaBgColor: string;
  heroTextColor: string;
  ctaTextColor: string;
  textColor: string;
  sectionBg: string;
  showStats: boolean;
  satisfactionRate?: string;
  clientsCount?: string;
  showGuarantee: boolean;
  guaranteeText?: string;
  guaranteeTextAr?: string;
  features?: { title: string; description: string; icon: string }[];
  faqs?: { question: string; answer: string }[];
  ctaFinalTitle?: string;
  ctaFinalTitleAr?: string;
  ctaFinalSubtitle?: string;
  ctaFinalSubtitleAr?: string;
  paymentText?: string;
}

export default function SkinovaTemplatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SkinovaTemplate />
    </Suspense>
  );
}

function SkinovaTemplate() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Content>({
    logo: '',
    brandName: 'Skinova',
    brandNameAr: 'سكينيوفا',
    heroTitle: 'L\'Excellence du Soin',
    heroTitleAr: 'التميز في العناية',
    heroSubtitle: 'Des formulations révolutionnaires pour une peau transformée. Le secret des peaux parfaites enfin révélé.',
    heroSubtitleAr: 'تركيبات ثورية لبشرة متحولة. سر البشرة المثالية أصبح مكشوفاً.',
    ctaButton: 'Découvrir la Collection',
    ctaButtonAr: 'اكتشف المجموعة',
    exploreButton: 'Explorer',
    exploreButtonAr: 'استكشف',
    collection2026Text: 'Collection Exclusive 2026',
    collection2026TextAr: 'مجموعة حصرية 2026',
    contactEmail: 'contact@skinova.com',
    contactWhatsapp: '',
    contactInstagram: '',
    contactFacebook: '',
    footerText: '© 2026 Skinova. Excellence cosmétique. Fabriqué en Algérie.',
    footerTextAr: '© 2026 سكينوفا. تميز تجميلي. مصنوع في الجزائر.',
    showHeader: true,
    showHeroTitle: true,
    showHeroSubtitle: true,
    showProductSection: true,
    heroBgColor: 'bg-stone-50',
    ctaBgColor: 'bg-stone-900',
    heroTextColor: 'text-stone-900',
    ctaTextColor: 'text-white',
    textColor: 'text-stone-600',
    sectionBg: 'bg-white',
    showStats: true,
    satisfactionRate: '99',
    clientsCount: '25K+',
    showReviews: true,
    showFAQ: true,
    showGuarantee: false,
    guaranteeText: 'Garantie 30 jours',
    guaranteeTextAr: 'ضمان 30 يوماً',
    ctaFinalTitle: 'Prête à transformer votre peau ?',
    ctaFinalTitleAr: 'هل أنت مستعدة لتحويل بشرتك؟',
    ctaFinalSubtitle: 'Rejoignez plus de 15K+ utilisatrices satisfaites et découvrez l\'excellence Skinova.',
    ctaFinalSubtitleAr: 'انضمي إلى أكثر من 15K+ مستخدمة satisfaites واكتشفي تميز Skinova.',
    features: [
      { title: 'Formule Exclusive', description: 'Brevet déposé', icon: '⚗️' },
      { title: 'Actifs Concentrés', description: '20% d\'actifs purs', icon: '💧' },
      { title: 'Texture Unique', description: 'Absorption instantanée', icon: '✨' },
      { title: 'Résultats Visibles', description: ' dès 7 jours', icon: '📊' }
    ],
    faqs: [
      { question: 'Quelle est la composition du produit ?', answer: 'Nos produits contiennent 20% d\'actifs purs, incluant de l\'acide hyaluronique, de la vitamine C pure et des peptides marins. 100% Cruelty Free.' },
      { question: 'Combien de temps dure un flacon ?', answer: 'En utilisation normale, un flacon dure environ 2 mois. Nous recommandons une cure de 3 mois pour des résultats optimaux.' },
      { question: 'Le produit est-il adapté aux peaux sensibles ?', answer: 'Oui, nos formules sont hypoallergéniques et testées dermatologiquement. Convient à tous les types de peau, même les plus sensibles.' },
      { question: 'Expédiez-vous en dehors de l\'Algérie ?', answer: 'Actuellement, nous expédions uniquement en Algérie. La livraison est effectuée sous 3-5 jours ouvrables.' }
    ],
    paymentText: 'Paiement à la livraison',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('skinova_lang') as 'fr' | 'ar' | null;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skinova_lang', lang);
  }, [lang]);

  const handleLangChange = (newLang: 'fr' | 'ar') => {
    setLang(newLang);
  };

  const satisfactionRate = reviews.length > 0
    ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)
    : (parseInt(content.satisfactionRate || '99'));
  
  const clientsCount = ordersCount > 0
    ? ordersCount >= 1000
      ? Math.floor(ordersCount / 1000) + 'K+'
      : ordersCount.toString()
    : content.clientsCount || '0';

  const isPreview = searchParams.get('preview') === 'true';
  const isEditMode = searchParams.get('editMode') === 'true' || (typeof window !== 'undefined' && localStorage.getItem('isSkinovaEditMode') === 'true');

  const handleEditClick = (field: string) => {
    if (isEditMode) {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'selectField', field }, '*');
      } else {
        window.dispatchEvent(new CustomEvent('selectField', { detail: { field } }));
      }
    }
  };

  const editableStyle = isEditMode ? "cursor-pointer ring-2 ring-purple-400 ring-offset-2 rounded transition-all" : "";

  const previewData = {
    product: {
      id: 'preview-skinova',
      name: 'Concentré Éclat',
      price: '4500',
      description: 'Un concentré ultra-puissant qui transforme instantanément l\'aspect de votre peau. Texture veloutée, fini naturel.',
      biography: 'Formulé avec les meilleurs actifs marins et végétaux.',
      photos: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=600', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600'],
      mainPhoto: 0,
      isOnSale: false,
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

  const previewContent: Content = {
    logo: '',
    brandName: 'Skinova',
    brandNameAr: 'سكينيوفا',
    heroTitle: 'L\'Excellence du Soin',
    heroTitleAr: 'التميز في العناية',
    heroSubtitle: 'Des formulations révolutionnaires pour une peau transformée.',
    heroSubtitleAr: 'تركيبات ثورية لبشرة متحولة.',
    ctaButton: 'Découvrir la Collection',
    ctaButtonAr: 'اكتشف المجموعة',
    exploreButton: 'Explorer',
    exploreButtonAr: 'استكشف',
    collection2026Text: 'Collection Exclusive 2026',
    collection2026TextAr: 'مجموعة حصرية 2026',
    contactEmail: 'contact@skinova.com',
    contactWhatsapp: '',
    contactInstagram: '',
    contactFacebook: '',
    footerText: '© 2026 Skinova. Excellence cosmétique.',
    footerTextAr: '© 2026 سكينوفا. تميز تجميلي.',
    showHeader: true,
    showHeroTitle: true,
    showHeroSubtitle: true,
    showProductSection: true,
    heroBgColor: 'bg-stone-50',
    ctaBgColor: 'bg-stone-900',
    heroTextColor: 'text-stone-900',
    ctaTextColor: 'text-white',
    textColor: 'text-stone-600',
    sectionBg: 'bg-white',
    showStats: true,
    satisfactionRate: '99',
    clientsCount: '25K+',
    showReviews: true,
    showFAQ: true,
    showGuarantee: false,
    guaranteeText: 'Garantie 30 jours',
    guaranteeTextAr: 'ضمان 30 يوماً',
    ctaFinalTitle: 'Prête à transformer votre peau ?',
    ctaFinalTitleAr: 'هل أنت مستعدة لتحويل بشرتك؟',
    ctaFinalSubtitle: 'Rejoignez plus de 15K+ utilisatrices satisfaites et découvrez l\'excellence Skinova.',
    ctaFinalSubtitleAr: 'انضمي إلى أكثر من 15K+ مستخدمة satisfaites واكتشفي تميز Skinova.',
    features: [
      { title: 'Formule Exclusive', description: 'Brevet déposé', icon: '⚗️' },
      { title: 'Actifs Concentrés', description: '20% d\'actifs purs', icon: '💧' },
      { title: 'Texture Unique', description: 'Absorption instantanée', icon: '✨' },
      { title: 'Résultats Visibles', description: ' dès 7 jours', icon: '📊' }
    ],
    faqs: [
      { question: 'Quelle est la composition du produit ?', answer: 'Nos produits contiennent 20% d\'actifs purs.' },
      { question: 'Combien de temps dure un flacon ?', answer: 'En utilisation normale, un flacon dure environ 2 mois.' },
      { question: 'Le produit est-il adapté aux peaux sensibles ?', answer: 'Oui, nos formules sont hypoallergéniques.' },
      { question: 'Expédiez-vous en dehors de l\'Algérie ?', answer: 'Actuellement, nous expédions uniquement en Algérie.' }
    ]
  };

  const loadData = async () => {
    const landingId = searchParams.get('id');
    const dataParam = searchParams.get('data');

    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
        if (decoded.content) setContent({ ...content, ...decoded.content, paymentText: decoded.content.paymentText || 'Paiement à la livraison', exploreButton: decoded.content.exploreButton || 'Explorer', exploreButtonAr: decoded.content.exploreButtonAr || 'استكشف' });
        if (decoded.products) setProducts(decoded.products);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
      setLoading(false);
      return;
    }

    if (landingId) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_URL}/public/landing/${landingId}?preview=true`);
        
        if (!response.ok) {
          throw new Error('Failed to load landing');
        }
        
        const result = await response.json();
        if (result.landing) {
          if (result.landing.content) setContent({ ...content, ...result.landing.content, paymentText: result.landing.content.paymentText || 'Paiement à la livraison', exploreButton: result.landing.content.exploreButton || 'Explorer', exploreButtonAr: result.landing.content.exploreButtonAr || 'استكشف' });
          if (result.landing.products?.length > 0) {
            setProducts(result.landing.products);
            setSelectedPhotoIndex(0);
          }
          if (result.landing.reviews) setReviews(result.landing.reviews);
          if (result.landing.ordersCount !== undefined) setOrdersCount(result.landing.ordersCount);
        }
      } catch (error: any) {
        console.error('Error loading landing:', error);
        setError('Erreur lors du chargement');
      }
    }
    setLoading(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const landingId = searchParams.get('id');
    if (!landingId || !reviewForm.name || !reviewForm.comment) return;

    setSubmittingReview(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/landing/${landingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewForm.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      if (response.ok) {
        setReviews([...reviews, { ...reviewForm, id: Date.now().toString() }]);
        setReviewForm({ name: '', rating: 5, comment: '' });
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
    setSubmittingReview(false);
  };

  const handleOrder = (product: Product) => {
    const landingId = searchParams.get('id') || '';
    const orderData = {
      name: product.name,
      price: product.price,
      photo: product.photos && product.photos.length > 0 ? product.photos[0] : '',
      description: product.description || '',
      landingId: landingId,
      landingSlug: landingId,
    };
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = `/template/skinova/order?lang=${lang}&id=${landingId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Page non disponible</h1>
          <p className="text-stone-600">{error}</p>
        </div>
      </div>
    );
  }

  const product = products[0];

  return (
    <div className={`min-h-screen bg-white font-sans ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        html { scroll-behavior: smooth; }
        
        @keyframes line-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-line { animation: line-grow 1.5s ease-out forwards; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(120, 113, 108, 0.3); }
          50% { box-shadow: 0 0 40px rgba(120, 113, 108, 0.6); }
        }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-badge-pulse { animation: badge-pulse 2s ease-in-out infinite; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Sale Banner */}
      {product?.isOnSale && product?.oldPrice && (
        <div className="bg-stone-900 text-white py-2 text-center text-sm tracking-widest uppercase animate-badge-pulse">
          🔥 Promo: -{Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice)) * 100)}% de réduction !
        </div>
      )}

      {/* Minimal Header */}
      {content.showHeader && (
        <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {content.logo ? (
                  <img src={content.logo} alt={content.brandName} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center">
                    <span className="text-white font-serif text-lg">S</span>
                  </div>
                )}
                <span onClick={() => handleEditClick('brandName')} className={`text-xl tracking-widest uppercase font-serif font-medium text-stone-900 ${editableStyle}`}>
                  {lang === 'ar' ? (content.brandNameAr || content.brandName) : content.brandName}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <nav className="hidden lg:flex items-center gap-12">
                  <a href="#collection" className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 transition-colors">{lang === 'ar' ? 'المنتجات' : 'Collection'}</a>
                  <a href="#avis" className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 transition-colors">{lang === 'ar' ? 'التعليقات' : 'Témoignages'}</a>
                  <a href="#faq" className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 transition-colors">FAQ</a>
                </nav>

                <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                  <button
                    onClick={() => handleLangChange('fr')}
                    className={`px-3 py-1.5 text-xs tracking-widest uppercase font-medium rounded transition-colors ${
                      lang === 'fr' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => handleLangChange('ar')}
                    className={`px-3 py-1.5 text-xs tracking-widest uppercase font-medium rounded transition-colors ${
                      lang === 'ar' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    AR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section - Editorial Style */}
      {content.showHeroTitle !== false && (
        <section id="accueil" className="min-h-[85vh] flex items-center bg-stone-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-stone-100/50 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 w-full relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content - Text + Stats */}
              <div>
                <div className="h-px w-16 bg-stone-300 mb-8 animate-line origin-left"></div>
                
                <p onClick={() => handleEditClick('collection2026Text')} className={`text-xs tracking-[0.3em] uppercase text-stone-500 mb-6 opacity-0 animate-fade-in-up ${editableStyle}`}>
                  {lang === 'ar' ? (content.collection2026TextAr || content.collection2026Text) : content.collection2026Text}
                </p>
                
                <h1 onClick={() => handleEditClick('heroTitle')} className={`text-5xl sm:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] ${content.heroTextColor} mb-8 opacity-0 animate-fade-in-up delay-100 ${editableStyle}`}>
                  {lang === 'ar' ? (content.heroTitleAr || content.heroTitle) : content.heroTitle}
                </h1>
                
                <div className="w-px h-16 bg-stone-300 mb-8 opacity-0 animate-slide-in-right delay-200"></div>
                
                <p onClick={() => handleEditClick('heroSubtitle')} className={`text-lg text-stone-500 leading-relaxed max-w-md mb-10 opacity-0 animate-fade-in-up delay-300 ${editableStyle}`}>
                  {lang === 'ar' ? (content.heroSubtitleAr || content.heroSubtitle) : content.heroSubtitle}
                </p>
                
                <div className="flex flex-wrap gap-6 opacity-0 animate-fade-in-up delay-400">
                  <button
                    onClick={() => { if (!isEditMode) product && handleOrder(product); }}
                    className={`inline-block px-10 py-4 bg-stone-900 text-white text-xs tracking-widest uppercase font-medium hover:bg-stone-800 transition-colors animate-pulse-glow ${editableStyle}`}
                  >
                    <span onClick={(e) => { e.stopPropagation(); handleEditClick('ctaButton'); }}>{lang === 'ar' ? (content.ctaButtonAr || content.ctaButton) : content.ctaButton}</span>
                  </button>
                  <a href="#collection" onClick={(e) => { if (isEditMode) { e.preventDefault(); handleEditClick('exploreButton'); } }} className={`inline-block px-10 py-4 border border-stone-300 text-stone-700 text-xs tracking-widest uppercase font-medium hover:border-stone-900 transition-colors ${editableStyle}`}>
                    {lang === 'ar' ? (content.exploreButtonAr || content.exploreButton) : content.exploreButton}
                  </a>
                </div>
              </div>

              {/* Right Content - Image */}
              <div className="relative animate-fade-in-up delay-300">
                {product?.isOnSale && product?.oldPrice && (
                  <div className="absolute -top-4 -right-4 z-20 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-badge-pulse shadow-lg">
                    -{Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice)) * 100)}%
                  </div>
                )}
                
                <div className="aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden relative">
                  {product && product.photos?.length > 0 ? (
                    <>
                      <img 
                        src={product.photos[selectedPhotoIndex]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isOnSale && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase animate-badge-pulse">
                          Solde
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl opacity-20 animate-float">⚗️</span>
                    </div>
                  )}
                </div>
                
                {/* Price + Stats Card */}
                {product && (
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white p-6 shadow-2xl border border-stone-100 min-w-[180px] animate-fade-in-up delay-500">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-3xl font-serif text-stone-900">{product.price} DA</p>
                      {product.isOnSale && product.oldPrice && (
                        <span className="text-sm text-stone-400 line-through">{product.oldPrice} DA</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mb-4">Prix du produit</p>
                    
                    {content.showStats && (
                      <div className="pt-4 border-t border-stone-100 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-stone-500">Satisfaction</span>
                          <span className="text-xs font-medium text-stone-900">{satisfactionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-stone-500">Utilisatrices</span>
                          <span className="text-xs font-medium text-stone-900">{clientsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-stone-500">Note</span>
                          <span className="text-xs font-medium text-stone-900">4.9/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Decorative Element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-stone-300"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Section */}
      {content.showProductSection !== false && product && (
        <section id="collection" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Info - Left Side */}
              <div className="lg:py-8">
                <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-4">Produit Star</p>
                <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-6">{product.name}</h2>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex text-stone-900">★★★★★</div>
                  <span className="text-sm text-stone-500">
                    {reviews.length > 0 ? `${reviews.length} avis` : '4.9/5 (2,847 avis)'}
                  </span>
                </div>

                <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-10 pb-10 border-b border-stone-200">
                  <span className="text-4xl font-serif text-stone-900">{product.price} DA</span>
                  {product.isOnSale && product.oldPrice && (
                    <span className="text-xl text-stone-400 line-through">{product.oldPrice} DA</span>
                  )}
                  {product.isOnSale && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-badge-pulse">
                      -{Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice || product.price)) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Benefits */}
                <div className="space-y-4 mb-10">
                  {content.showGuarantee && content.guaranteeText && (
                    <div className="flex items-center gap-4 p-4 bg-stone-50 animate-fade-in-up">
                      <svg className="w-5 h-5 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-sm text-stone-700">{content.guaranteeText}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 p-4 bg-stone-50">
                    <svg className="w-5 h-5 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span onClick={() => handleEditClick('paymentText')} className={`text-sm text-stone-700 ${editableStyle}`}>{content.paymentText}</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => { if (!isEditMode) handleOrder(product); }}
                  className={`w-full py-5 bg-stone-900 text-white text-xs tracking-widest uppercase font-medium hover:bg-stone-800 transition-colors ${editableStyle}`}
                >
                  <span onClick={(e) => { e.stopPropagation(); handleEditClick('ctaButton'); }}>{lang === 'ar' ? (content.ctaButtonAr || content.ctaButton) : content.ctaButton}</span>
                </button>

                {/* WhatsApp */}
                {content.contactWhatsapp && (
                  <a 
                    href={`https://wa.me/${content.contactWhatsapp.replace(/\D/g, '')}`}
                    className="w-full mt-4 py-4 bg-green-600 text-white text-xs tracking-widest uppercase font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {lang === 'ar' ? 'اطلب عبر واتساب' : 'Commander sur WhatsApp'}
                  </a>
                )}
              </div>

              {/* Images - Right Side */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-stone-100 overflow-hidden relative">
                  {product.photos?.length > 0 ? (
                    <>
                      <img 
                        src={product.photos[selectedPhotoIndex]} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {product.isOnSale && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase animate-badge-pulse">
                          -${Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice || product.price)) * 100)}%
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-9xl opacity-30">⚗️</span>
                    </div>
                  )}
                </div>
                
                {product.photos?.length > 1 && (
                  <div className="flex gap-4 justify-center">
                    {product.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`w-20 h-20 overflow-hidden border-2 transition-all hover:scale-105 ${
                          selectedPhotoIndex === index ? 'border-stone-900' : 'border-stone-200'
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - From API */}
      {content.showReviews !== false && (
        <section id="avis" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-4">{lang === 'ar' ? 'شهادات' : 'Témoignages'}</p>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">{lang === 'ar' ? 'ماذا تقول عميلاتنا' : 'Ce qu\'en disent nos clientes'}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 6).map((review, i) => (
                <div key={review.id || i} className="p-8 bg-stone-50 border border-stone-100 hover:shadow-lg transition-shadow">
                  <div className="flex text-stone-900 mb-6">{'★'.repeat(review.rating || 5)}</div>
                  <p className="text-stone-600 leading-relaxed mb-8">"{review.comment}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white text-sm">
                      {(review.firstName || review.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">{review.name || `${review.firstName} ${review.lastName || ''}`}</p>
                      <p className="text-xs text-stone-500">Cliente vérifiée ✓</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Review Button */}
            {!showReviewForm && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="inline-block px-8 py-4 border-2 border-stone-300 text-stone-700 text-xs tracking-widest uppercase font-medium hover:border-stone-900 hover:text-stone-900 transition-colors"
                >
                  {lang === 'ar' ? 'اكتبي تعليقاً' : 'Laisser un commentaire'}
                </button>
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <div className="max-w-xl mx-auto mt-12 bg-stone-50 border border-stone-200 p-8">
                <h3 className="text-2xl font-serif text-stone-900 mb-6 text-center">
                  {lang === 'ar' ? 'اكتبي تعليقك' : 'Partagez votre expérience'}
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">
                      {lang === 'ar' ? 'اسمك' : 'Votre nom'}
                    </label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none text-stone-900"
                      placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Votre nom complet'}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">
                      {lang === 'ar' ? 'التقييم' : 'Votre note'}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="text-2xl focus:outline-none transition-colors"
                        >
                          {star <= reviewForm.rating ? (
                            <span className="text-stone-900">★</span>
                          ) : (
                            <span className="text-stone-300">☆</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">
                      {lang === 'ar' ? 'تعليقك' : 'Votre commentaire'}
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none resize-none text-stone-900"
                      placeholder={lang === 'ar' ? 'اكتبي رأيك...' : 'Partagez votre avis sur le produit...'}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="flex-1 py-3 bg-stone-900 text-white text-xs tracking-widest uppercase font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? (lang === 'ar' ? 'جاري الإرسال...' : 'Envoi...') : (lang === 'ar' ? 'إرسال' : 'Envoyer')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 border border-stone-300 text-stone-600 text-xs tracking-widest uppercase font-medium hover:border-stone-500 transition-colors"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ - Accordion */}
      {content.showFAQ && content.faqs && content.faqs.length > 0 && (
        <section id="faq" className="py-20 bg-stone-900 text-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-serif">Questions fréquentes</h2>
            </div>

            <div className="space-y-4">
              {content.faqs.map((faq, index) => (
                <div key={index} className="border border-stone-700 hover:border-stone-500 transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left"
                  >
                    <span onClick={(e) => { e.stopPropagation(); handleEditClick(`faq${index + 1}Question`); }} className={`text-sm font-medium pr-8 ${editableStyle}`}>{faq.question}</span>
                    <span className="text-xl flex-shrink-0 transition-transform duration-300" style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </button>
                  {openFaq === index && (
                    <div className="px-8 pb-6 text-stone-400 leading-relaxed border-t border-stone-700 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA - Dark Section */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <h2 
            onClick={() => handleEditClick('ctaFinalTitle')} 
            className={`text-4xl sm:text-5xl font-serif mb-6 ${editableStyle}`}
          >
            {lang === 'ar' ? (content.ctaFinalTitleAr || content.ctaFinalTitle || 'هل أنت مستعدة لتحويل بشرتك؟') : (content.ctaFinalTitle || 'Prête à transformer votre peau ?')}
          </h2>
          <p 
            onClick={() => handleEditClick('ctaFinalSubtitle')} 
            className={`text-stone-400 mb-10 max-w-xl mx-auto ${editableStyle}`}
          >
            {lang === 'ar' ? (content.ctaFinalSubtitleAr || `انضمي إلى أكثر من ${clientsCount} مستخدمة satisfaites واكتشفي تميز Skinova.`) : (content.ctaFinalSubtitle || `Rejoignez plus de ${clientsCount} utilisatrices satisfaites et découvrez l'excellence Skinova.`)}
          </p>
          <div className="flex justify-center flex-wrap gap-8 mt-12 pt-12 border-t border-stone-800">
            {content.showGuarantee && content.guaranteeText && (
              <span className="text-xs text-stone-500 tracking-widest uppercase">✓ {lang === 'ar' ? (content.guaranteeTextAr || content.guaranteeText) : content.guaranteeText}</span>
            )}
            <span className="text-xs text-stone-500 tracking-widest uppercase">✓ {content.paymentText}</span>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <span className="text-stone-900 font-serif text-lg">S</span>
              </div>
              <span className="text-lg tracking-widest uppercase font-serif">{lang === 'ar' ? (content.brandNameAr || content.brandName) : content.brandName}</span>
            </div>
            
            <div className="flex gap-8">
              {content.contactEmail && <span className="text-xs text-stone-500">{content.contactEmail}</span>}
            </div>
            
            <p onClick={() => handleEditClick('footerText')} className={`text-xs text-stone-600 ${editableStyle}`}>{lang === 'ar' ? (content.footerTextAr || content.footerText) : content.footerText}</p>
          </div>
        </div>
      </footer>

      {/* Floating Language Toggle */}
      <button
        onClick={() => handleLangChange(lang === 'fr' ? 'ar' : 'fr')}
        className="fixed bottom-8 left-8 w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-stone-800 transition-colors z-50 animate-float"
        style={{ animationDelay: '0.5s' }}
      >
        <span className="text-sm font-bold">{lang === 'fr' ? 'AR' : 'FR'}</span>
      </button>

      {/* Floating WhatsApp */}
      {content.contactWhatsapp && (
        <a
          href={`https://wa.me/${content.contactWhatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-xl hover:bg-green-700 transition-colors z-50 animate-float"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
}
