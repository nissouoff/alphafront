"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Content {
  logo: string;
  brandName: string;
  contactWhatsapp: string;
  contactInstagram: string;
  contactFacebook: string;
  heroBgColor: string;
  ctaBgColor: string;
}

interface OrderProduct {
  name: string;
  price: string;
  landingSlug: string;
}

export default function OrderConfirmationPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [product, setProduct] = useState<OrderProduct | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [landingSlug, setLandingSlug] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productData = params.get("product");
    const orderIdParam = params.get("orderId");
    
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
    
    if (productData) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(productData)));
        setProduct(decoded);
        setLandingSlug(decoded.landingSlug || '');
      } catch (e) {
        console.error("Error parsing product data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (landingSlug) {
      loadLandingData();
    }
  }, [landingSlug]);

  const loadLandingData = async () => {
    if (!landingSlug) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/public/landing/${landingSlug}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.landing?.content) {
          setContent(result.landing.content);
        }
      } else {
        // If slug doesn't work, try getting from Firebase directly
        const allResponse = await fetch(`${API_URL}/landings`);
        if (allResponse.ok) {
          const allData = await allResponse.json();
          const found = Object.entries(allData || {}).find(([id, data]: [string, any]) => 
            id === landingSlug || data.slug === landingSlug
          );
          if (found && (found[1] as any).content) {
            setContent((found[1] as any).content);
          }
        }
      }
    } catch (error) {
      console.error('Error loading landing data:', error);
    }
    setLoading(false);
  };

  const brandName = content?.brandName || 'Notre Boutique';
  const whatsapp = content?.contactWhatsapp || '';
  const heroBgColor = content?.heroBgColor || 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50';
  const ctaGradient = content?.ctaBgColor || 'from-rose-500 to-orange-500';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${heroBgColor}`}>
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Bar */}
      <div className="bg-zinc-900 text-white py-2 text-center text-sm">
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Paiement à la livraison • Livraison gratuite en Algérie
        </span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {content?.logo ? (
                <img src={content.logo} alt={brandName} className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-200" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-md">
                  <span className="text-white text-xl font-bold">{brandName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">{brandName}</span>
                <p className="text-xs text-zinc-500 tracking-widest uppercase">Confirmation</p>
              </div>
            </div>
            
            <Link href={`/template/cosmetic?id=${landingSlug}`} className="text-zinc-600 hover:text-rose-500 transition-colors">
              Retour
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden">
          {/* Success Header */}
          <div className={`bg-gradient-to-r ${ctaGradient} p-6 md:p-8 text-center`}>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Commande Confirmée !</h1>
            <p className="text-white/90 text-sm md:text-base">Merci pour votre confiance</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {orderId && (
              <div className="bg-zinc-50 rounded-2xl p-4 mb-6 md:mb-8 text-center border border-zinc-200">
                <p className="text-sm text-zinc-600 mb-1">Numéro de commande</p>
                <p className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${ctaGradient} bg-clip-text text-transparent`}>
                  {orderId}
                </p>
              </div>
            )}

            <div className="bg-zinc-50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-bold text-zinc-900 mb-4">Détails de la commande</h2>
              
              <div className="flex items-center gap-3 md:gap-4 mb-4 pb-4 border-b border-zinc-200">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-3xl md:text-4xl">✨</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base md:text-xl text-zinc-900">{product?.name || 'Produit'}</p>
                  <p className="text-zinc-500 text-sm">Quantité: 1</p>
                </div>
                <p className={`text-lg md:text-2xl font-bold bg-gradient-to-r ${ctaGradient} bg-clip-text text-transparent`}>
                  {product?.price || '0'} DA
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Sous-total</span>
                  <span className="font-medium text-zinc-900">{product?.price || '0'} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Livraison</span>
                  <span className="font-medium text-green-600">À confirmer</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-200">
                  <span className="font-bold text-zinc-900">Total estimé</span>
                  <span className={`font-bold text-base md:text-xl bg-gradient-to-r ${ctaGradient} bg-clip-text text-transparent`}>
                    {product?.price || '0'} DA
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className={`${heroBgColor} rounded-2xl p-6 mb-8`}>
              <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <svg className={`w-5 h-5 text-rose-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Prochaines étapes
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${ctaGradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-zinc-700">Nous vous contacterons sous <strong>24h</strong> pour confirmer votre commande</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${ctaGradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <span className="text-zinc-700">Validation du montant de la livraison pour votre wilaya</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${ctaGradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span className="text-zinc-700">Expédition de votre commande</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${ctaGradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <span className="text-zinc-700">Paiement à la livraison</span>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <p className="text-zinc-700 text-center mb-4">
                Une question ? Contactez-nous directement sur WhatsApp
              </p>
              <a 
                href={`https://wa.me/${whatsapp?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Commander sur WhatsApp
              </a>
            </div>

            {/* Back Button */}
            <Link 
              href={`/template/cosmetic?id=${landingSlug}`}
              className={`block w-full py-4 bg-gradient-to-r ${ctaGradient} text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all text-center`}
            >
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      {whatsapp && (
        <a 
          href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition-all z-50 animate-bounce"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
}
