"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

type Language = 'fr' | 'ar';

const translations = {
  fr: {
    return: 'Retour',
    orderConfirmed: 'Commande confirmée !',
    thankYou: 'Merci pour votre commande. Nous vous contacterons bientôt pour confirmer les détails.',
    price: 'Prix',
    orderNumber: 'Numéro de commande',
    orderDetails: 'Détails de la commande',
    quantity: 'Quantité',
    subtotal: 'Sous-total',
    delivery: 'Livraison',
    toConfirm: 'À confirmer',
    estimatedTotal: 'Total estimé',
    nextSteps: 'Prochaines étapes',
    step1: 'Nous vous contacterons sous 24h pour confirmer votre commande',
    step2: 'Validation du montant de la livraison pour votre wilaya',
    step3: 'Expédition de votre commande',
    step4: 'Paiement à la livraison',
    cashOnDelivery: 'Paiement à la livraison',
    deliveryTime: 'Livraison sous 24-48h',
    contactUs: 'Une question ?',
    orderOnWhatsApp: 'Commander sur WhatsApp',
    returnHome: 'Retour à l\'accueil',
    securePayment: 'Paiement à la livraison • Livraison gratuite en Algérie',
  },
  ar: {
    return: 'رجوع',
    orderConfirmed: 'تم تأكيد الطلب!',
    thankYou: 'شكرا لطلبك. سنتواصل معك قريبا لتأكيد التفاصيل.',
    price: 'السعر',
    orderNumber: 'رقم الطلب',
    orderDetails: 'تفاصيل الطلب',
    quantity: 'الكمية',
    subtotal: 'المجموع الفرعي',
    delivery: 'التوصيل',
    toConfirm: 'للتأكيد',
    estimatedTotal: 'الإجمالي المتوقع',
    nextSteps: 'الخطوات التالية',
    step1: 'سنتواصل معك خلال 24 ساعة لتأكيد طلبك',
    step2: 'تأكيد مبلغ التوصيل لولايتك',
    step3: 'شحن طلبك',
    step4: 'الدفع عند الاستلام',
    cashOnDelivery: 'الدفع عند الاستلام',
    deliveryTime: 'التوصيل خلال 24-48 ساعة',
    contactUs: 'هل لديك سؤال؟',
    orderOnWhatsApp: 'اطلب عبر واتساب',
    returnHome: 'العودة للرئيسية',
    securePayment: 'الدفع عند الاستلام • شحن مجاني في الجزائر',
  },
};

export default function VibeConfirmationPage() {
  const searchParams = useSearchParams();
  
  const [confirmationData, setConfirmationData] = useState<{
    name: string; 
    price: string; 
    photo: string; 
    description: string; 
    landingId: string;
    customerName?: string;
    phone?: string;
    wilaya?: string;
    commune?: string;
  } | null>(null);
  
  const lang = (searchParams.get('lang') as Language) || 'fr';
  const landingId = searchParams.get('id') || '';
  
  useEffect(() => {
    const stored = sessionStorage.getItem('confirmationData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfirmationData(parsed);
      } catch (e) {
        console.error('Error parsing confirmation data', e);
      }
    }
  }, []);
  
  const productName = confirmationData?.name || 'Votre commande';
  const productPrice = confirmationData?.price || '0';
  const productPhoto = confirmationData?.photo || '';
  const productDescription = confirmationData?.description || '';
  const customerName = confirmationData?.customerName || '';
  const phone = confirmationData?.phone || '';
  const wilaya = confirmationData?.wilaya || '';
  const commune = confirmationData?.commune || '';
  
  const t = translations[lang];

  if (!confirmationData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white py-8 px-4 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="bg-zinc-900 text-white py-2 text-center text-sm">
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t.securePayment}
        </span>
      </div>

      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/template/vibe?id=${landingId}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.return}
          </Link>
          
          <button
            onClick={() => {
              const newLang = lang === 'fr' ? 'ar' : 'fr';
              const params = new URLSearchParams(window.location.search);
              params.set('lang', newLang);
              window.location.search = params.toString();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            <span className={lang === 'ar' ? 'text-orange-400' : ''}>FR</span>
            <span className="text-gray-500">/</span>
            <span className={lang === 'ar' ? '' : 'text-orange-400'}>AR</span>
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 my-8">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{t.orderConfirmed}</h1>
            <p className="text-white/90 text-sm">{t.thankYou}</p>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-sm text-gray-400 mb-3">{lang === 'ar' ? 'معلومات العميل' : 'Informations client'}</h3>
            <div className="space-y-2">
              {customerName && (
                <p className="text-white"><span className="text-gray-400">{lang === 'ar' ? 'الاسم:' : 'Nom:'}</span> {customerName}</p>
              )}
              {phone && (
                <p className="text-white"><span className="text-gray-400">{lang === 'ar' ? 'الهاتف:' : 'Téléphone:'}</span> {phone}</p>
              )}
              {wilaya && (
                <p className="text-white"><span className="text-gray-400">{lang === 'ar' ? 'الولاية:' : 'Wilaya:'}</span> {wilaya}</p>
              )}
              {commune && (
                <p className="text-white"><span className="text-gray-400">{lang === 'ar' ? 'البلدية:' : 'Commune:'}</span> {commune}</p>
              )}
            </div>
          </div>

          {/* Product */}
          <div className="p-6">
            {productPhoto && (
              <div className="aspect-video bg-gray-800 mb-6 rounded-xl overflow-hidden">
                <img 
                  src={productPhoto} 
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-2">{productName}</h2>
            {productDescription && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{productDescription}</p>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-400">{t.price}</span>
              <span className="text-2xl font-bold text-orange-500">{productPrice} DA</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.nextSteps}
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <span>{t.step1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <span>{t.step2}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <span>{t.step3}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
              <span>{t.step4}</span>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm text-gray-400 mb-6">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t.cashOnDelivery}
          </div>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {t.deliveryTime}
          </div>
        </div>

        {/* Back Button */}
        <Link
          href={`/template/vibe?id=${landingId}`}
          className="block w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-center"
        >
          {t.returnHome}
        </Link>
      </div>
    </div>
  );
}
