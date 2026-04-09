"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { uploadImage, getLanding, updateLanding } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  title: string;
  price: string;
  description: string;
  biography: string;
  photos: string[];
  mainPhoto: number;
  stock: number;
  unlimitedStock: boolean;
}

const STORAGE_KEY = 'cosmetic_editor_draft';

export default function CosmeticEditor() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const landingId = searchParams.get('id');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [loadingLanding, setLoadingLanding] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const [content, setContent] = useState<Record<string, any>>({
    brandName: "Bella Skin",
    tagline: "Cosmétiques Naturels",
    collectionTitle: "Collection Exclusive",
    reviewsTitle: "Avis client",
    logo: "",
    heroTitle: "Votre beauté commence ici",
    heroSubtitle: "Découvrez notre collection exclusive de soins cosmétiques naturels, formulés pour révéler l'éclat de votre peau.",
    ctaButton: "Découvrir la collection",
    contactEmail: "contact@bellaskin.com",
    footerText: "Des soins naturels pour une peau radieuse. Fabriqués avec passion en Algérie.",
    showHeader: true,
    showProduct: true,
    showCTA: true,
    showBiography: true,
    showFooter: true,
    showContact: true,
    heroBgColor: "bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50",
    ctaBgColor: "bg-gradient-to-r from-rose-500 to-orange-500",
    heroTextColor: "text-zinc-900",
    ctaTextColor: "text-white",
    textColor: "text-zinc-700",
    heroTextSize: "text-6xl",
    ctaTextSize: "text-lg",
    heroSubtitleSize: "text-xl",
    sectionBg: "bg-white",
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: "product_1",
      name: "Sérum Éclat Naturel",
      title: "Sérum Éclat Premium",
      price: "2500",
      description: "Éclat et luminosité - Formule concentrée pour une peau radieuse",
      biography: "Notre sérum Éclat Naturel est formulé avec des ingrédients naturels de haute qualité pour révéler la beauté de votre peau.\n\n• Éclaircit et unifie le teint\n• Hydrate en profondeur\n• Réduit les signes de fatigue\n• Protège contre les agressions extérieures\n\nConvient à tous les types de peau. Testé dermatologiquement. Non comédogène.",
      photos: [],
      mainPhoto: 0,
      stock: 100,
      unlimitedStock: true,
    },
  ]);

  const [productPhotos, setProductPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user) {
      localStorage.setItem('isCosmeticEditMode', 'true');
      if (landingId) {
        loadLanding();
      } else {
        loadFromLocalStorage();
        setLoadingLanding(false);
      }
    }
    return () => {
      localStorage.removeItem('isCosmeticEditMode');
    };
  }, [loading, user, landingId]);

  useEffect(() => {
    const handleSelectField = (event: any) => {
      const field = event.data?.field || event.detail?.field;
      if (!field) return;
      
      const fieldMap: Record<string, string> = {
        brandName: 'brandName',
        tagline: 'tagline',
        collectionTitle: 'collectionTitle',
        reviewsTitle: 'reviewsTitle',
        heroTitle: 'heroTitle',
        heroSubtitle: 'heroSubtitle',
        ctaButton: 'ctaButton',
        contactEmail: 'contactEmail',
        footerText: 'footerText',
      };
      
      const inputId = fieldMap[field];
      if (inputId) {
        const input = document.getElementById(`input-${inputId}`);
        if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          input.focus();
        }
      }
    };

    window.addEventListener('selectField', handleSelectField);
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'selectField') {
        handleSelectField(event);
      }
    });
    return () => {
      window.removeEventListener('selectField', handleSelectField);
    };
  }, []);

  const loadLanding = async () => {
    if (!landingId) return;
    try {
      const result = await getLanding(landingId);
      if (result.landing) {
        setIsLive(result.landing.isPublished || result.landing.is_published || false);
        if (result.landing.content) {
          setContent(result.landing.content);
        }
        if (result.landing.products && result.landing.products.length > 0) {
          setProducts(result.landing.products as any);
          setProductPhotos(result.landing.products[0]?.photos || []);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du chargement");
    } finally {
      setLoadingLanding(false);
    }
  };

  const loadFromLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.content) setContent(data.content);
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          setProductPhotos(data.products[0]?.photos || []);
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const data = { content, products };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [content, products]);

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
    if (field === 'photos') {
      setProductPhotos(value);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const result = await uploadImage(file, 'logos');
      setContent({ ...content, logo: result.url });
      toast.success("Logo uploadé !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    const product = products[0];
    if (!product) return;

    try {
      const newPhotos: string[] = [];
      for (let i = 0; i < files.length && (productPhotos.length) + i < 9; i++) {
        const result = await uploadImage(files[i], 'products');
        newPhotos.push(result.url);
      }
      const updatedPhotos = [...productPhotos, ...newPhotos];
      setProductPhotos(updatedPhotos);
      updateProduct(product.id, 'photos', updatedPhotos);
      toast.success(`${newPhotos.length} photo(s) ajoutée(s) !`);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = productPhotos.filter((_, i) => i !== index);
    setProductPhotos(updatedPhotos);
    updateProduct(products[0].id, 'photos', updatedPhotos);
  };

  const handleSaveToDatabase = async () => {
    setSaving(true);
    try {
      const payload: any = { 
        content, 
        products: products.map(p => ({
          ...p,
          photos: p.id === products[0].id ? productPhotos : p.photos
        }))
      };
      
      if (landingId) {
        payload.isPublished = isLive;
        await updateLanding(landingId, payload);
      } else {
        await updateLanding(null, payload);
      }
      
      toast.success("Page enregistrée !");
      localStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLive = async () => {
    if (!landingId) {
      toast.error("Enregistrez d'abord");
      return;
    }

    const newStatus = !isLive;
    setIsLive(newStatus);
    
    try {
      await updateLanding(landingId, { isPublished: newStatus });
      toast.success(newStatus ? "Site en ligne !" : "Site hors ligne");
    } catch (error: any) {
      setIsLive(!newStatus);
      toast.error(error.message || "Erreur");
    }
  };

  const handlePreview = () => {
    if (landingId) {
      window.open(`/template/cosmetic?id=${landingId}&editMode=true`, '_blank');
    } else {
      const tempData = {
        content,
        products: products.map(p => ({
          ...p,
          photos: p.id === products[0].id ? productPhotos : p.photos
        }))
      };
      const encoded = btoa(encodeURIComponent(JSON.stringify(tempData)));
      window.open(`/template/cosmetic?data=${encoded}&editMode=true`, '_blank');
    }
  };

  const currentProduct = products[0];

  if (loading || loadingLanding || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <div className="h-6 w-px bg-zinc-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="font-bold text-zinc-900">Bella Skin Template</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {landingId && (
            <button
              onClick={handleToggleLive}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                isLive 
                  ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`}></span>
              {isLive ? 'En ligne' : 'Hors ligne'}
            </button>
          )}
          
          <button 
            onClick={handlePreview}
            className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Aperçu
          </button>
          
          <button 
            onClick={handleSaveToDatabase}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Template Preview */}
        <main className="flex-1 overflow-auto pb-8">
          <div className="min-h-screen bg-white font-sans">
            
            {/* Top Bar */}
            <div className="bg-zinc-900 text-white py-2 text-center text-sm">
              Livraison gratuite en Algérie • Paiement à la livraison
            </div>

            {/* Header */}
            {content.showHeader !== false && (
              <header className="bg-white border-b border-zinc-100 sticky top-14 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => logoInputRef.current?.click()}
                        className="relative group cursor-pointer"
                      >
                        {content.logo ? (
                          <img src={content.logo} alt={content.brandName} className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-200" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-md">
                            <span className="text-white text-xl font-bold">B</span>
                          </div>
                        )}
                        <div className="absolute -inset-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                          {content.brandName}
                        </span>
                        <span className="text-xs text-zinc-500 tracking-widest uppercase">{content.tagline || 'Cosmétiques Naturels'}</span>
                      </div>
                    </div>
                    
                    <nav className="hidden lg:flex items-center gap-8">
                      <span className="text-sm font-medium text-zinc-600">Collection</span>
                      <span className="text-sm font-medium text-zinc-600">Bienfaits</span>
                      <span className="text-sm font-medium text-zinc-600">Avis</span>
                      <span className="text-sm font-medium text-zinc-600">Contact</span>
                    </nav>
                    
                    {content.showCTA !== false && (
                      <button className="hidden lg:inline-flex px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                        {content.ctaButton}
                      </button>
                    )}
                  </div>
                </div>
              </header>
            )}

            {/* Hero Section */}
            <section className={`${content.heroBgColor || 'bg-gradient-to-br from-rose-50 to-amber-50'} py-24 lg:py-32 relative overflow-hidden`}>
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-rose-100">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium text-zinc-700">Nouveau • Collection Printemps 2026</span>
                    </div>
                    
                    <h1 className={`${content.heroTextSize || 'text-4xl md:text-6xl'} font-bold ${content.heroTextColor || 'text-zinc-900'} leading-tight`}>
                      {content.heroTitle}
                    </h1>
                    
                    <p className={`${content.heroSubtitleSize || 'text-base md:text-xl'} text-zinc-600 leading-relaxed max-w-lg`}>
                      {content.heroSubtitle}
                    </p>
                    
                    {content.showCTA !== false && (
                      <div className="flex flex-wrap gap-4 pt-4">
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                          {content.ctaButton}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                        <button className="inline-flex px-8 py-4 bg-white text-zinc-800 font-bold rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 items-center gap-2 border border-zinc-200">
                          En savoir plus
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-rose-300/30 to-orange-300/30 rounded-[3rem] blur-2xl"></div>
                    <div className="relative">
                      {productPhotos.length > 0 ? (
                        <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-zinc-100">
                          <img 
                            src={productPhotos[currentProduct?.mainPhoto || 0]} 
                            alt={currentProduct?.name || 'Product'} 
                            className="w-full rounded-2xl" 
                          />
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-[2rem] p-16 shadow-2xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:from-rose-200 hover:to-orange-200 transition-colors group"
                        >
                          <span className="text-[10rem] group-hover:scale-110 transition-transform">🌸</span>
                          <p className="text-zinc-500 mt-4">Cliquez pour ajouter une photo</p>
                        </div>
                      )}
                      
                      {currentProduct && (
                        <div className="absolute -left-4 bottom-12 bg-white rounded-2xl p-5 shadow-2xl border border-zinc-100 max-w-[200px]">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-green-600">Best-seller</span>
                          </div>
                          <p className="font-bold text-xl text-zinc-900">
                            {currentProduct.price} DA
                          </p>
                          <p className="text-xs text-zinc-500">{currentProduct.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* marquee */}
            <div className="bg-zinc-900 py-4 overflow-hidden">
              <div className="flex gap-8 animate-marquee whitespace-nowrap">
                {['🌿 100% Naturel', '🐰 Cruelty-Free', '🇩🇿 Fait en Algérie', '✨ Vegan', '🧴 Sans Parabènes', '🌿 100% Naturel', '🐰 Cruelty-Free', '🇩🇿 Fait en Algérie', '✨ Vegan', '🧴 Sans Parabènes'].map((item, i) => (
                  <span key={i} className="text-white/80 text-sm font-medium">{item}</span>
                ))}
              </div>
            </div>

            {/* Product Section */}
            {content.showProduct !== false && currentProduct && (
              <section id="collection" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                  <div className="text-center mb-12 md:mb-16">
                    <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-semibold rounded-full mb-4">Notre Sélection</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 mb-4">Collection Exclusive</h2>
                    <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto">Des soins cosmétiques de haute qualité, formulés avec des ingrédients naturels soigneusement sélectionnés.</p>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-zinc-100">
                        {productPhotos.length > 0 ? (
                          <img 
                            src={productPhotos[currentProduct.mainPhoto || 0]} 
                            alt={currentProduct.name}
                            className="w-full rounded-xl md:rounded-2xl aspect-square object-cover" 
                          />
                        ) : (
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl md:rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:from-rose-200 hover:to-orange-200 transition-colors">
                            <span className="text-6xl md:text-8xl">✨</span>
                            <span className="text-zinc-500 mt-4">Cliquez pour ajouter des photos</span>
                          </div>
                        )}
                      </div>
                      
                      {productPhotos.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {productPhotos.map((photo, index) => (
                            <div 
                              key={index} 
                              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer ${
                                currentProduct.mainPhoto === index ? 'border-rose-500' : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                              onClick={() => updateProduct(currentProduct.id, 'mainPhoto', index)}
                            >
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:sticky lg:top-28 space-y-6 md:space-y-8">
                      <div>
                        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full mb-4">Nouveauté</span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-2">{currentProduct.name}</h2>
                        <p className="text-base md:text-lg text-zinc-600 mb-6">{currentProduct.description}</p>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">{currentProduct.price} DA</span>
                          <span className="text-base md:text-lg text-zinc-400 line-through">5500 DA</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 md:p-4 bg-green-50 rounded-xl">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-green-800">Livraison gratuite</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-xl">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-blue-800">Paiement à la livraison</span>
                        </div>
                      </div>

                      {content.showCTA !== false && (
                        <button className="w-full py-4 md:py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-base md:text-lg">
                          {content.ctaButton}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Biography Section */}
            {content.showBiography !== false && currentProduct && currentProduct.biography && (
              <section id="bienfaits" className="py-16 md:py-24 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                  <div className="text-center mb-8 md:mb-12">
                    <span className="inline-block px-4 py-1.5 bg-white text-rose-700 text-sm font-semibold rounded-full mb-4 shadow-sm">Ce qui nous différencie</span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-4">Pourquoi choisir nos produits ?</h2>
                  </div>
                  
                  <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-lg border border-zinc-100 max-w-4xl mx-auto">
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4 md:mb-6 text-center">À propos de ce produit</h3>
                    <p className="text-zinc-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                      {currentProduct.biography}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section */}
            {content.showContact !== false && (
              <section className="py-16 md:py-20 bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Besoin d&apos;aide ?</h2>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-8">
                    <p className="text-white/80 mb-4">Contactez-nous par email</p>
                    <span className="text-xl md:text-2xl lg:text-3xl font-bold">{content.contactEmail}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Footer */}
            {content.showFooter !== false && (
              <footer className="py-12 bg-zinc-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      {content.logo ? (
                        <img src={content.logo} alt={content.brandName} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                          <span className="text-white font-bold">B</span>
                        </div>
                      )}
                      <span className="text-lg font-bold">{content.brandName}</span>
                    </div>
                    
                    <p className="text-zinc-400 text-sm">{content.footerText}</p>
                    
                    <p className="text-zinc-500 text-sm">© 2026 {content.brandName}</p>
                  </div>
                </div>
              </footer>
            )}
          </div>
        </main>

        {/* Right Sidebar - Fixed Configuration Panel */}
        <aside className="w-80 bg-white border-l border-zinc-200 flex flex-col overflow-hidden sticky top-14 h-[calc(100vh-57px)]">
          <div className="p-4 border-b border-zinc-200 bg-gradient-to-r from-rose-500 to-orange-500">
            <h3 className="font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Configuration
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Section Visibility */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Sections</h4>
              <div className="space-y-2">
                <ToggleSwitch 
                  label="En-tête" 
                  checked={content.showHeader !== false} 
                  onChange={(v) => setContent({...content, showHeader: v})}
                  color="rose"
                />
                <ToggleSwitch 
                  label="Produit" 
                  checked={content.showProduct !== false} 
                  onChange={(v) => setContent({...content, showProduct: v})}
                  color="orange"
                />
                <ToggleSwitch 
                  label="Bouton CTA" 
                  checked={content.showCTA !== false} 
                  onChange={(v) => setContent({...content, showCTA: v})}
                  color="green"
                />
                <ToggleSwitch 
                  label="Description" 
                  checked={content.showBiography !== false} 
                  onChange={(v) => setContent({...content, showBiography: v})}
                  color="blue"
                />
                <ToggleSwitch 
                  label="Contact" 
                  checked={content.showContact !== false} 
                  onChange={(v) => setContent({...content, showContact: v})}
                  color="purple"
                />
                <ToggleSwitch 
                  label="Pied de page" 
                  checked={content.showFooter !== false} 
                  onChange={(v) => setContent({...content, showFooter: v})}
                  color="zinc"
                />
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Texte</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Nom de la marque</label>
                  <input
                    id="input-brandName"
                    type="text"
                    value={content.brandName}
                    onChange={(e) => setContent({...content, brandName: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Slogan (sous le nom)</label>
                  <input
                    id="input-tagline"
                    type="text"
                    value={content.tagline || ''}
                    onChange={(e) => setContent({...content, tagline: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Titre principal</label>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Sous-titre</label>
                  <textarea
                    value={content.heroSubtitle}
                    onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Bouton CTA</label>
                  <input
                    id="input-ctaButton"
                    type="text"
                    value={content.ctaButton}
                    onChange={(e) => setContent({...content, ctaButton: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Titre Collection</label>
                  <input
                    id="input-collectionTitle"
                    type="text"
                    value={content.collectionTitle}
                    onChange={(e) => setContent({...content, collectionTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Titre Avis</label>
                  <input
                    id="input-reviewsTitle"
                    type="text"
                    value={content.reviewsTitle}
                    onChange={(e) => setContent({...content, reviewsTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Email contact</label>
                  <input
                    type="email"
                    value={content.contactEmail}
                    onChange={(e) => setContent({...content, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Texte footer</label>
                  <textarea
                    value={content.footerText}
                    onChange={(e) => setContent({...content, footerText: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            {currentProduct && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Produit</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Nom du produit</label>
                    <input
                      type="text"
                      value={currentProduct.name}
                      onChange={(e) => updateProduct(currentProduct.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Prix (DA)</label>
                    <input
                      type="text"
                      value={currentProduct.price}
                      onChange={(e) => updateProduct(currentProduct.id, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Description</label>
                    <input
                      type="text"
                      value={currentProduct.description}
                      onChange={(e) => updateProduct(currentProduct.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Colors */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Couleurs</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-2 block">Fond Hero</label>
                  <div className="flex flex-wrap gap-2">
                    {heroBgOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setContent({...content, heroBgColor: color.value})}
                        className={`h-8 px-3 rounded-lg bg-gradient-to-br ${color.value.split(' ').slice(2).join(' ')} border-2 transition-all text-xs font-medium ${
                          content.heroBgColor === color.value ? 'border-rose-500 ring-2 ring-rose-200' : 'border-transparent'
                        }`}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-2 block">Bouton CTA</label>
                  <div className="flex flex-wrap gap-2">
                    {ctaBgOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setContent({...content, ctaBgColor: color.value})}
                        className={`h-8 px-3 rounded-lg bg-gradient-to-r ${color.value.split(' ').slice(2).join(' ')} border-2 transition-all text-xs font-medium text-white ${
                          content.ctaBgColor === color.value ? 'border-white ring-2 ring-rose-200' : 'border-transparent'
                        }`}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-rose-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-rose-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photos ({productPhotos.length}/9)
              </h4>
              <p className="text-xs text-rose-600 mb-3">
                Cliquez sur une zone photo dans le template pour ajouter des images.
              </p>
              {productPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {productPhotos.map((photo, index) => (
                    <div key={index} className="relative w-12 h-12 rounded-lg overflow-hidden border border-rose-200">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Hidden File Inputs */}
      <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
    </div>
  );
}

const heroBgOptions = [
  { value: "bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50", label: "Rose" },
  { value: "bg-gradient-to-br from-orange-50 to-amber-50", label: "Orange" },
  { value: "bg-gradient-to-br from-purple-50 to-pink-50", label: "Violet" },
  { value: "bg-gradient-to-br from-blue-50 to-indigo-50", label: "Bleu" },
  { value: "bg-gradient-to-br from-green-50 to-emerald-50", label: "Vert" },
  { value: "bg-white", label: "Blanc" },
  { value: "bg-zinc-100", label: "Gris" },
  { value: "bg-zinc-900", label: "Noir" },
];

const ctaBgOptions = [
  { value: "bg-gradient-to-r from-rose-500 to-orange-500", label: "Rose Orange" },
  { value: "bg-gradient-to-r from-orange-500 to-amber-500", label: "Orange" },
  { value: "bg-gradient-to-r from-pink-500 to-rose-500", label: "Rose" },
  { value: "bg-gradient-to-r from-purple-500 to-pink-500", label: "Violet" },
  { value: "bg-gradient-to-r from-blue-500 to-indigo-500", label: "Bleu" },
  { value: "bg-gradient-to-r from-green-500 to-emerald-500", label: "Vert" },
  { value: "bg-gradient-to-r from-zinc-700 to-zinc-900", label: "Gris foncé" },
  { value: "bg-black", label: "Noir" },
];

function ToggleSwitch({ label, checked, onChange, color }: { 
  label: string; 
  checked: boolean; 
  onChange: (v: boolean) => void; 
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    rose: 'bg-rose-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    zinc: 'bg-zinc-500',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-600">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          checked ? colorClasses[color] : 'bg-zinc-300'
        }`}
      >
        <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform absolute top-0.5 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`} />
      </button>
    </div>
  );
}
