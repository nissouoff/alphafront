"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getLanding, updateLanding, publishLanding, unpublishLanding, Product } from "@/lib/api";

interface LandingContent {
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
  satisfactionRate?: string;
  clientsCount?: string;
  showGuarantee: boolean;
  guaranteeText?: string;
}

const DEFAULT_CONTENT: LandingContent = {
  logo: '',
  brandName: 'Ma Marque',
  heroTitle: 'Votre beauté commence ici',
  heroSubtitle: 'Découvrez notre collection exclusive de soins cosmétiques naturels.',
  ctaButton: 'Commander maintenant',
  contactEmail: 'contact@exemple.com',
  contactWhatsapp: '',
  contactInstagram: '',
  contactFacebook: '',
  footerText: 'Des soins naturels pour une peau radieuse.',
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
};

export default function LandingEditorPage() {
  const searchParams = useSearchParams();
  const landingId = searchParams.get('id');
  const template = searchParams.get('template') || 'cosmetic';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'product' | 'contact'>('content');
  const [isPublished, setIsPublished] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-50">
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
                <span className="hidden sm:inline px-2 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-medium">
                  Publiée
                </span>
                <span className="sm:hidden w-2 h-2 bg-green-500 rounded-full"></span>
                <button
                  onClick={handleUnpublish}
                  disabled={publishing}
                  className="px-2 sm:px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm"
                >
                  Dépub
                </button>
              </div>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-1 sm:gap-2 text-sm"
              >
                {publishing ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
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
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
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
      <main className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Identité de la marque</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    {content.logo ? (
                      <div className="relative">
                        <img src={content.logo} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" />
                        <button
                          onClick={() => setContent(prev => ({ ...prev, logo: '' }))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        >
                          ×
                        </button>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nom de la marque</label>
                    <input
                      type="text"
                      value={content.brandName}
                      onChange={(e) => setContent(prev => ({ ...prev, brandName: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email de contact</label>
                    <input
                      type="email"
                      value={content.contactEmail}
                      onChange={(e) => setContent(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Section Héro</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Titre principal</label>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Sous-titre</label>
                  <textarea
                    value={content.heroSubtitle}
                    onChange={(e) => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Bouton CTA</label>
                  <input
                    type="text"
                    value={content.ctaButton}
                    onChange={(e) => setContent(prev => ({ ...prev, ctaButton: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>

                <div className="border-t border-zinc-700 pt-4 sm:pt-6 space-y-4">
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.showStats !== false}
                        onChange={(e) => setContent(prev => ({ ...prev, showStats: e.target.checked }))}
                        className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-rose-500 focus:ring-rose-500 mt-0.5"
                      />
                      <div>
                        <span className="text-white font-medium">Afficher les statistiques</span>
                        <p className="text-xs text-zinc-500 mt-1">Basé sur les avis clients et commandes</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.showReviews !== false}
                        onChange={(e) => setContent(prev => ({ ...prev, showReviews: e.target.checked }))}
                        className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-rose-500 focus:ring-rose-500 mt-0.5"
                      />
                      <span className="text-white font-medium">Afficher les commentaires clients</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.showGuarantee || false}
                        onChange={(e) => setContent(prev => ({ ...prev, showGuarantee: e.target.checked }))}
                        className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-green-500 focus:ring-green-500 mt-0.5"
                      />
                      <span className="text-white font-medium">Afficher la garantie</span>
                    </label>
                  </div>

                  {content.showGuarantee && (
                    <div className="ml-8 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Texte de la garantie</label>
                      <input
                        type="text"
                        value={content.guaranteeText || 'Garantie 30 jours'}
                        onChange={(e) => setContent(prev => ({ ...prev, guaranteeText: e.target.value }))}
                        placeholder="Ex: Garantie 30 jours"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-green-500 focus:outline-none text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Pied de page</h2>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Texte du footer</label>
                <textarea
                  value={content.footerText}
                  onChange={(e) => setContent(prev => ({ ...prev, footerText: e.target.value }))}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none text-sm sm:text-base"
                />
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
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Prix (DA)</label>
                    <input
                      type="text"
                      value={product.price}
                      onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4 sm:pt-6">
                  <label className="flex items-start gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={product.isOnSale || false}
                      onChange={(e) => setProduct(prev => ({ 
                        ...prev, 
                        isOnSale: e.target.checked,
                        oldPrice: e.target.checked && !prev.oldPrice ? prev.price : prev.oldPrice
                      }))}
                      className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-red-500 focus:ring-red-500 mt-0.5"
                    />
                    <span className="text-white font-medium">Produit en solde</span>
                  </label>

                  {product.isOnSale && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-2">Ancien prix (DA)</label>
                          <input
                            type="text"
                            value={product.oldPrice || ''}
                            onChange={(e) => setProduct(prev => ({ ...prev, oldPrice: e.target.value }))}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-red-500 focus:outline-none text-sm sm:text-base"
                            placeholder="Ex: 5000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-2">Réduction</label>
                          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-red-400 font-bold text-base sm:text-lg">
                            {product.oldPrice && product.price ? 
                              `-${Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice)) * 100)}%` 
                              : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                  <textarea
                    value={product.description}
                    onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Biographie / Détails</label>
                  <textarea
                    value={product.biography}
                    onChange={(e) => setProduct(prev => ({ ...prev, biography: e.target.value }))}
                    rows={5}
                    placeholder="Avantages, ingrédients, mode d'emploi..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Photos du produit</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
                  {product.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className={`w-full aspect-square object-cover rounded-lg sm:rounded-xl ${
                          product.mainPhoto === index ? 'ring-2 ring-purple-500' : ''
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-lg sm:rounded-xl">
                        <button
                          onClick={() => setProduct(prev => ({ ...prev, mainPhoto: index }))}
                          className="px-2 py-1 bg-white text-black text-xs rounded-lg"
                        >
                          Principal
                        </button>
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg"
                        >
                          Supprimer
                        </button>
                      </div>
                      {product.mainPhoto === index && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] sm:text-xs rounded-lg sm:rounded-md">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                  
                  <label className="aspect-square border-2 border-dashed border-zinc-600 rounded-lg sm:rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs sm:text-sm text-zinc-500 mt-1 sm:mt-2">Ajouter</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'photo')}
                    />
                  </label>
                </div>
                
                {product.photos.length === 0 && (
                  <p className="text-zinc-500 text-sm text-center py-6 sm:py-8">
                    Ajoutez au moins une photo du produit
                  </p>
                )}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Stock</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.unlimitedStock}
                    onChange={(e) => setProduct(prev => ({ ...prev, unlimitedStock: e.target.checked }))}
                    className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-zinc-300">Stock illimité</span>
                </label>
                
                {!product.unlimitedStock && (
                  <div className="w-full sm:w-32">
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => setProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                )}
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={content.contactWhatsapp}
                      onChange={(e) => setContent(prev => ({ ...prev, contactWhatsapp: e.target.value }))}
                      placeholder="+213 555 123 456"
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Instagram</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={content.contactInstagram}
                      onChange={(e) => setContent(prev => ({ ...prev, contactInstagram: e.target.value }))}
                      placeholder="@votre_compte"
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Facebook</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={content.contactFacebook}
                      onChange={(e) => setContent(prev => ({ ...prev, contactFacebook: e.target.value }))}
                      placeholder="https://facebook.com/..."
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={content.contactEmail}
                      onChange={(e) => setContent(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@votresite.com"
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
