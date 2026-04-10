"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";

type Language = 'fr' | 'ar';

const wilayas = [
  "Adrar", "Aïn Defla", "Aïn Témouchent", "Alger", "Annaba", "Batna", "Béchar", "Béjaïa", 
  "Biskra", "Blida", "Bordj Bou Arreridj", "Bouira", "Boumerdès", "Chlef", "Constantine", 
  "Djanet", "Djelfa", "El Bayadh", "El Oued", "El Tarf", "Ghardaïa", "Guelma", "Illizi", 
  "In Guezzam", "In Salah", "Jijel", "Khenchela", "Laghouat", "M'Sila", "Mascara", "Médea", 
  "Mila", "Mostaganem", "Naâma", "Oran", "Ouargla", "Oum El Bouaghi", "Relizane", "Saïda", 
  "Sétif", "Sidi Bel Abbès", "Skikda", "Souk Ahras", "Tamanghasset", "Tébessa", "Tiaret", 
  "Tindouf", "Tipaza", "Tissemsilt", "Tizi Ouzou", "Tlemcen", "Touggourt"
];

const translations = {
  fr: {
    return: 'Retour',
    finalizeOrder: 'Finaliser la commande',
    fillInfo: 'Remplissez vos informations pour confirmer la commande',
    product: 'Produit',
    price: 'Prix',
    firstName: 'Prénom',
    lastName: 'Nom',
    phone: 'Numéro de téléphone',
    phonePlaceholder: '0555 12 34 56',
    wilaya: 'Wilaya',
    selectWilaya: 'Sélectionner une wilaya',
    commune: 'Commune',
    communePlaceholder: 'Nom de la commune',
    deliveryType: 'Type de livraison',
    deliveryToOffice: 'Livraison au bureau',
    deliveryToHome: 'Livraison à domicile',
    address: 'Adresse de livraison',
    addressPlaceholder: 'Rue, numéro de rue, appartement, etc.',
    note: 'Note (optionnel)',
    notePlaceholder: 'Une note pour le vendeur...',
    confirmOrder: 'Confirmer la commande',
    confirming: 'Confirmation...',
    cashOnDelivery: 'Paiement à la livraison',
    fastDelivery: 'Livraison rapide',
    fillAllFields: 'Veuillez remplir tous les champs obligatoires',
    orderSuccess: 'Commande envoyée avec succès !',
    orderError: 'Erreur lors de la commande',
  },
  ar: {
    return: 'رجوع',
    finalizeOrder: 'إتمام الطلب',
    fillInfo: 'املأ معلوماتك لتأكيد الطلب',
    product: 'المنتج',
    price: 'السعر',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'رقم الهاتف',
    phonePlaceholder: '0555 12 34 56',
    wilaya: 'الولاية',
    selectWilaya: 'اختر الولاية',
    commune: 'البلدية',
    communePlaceholder: 'اسم البلدية',
    deliveryType: 'نوع التوصيل',
    deliveryToOffice: 'توصيل للمكتب',
    deliveryToHome: 'توصيل للمنزل',
    address: 'عنوان التوصيل',
    addressPlaceholder: 'الشارع، رقم المبنى، الشقة، إلخ',
    note: 'ملاحظة (اختياري)',
    notePlaceholder: 'ملاحظة للبائع...',
    confirmOrder: 'تأكيد الطلب',
    confirming: 'جاري التأكيد...',
    cashOnDelivery: 'الدفع عند الاستلام',
    fastDelivery: 'توصيل سريع',
    fillAllFields: 'يرجى ملء جميع الحقول إلزامية',
    orderSuccess: 'تم إرسال الطلب بنجاح!',
    orderError: 'خطأ في الطلب',
  },
};

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
  description?: string;
}

interface OrderData {
  name: string;
  price: string;
  photo: string;
  description: string;
  landingId: string;
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
  const [submitting, setSubmitting] = useState(false);
  const [landingSlug, setLandingSlug] = useState<string>('');
  const [lang, setLang] = useState<Language>('fr');
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang") as Language;
    const idParam = params.get("id");
    
    if (langParam) {
      setLang(langParam);
    }
    
    if (idParam) {
      setLandingSlug(idParam);
    }
    
    const stored = sessionStorage.getItem('orderData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOrderData(parsed);
        setProduct({
          name: parsed.name,
          price: parsed.price,
          landingSlug: parsed.landingId,
          description: parsed.description,
        });
        setProductPhoto(parsed.photo);
      } catch (e) {
        console.error("Error parsing order data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (landingSlug && !orderData) {
      loadLandingData();
    }
  }, [landingSlug]);

  const loadLandingData = async () => {
    if (!landingSlug) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/shop/${landingSlug}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.landing?.content) {
          setContent(result.landing.content);
        }
        if (result.landing?.products && result.landing.products.length > 0) {
          const prod = result.landing.products[0];
          setProduct(prod);
          const mainPhoto = prod.photos?.[prod.mainPhoto || 0];
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
    if (!product && !orderData) return;

    setSubmitting(true);
    
    const orderLandingId = orderData?.landingId || product?.landingSlug;
    
    if (!orderLandingId) {
      alert('Erreur: ID du produit manquant');
      setSubmitting(false);
      return;
    }
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/shop/${orderLandingId}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product?.name || orderData?.name || '',
          productPrice: product?.price || orderData?.price || '',
          productPhoto: productPhoto || orderData?.photo || '',
          customerName: `${formData.firstName} ${formData.lastName}`,
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
        
        const confirmationData = {
          ...orderData,
          customerName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          wilaya: formData.wilaya,
          commune: formData.commune,
        };
        sessionStorage.setItem('confirmationData', JSON.stringify(confirmationData));
        
        window.location.href = `/template/cosmetic/confirmation?lang=${lang}&orderId=${newOrderId}&id=${orderLandingId}`;
        return;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Order error:', errorData);
        alert(errorData.message || t.orderError);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert(t.orderError);
    }
    setSubmitting(false);
  };

  const brandName = content?.brandName || 'Notre Boutique';
  const heroBgColor = content?.heroBgColor || 'bg-gradient-to-br from-rose-50 to-amber-50';
  const ctaGradient = content?.ctaBgColor || 'from-rose-500 to-orange-500';

  if (!product && !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white font-sans ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/template/cosmetic?id=${landingSlug}`} className="flex items-center gap-2 text-zinc-600 hover:text-rose-500 transition-colors">
            <svg className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.return}
          </Link>
          
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="flex items-center gap-2 px-3 py-2 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors text-sm font-medium text-rose-700"
          >
            <Globe className="w-4 h-4" />
            <span className={lang === 'ar' ? 'text-orange-500' : ''}>FR</span>
            <span className="text-rose-400">/</span>
            <span className={lang === 'ar' ? '' : 'text-orange-500'}>AR</span>
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 text-zinc-900">{t.finalizeOrder}</h1>
        <p className="text-zinc-500 mb-8">{t.fillInfo}</p>

        {/* Product */}
        <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden mb-6">
          {productPhoto && (
            <div className="aspect-square bg-gradient-to-br from-rose-100 to-orange-100">
              <img 
                src={productPhoto} 
                alt={product?.name || 'Produit'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2 text-zinc-900">{product?.name || orderData?.name || 'Produit'}</h2>
            {product?.description && (
              <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{product.description}</p>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
              <span className="text-zinc-500">{t.price}</span>
              <span className={`text-2xl font-bold bg-gradient-to-r ${ctaGradient} bg-clip-text text-transparent`}>
                {product?.price || orderData?.price || '0'} DA
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">{t.firstName} *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none text-zinc-900"
                placeholder={lang === 'ar' ? 'محمد' : 'Votre prénom'}
                required
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">{t.lastName} *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none text-zinc-900"
                placeholder={lang === 'ar' ? 'أحمد' : 'Votre nom'}
                required
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">{t.phone} *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none text-zinc-900"
              placeholder={t.phonePlaceholder}
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">{t.wilaya} *</label>
            <select
              value={formData.wilaya}
              onChange={(e) => setFormData({ ...formData, wilaya: e.target.value, commune: "" })}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none text-zinc-900"
              required
            >
              <option value="">{t.selectWilaya}</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">{t.commune} *</label>
            <input
              type="text"
              value={formData.commune}
              onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none text-zinc-900"
              placeholder={t.communePlaceholder}
              required
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">{t.deliveryType} *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bureau: true, homeDelivery: false })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.bureau
                    ? `border-rose-500 bg-rose-50`
                    : "border-zinc-200 hover:border-rose-300"
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="block text-sm font-medium text-zinc-700">{t.deliveryToOffice}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bureau: false, homeDelivery: true })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.homeDelivery
                    ? `border-rose-500 bg-rose-50`
                    : "border-zinc-200 hover:border-rose-300"
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="block text-sm font-medium text-zinc-700">{t.deliveryToHome}</span>
              </button>
            </div>
          </div>

          {formData.homeDelivery && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">{t.address} *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none resize-none text-zinc-900"
                rows={3}
                placeholder={t.addressPlaceholder}
                required
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">{t.note}</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none resize-none text-zinc-900"
              rows={2}
              placeholder={t.notePlaceholder}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 bg-gradient-to-r ${ctaGradient} text-white font-bold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t.confirming}
              </>
            ) : (
              t.confirmOrder
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t.cashOnDelivery}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {t.fastDelivery}
          </div>
        </div>
      </div>
    </div>
  );
}
