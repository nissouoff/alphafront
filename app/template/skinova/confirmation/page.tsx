"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Content {
  logo: string;
  brandName: string;
  ctaButton: string;
}

interface OrderProduct {
  name: string;
  price: string;
  landingSlug: string;
}

export default function SkinovaConfirmationPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [product, setProduct] = useState<OrderProduct | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productData = params.get("product");
    const orderIdParam = params.get("orderId");
    
    if (productData) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(productData)));
        setProduct(decoded);
        loadLandingData(decoded.landingSlug);
      } catch (e) {
        console.error("Error parsing product data", e);
      }
    }
    
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, []);

  const loadLandingData = async (landingSlug: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/public/landing/${landingSlug}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.landing?.content) {
          setContent(result.landing.content);
        }
      }
    } catch (error) {
      console.error('Error loading landing data:', error);
    }
  };

  const brandName = content?.brandName || 'Skinova';

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <Link href={`/template/skinova`} className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center">
              <span className="text-white font-serif text-lg">S</span>
            </div>
            <span className="text-xl tracking-widest uppercase font-serif font-medium text-stone-900">{brandName}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-10 border-2 border-stone-900 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-4">Confirmation</p>
        <h1 className="text-4xl sm:text-5xl font-serif text-stone-900 mb-6">
          Commande Confirmée
        </h1>
        <p className="text-stone-600 mb-12 max-w-md mx-auto">
          Merci pour votre commande. Nous vous contacterons قريباً pour confirmer les détails.
        </p>

        {/* Order Details */}
        {orderId && (
          <div className="bg-white p-8 border border-stone-200 mb-10 text-left">
            <div className="flex justify-between items-center pb-6 border-b border-stone-100">
              <span className="text-xs tracking-widest uppercase text-stone-500">Commande</span>
              <span className="text-sm font-medium text-stone-900 font-sans">{orderId}</span>
            </div>
            {product && (
              <div className="pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-stone-500">Produit</span>
                  <span className="font-medium text-stone-900 font-sans">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Prix</span>
                  <span className="font-medium text-stone-900 font-sans">{product.price} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Paiement</span>
                  <span className="text-sm text-stone-900 font-sans">À la livraison</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Steps */}
        <div className="bg-white p-8 border border-stone-200 mb-10">
          <h3 className="text-xs tracking-widest uppercase text-stone-500 mb-6">Prochaines étapes</h3>
          <div className="space-y-6 text-left">
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-stone-900 text-white text-sm flex items-center justify-center flex-shrink-0 font-sans">1</span>
              <div>
                <p className="font-medium text-stone-900 font-sans">Confirmation par téléphone</p>
                <p className="text-sm text-stone-500 font-sans">Nous vous appellerons pour confirmer</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-stone-900 text-white text-sm flex items-center justify-center flex-shrink-0 font-sans">2</span>
              <div>
                <p className="font-medium text-stone-900 font-sans">Préparation</p>
                <p className="text-sm text-stone-500 font-sans">Votre commande sera préparée avec soin</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-stone-900 text-white text-sm flex items-center justify-center flex-shrink-0 font-sans">3</span>
              <div>
                <p className="font-medium text-stone-900 font-sans">Livraison</p>
                <p className="text-sm text-stone-500 font-sans">Recevez votre commande sous 3-5 jours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-4 bg-stone-900 text-white text-xs tracking-widest uppercase font-medium hover:bg-stone-800 transition-colors font-sans"
          >
            Retour au dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-white text-stone-900 text-xs tracking-widest uppercase font-medium border border-stone-300 hover:border-stone-900 transition-colors font-sans"
          >
            Nouvelle commande
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-stone-500 font-sans">© 2026 {brandName}. Excellence cosmétique.</p>
      </footer>
    </div>
  );
}
