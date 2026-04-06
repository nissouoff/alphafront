"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const wilayas = [
  "Adrar", "Aïn Defla", "Aïn Témouchent", "Alger", "Annaba", "Batna", "Béchar", "Béjaïa", 
  "Biskra", "Blida", "Bordj Bou Arreridj", "Bouira", "Boumerdès", "Chlef", "Constantine", 
  "Djanet", "Djelfa", "El Bayadh", "El Oued", "El Tarf", "Ghardaïa", "Guelma", "Illizi", 
  "In Guezzam", "In Salah", "Jijel", "Khenchela", "Laghouat", "M'Sila", "Mascara", "Médea", 
  "Mila", "Mostaganem", "Naâma", "Oran", "Ouargla", "Oum El Bouaghi", "Relizane", "Saïda", 
  "Sétif", "Sidi Bel Abbès", "Skikda", "Souk Ahras", "Tamanghasset", "Tébessa", "Tiaret", 
  "Tindouf", "Tipaza", "Tissemsilt", "Tizi Ouzou", "Tlemcen", "Touggourt"
];

interface Content {
  logo: string;
  brandName: string;
  ctaButton: string;
}

interface OrderProduct {
  name: string;
  price: string;
  photos?: string[];
  description?: string;
  photo?: string;
  landingSlug?: string;
  landingId?: string;
}

export default function SkinovaOrderPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [product, setProduct] = useState<OrderProduct | null>(null);
  const [productPhoto, setProductPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    wilaya: "",
    commune: "",
    homeDelivery: false,
    bureau: false,
    address: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [landingSlug, setLandingSlug] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productData = params.get("product");
    const idParam = params.get("id");
    
    // Try to get from sessionStorage first
    const stored = sessionStorage.getItem('orderData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProduct(parsed);
        if (parsed.photo) {
          setProductPhoto(parsed.photo);
        }
        setLandingSlug(parsed.landingId || parsed.landingSlug || idParam || '');
      } catch (e) {
        console.error("Error parsing order data:", e);
      }
    } else if (productData) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(productData)));
        setProduct(decoded);
        if (decoded.photo) {
          setProductPhoto(decoded.photo);
        }
        setLandingSlug(decoded.landingSlug || idParam || '');
      } catch (e) {
        console.error("Error parsing product data", e);
      }
    } else if (idParam) {
      setLandingSlug(idParam);
      loadLandingData(idParam);
    }
  }, []);

  const loadLandingData = async (landingId?: string) => {
    const id = landingId || landingSlug;
    if (!id) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/public/landing/${id}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.landing?.content) {
          setContent(result.landing.content);
        }
        if (!productPhoto && result.landing?.products && result.landing.products.length > 0) {
          const mainPhoto = result.landing.products[0].photos?.[result.landing.products[0].mainPhoto || 0];
          if (mainPhoto) {
            setProductPhoto(mainPhoto);
          }
        }
      }
    } catch (error) {
      console.error('Error loading landing data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const landingId = product.landingSlug || product.landingId || landingSlug;
    if (!landingId) {
      alert('Erreur: ID du produit manquant');
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/shop/${landingId}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          productPrice: product.price,
          customerName: formData.lastName,
          customer_firstname: formData.firstName,
          phone: formData.phone,
          wilaya: formData.wilaya,
          commune: formData.commune,
          address: formData.bureau ? 'Bureau' : (formData.homeDelivery ? formData.address : ''),
          note: formData.note,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newOrderId = result.order?.id || result.orderId || result.id || 'CMD-' + Date.now();
        
        const confirmData = {
          ...product,
          orderId: newOrderId,
        };
        sessionStorage.setItem('confirmData', JSON.stringify(confirmData));
        
        window.location.href = `/template/skinova/confirmation`;
        return;
      } else {
        const errorText = await response.text();
        console.error('Order error:', errorText);
        alert('Erreur lors de la commande. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    }
    setSubmitting(false);
  };

  const brandName = content?.brandName || 'Skinova';

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          <Link href={`/template/skinova?id=${landingSlug}`} className="flex items-center gap-4">
            {content?.logo ? (
              <img src={content.logo} alt={brandName} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center">
                <span className="text-white font-serif text-lg">S</span>
              </div>
            )}
            <span className="text-xl tracking-widest uppercase font-serif font-medium text-stone-900">{brandName}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-2">Finaliser</p>
          <h1 className="text-4xl font-serif text-stone-900">Votre Commande</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-5 py-4 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none text-stone-900 font-sans"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-5 py-4 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none text-stone-900 font-sans"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none text-stone-900 font-sans"
                  placeholder="0555 55 55 55"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">Wilaya *</label>
                <select
                  required
                  value={formData.wilaya}
                  onChange={(e) => setFormData({...formData, wilaya: e.target.value, address: ''})}
                  className="w-full px-5 py-4 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none text-stone-900 font-sans"
                >
                  <option value="">Sélectionnez</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bureau}
                    onChange={(e) => setFormData({...formData, bureau: e.target.checked, homeDelivery: false})}
                    className="w-5 h-5 border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span className="text-sm text-stone-700 font-sans">Livraison au bureau</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.homeDelivery}
                    onChange={(e) => setFormData({...formData, homeDelivery: e.target.checked, bureau: false})}
                    className="w-5 h-5 border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span className="text-sm text-stone-700 font-sans">Livraison à domicile</span>
                </label>
              </div>

              {formData.homeDelivery && (
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">Adresse complète</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none text-stone-900 font-sans"
                    placeholder="Rue, numéro, ville..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">Note (optionnel)</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  rows={2}
                  className="w-full px-5 py-4 bg-white border border-stone-200 focus:border-stone-900 focus:outline-none text-stone-900 font-sans"
                  placeholder="Instructions spéciales..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-stone-900 text-white text-xs tracking-widest uppercase font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 font-sans"
              >
                {submitting ? 'Envoi en cours...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-8 border border-stone-200">
              <h3 className="text-xs tracking-widest uppercase text-stone-500 mb-6">Récapitulatif</h3>
              
              <div className="aspect-square bg-stone-100 mb-6 overflow-hidden">
                {(product?.photo || productPhoto) ? (
                  <img src={product?.photo || productPhoto || ''} alt={product?.name || 'Produit'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl opacity-20">⚗️</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm font-medium text-stone-900 mb-1 font-sans">{product.name}</p>
              
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Prix</span>
                  <span className="text-stone-900 font-medium">{product.price} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Livraison</span>
                  <span className="text-stone-900">{formData.wilaya ? 'À confirmer' : '-'}</span>
                </div>
                <div className="pt-3 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-900">Total</span>
                    <span className="text-xl font-serif text-stone-900">{product.price} DA</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Paiement à la livraison</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Garantie 30 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
