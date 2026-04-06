"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";

type Language = 'fr' | 'ar';

const translations = {
  fr: {
    discoverCollection: 'Découvrir la collection',
    fastDelivery: 'Livraison rapide',
    returnHome: 'Retour à la page principale',
    orderConfirmed: 'Commande confirmée !',
    price: 'Prix',
  },
  ar: {
    discoverCollection: 'اكتشف المجموعة',
    fastDelivery: 'توصيل سريع',
    returnHome: 'العودة للصفحة الرئيسية',
    orderConfirmed: 'تم تأكيد الطلب!',
    price: 'السعر',
  },
};

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

interface Content {
  logo: string;
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  contactEmail: string;
  contactWhatsapp: string;
  contactInstagram: string;
  contactFacebook: string;
  footerText: string;
  showHeader: boolean;
  showProduct: boolean;
  showCTA: boolean;
  showBiography: boolean;
  showFooter: boolean;
  showContact: boolean;
  showHeaderNav: boolean;
  showHeroTitle: boolean;
  showHeroSubtitle: boolean;
  showProductSection: boolean;
  showProductName: boolean;
  showProductPrice: boolean;
  showProductDescription: boolean;
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
  showReviews: boolean;
  showStats: boolean;
  showGuarantee?: boolean;
  guaranteeText?: string;
  satisfactionRate?: string;
  clientsCount?: string;
  showTrustBar?: boolean;
  trustBarText?: string;
  feature1Title?: string;
  feature1Desc?: string;
  feature2Title?: string;
  feature2Desc?: string;
  feature3Title?: string;
  feature3Desc?: string;
}

interface LandingData {
  content: Content;
  products: Product[];
}

export default function CosmeticTemplatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <CosmeticTemplate />
    </Suspense>
  );
}

function CosmeticTemplate() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState<Content>({
    logo: '',
    brandName: 'Bella Skin',
    heroTitle: 'Votre beauté commence ici',
    heroSubtitle: 'Découvrez notre collection exclusive de soins cosmétiques naturels, formulés pour révéler l\'éclat de votre peau.',
    ctaButton: 'Découvrir la collection',
    contactEmail: 'contact@bellaskin.com',
    contactWhatsapp: '',
    contactInstagram: '',
    contactFacebook: '',
    footerText: 'Des soins naturels pour une peau radieuse. Fabriqués avec passion en Algérie.',
    showHeader: true,
    showProduct: true,
    showCTA: true,
    showBiography: true,
    showFooter: true,
    showContact: true,
    showHeaderNav: true,
    showHeroTitle: true,
    showHeroSubtitle: true,
    showProductSection: true,
    showProductName: true,
    showProductPrice: true,
    showProductDescription: true,
    heroBgColor: 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50',
    ctaBgColor: 'bg-gradient-to-r from-rose-500 to-orange-500',
    heroTextColor: 'text-zinc-900',
    ctaTextColor: 'text-white',
    textColor: 'text-zinc-700',
    heroTextSize: 'text-6xl',
    ctaTextSize: 'text-lg',
    productNameSize: 'text-3xl',
    productPriceSize: 'text-4xl',
    heroSubtitleSize: 'text-xl',
    sectionBg: 'bg-white',
    showStats: true,
    satisfactionRate: '98',
    clientsCount: '15K+',
    showReviews: true,
    showGuarantee: false,
    guaranteeText: 'Garantie satisfait ou remboursé sous 30 jours',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ firstName: '', lastName: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [lang, setLang] = useState<Language>('fr');
  const [landingSlug, setLandingSlug] = useState<string>('');

  const t = translations[lang];

  const satisfactionRate = reviews.length > 0 
    ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)
    : 98;
  
  const clientsCount = ordersCount > 0 
    ? ordersCount >= 1000 
      ? Math.floor(ordersCount / 1000) + 'K+' 
      : ordersCount.toString()
    : '0';

  const isPreview = searchParams.get('preview') === 'true';
  const isEditMode = searchParams.get('editMode') === 'true';

  const handleEditClick = (field: string) => {
    if (isEditMode && window.parent !== window) {
      window.parent.postMessage({ type: 'selectField', field }, '*');
    }
  };

  const editableStyle = isEditMode ? "cursor-pointer hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 rounded transition-all" : "";

  const previewContent: Content = {
    logo: '',
    brandName: 'Cosméto Nature',
    heroTitle: 'Votre Beauté Naturelle',
    heroSubtitle: 'Des produits naturels pour une peau radieuse',
    ctaButton: 'Commander Maintenant',
    contactEmail: 'contact@cosmetonature.com',
    contactWhatsapp: '',
    contactInstagram: '',
    contactFacebook: '',
    footerText: 'Des soins naturels pour une peau radieuse',
    showHeader: true,
    showProduct: true,
    showCTA: true,
    showBiography: true,
    showFooter: true,
    showContact: true,
    showHeaderNav: true,
    showHeroTitle: true,
    showHeroSubtitle: true,
    showProductSection: true,
    showProductName: true,
    showProductPrice: true,
    showProductDescription: true,
    heroBgColor: 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50',
    ctaBgColor: 'bg-gradient-to-r from-rose-500 to-orange-500',
    heroTextColor: 'text-zinc-900',
    ctaTextColor: 'text-white',
    textColor: 'text-zinc-700',
    heroTextSize: 'text-6xl',
    ctaTextSize: 'text-lg',
    productNameSize: 'text-3xl',
    productPriceSize: 'text-4xl',
    heroSubtitleSize: 'text-xl',
    sectionBg: 'bg-white',
    showStats: true,
    satisfactionRate: '98',
    clientsCount: '15K+',
    showReviews: true,
    showGuarantee: false,
    guaranteeText: 'Garantie satisfait ou remboursé sous 30 jours',
  };
  const previewData = {
    product: {
      id: 'preview-1',
      name: 'Sérum Visage Naturel',
      price: '3500 DA',
      description: 'Un sérum visage enrichi en ingrédients naturels pour une peau éclatante et hydratée.',
      biography: 'Notre sérum est formulé avec des extraits de plantes alpines et de l\'huile d\'argan pure. Testé dermatologiquement, convient à tous les types de peau.',
      photos: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'],
      mainPhoto: 0,
      isOnSale: true,
      oldPrice: '4500 DA',
      stock: 50,
      unlimitedStock: false,
    }
  };

  useEffect(() => {
    if (isPreview) {
      setContent(previewContent);
      setProducts([previewData.product]);
      setSelectedPhotoIndex(0);
      setLoading(false);
    } else {
      loadData();
    }
  }, []);

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
    const dataParam = searchParams.get('data');
    const isPreview = searchParams.get('preview') === 'true';

    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
        if (decoded.content) setContent(decoded.content);
        if (decoded.products) setProducts(decoded.products);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
      setLoading(false);
      return;
    }

    if (landingId) {
      try {
        console.log('Loading landing with ID:', landingId);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        let url = `${API_URL}/public/landing/${landingId}`;
        if (isPreview) {
          url = `${API_URL}/preview/${landingId}`;
        }
        console.log('API URL:', url);
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const text = await response.text();
          console.error('Error response:', text);
          throw new Error('Failed to load landing: ' + response.status);
        }
        
        const result = await response.json();
        console.log('Result:', result);
        const landing = result.landing || result;
        if (landing) {
          console.log('Landing found:', landing.name);
          console.log('Content:', landing.content);
          console.log('Products:', landing.products);
          console.log('Landing slug:', landing.slug);
          if (landing.slug) {
            setLandingSlug(landing.slug);
          }
          if (result.landing?.content) {
            setContent(result.landing.content);
          } else if (landing.content) {
            setContent(landing.content);
          }
          if (result.landing?.products && result.landing.products.length > 0) {
            setProducts(result.landing.products);
            setSelectedPhotoIndex(0);
          } else if (landing.products && landing.products.length > 0) {
            setProducts(landing.products);
            setSelectedPhotoIndex(0);
          }
          if (result.landing?.reviews) {
            setReviews(result.landing.reviews);
          } else if (landing.reviews) {
            setReviews(landing.reviews);
          }
          if (result.landing?.ordersCount !== undefined) {
            setOrdersCount(result.landing.ordersCount);
          } else if (landing.ordersCount !== undefined) {
            setOrdersCount(landing.ordersCount);
          }
        }
      } catch (error: any) {
        console.error('Error loading landing:', error);
        setError(error.message || 'Erreur lors du chargement');
      }
    }
    setLoading(false);
  };

  const handleOrder = (product: Product) => {
    const landingId = searchParams.get('id') || '';
    const orderData = {
      name: product.name,
      price: product.price,
      photo: product.photos && product.photos.length > 0 ? product.photos[0] : '',
      description: product.description || '',
      landingId: landingSlug || landingId,
    };
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = `/template/cosmetic/order?lang=${lang}&id=${landingSlug || landingId}`;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.firstName || !reviewForm.lastName || !reviewForm.comment) return;
    
    const landingId = searchParams.get('id');
    if (!landingId) return;
    
    setSubmittingReview(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/landing/${landingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: reviewForm.firstName,
          lastName: reviewForm.lastName,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.review) {
          setReviews([result.review, ...reviews]);
        }
        setReviewForm({ firstName: '', lastName: '', rating: 5, comment: '' });
        alert('Merci pour votre avis !');
        
        // Reload reviews from API
        const landingResponse = await fetch(`${API_URL}/public/landing/${landingId}`);
        if (landingResponse.ok) {
          const landingResult = await landingResponse.json();
          if (landingResult.landing?.reviews) {
            setReviews(landingResult.landing.reviews);
          }
        }
      } else {
        alert('Erreur lors de l\'envoi de l\'avis');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de l\'envoi de l\'avis');
    }
    
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Page non disponible</h1>
          <p className="text-zinc-600 mb-6">{error}</p>
          <a href="/" className="inline-block px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors">
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  const product = products[0];

  return (
    <div className={`min-h-screen bg-white font-sans ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      {content.showHeaderNav !== false && (
        <header className="bg-white border-b border-zinc-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {content.logo ? (
                  <img src={content.logo} alt={content.brandName} className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-200" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-md">
                    <span className="text-white text-xl font-bold">B</span>
                  </div>
                )}
                <div>
                  <span onClick={() => handleEditClick('brandName')} className={`text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent ${editableStyle}`}>{content.brandName}</span>
                  <p className="text-xs text-zinc-500 tracking-widest uppercase">Cosmétiques Naturels</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <nav className="hidden lg:flex items-center gap-8">
                  <a href="#collection" className="text-sm font-medium text-zinc-600 hover:text-rose-500 transition-colors">Collection</a>
                  <a href="#avis" className="text-sm font-medium text-zinc-600 hover:text-rose-500 transition-colors">Avis</a>
                  <a href="#contact" className="text-sm font-medium text-zinc-600 hover:text-rose-500 transition-colors">Contact</a>
                </nav>
                
                <button
                  onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
                  className="flex items-center gap-2 px-3 py-2 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors text-sm font-medium text-rose-700"
                >
                  <Globe className="w-4 h-4" />
                  <span className={lang === 'ar' ? 'text-orange-500' : ''}>FR</span>
                  <span className="text-rose-400">/</span>
                  <span className={lang === 'ar' ? '' : 'text-orange-500'}>AR</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      {content.showHeroTitle !== false && (
        <section className={`${content.heroBgColor || 'bg-gradient-to-br from-rose-50 to-amber-50'} py-16 md:py-24 lg:py-32 relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-rose-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-orange-200/40 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-rose-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-zinc-700">Nouveau • Collection Printemps 2026</span>
                </div>
                
                {/* Sale Badge */}
                {product?.isOnSale && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-lg animate-pulse">
                    <span className="text-2xl">🔥</span>
                    <span className="text-sm font-bold">
                      -{Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice || product.price)) * 100)}% DE SOLDE !
                    </span>
                  </div>
                )}
                
                {/* Title */}
                <h1 onClick={() => handleEditClick('heroTitle')} className={`${content.heroTextSize || 'text-4xl md:text-6xl'} font-bold ${content.heroTextColor || 'text-zinc-900'} leading-tight ${editableStyle}`}>
                  {content.heroTitle}
                </h1>
                
                {/* Subtitle */}
                <p onClick={() => handleEditClick('heroSubtitle')} className={`text-lg md:text-xl text-zinc-600 leading-relaxed max-w-lg ${editableStyle}`}>
                  {content.heroSubtitle}
                </p>
                
                {/* CTA Buttons */}
                {content.showCTA !== false && (
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="#collection" 
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      onClick={(e) => { e.preventDefault(); if (!isEditMode) window.location.href = '#collection'; }}
                    >
                      {t.discoverCollection}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <a 
                      href="#bienfaits" 
                      className="inline-flex px-8 py-4 bg-white text-zinc-800 font-bold rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 items-center gap-2 border border-zinc-200"
                    >
                      {t.fastDelivery}
                    </a>
                  </div>
                )}
                
                {/* Stats */}
                {content.showStats !== false && (
                  <div className="flex items-center gap-8 pt-8 border-t border-zinc-200/50 flex-wrap">
                    <div className="text-center">
                      <p onClick={() => handleEditClick('satisfactionRate')} className={`text-3xl font-bold text-rose-500 ${editableStyle}`}>{satisfactionRate}%</p>
                      <p onClick={() => handleEditClick('clientsCount')} className={`text-xs text-zinc-500 uppercase tracking-wider ${editableStyle}`}>Satisfait</p>
                    </div>
                    <div className="w-px h-12 bg-zinc-200"></div>
                    <div className="text-center">
                      <p onClick={() => handleEditClick('clientsCount')} className={`text-3xl font-bold text-rose-500 ${editableStyle}`}>{clientsCount}</p>
                      <p onClick={() => handleEditClick('clientsCount')} className={`text-xs text-zinc-500 uppercase tracking-wider ${editableStyle}`}>Clients</p>
                    </div>
                    {content.showTrustBar !== false && content.trustBarText && (
                      <>
                        <div className="w-px h-12 bg-zinc-200"></div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <p onClick={() => handleEditClick('trustBarText')} className={`text-sm font-medium text-zinc-600 ${editableStyle}`}>{content.trustBarText}</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Hero Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-rose-300/30 to-orange-300/30 rounded-[3rem] blur-2xl"></div>
                <div className="relative">
                  {product && product.photos && product.photos.length > 0 ? (
                    <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-zinc-100">
                      <img 
                        src={product.photos[selectedPhotoIndex] || product.photos[0]} 
                        alt={product.name} 
                        className="w-full rounded-2xl" 
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-[2rem] p-8 md:p-16 shadow-2xl flex flex-col items-center justify-center aspect-square">
                      <span className="text-7xl md:text-[12rem]">🌸</span>
                      <p className="text-zinc-500 mt-4">Photo du produit principal</p>
                    </div>
                  )}
                  
                  {/* Floating Card */}
                  {product && (
                    <div className="absolute left-2 md:-left-4 bottom-8 md:bottom-12 bg-white rounded-2xl p-4 md:p-5 shadow-2xl border border-zinc-100 max-w-[160px] md:max-w-[200px]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-green-600">Best-seller</span>
                      </div>
                      <p className="font-bold text-xl text-zinc-900">{product.price} DA</p>
                      <p className="text-xs text-zinc-500">{product.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Section */}
      {content.showProductSection !== false && product && (
        <section id="collection" className={`py-16 md:py-24 ${content.sectionBg || 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-semibold rounded-full mb-4">Notre Sélection</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 mb-4">Collection Exclusive</h2>
              <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto">Des soins cosmétiques de haute qualité, formulés avec des ingrédients naturels soigneusement sélectionnés.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-zinc-100">
                  {product.photos && product.photos.length > 0 ? (
                    <img 
                      src={product.photos[selectedPhotoIndex] || product.photos[0]} 
                      alt={product.name}
                      className="w-full rounded-xl md:rounded-2xl aspect-square object-cover" 
                    />
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <span className="text-6xl md:text-8xl">✨</span>
                    </div>
                  )}
                </div>
                
                {/* Thumbnails */}
                {product.photos && product.photos.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.photos.map((photo, index) => (
                      <button 
                        key={index} 
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedPhotoIndex === index ? 'border-rose-500 ring-2 ring-rose-200' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="lg:sticky lg:top-28 space-y-6 md:space-y-8">
                {/* Title & Price */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">Nouveauté</span>
                    {product.isOnSale && (
                      <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                        -{Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice || product.price)) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-2">{product.name}</h2>
                  <p className="text-base md:text-lg text-zinc-600 mb-6">{product.description}</p>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">{product.price} DA</span>
                    {product.isOnSale && product.oldPrice && (
                      <span className="text-lg md:text-xl text-zinc-400 line-through">{product.oldPrice} DA</span>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-green-800">Livraison rapide</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-orange-800">Paiement à la livraison</span>
                  </div>
                </div>

                {/* CTA */}
                {content.showCTA !== false && (
                  <button 
                    onClick={() => handleOrder(product)}
                    className="w-full py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {t.discoverCollection}
                  </button>
                )}

                {/* Quick Contact */}
                <div className="flex items-center justify-center gap-4 p-4 bg-zinc-50 rounded-xl">
                  <span className="text-sm text-zinc-600">Une question ?</span>
                  <a href={`https://wa.me/${content.contactWhatsapp?.replace(/\D/g, '')}`} className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Commander sur WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {/* Guarantee Section */}
      {content.showGuarantee && content.guaranteeText && (
        <section className="py-12 md:py-16 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 
              onClick={() => handleEditClick('guaranteeText')}
              className={`text-xl md:text-2xl font-bold text-green-800 mb-2 ${editableStyle}`}
            >
              {content.guaranteeText}
            </h3>
            <p className="text-green-600">Achetez en toute confiance</p>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {content.showReviews !== false && (
        <section id="avis" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Review Form */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-12 md:mb-16 border border-rose-100">
            <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4 md:mb-6 text-center">Laisser un avis</h3>
            <form onSubmit={handleReviewSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={reviewForm.firstName}
                    onChange={(e) => setReviewForm({...reviewForm, firstName: e.target.value})}
                    placeholder="Prénom"
                    required
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={reviewForm.lastName}
                    onChange={(e) => setReviewForm({...reviewForm, lastName: e.target.value})}
                    placeholder="Nom"
                    required
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Note</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className="text-3xl transition-colors"
                    >
                      {star <= reviewForm.rating ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-zinc-300">★</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Votre commentaire..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Envoyer mon avis
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full mb-4">Témoignages</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-4">Ce que disent nos clientes</h2>
            {reviews.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex text-yellow-400 text-xl md:text-2xl">★★★★★</div>
                <span className="font-bold text-zinc-900 text-base md:text-lg">5/5</span>
                <span className="text-zinc-500">({reviews.length} avis)</span>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm md:text-base">Aucun avis pour le moment. Soyez la première à laisser un avis !</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reviews.length > 0 ? (
              reviews.map((review, i) => (
                <div key={review.id || i} className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-100">
                  <div className="flex text-yellow-400 mb-4">{'★'.repeat(review.rating)}</div>
                  <p className="text-zinc-700 mb-6 leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.firstName?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{review.name}</p>
                      <p className="text-sm text-zinc-500">Cliente ✓</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-zinc-500">
                <p className="text-lg">Aucun commentaire pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Besoin d&apos;aide ?</h2>
          <p className="text-base md:text-xl text-white/90 mb-8">Notre équipe est disponible 7j/7 pour répondre à toutes vos questions</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              {content.contactEmail && (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white/70 text-sm">Email</p>
                    <a href={`mailto:${content.contactEmail}`} className="text-lg md:text-xl font-bold hover:underline">{content.contactEmail}</a>
                  </div>
                </div>
              )}
              {content.contactWhatsapp && (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white/70 text-sm">WhatsApp</p>
                    <a href={`https://wa.me/${content.contactWhatsapp?.replace(/\D/g, '')}`} className="text-lg md:text-xl font-bold hover:underline">
                      {content.contactWhatsapp}
                    </a>
                  </div>
                </div>
              )}
            </div>
            {(content.contactEmail || content.contactWhatsapp) && (
              <p className="text-white/70 text-sm">Réponse garantie sous 24h</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      {content.showFooter !== false && (
        <footer className="py-12 md:py-16 bg-zinc-900 text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {content.logo ? (
                    <img src={content.logo} alt={content.brandName} className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                      <span className="text-white text-lg md:text-xl font-bold">B</span>
                    </div>
                  )}
                  <span className="text-xl md:text-2xl font-bold">{content.brandName}</span>
                </div>
                <p onClick={() => handleEditClick('footerText')} className={`text-zinc-400 leading-relaxed text-sm md:text-base ${editableStyle}`}>{content.footerText}</p>
              </div>
              
              {/* Links */}
              <div>
                <h4 className="font-bold mb-4">Navigation</h4>
                <ul className="space-y-2 text-zinc-400">
                  <li><a href="#collection" className="hover:text-white transition-colors">Collection</a></li>
                  <li><a href="#avis" className="hover:text-white transition-colors">Avis</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <ul className="space-y-2 text-zinc-400">
                  <li className="text-sm md:text-base">{content.contactEmail}</li>
                  {content.contactWhatsapp && <li className="text-sm md:text-base">{content.contactWhatsapp}</li>}
                </ul>
                <div className="flex gap-4 mt-4">
                  {content.contactInstagram && (
                    <a href={`https://instagram.com/${content.contactInstagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {content.contactFacebook && (
                    <a href={content.contactFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {content.contactWhatsapp && (
                    <a href={`https://wa.me/${content.contactWhatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating WhatsApp */}
      {content.contactWhatsapp && (
        <a 
          href={`https://wa.me/${content.contactWhatsapp?.replace(/\D/g, '')}`} 
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition-all z-50 animate-bounce"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
