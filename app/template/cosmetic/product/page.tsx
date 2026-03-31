"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductData, storeProductData } from "@/lib/productStorage";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  biography: string;
  photos: string[];
  mainPhoto: number;
}

interface Content {
  logo: string;
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  contactEmail: string;
  footerText: string;
}

interface LandingData {
  content: Content;
  products: Product[];
}

interface OrderData {
  product: Product;
  landing: LandingData;
}

function ProductPageContent() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const data = getProductData(id) as { productId: string; productName: string; productTitle: string; productPrice: string; productPhoto: string; landingId: string; landingSlug: string; landingName: string; timestamp: number } | null;
      if (data) {
        setProduct({
          id: data.productId,
          name: data.productName,
          title: data.productTitle,
          price: data.productPrice,
          description: '',
          biography: '',
          photos: [data.productPhoto],
          mainPhoto: 0,
        } as unknown as Product);
        setLandingData({
          id: data.landingId,
          slug: data.landingSlug,
          name: data.landingName,
          content: {} as any,
          products: [],
        } as unknown as LandingData);
        setCurrentPhotoIndex(0);
      } else {
        setError("Produit non trouvé ou données expirées");
      }
    } else {
      setError("Produit non trouvé");
    }
  }, [searchParams]);

  const content = landingData?.content || {
    logo: '',
    brandName: 'Ma Boutique',
    heroTitle: 'Bienvenue',
    heroSubtitle: 'Découvrez nos produits',
    ctaButton: 'Découvrir',
    contactEmail: 'contact@exemple.com',
    footerText: '© 2026 Ma Boutique',
  };

  const topProducts = landingData?.products?.filter(p => p.id !== product?.id).slice(0, 3) || [];

  const nextPhoto = () => {
    if (product && product.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % product.photos.length);
    }
  };

  const prevPhoto = () => {
    if (product && product.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + product.photos.length) % product.photos.length);
    }
  };

  const handleOrder = () => {
    alert("Fonctionnalité de commande en cours de développement.");
  };

  const handleProductClick = (p: Product) => {
    if (landingData) {
      const newDataId = storeProductData({ product: p, landing: landingData });
      window.open(`/template/cosmetic/product?id=${newDataId}`, '_blank');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Oups !</h1>
          <p className="text-zinc-600 mb-6">{error}</p>
          <a href="/" className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (!product || !landingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.logo ? (
              <img src={content.logo} alt={content.brandName} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✨</span>
              </div>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{content.brandName}</span>
          </div>
          <Link 
            href={`/template/cosmetic?${searchParams.toString()}`}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la boutique
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-pink-500/20">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                {product.photos.length > 0 ? (
                  <img 
                    src={product.photos[currentPhotoIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-9xl">💄</span>
                )}
              </div>
              
              {product.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {product.photos.length > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                {product.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      currentPhotoIndex === index ? 'border-pink-500 scale-105' : 'border-transparent hover:border-pink-300'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-sm font-medium rounded-full w-fit mb-4">
              {content.brandName}
            </span>
            
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">
              {product.price} DZD
            </p>
            
            <p className="text-lg text-zinc-600 mb-6">
              {product.description}
            </p>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-zinc-900 mb-2">Description détaillée</h3>
              <p className="text-zinc-600 leading-relaxed">
                {product.biography}
              </p>
            </div>

            <button
              onClick={handleOrder}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Commander maintenant
            </button>

            <div className="mt-6 p-4 bg-green-50 rounded-xl flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700">Livraison disponible • Paiement à la livraison</span>
            </div>
          </div>
        </div>

        {topProducts.length > 0 && (
          <section className="mt-20">
            <div className="border-t border-zinc-200 pt-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">Vous aimerez aussi</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {topProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                    onClick={() => handleProductClick(p)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                      {p.photos.length > 0 ? (
                        <img src={p.photos[p.mainPhoto]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">💄</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-zinc-900 mb-1">{p.name}</h3>
                    <p className="text-zinc-500 text-sm mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        {p.price}
                      </span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-600 text-sm rounded-full">
                        Commander
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="py-12 px-6 bg-zinc-900 text-white mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {content.logo ? (
              <img src={content.logo} alt={content.brandName} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✨</span>
              </div>
            )}
            <span className="text-xl font-bold">{content.brandName}</span>
          </div>
          <p className="text-zinc-400">{content.footerText}</p>
          <div className="pt-8 mt-8 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm">© 2026 {content.brandName}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ProductTemplatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  );
}
