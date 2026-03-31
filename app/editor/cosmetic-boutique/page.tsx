"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { uploadImage, getLanding, updateLanding, publishLanding, unpublishLanding } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  biography: string;
  photos: string[];
  mainPhoto: number;
  stock: number;
  unlimitedStock: boolean;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function CosmeticBoutiqueEditor() {
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const landingId = searchParams.get('id');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [landing, setLanding] = useState<any>(null);
  const [loadingLanding, setLoadingLanding] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isLanding, setIsLanding] = useState(false);

  const [categories, setCategories] = useState<Category[]>([
    { id: "cat_skincare", name: "Soins Visage", icon: "✨" },
    { id: "cat_makeup", name: "Maquillage", icon: "💄" },
    { id: "cat_perfume", name: "Parfums", icon: "🌸" },
    { id: "cat_body", name: "Soins Corps", icon: "🧴" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [content, setContent] = useState<Record<string, any>>({
    brandName: "GlowBeauty",
    logo: "",
    heroTitle: "Revealez your natural beauty",
    heroSubtitle: "Des produits cosmétiques naturels et biologiques pour prendre soin de votre peau.",
    ctaButton: "Découvrir la collection",
    contactEmail: "contact@glowbeauty.com",
    footerText: "Votre beauté naturelle, notre passion.",
    aboutTitle: "Notre Histoire",
    aboutText: "Nous créons des produits cosmétiques naturels depuis 2020.",
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: "product_1",
      name: "Sérum Vitamine C",
      price: "39€",
      description: "Éclat et luminosité",
      biography: "Notre sérum Vitamine C est formulé avec 15% de vitamine C pure pour révéler l'éclat naturel de votre peau.",
      photos: [],
      mainPhoto: 0,
      stock: 100,
      unlimitedStock: true,
      category: "cat_skincare",
    },
    {
      id: "product_2",
      name: "Rouge à Lèvres Mat",
      price: "25€",
      description: "Couleur intense",
      biography: "Un rouge à lèvres mat longue tenue enrichi en vitamine E.",
      photos: [],
      mainPhoto: 0,
      stock: 50,
      unlimitedStock: false,
      category: "cat_makeup",
    },
  ]);
  const [selectedProduct, setSelectedProduct] = useState<string>("product_1");
  const [editingPhotos, setEditingPhotos] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user) {
      if (landingId) {
        loadLanding();
      } else {
        setLoadingLanding(false);
      }
    }
  }, [loading, user, landingId]);

  const loadLanding = async () => {
    if (!landingId) return;
    try {
      const result = await getLanding(landingId);
      setLanding(result.landing);
      setIsOnline(result.landing.isPublished || result.landing.is_published || false);
      setIsLanding(result.landing.isLanding === true);
      if (result.landing.content) {
        setContent(result.landing.content);
      }
      if (result.landing.products && result.landing.products.length > 0) {
        setProducts(result.landing.products);
        setSelectedProduct(result.landing.products[0].id);
      }
      if ((result.landing as any).categories) {
        setCategories((result.landing as any).categories);
      }
    } catch (error: any) {
      console.error('Load landing error:', error);
      toast.error(error.message || "Erreur lors du chargement");
    } finally {
      setLoadingLanding(false);
    }
  };

  const addProduct = () => {
    const newId = `product_${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: "Nouveau produit",
      price: "0€",
      description: "Description",
      biography: "Description détaillée",
      photos: [],
      mainPhoto: 0,
      stock: 100,
      unlimitedStock: true,
      category: selectedCategory !== "all" ? selectedCategory : categories[0]?.id,
    };
    setProducts([...products, newProduct]);
    setSelectedProduct(newId);
  };

  const removeProduct = (productId: string) => {
    if (products.length <= 1) {
      toast.error("Au moins un produit requis");
      return;
    }
    const newProducts = products.filter(p => p.id !== productId);
    setProducts(newProducts);
    if (selectedProduct === productId) {
      setSelectedProduct(newProducts[0]?.id || "");
    }
  };

  const addCategory = () => {
    const name = prompt("Nom de la catégorie:");
    if (!name) return;
    const newId = `cat_${Date.now()}`;
    setCategories([...categories, { id: newId, name, icon: "📦" }]);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const data = { content, products, categories };
      if (landingId) {
        await updateLanding(landingId, data);
        toast.success("Modifications sauvegardées !");
      } else {
        toast.success("Template sauvegardé localement !");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!landingId) {
      toast.error("Sauvegardez d'abord la landing");
      return;
    }
    setSaving(true);
    try {
      await handleSave();
      await publishLanding(landingId);
      setIsOnline(true);
      toast.success("Boutique publiée !");
      
      const params = new URLSearchParams({
        logo: content.logo,
        brandName: content.brandName,
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        ctaButton: content.ctaButton,
        contactEmail: content.contactEmail,
        footerText: content.footerText,
        products: encodeURIComponent(JSON.stringify(products)),
        categories: encodeURIComponent(JSON.stringify(categories)),
      });
      window.open(`/template/cosmetic-boutique?${params.toString()}`, "_blank");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la publication");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOnline = async () => {
    if (!landingId) return;
    setSaving(true);
    try {
      if (isOnline) {
        await unpublishLanding(landingId);
        setIsOnline(false);
        toast.success("Boutique mise hors ligne");
      } else {
        await publishLanding(landingId);
        setIsOnline(true);
        toast.success("Boutique mise en ligne");
      }
      loadLanding();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user || !selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    if ((product.photos?.length || 0) + files.length > 9) {
      toast.error("Maximum 9 photos par produit");
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        if ((product.photos?.length || 0) + i >= 9) break;
        
        const result = await uploadImage(files[i], 'products');
        setProducts(currentProducts => 
          currentProducts.map(p => 
            p.id === selectedProduct 
              ? { ...p, photos: [...(p.photos || []), result.url] } 
              : p
          )
        );
      }
      toast.success("Photos ajoutées !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du téléversement");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const result = await uploadImage(file, 'logos');
      setContent({ ...content, logo: result.url });
      toast.success("Logo uploadé !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du téléversement");
    } finally {
      setUploading(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (productId: string, index: number) => {
    setProducts(currentProducts => {
      const product = currentProducts.find(p => p.id === productId);
      if (!product) return currentProducts;
      
      if ((product.photos?.length || 0) <= 1) {
        toast.error("Au moins une photo requise");
        return currentProducts;
      }
      
      const newPhotos = product.photos?.filter((_, i) => i !== index) || [];
      const newMainPhoto = product.mainPhoto >= newPhotos.length 
        ? Math.max(0, newPhotos.length - 1) 
        : product.mainPhoto;
      
      return currentProducts.map(p => 
        p.id === productId 
          ? { ...p, photos: newPhotos, mainPhoto: newMainPhoto } 
          : p
      );
    });
  };

  const setMainPhoto = (productId: string, index: number) => {
    updateProduct(productId, 'mainPhoto', index);
  };

  const currentProduct = products.find(p => p.id === selectedProduct);
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading || loadingLanding || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-800 border-r border-zinc-700 flex flex-col">
        <div className="p-4 border-b border-zinc-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white">ShopLaunch</span>
          </Link>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase mb-4">Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Logo de la boutique</label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="hidden"
              />
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="w-20 h-20 bg-zinc-700 border-2 border-dashed border-zinc-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors overflow-hidden"
              >
                {content.logo ? (
                  <img src={content.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-zinc-500">✨</span>
                )}
              </div>
              {content.logo && (
                <button
                  onClick={() => setContent({ ...content, logo: '' })}
                  className="mt-2 text-xs text-red-400 hover:text-red-300"
                >
                  Supprimer le logo
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Nom de la marque</label>
              <input
                type="text"
                value={content.brandName}
                onChange={(e) => setContent({...content, brandName: e.target.value})}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Titre principal</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Sous-titre</label>
              <textarea
                value={content.heroSubtitle}
                onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Bouton CTA</label>
              <input
                type="text"
                value={content.ctaButton}
                onChange={(e) => setContent({...content, ctaButton: e.target.value})}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Email de contact</label>
              <input
                type="email"
                value={content.contactEmail}
                onChange={(e) => setContent({...content, contactEmail: e.target.value})}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Texte footer</label>
              <input
                type="text"
                value={content.footerText}
                onChange={(e) => setContent({...content, footerText: e.target.value})}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Categories Section */}
          <div className="border-t border-zinc-700 mt-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase">Catégories ({categories.length})</h4>
              <button
                onClick={addCategory}
                className="p-1 bg-pink-500 hover:bg-pink-600 rounded text-white text-xs"
                title="Ajouter une catégorie"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedCategory === "all" 
                    ? 'bg-pink-500 text-white' 
                    : 'text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <span>📋</span>
                <span>Tous les produits</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    selectedCategory === cat.id 
                      ? 'bg-pink-500 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="border-t border-zinc-700 mt-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase">Produits ({products.length})</h4>
              <button
                onClick={addProduct}
                className="p-1 bg-pink-500 hover:bg-pink-600 rounded text-white text-xs"
                title="Ajouter un produit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProduct(product.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedProduct === product.id 
                        ? 'bg-pink-500 text-white' 
                        : 'text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <span className="truncate">{product.name}</span>
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-300">Statut</span>
            <button
              onClick={handleToggleOnline}
              disabled={saving || !landingId}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isOnline ? 'bg-green-500' : 'bg-zinc-600'
              } disabled:opacity-50`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                isOnline ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
          <p className={`text-xs mb-3 ${isOnline ? 'text-green-400' : 'text-zinc-500'}`}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sauvegarde...
              </>
            ) : 'Sauvegarder'}
          </button>
        </div>

        <div className="p-4 border-t border-zinc-700">
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-zinc-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Editor */}
      <main className="flex-1 p-8 overflow-auto bg-zinc-100">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">Boutique Cosmétique</h1>
                <p className="text-zinc-500">
                  {landing ? `"${landing.name}" - ${isOnline ? 'En ligne' : 'Hors ligne'}` : 'Nouvelle boutique'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePublish}
                disabled={saving || !landingId}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors"
              >
                {isOnline ? 'Mettre à jour' : 'Publier'}
              </button>
            </div>
          </div>

          {currentProduct ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-zinc-400">Édition: {currentProduct.name}</span>
                </div>
                <button
                  onClick={() => setEditingPhotos(!editingPhotos)}
                  className="px-3 py-1 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  {editingPhotos ? "Masquer photos" : "Gérer photos"}
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Nom du produit</label>
                    <input
                      type="text"
                      value={currentProduct.name}
                      onChange={(e) => updateProduct(currentProduct.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Prix (DA)</label>
                    <input
                      type="text"
                      value={currentProduct.price}
                      onChange={(e) => updateProduct(currentProduct.id, 'price', e.target.value)}
                      placeholder="Ex: 1500"
                      className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Catégorie</label>
                    <select
                      value={currentProduct.category || ""}
                      onChange={(e) => updateProduct(currentProduct.id, 'category', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="p-4 bg-zinc-100 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentProduct.unlimitedStock}
                        onChange={(e) => updateProduct(currentProduct.id, 'unlimitedStock', e.target.checked)}
                        className="w-5 h-5 rounded border-zinc-300 text-pink-500 focus:ring-pink-500"
                      />
                      <span className="text-sm font-medium text-zinc-700">Stock illimité</span>
                    </label>
                    {!currentProduct.unlimitedStock && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Quantité en stock</label>
                        <input
                          type="number"
                          min="1"
                          value={currentProduct.stock}
                          onChange={(e) => updateProduct(currentProduct.id, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Description courte</label>
                  <input
                    type="text"
                    value={currentProduct.description}
                    onChange={(e) => updateProduct(currentProduct.id, 'description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Biographie / Description détaillée</label>
                  <textarea
                    value={currentProduct.biography}
                    onChange={(e) => updateProduct(currentProduct.id, 'biography', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {editingPhotos && (
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                    <h4 className="font-semibold text-zinc-900 mb-4">Photos ({(currentProduct.photos?.length || 0)}/9)</h4>
                    
                    <div className="mb-4">
                      <p className="text-sm text-zinc-600 mb-2">Photos actuelles:</p>
                      {(currentProduct.photos?.length || 0) === 0 ? (
                        <p className="text-sm text-zinc-400 italic">Aucune photo. Ajoutez des photos ci-dessous.</p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {(currentProduct.photos || []).map((photo, index) => (
                            <div 
                              key={index} 
                              className={`relative w-24 h-24 bg-white rounded-lg overflow-hidden border-2 ${
                                currentProduct.mainPhoto === index ? 'border-pink-500' : 'border-zinc-200'
                              }`}
                            >
                              <img 
                                src={photo} 
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {currentProduct.mainPhoto === index && (
                                <span className="absolute top-1 right-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  Principal
                                </span>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
                                <button
                                  onClick={() => setMainPhoto(currentProduct.id, index)}
                                  className="p-1.5 bg-white rounded-full text-xs"
                                  title="Principal"
                                >
                                  ⭐
                                </button>
                                <button
                                  onClick={() => removePhoto(currentProduct.id, index)}
                                  className="p-1.5 bg-red-500 rounded-full text-white text-xs"
                                  title="Supprimer"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-zinc-600 mb-2">Ajouter des photos:</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading || (currentProduct.photos?.length || 0) >= 9}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || (currentProduct.photos?.length || 0) >= 9}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Téléversement...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Choisir des fichiers
                          </>
                        )}
                      </button>
                      <p className="text-xs text-zinc-500 mt-2">JPG, PNG, GIF, WebP - Max 5MB par image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-zinc-500 mb-4">Aucun produit dans cette catégorie.</p>
              <button
                onClick={addProduct}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-colors"
              >
                Ajouter un produit
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
