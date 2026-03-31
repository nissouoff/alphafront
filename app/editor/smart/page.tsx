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

type Section = 'header' | 'hero' | 'product' | 'biography' | 'contact' | 'footer';

interface HoveredElement {
  section: Section;
  element: string;
  position: { x: number; y: number };
}

const STORAGE_KEY = 'smart_editor_draft';

export default function SmartEditor() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const landingId = searchParams.get('id');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [loadingLanding, setLoadingLanding] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [hoveredElement, setHoveredElement] = useState<HoveredElement | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showSectionNav, setShowSectionNav] = useState(true);

  const [content, setContent] = useState<Record<string, any>>({
    brandName: "Bella Skin",
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
    heroBgColor: "bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50",
    ctaBgColor: "bg-gradient-to-r from-rose-500 to-orange-500",
    heroTextColor: "text-zinc-900",
    ctaTextColor: "text-white",
    textColor: "text-zinc-700",
    heroTextSize: "text-6xl",
    ctaTextSize: "text-lg",
    productNameSize: "text-3xl",
    productPriceSize: "text-4xl",
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
      if (landingId) {
        loadLanding();
      } else {
        loadFromLocalStorage();
        setLoadingLanding(false);
      }
    }
  }, [loading, user, landingId]);

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
      window.open(`/template/cosmetic?id=${landingId}`, '_blank');
    } else {
      const tempData = {
        content,
        products: products.map(p => ({
          ...p,
          photos: p.id === products[0].id ? productPhotos : p.photos
        }))
      };
      const encoded = btoa(encodeURIComponent(JSON.stringify(tempData)));
      window.open(`/template/cosmetic?data=${encoded}`, '_blank');
    }
  };

  const scrollToSection = (section: Section) => {
    setActiveSection(section);
    const element = document.getElementById(`section-${section}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentProduct = products[0];

  const sections = [
    { id: 'header' as Section, label: 'En-tête', icon: '🎯' },
    { id: 'hero' as Section, label: 'Hero', icon: '✨' },
    { id: 'product' as Section, label: 'Produit', icon: '💎' },
    { id: 'biography' as Section, label: 'Description', icon: '📝' },
    { id: 'contact' as Section, label: 'Contact', icon: '📧' },
    { id: 'footer' as Section, label: 'Footer', icon: '📋' },
  ];

  if (loading || loadingLanding || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-100 overflow-hidden">
      {/* Minimal Top Bar */}
      <header className="bg-zinc-900 text-white px-6 py-3 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="font-semibold text-sm">Smart Editor</span>
          </div>

          <div className="h-6 w-px bg-zinc-700"></div>
          
          <div className="flex items-center gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeSection === section.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>{section.icon}</span>
                <span className="hidden md:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              previewMode 
                ? 'bg-rose-500 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {previewMode ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Éditer
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Aperçu
              </>
            )}
          </button>

          {landingId && (
            <button
              onClick={handleToggleLive}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                isLive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-zinc-500'}`}></span>
              {isLive ? 'En ligne' : 'Hors ligne'}
            </button>
          )}
          
          <button 
            onClick={handlePreview}
            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ouvrir
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Section Navigator - Left Sidebar */}
        {!previewMode && (
          <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden flex-shrink-0">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sections</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sections.map((section) => {
                const isVisible = section.id === 'header' ? content.showHeader :
                                section.id === 'hero' ? content.showHeader :
                                section.id === 'product' ? content.showProduct :
                                section.id === 'biography' ? content.showBiography :
                                section.id === 'contact' ? true :
                                content.showFooter;

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group ${
                      activeSection === section.id 
                        ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30' 
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{section.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          activeSection === section.id ? 'text-white' : 'text-zinc-400'
                        }`}>
                          {section.label}
                        </p>
                        <p className="text-xs text-zinc-600">{isVisible ? 'Visible' : 'Masqué'}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        isVisible ? 'bg-green-500' : 'bg-zinc-600'
                      }`}></div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-zinc-800">
              <div className="bg-zinc-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Auto-sauvegarde
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-full rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Template Preview - Main Area */}
        <main 
          className={`flex-1 overflow-auto pb-8 ${previewMode ? 'bg-zinc-400' : 'bg-zinc-100'}`}
          onClick={() => {
            if (editingField) setEditingField(null);
          }}
        >
          {/* Preview Mode Banner */}
          {previewMode && (
            <div className="sticky top-0 z-50 bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 px-6 text-center text-sm font-medium shadow-lg">
              Mode aperçu — Cliquez sur "Éditer" pour modifier la page
            </div>
          )}

          <div className={`min-h-screen bg-white font-sans ${previewMode ? 'max-w-5xl mx-auto shadow-2xl my-8 rounded-2xl overflow-hidden' : ''}`}>
            
            {/* Editable Overlay */}
            {!previewMode && (
              <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 p-3 space-y-2">
                  <p className="text-xs text-zinc-500 font-medium px-2">Actions rapides</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <span>📷</span>
                    </div>
                    Ajouter photo
                  </button>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span>🎨</span>
                    </div>
                    Changer logo
                  </button>
                </div>
              </div>
            )}

            {/* Top Bar */}
            <div className="bg-zinc-900 text-white py-2 text-center text-sm">
              Livraison gratuite en Algérie • Paiement à la livraison
            </div>

            {/* Header Section */}
            {content.showHeader !== false && (
              <section 
                id="section-header"
                className={`bg-white border-b border-zinc-100 sticky top-0 z-40 shadow-sm transition-all ${
                  !previewMode && activeSection === 'header' ? 'ring-2 ring-rose-500 ring-inset' : ''
                }`}
                onMouseEnter={() => !previewMode && setActiveSection('header')}
                onDoubleClick={() => !previewMode && setEditingField('brandName')}
              >
                <div className="max-w-7xl mx-auto px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => !previewMode && logoInputRef.current?.click()}
                        className={`relative group cursor-pointer ${previewMode ? '' : 'hover:ring-2 hover:ring-rose-300 hover:ring-offset-2 rounded-full transition-all'}`}
                      >
                        {content.logo ? (
                          <img src={content.logo} alt={content.brandName} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-md">
                            <span className="text-white text-xl font-bold">B</span>
                          </div>
                        )}
                        {!previewMode && (
                          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs">Changer</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="relative">
                        {editingField === 'brandName' ? (
                          <input
                            autoFocus
                            value={content.brandName}
                            onChange={(e) => setContent({...content, brandName: e.target.value})}
                            onBlur={() => setEditingField(null)}
                            className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent border-b-2 border-rose-500 outline-none bg-transparent"
                          />
                        ) : (
                          <span 
                            onDoubleClick={() => !previewMode && setEditingField('brandName')}
                            className={`text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent cursor-pointer ${
                              !previewMode && activeSection === 'header' ? 'ring-2 ring-rose-200 rounded' : ''
                            }`}
                          >
                            {content.brandName}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <nav className="hidden lg:flex items-center gap-8">
                      <span className="text-sm font-medium text-zinc-600">Collection</span>
                      <span className="text-sm font-medium text-zinc-600">Bienfaits</span>
                      <span className="text-sm font-medium text-zinc-600">Avis</span>
                      <span className="text-sm font-medium text-zinc-600">Contact</span>
                    </nav>
                    
                    {content.showCTA !== false && (
                      <button 
                        onClick={() => !previewMode && setEditingField('ctaButton')}
                        className="hidden lg:inline-flex px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                      >
                        {content.ctaButton}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Hero Section */}
            <section 
              id="section-hero"
              className={`${content.heroBgColor || 'bg-gradient-to-br from-rose-50 to-amber-50'} py-24 lg:py-32 relative overflow-hidden transition-all ${
                !previewMode && activeSection === 'hero' ? 'ring-2 ring-rose-500 ring-inset' : ''
              }`}
              onMouseEnter={() => !previewMode && setActiveSection('hero')}
            >
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-rose-100">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium text-zinc-700">Nouveau • Collection Printemps 2026</span>
                    </div>
                    
                    {/* Hero Title */}
                    <div 
                      onDoubleClick={() => !previewMode && setEditingField('heroTitle')}
                      className="relative cursor-pointer"
                    >
                      {editingField === 'heroTitle' ? (
                        <input
                          autoFocus
                          value={content.heroTitle}
                          onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                          onBlur={() => setEditingField(null)}
                          className={`${content.heroTextSize || 'text-6xl'} font-bold ${content.heroTextColor || 'text-zinc-900'} leading-tight w-full outline-none border-b-2 border-rose-500 bg-transparent`}
                        />
                      ) : (
                        <h1 className={`${content.heroTextSize || 'text-6xl'} font-bold ${content.heroTextColor || 'text-zinc-900'} leading-tight ${
                          !previewMode && activeSection === 'hero' ? 'ring-2 ring-rose-200 rounded-2xl bg-white/50 px-4 py-2' : ''
                        } transition-all`}>
                          {content.heroTitle}
                        </h1>
                      )}
                    </div>
                    
                    {/* Hero Subtitle */}
                    {content.heroSubtitle && (
                      <div 
                        onDoubleClick={() => !previewMode && setEditingField('heroSubtitle')}
                        className="relative cursor-pointer"
                      >
                        {editingField === 'heroSubtitle' ? (
                          <textarea
                            autoFocus
                            value={content.heroSubtitle}
                            onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
                            onBlur={() => setEditingField(null)}
                            rows={3}
                            className={`${content.heroSubtitleSize || 'text-xl'} text-zinc-600 leading-relaxed w-full outline-none border-b-2 border-rose-500 bg-transparent resize-none`}
                          />
                        ) : (
                          <p className={`${content.heroSubtitleSize || 'text-xl'} text-zinc-600 leading-relaxed max-w-lg ${
                            !previewMode && activeSection === 'hero' ? 'ring-2 ring-rose-200 rounded-xl bg-white/50 px-4 py-2' : ''
                          } transition-all`}>
                            {content.heroSubtitle}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {content.showCTA !== false && (
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div 
                          onDoubleClick={() => !previewMode && setEditingField('ctaButton')}
                          className="relative cursor-pointer"
                        >
                          {editingField === 'ctaButton' ? (
                            <input
                              autoFocus
                              value={content.ctaButton}
                              onChange={(e) => setContent({...content, ctaButton: e.target.value})}
                              onBlur={() => setEditingField(null)}
                              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-full shadow-lg outline-none border-b-2 border-rose-600"
                            />
                          ) : (
                            <button className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all ${
                              !previewMode && activeSection === 'hero' ? 'ring-4 ring-rose-200' : ''
                            }`}>
                              {content.ctaButton}
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </button>
                          )}
                        </div>
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
                          onClick={() => !previewMode && fileInputRef.current?.click()}
                          className={`bg-gradient-to-br from-rose-100 to-orange-100 rounded-[2rem] p-16 shadow-2xl flex flex-col items-center justify-center aspect-square ${
                            !previewMode ? 'cursor-pointer hover:from-rose-200 hover:to-orange-200 transition-colors' : ''
                          }`}
                        >
                          <span className="text-[10rem]">🌸</span>
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

            {/* Product Section */}
            {content.showProduct !== false && currentProduct && (
              <section 
                id="section-product"
                className={`py-24 ${content.sectionBg || 'bg-white'} transition-all ${
                  !previewMode && activeSection === 'product' ? 'ring-2 ring-rose-500 ring-inset' : ''
                }`}
                onMouseEnter={() => !previewMode && setActiveSection('product')}
              >
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-semibold rounded-full mb-4">Notre Sélection</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4">Collection Exclusive</h2>
                    
                    {/* Product Name */}
                    <div 
                      onDoubleClick={() => !previewMode && setEditingField('product_name')}
                      className="relative inline-block cursor-pointer"
                    >
                      {editingField === 'product_name' ? (
                        <input
                          autoFocus
                          value={currentProduct.name}
                          onChange={(e) => updateProduct(currentProduct.id, 'name', e.target.value)}
                          onBlur={() => setEditingField(null)}
                          className={`${content.productNameSize || 'text-3xl'} font-bold text-zinc-900 mb-4 outline-none border-b-2 border-rose-500 bg-transparent text-center`}
                        />
                      ) : (
                        <h2 className={`${content.productNameSize || 'text-3xl'} font-bold text-zinc-900 mb-4 ${
                          !previewMode && activeSection === 'product' ? 'ring-2 ring-rose-200 rounded-2xl bg-rose-50 px-4 py-2' : ''
                        } transition-all`}>
                          {currentProduct.name}
                        </h2>
                      )}
                    </div>
                    
                    {/* Product Description */}
                    {currentProduct.description && (
                      <div 
                        onDoubleClick={() => !previewMode && setEditingField('product_description')}
                        className="relative inline-block cursor-pointer"
                      >
                        {editingField === 'product_description' ? (
                          <input
                            autoFocus
                            value={currentProduct.description}
                            onChange={(e) => updateProduct(currentProduct.id, 'description', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            className="text-lg text-zinc-600 max-w-2xl mx-auto outline-none border-b-2 border-rose-500 bg-transparent"
                          />
                        ) : (
                          <p className={`text-lg text-zinc-600 max-w-2xl mx-auto ${
                            !previewMode && activeSection === 'product' ? 'ring-2 ring-orange-200 rounded-xl bg-orange-50 px-4 py-2' : ''
                          } transition-all`}>
                            {currentProduct.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-6 shadow-lg border border-zinc-100">
                        <div 
                          onClick={() => !previewMode && fileInputRef.current?.click()}
                          className={`relative group cursor-pointer`}
                        >
                          {productPhotos.length > 0 ? (
                            <img 
                              src={productPhotos[currentProduct.mainPhoto || 0]} 
                              alt={currentProduct.name}
                              className="w-full rounded-2xl aspect-square object-cover" 
                            />
                          ) : (
                            <div className={`aspect-square bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl flex flex-col items-center justify-center ${
                              !previewMode ? 'group-hover:from-rose-200 group-hover:to-orange-200 transition-colors' : ''
                            }`}>
                              <span className="text-8xl">✨</span>
                              <span className="text-zinc-500 mt-4">Cliquez pour ajouter des photos</span>
                              <span className="text-xs text-zinc-400 mt-1">(Plusieurs photos)</span>
                            </div>
                          )}
                          {!previewMode && (
                            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="text-center text-white">
                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="font-medium">Ajouter des photos</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Photo Gallery */}
                      {productPhotos.length > 0 && (
                        <div className="bg-white rounded-2xl p-4 shadow-lg border border-zinc-100">
                          <p className="text-sm font-medium text-zinc-500 mb-3">Photos ({productPhotos.length}/9)</p>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {productPhotos.map((photo, index) => (
                              <div 
                                key={index} 
                                className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                  currentProduct.mainPhoto === index 
                                    ? 'border-rose-500 ring-2 ring-rose-200' 
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                                onClick={() => updateProduct(currentProduct.id, 'mainPhoto', index)}
                              >
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                {!previewMode && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removePhoto(index);
                                    }}
                                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-bl flex items-center justify-center"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                            {!previewMode && productPhotos.length < 9 && (
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 hover:border-rose-400 hover:text-rose-500 transition-colors"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {/* Price */}
                      <div>
                        <div 
                          onDoubleClick={() => !previewMode && setEditingField('product_price')}
                          className="relative inline-block cursor-pointer"
                        >
                          {editingField === 'product_price' ? (
                            <input
                              autoFocus
                              value={currentProduct.price}
                              onChange={(e) => updateProduct(currentProduct.id, 'price', e.target.value)}
                              onBlur={() => setEditingField(null)}
                              className={`${content.productPriceSize || 'text-4xl'} font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent outline-none border-b-2 border-rose-500 bg-transparent`}
                            />
                          ) : (
                            <p className={`${content.productPriceSize || 'text-4xl'} font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent ${
                              !previewMode && activeSection === 'product' ? 'ring-2 ring-green-200 rounded-xl bg-green-50 px-4 py-2' : ''
                            } transition-all`}>
                              {currentProduct.price} DA
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 mt-1">TVA incluse • Livraison gratuite +2000 DA</p>
                      </div>

                      {content.showCTA !== false && (
                        <button className="w-full py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg">
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
              <section 
                id="section-biography"
                className={`py-24 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 transition-all ${
                  !previewMode && activeSection === 'biography' ? 'ring-2 ring-rose-500 ring-inset' : ''
                }`}
                onMouseEnter={() => !previewMode && setActiveSection('biography')}
              >
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-white text-rose-700 text-sm font-semibold rounded-full mb-4 shadow-sm">Ce qui nous différencie</span>
                    <h2 className="text-4xl font-bold text-zinc-900 mb-4">Pourquoi choisir nos produits ?</h2>
                  </div>
                  
                  <div 
                    onDoubleClick={() => !previewMode && setEditingField('product_biography')}
                    className="relative cursor-pointer"
                  >
                    <div className={`bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-zinc-100 max-w-4xl mx-auto ${
                      !previewMode && activeSection === 'biography' ? 'ring-4 ring-blue-200' : ''
                    } transition-all`}>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-6 text-center">À propos de ce produit</h3>
                      {editingField === 'product_biography' ? (
                        <textarea
                          autoFocus
                          value={currentProduct.biography}
                          onChange={(e) => updateProduct(currentProduct.id, 'biography', e.target.value)}
                          onBlur={() => setEditingField(null)}
                          rows={8}
                          className={`${content.textColor || 'text-zinc-700'} leading-relaxed text-lg whitespace-pre-wrap w-full outline-none border-2 border-rose-200 rounded-xl p-4 bg-zinc-50`}
                        />
                      ) : (
                        <p className={`${content.textColor || 'text-zinc-700'} leading-relaxed text-lg whitespace-pre-wrap ${
                          !previewMode && activeSection === 'biography' ? 'ring-2 ring-blue-100 rounded-2xl bg-blue-50 px-6 py-4' : ''
                        } transition-all`}>
                          {currentProduct.biography}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section */}
            <section 
              id="section-contact"
              className={`py-20 bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white transition-all ${
                !previewMode && activeSection === 'contact' ? 'ring-2 ring-white ring-inset' : ''
              }`}
              onMouseEnter={() => !previewMode && setActiveSection('contact')}
            >
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Besoin d&apos;aide ?</h2>
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
                  <p className="text-white/80 mb-4">Contactez-nous par email</p>
                  <div 
                    onDoubleClick={() => !previewMode && setEditingField('contactEmail')}
                    className="relative inline-block cursor-pointer"
                  >
                    {editingField === 'contactEmail' ? (
                      <input
                        autoFocus
                        value={content.contactEmail}
                        onChange={(e) => setContent({...content, contactEmail: e.target.value})}
                        onBlur={() => setEditingField(null)}
                        className="text-2xl md:text-3xl font-bold text-white outline-none border-b-2 border-white bg-transparent text-center"
                      />
                    ) : (
                      <span className={`text-2xl md:text-3xl font-bold ${
                        !previewMode && activeSection === 'contact' ? 'ring-2 ring-white/50 rounded-xl bg-white/10 px-4 py-2' : ''
                      } transition-all`}>
                        {content.contactEmail}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            {content.showFooter !== false && (
              <footer 
                id="section-footer"
                className={`py-12 bg-zinc-900 text-white transition-all ${
                  !previewMode && activeSection === 'footer' ? 'ring-2 ring-rose-500 ring-inset' : ''
                }`}
                onMouseEnter={() => !previewMode && setActiveSection('footer')}
              >
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
                    
                    <div 
                      onDoubleClick={() => !previewMode && setEditingField('footerText')}
                      className="relative cursor-pointer"
                    >
                      {editingField === 'footerText' ? (
                        <textarea
                          autoFocus
                          value={content.footerText}
                          onChange={(e) => setContent({...content, footerText: e.target.value})}
                          onBlur={() => setEditingField(null)}
                          rows={2}
                          className="text-zinc-400 text-sm bg-transparent outline-none border-2 border-zinc-600 rounded-lg p-2 resize-none max-w-md"
                        />
                      ) : (
                        <p className={`text-zinc-400 text-sm ${
                          !previewMode && activeSection === 'footer' ? 'ring-2 ring-zinc-600 rounded-lg bg-zinc-800 px-3 py-2' : ''
                        } transition-all`}>
                          {content.footerText}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-zinc-500 text-sm">© 2026 {content.brandName}</p>
                  </div>
                </div>
              </footer>
            )}
          </div>
        </main>

        {/* Right Panel - Section Editor */}
        {!previewMode && (
          <aside className="w-80 bg-white border-l border-zinc-200 flex flex-col overflow-hidden flex-shrink-0">
            <div className="p-4 border-b border-zinc-200 bg-gradient-to-r from-rose-500 to-orange-500">
              <h3 className="font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Modifier: {sections.find(s => s.id === activeSection)?.label}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Section Visibility Toggle */}
              <div className="bg-zinc-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700">Visible</span>
                  <button
                    onClick={() => {
                      const visibilityMap: Record<Section, string> = {
                        header: 'showHeader',
                        hero: 'showHeader',
                        product: 'showProduct',
                        biography: 'showBiography',
                        contact: 'contactSection',
                        footer: 'showFooter'
                      };
                      const key = visibilityMap[activeSection];
                      if (key) {
                        setContent({...content, [key]: !content[key]});
                      }
                    }}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      (activeSection === 'header' || activeSection === 'hero') ? (content.showHeader ? 'bg-green-500' : 'bg-zinc-300') :
                      activeSection === 'product' ? (content.showProduct ? 'bg-green-500' : 'bg-zinc-300') :
                      activeSection === 'biography' ? (content.showBiography ? 'bg-green-500' : 'bg-zinc-300') :
                      activeSection === 'footer' ? (content.showFooter ? 'bg-green-500' : 'bg-zinc-300') :
                      'bg-green-500'
                    }`}
                  >
                    <span className={`block w-6 h-6 bg-white rounded-full shadow transition-transform absolute top-0.5 ${
                      (activeSection === 'header' || activeSection === 'hero') ? (content.showHeader ? 'translate-x-5' : 'translate-x-0.5') :
                      activeSection === 'product' ? (content.showProduct ? 'translate-x-5' : 'translate-x-0.5') :
                      activeSection === 'biography' ? (content.showBiography ? 'translate-x-5' : 'translate-x-0.5') :
                      activeSection === 'footer' ? (content.showFooter ? 'translate-x-5' : 'translate-x-0.5') :
                      'translate-x-5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Section-specific controls */}
              {activeSection === 'header' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Nom de la marque</label>
                    <input
                      type="text"
                      value={content.brandName}
                      onChange={(e) => setContent({...content, brandName: e.target.value})}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Bouton CTA</label>
                    <input
                      type="text"
                      value={content.ctaButton}
                      onChange={(e) => setContent({...content, ctaButton: e.target.value})}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Titre principal</label>
                    <input
                      type="text"
                      value={content.heroTitle}
                      onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Sous-titre</label>
                    <textarea
                      value={content.heroSubtitle}
                      onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Taille du titre</label>
                    <select
                      value={content.heroTextSize}
                      onChange={(e) => setContent({...content, heroTextSize: e.target.value})}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    >
                      <option value="text-4xl">Grand (4XL)</option>
                      <option value="text-5xl">Très grand (5XL)</option>
                      <option value="text-6xl">Enorme (6XL)</option>
                      <option value="text-7xl">Massif (7XL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Couleur du fond</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: "bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50", color: "from-rose-200 to-amber-200" },
                        { value: "bg-gradient-to-br from-orange-50 to-amber-50", color: "from-orange-200 to-amber-200" },
                        { value: "bg-gradient-to-br from-rose-100 to-orange-100", color: "from-rose-300 to-orange-200" },
                        { value: "bg-gradient-to-br from-purple-50 to-pink-50", color: "from-purple-200 to-pink-200" },
                        { value: "bg-gradient-to-br from-blue-50 to-indigo-50", color: "from-blue-200 to-indigo-200" },
                        { value: "bg-gradient-to-br from-green-50 to-emerald-50", color: "from-green-200 to-emerald-200" },
                        { value: "bg-white", color: "bg-white" },
                        { value: "bg-zinc-100", color: "bg-zinc-300" },
                      ].map((bg) => (
                        <button
                          key={bg.value}
                          onClick={() => setContent({...content, heroBgColor: bg.value})}
                          className={`w-full aspect-square rounded-lg bg-gradient-to-br ${bg.color} border-2 transition-all ${
                            content.heroBgColor === bg.value ? 'border-rose-500 ring-2 ring-rose-200' : 'border-transparent hover:border-zinc-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'product' && currentProduct && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Nom du produit</label>
                    <input
                      type="text"
                      value={currentProduct.name}
                      onChange={(e) => updateProduct(currentProduct.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Prix (DA)</label>
                    <input
                      type="text"
                      value={currentProduct.price}
                      onChange={(e) => updateProduct(currentProduct.id, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Description courte</label>
                    <input
                      type="text"
                      value={currentProduct.description}
                      onChange={(e) => updateProduct(currentProduct.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'biography' && currentProduct && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Description détaillée</label>
                    <textarea
                      value={currentProduct.biography}
                      onChange={(e) => updateProduct(currentProduct.id, 'biography', e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm resize-none"
                      placeholder="Décrivez votre produit..."
                    />
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Email de contact</label>
                    <input
                      type="email"
                      value={content.contactEmail}
                      onChange={(e) => setContent({...content, contactEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'footer' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Texte du pied de page</label>
                    <textarea
                      value={content.footerText}
                      onChange={(e) => setContent({...content, footerText: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />
    </div>
  );
}
