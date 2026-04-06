"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Globe } from "lucide-react";

type Language = 'fr' | 'ar';

const WILAYAS = [
  "Adrar", "Ain Defla", "Ain Temouchent", "Alger", "Annaba", "Batna", "Bechar", "Bejaia", 
  "Biskra", "Blida", "Bordj Bou Arreridj", "Bouira", "Boumerdes", "Chlef", "Constantine", 
  "Djelfa", "El Bayadh", "El Oued", "El Tarf", "Ghardaia", "Guelma", "Illizi", "Jijel", 
  "Khenchela", "Laghouat", "Lemdaouar", "M'sila", "Mascara", "Medea", "Mila", "Mostaganem", 
  "Naama", "Oran", "Ouargla", "Oum El Bouaghi", "Relizane", "Saida", "Setif", "Sidi Bel Abbes", 
  "Skikda", "Souk Ahras", "Tamanrasset", "Tebessa", "Tiaret", "Tindouf", "Tipaza", "Tissemsilt", 
  "Tizi Ouzou", "Tlemcen"
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
    confirmOrder: 'Confirmer la commande',
    confirming: 'Confirmation...',
    cashOnDelivery: 'Paiement à la livraison',
    fastDelivery: 'Livraison rapide',
    required: 'Champs obligatoires',
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
    confirmOrder: 'تأكيد الطلب',
    confirming: 'جاري التأكيد...',
    cashOnDelivery: 'الدفع عند الاستلام',
    fastDelivery: 'توصيل سريع',
    required: 'الحقول إلزامية',
    fillAllFields: 'يرجى ملء جميع الحقول إلزامية',
    orderSuccess: 'تم إرسال الطلب بنجاح!',
    orderError: 'خطأ في الطلب',
  },
};

interface OrderData {
  name: string;
  price: string;
  photo: string;
  description: string;
  landingId: string;
}

export default function VibeOrderPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [landingSlug, setLandingSlug] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [lang, setLang] = useState<Language>('fr');
  
  const t = translations[lang];
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    wilaya: "",
    commune: "",
    deliveryType: "bureau" as "bureau" | "maison",
    address: "",
  });

  useEffect(() => {
    const langParam = searchParams.get('lang') as Language;
    const idParam = searchParams.get('id');
    
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
        setLoadingProduct(false);
      } catch (e) {
        console.error("Error parsing order data:", e);
        setLoadingProduct(false);
      }
    } else {
      setLoadingProduct(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.wilaya || !formData.commune) {
      toast.error(t.fillAllFields);
      return;
    }

    setLoading(true);
    
    // Use landingId from orderData if available, otherwise use landingSlug from state
    const orderLandingId = orderData?.landingId || landingSlug;
    
    console.log('Order data:', { orderData, landingSlug, orderLandingId });
    
    if (!orderLandingId) {
      toast.error('Erreur: ID du produit manquant');
      setLoading(false);
      return;
    }
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${API_URL}/shop/${orderLandingId}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: orderData?.name || '',
          productPrice: orderData?.price || '',
          productPhoto: orderData?.photo || '',
          customerName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          wilaya: formData.wilaya,
          commune: formData.commune,
          address: formData.deliveryType === "maison" ? formData.address : '',
        }),
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', responseText);

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la commande';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Use default error message
        }
        throw new Error(errorMessage);
      }

      toast.success(t.orderSuccess);
      
      // Store order data and redirect to confirmation
      const confirmationData = {
        ...orderData,
        customerName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        wilaya: formData.wilaya,
        commune: formData.commune,
      };
      sessionStorage.setItem('confirmationData', JSON.stringify(confirmationData));
      
      window.location.href = `/template/vibe/confirmation?lang=${lang}&id=${orderLandingId}`;
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || t.orderError);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/template/vibe?id=${landingSlug}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.return}
          </Link>
          
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            <span className={lang === 'ar' ? 'text-orange-400' : ''}>FR</span>
            <span className="text-gray-500">/</span>
            <span className={lang === 'ar' ? '' : 'text-orange-400'}>AR</span>
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">{t.finalizeOrder}</h1>
        <p className="text-gray-400 mb-8">{t.fillInfo}</p>

        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 mb-6">
          {orderData?.photo && (
            <div className="aspect-square bg-gray-800">
              <img 
                src={orderData.photo} 
                alt={orderData?.name || 'Produit'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{orderData?.name || 'Produit'}</h2>
            {orderData?.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{orderData.description}</p>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-400">{t.price}</span>
              <span className="text-2xl font-bold text-orange-500">{orderData?.price || '0'} DA</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t.firstName} *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white"
                placeholder={lang === 'ar' ? 'محمد' : 'Votre prénom'}
                required
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t.lastName} *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white"
                placeholder={lang === 'ar' ? 'أحمد' : 'Votre nom'}
                required
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.phone} *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white"
              placeholder={t.phonePlaceholder}
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.wilaya} *</label>
            <select
              value={formData.wilaya}
              onChange={(e) => setFormData({ ...formData, wilaya: e.target.value, commune: "" })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white"
              required
            >
              <option value="">{t.selectWilaya}</option>
              {WILAYAS.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.commune} *</label>
            <input
              type="text"
              value={formData.commune}
              onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white"
              placeholder={t.communePlaceholder}
              required
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.deliveryType} *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryType: "bureau" })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.deliveryType === "bureau"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="block text-sm font-medium">{t.deliveryToOffice}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryType: "maison" })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.deliveryType === "maison"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="block text-sm font-medium">{t.deliveryToHome}</span>
              </button>
            </div>
          </div>

          {formData.deliveryType === "maison" && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t.address} *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-white"
                rows={3}
                placeholder={t.addressPlaceholder}
                required
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t.confirming}
              </>
            ) : (
              t.confirmOrder
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
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
