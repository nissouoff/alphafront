"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

interface OrderConfirmation {
  order: any;
  productName: string;
  productPrice: string;
  customerName: string;
  customerFirstname: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  landingName: string;
  orderId: string;
  shopSlug: string;
  orderDate: string;
  orderTime: string;
}

function ConfirmationPageContent() {
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [shopSlug, setShopSlug] = useState<string>("");
  const [landingName, setLandingName] = useState<string>("la boutique");

  useEffect(() => {
    const orderData = localStorage.getItem('order_confirmation');
    if (orderData) {
      const data: OrderConfirmation = JSON.parse(orderData);
      setConfirmation(data);
      setLandingName(data.landingName || "la boutique");
      setShopSlug(data.shopSlug || "");
      localStorage.removeItem('order_confirmation');
    }
  }, []);

  if (!confirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Commande non trouvée</h1>
          <p className="text-zinc-600 mb-6">Nous n'avons pas pu trouver les détails de votre commande.</p>
          <Link href={shopSlug ? `/shop/${shopSlug}` : "/"} className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const fullName = [confirmation.customerName, confirmation.customerFirstname].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-900 mb-2 text-center">Commande envoyée !</h1>
        <p className="text-zinc-600 text-center mb-6">
          Votre commande a été envoyée avec succès.
        </p>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-zinc-900 mb-3">Détails de la commande</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-zinc-700">Numéro:</span> <span className="font-bold text-zinc-900">#{confirmation.orderId}</span></p>
            <p><span className="text-zinc-700">Date:</span> <span className="font-bold text-zinc-900">{confirmation.orderDate}</span></p>
            <p><span className="text-zinc-700">Heure:</span> <span className="font-bold text-zinc-900">{confirmation.orderTime}</span></p>
            <p><span className="text-zinc-700">Produit:</span> <span className="font-bold text-zinc-900">{confirmation.productName}</span></p>
            <p><span className="text-zinc-700">Prix:</span> <span className="font-bold text-zinc-900">{confirmation.productPrice} DZD</span></p>
            {fullName && (
              <p><span className="text-zinc-700">Client:</span> <span className="font-bold text-zinc-900">{fullName}</span></p>
            )}
            {confirmation.phone && (
              <p><span className="text-zinc-700">Téléphone:</span> <span className="font-bold text-zinc-900">{confirmation.phone}</span></p>
            )}
            {confirmation.wilaya && (
              <p><span className="text-zinc-700">Wilaya:</span> <span className="font-bold text-zinc-900">{confirmation.wilaya}</span></p>
            )}
            {confirmation.commune && (
              <p><span className="text-zinc-700">Commune:</span> <span className="font-bold text-zinc-900">{confirmation.commune}</span></p>
            )}
            {confirmation.address && (
              <p><span className="text-zinc-700">Adresse:</span> <span className="font-bold text-zinc-900">{confirmation.address}</span></p>
            )}
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-xl mb-6 border border-yellow-200">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-yellow-700 text-sm">
              <strong>Confirmation par appel:</strong> Vous recevrez un appel depuis notre boutique dans les prochaines minutes pour confirmer votre commande.
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl mb-6">
          <p className="text-blue-700 text-sm text-center">
            Le paiement se fera à la livraison. Merci pour votre confiance !
          </p>
        </div>

        <Link href={shopSlug ? `/shop/${shopSlug}` : "/"} className="block w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center">
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ConfirmationPageContent />
    </Suspense>
  );
}
