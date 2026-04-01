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
  heroBgColor: string;
  ctaBgColor: string;
}

interface OrderProduct {
  name: string;
  price: string;
  landingSlug: string;
}

export default function OrderPage() {
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
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [landingSlug, setLandingSlug] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productData = params.get("product");
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
        if (result.landing?.products && result.landing.products.length > 0) {
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

    setSubmitting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/shop/${product.landingSlug}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          productPrice: product.price,
          productPhoto: productPhoto,
          customerName: formData.lastName,
          customer_firstname: formData.firstName,
          phone: formData.phone,
          wilaya: formData.wilaya,
          address: formData.bureau ? 'Bureau' : (formData.homeDelivery ? formData.address : ''),
          note: formData.note,
          quantity: 1,
          landingId: product.landingSlug,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newOrderId = result.order?.id || result.orderId || result.id || 'CMD-' + Date.now();
        setOrderId(newOrderId);
        setOrderPlaced(true);
        
        // Redirect to confirmation page
        const params = new URLSearchParams(window.location.search);
        const productData = params.get("product");
        const confirmParams = new URLSearchParams();
        if (productData) confirmParams.set("product", productData);
        confirmParams.set("orderId", newOrderId);
        window.location.href = `/template/cosmetic/confirmation?${confirmParams.toString()}`;
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

  const brandName = content?.brandName || 'Notre Boutique';
  const heroBgColor = content?.heroBgColor || 'bg-gradient-to-br from-rose-50 to-amber-50';
  const ctaGradient = content?.ctaBgColor || 'from-rose-500 to-orange-500';
  const ctaButtonText = content?.ctaButton || 'Commander maintenant';

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${heroBgColor.includes('gradient') ? '' : 'bg-gradient-to-br from-rose-50 to-amber-50'}`}>
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href={`/template/cosmetic?id=${landingSlug}`} className="flex items-center gap-2">
            {content?.logo ? (
              <img src={content.logo} alt={brandName} className="h-10 w-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{brandName.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span className={`text-xl font-bold bg-gradient-to-r ${ctaGradient} bg-clip-text text-transparent`}>{brandName}</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${ctaGradient} p-8 text-white`}>
            <h1 className="text-3xl font-bold">Finaliser votre commande</h1>
            <p className="opacity-90 mt-2">Remplissez vos informations pour passer commande</p>
          </div>

          <div className="grid md:grid-cols-3">
            <div className="md:col-span-2 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Numéro de téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                    placeholder="0555 55 55 55"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Wilaya *</label>
                  <select
                    required
                    value={formData.wilaya}
                    onChange={(e) => setFormData({...formData, wilaya: e.target.value, address: ''})}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-black"
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bureau}
                      onChange={(e) => setFormData({...formData, bureau: e.target.checked, homeDelivery: false})}
                      className="w-5 h-5 rounded border-zinc-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-black">Livraison au bureau</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.homeDelivery}
                      onChange={(e) => setFormData({...formData, homeDelivery: e.target.checked, bureau: false})}
                      className="w-5 h-5 rounded border-zinc-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-black">Livraison à domicile</span>
                  </label>
                </div>

                {formData.homeDelivery && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Adresse complète</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                      placeholder="Rue, numéro, étage, ville..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Note (optionnel)</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                    placeholder="Instructions spéciales, préférences..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 bg-gradient-to-r ${ctaGradient} text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all text-lg disabled:opacity-70 flex items-center justify-center gap-2`}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    ctaButtonText
                  )}
                </button>
              </form>
            </div>

            <div className="bg-zinc-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-zinc-200">
              <h3 className="font-bold text-zinc-900 mb-4">Votre commande</h3>
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="w-full h-32 bg-gradient-to-br from-rose-100 to-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {productPhoto ? (
                    <img src={productPhoto} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl md:text-5xl">✨</span>
                  )}
                </div>
              </div>
              <div className="border-t border-zinc-200 pt-4 space-y-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Sous-total</span>
                  <span>{product.price} DA</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Livraison</span>
                  <span>{formData.wilaya ? "À confirmer" : "-"}</span>
                </div>
                <div className="flex justify-between font-bold text-base md:text-lg text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span className={`bg-gradient-to-r ${ctaGradient} bg-clip-text text-transparent`}>
                    {product.price} DA
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-4">
                Le montant de la livraison sera confirmé par téléphone après votre commande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
