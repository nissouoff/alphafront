"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getLanding, updateLanding, publishLanding, unpublishLanding, Product } from "@/lib/api";

interface VibeContent {
  logo: string;
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  reviewsTitle: string;
  review1Text: string;
  review2Text: string;
  review3Text: string;
  offerTitle: string;
  offerSubtitle: string;
  faq1Question: string;
  faq1Answer: string;
  faq2Question: string;
  faq2Answer: string;
  faq3Question: string;
  faq3Answer: string;
  footerText: string;
  showFeatures: boolean;
  showReviews: boolean;
  showOffer: boolean;
  showFaq: boolean;
  showTrustBar: boolean;
  trustBarText: string;
}

const DEFAULT_CONTENT: VibeContent = {
  logo: '',
  brandName: 'Vibe',
  heroTitle: 'Boost ton quotidien avec un produit unique 🚀',
  heroSubtitle: 'Une solution moderne, rapide et efficace conçue pour des résultats visibles immédiatement.',
  ctaButton: 'Acheter maintenant',
  feature1Title: 'Rapide',
  feature1Desc: 'Résultats visibles immédiatement',
  feature2Title: 'Simple',
  feature2Desc: 'Utilisable par tout le monde',
  feature3Title: 'Puissant',
  feature3Desc: 'Performance haut niveau',
  featuresSectionTitle: 'Pourquoi choisir ce produit ?',
  featuresSectionSubtitle: 'Pensé pour la performance maximale',
  reviewsTitle: 'Avis clients',
  review1Text: '"Incroyable, je recommande à 100%."',
  review2Text: '"Produit de qualité supérieure."',
  review3Text: '"Le meilleur achat que j\'ai fait."',
  offerTitle: 'Offre limitée 🔥',
  offerSubtitle: 'Ne rate pas cette opportunité',
  faq1Question: 'Livraison ?',
  faq1Answer: 'Livraison rapide sous 24-48h partout en Algérie.',
  faq2Question: 'Garantie ?',
  faq2Answer: 'Garantie satisfait ou remboursé sous 30 jours.',
  faq3Question: 'Utilisation ?',
  faq3Answer: 'Simple et intuitif, adapté à tous les niveaux.',
  footerText: '© 2026 - Tous droits réservés',
  showFeatures: true,
  showReviews: true,
  showOffer: true,
  showFaq: true,
  showTrustBar: true,
  trustBarText: '+10 000 clients satisfaits • Livraison rapide • Support 24/7',
};

export default function VibeEditorPage() {
  const searchParams = useSearchParams();
  const landingId = searchParams.get('id');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'product' | 'faq' | 'settings' | 'preview'>('content');
  const [isPublished, setIsPublished] = useState(false);

  const [content, setContent] = useState<VibeContent>(DEFAULT_CONTENT);
  const [product, setProduct] = useState<Product>({
    id: '',
    name: 'Produit Premium',
    price: '3500',
    description: 'Une solution moderne et efficace.',
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
    if (landingId) {
      localStorage.setItem('isVibeEditMode', 'true');
    }
    return () => {
      localStorage.removeItem('isVibeEditMode');
    };
  }, [landingId]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'selectField') {
        const field = event.data.field;
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!landingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Landing non trouvée</h1>
          <Link href="/templates-landing" className="text-orange-500 underline">
            Retour aux templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors p-2 -ml-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="font-bold text-white text-lg">V</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold">{content.brandName}</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Éditeur Vibe</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => window.open(`/template/vibe?id=${landingId}`, '_blank')}
              className="p-2 sm:px-3 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1 sm:gap-2"
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
              className="p-2 sm:px-3 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50"
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
              <button onClick={handlePublish} disabled={publishing} className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center gap-1 sm:gap-2 text-sm">
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
      <div className="bg-gray-900 border-b border-gray-800 overflow-x-auto">
        <div className="px-2 sm:px-4 md:px-6">
          <div className="flex gap-1 sm:gap-4 md:gap-8 min-w-max">
            {[
              { id: 'content', label: 'Contenu', icon: '🎨' },
              { id: 'product', label: 'Produit', icon: '🛍️' },
              { id: 'faq', label: 'FAQ', icon: '❓' },
              { id: 'settings', label: 'Paramètres', icon: '⚙️' },
              { id: 'preview', label: 'Aperçu', icon: '👁️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id ? 'border-orange-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
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
          <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl">
            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Titre principal</label>
                  <input type="text" value={content.heroTitle} onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sous-titre</label>
                  <textarea value={content.heroSubtitle} onChange={(e) => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))} rows={2} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Texte du bouton</label>
                  <input type="text" value={content.ctaButton} onChange={(e) => setContent(prev => ({ ...prev, ctaButton: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Features (Liste)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feature 1 - Titre</label>
                  <input type="text" value={content.feature1Title} onChange={(e) => setContent(prev => ({ ...prev, feature1Title: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feature 2 - Titre</label>
                  <input type="text" value={content.feature2Title} onChange={(e) => setContent(prev => ({ ...prev, feature2Title: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feature 3 - Titre</label>
                  <input type="text" value={content.feature3Title} onChange={(e) => setContent(prev => ({ ...prev, feature3Title: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Avis Clients</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Avis 1</label>
                  <input type="text" value={content.review1Text} onChange={(e) => setContent(prev => ({ ...prev, review1Text: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Avis 2</label>
                  <input type="text" value={content.review2Text} onChange={(e) => setContent(prev => ({ ...prev, review2Text: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Avis 3</label>
                  <input type="text" value={content.review3Text} onChange={(e) => setContent(prev => ({ ...prev, review3Text: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Tab */}
        {activeTab === 'product' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl">
            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Informations du produit</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nom du produit</label>
                    <input type="text" value={product.name} onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Prix (DA)</label>
                    <input type="text" value={product.price} onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea value={product.description} onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Photos du produit</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
                {product.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img src={photo} alt={`Photo ${index + 1}`} className={`w-full aspect-square object-cover rounded-lg sm:rounded-xl ${product.mainPhoto === index ? 'ring-2 ring-orange-500' : ''}`} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-lg sm:rounded-xl">
                      <button onClick={() => setProduct(prev => ({ ...prev, mainPhoto: index }))} className="px-2 py-1 bg-white text-black text-xs rounded-lg">Principal</button>
                      <button onClick={() => handleRemovePhoto(index)} className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg">Supprimer</button>
                    </div>
                    {product.mainPhoto === index && <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] sm:text-xs rounded-lg sm:rounded-md">Principal</span>}
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-700 rounded-lg sm:rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Ajouter</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'photo')} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl">
            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Section Features</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Titre de la section</label>
                  <input type="text" value={content.featuresSectionTitle} onChange={(e) => setContent(prev => ({ ...prev, featuresSectionTitle: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sous-titre</label>
                  <input type="text" value={content.featuresSectionSubtitle} onChange={(e) => setContent(prev => ({ ...prev, featuresSectionSubtitle: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feature 1 - Description</label>
                  <input type="text" value={content.feature1Desc} onChange={(e) => setContent(prev => ({ ...prev, feature1Desc: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feature 2 - Description</label>
                  <input type="text" value={content.feature2Desc} onChange={(e) => setContent(prev => ({ ...prev, feature2Desc: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feature 3 - Description</label>
                  <input type="text" value={content.feature3Desc} onChange={(e) => setContent(prev => ({ ...prev, feature3Desc: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">FAQ</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Question 1</label>
                  <input type="text" value={content.faq1Question} onChange={(e) => setContent(prev => ({ ...prev, faq1Question: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Réponse 1</label>
                  <input type="text" value={content.faq1Answer} onChange={(e) => setContent(prev => ({ ...prev, faq1Answer: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Question 2</label>
                  <input type="text" value={content.faq2Question} onChange={(e) => setContent(prev => ({ ...prev, faq2Question: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Réponse 2</label>
                  <input type="text" value={content.faq2Answer} onChange={(e) => setContent(prev => ({ ...prev, faq2Answer: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Question 3</label>
                  <input type="text" value={content.faq3Question} onChange={(e) => setContent(prev => ({ ...prev, faq3Question: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Réponse 3</label>
                  <input type="text" value={content.faq3Answer} onChange={(e) => setContent(prev => ({ ...prev, faq3Answer: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl">
            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Options d&apos;affichage</h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showTrustBar !== false} onChange={(e) => setContent(prev => ({ ...prev, showTrustBar: e.target.checked }))} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Afficher la barre de confiance</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showFeatures !== false} onChange={(e) => setContent(prev => ({ ...prev, showFeatures: e.target.checked }))} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Afficher les features</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showReviews !== false} onChange={(e) => setContent(prev => ({ ...prev, showReviews: e.target.checked }))} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Afficher les avis clients</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showOffer !== false} onChange={(e) => setContent(prev => ({ ...prev, showOffer: e.target.checked }))} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Afficher l&apos;offre</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={content.showFaq !== false} onChange={(e) => setContent(prev => ({ ...prev, showFaq: e.target.checked }))} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Afficher la FAQ</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Section Offre</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Titre de l&apos;offre</label>
                  <input type="text" value={content.offerTitle} onChange={(e) => setContent(prev => ({ ...prev, offerTitle: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sous-titre de l&apos;offre</label>
                  <input type="text" value={content.offerSubtitle} onChange={(e) => setContent(prev => ({ ...prev, offerSubtitle: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Footer</h2>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Texte du footer</label>
                <input type="text" value={content.footerText} onChange={(e) => setContent(prev => ({ ...prev, footerText: e.target.value }))} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="h-[calc(100vh-160px)] bg-black rounded-xl overflow-hidden border border-gray-800 relative">
            <iframe
              ref={iframeRef}
              src={`/template/vibe?id=${landingId}&editMode=true`}
              className="w-full h-full border-0"
              title="Preview"
            />
            <div className="absolute bottom-4 left-4 px-3 py-2 bg-orange-500/90 text-white text-sm rounded-lg">
              Prévisualisation du template Vibe
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
