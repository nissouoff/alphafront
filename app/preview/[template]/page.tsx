"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const templateData: Record<string, {
  name: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
  features: string[];
}> = {
  cosmetic: {
    name: "Cosmétiques",
    icon: "💄",
    color: "from-purple-500 to-violet-500",
    bg: "bg-gradient-to-br from-purple-100 to-pink-100",
    description: "Parfait pour les produits de beauté et soins",
    features: ["Carrousel de photos", "Formulaire de commande", "Témoignages", "Section À propos"]
  },
  fashion: {
    name: "Mode & Vêtements",
    icon: "👗",
    color: "from-pink-500 to-rose-500",
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    description: "Idéal pour les boutiques de vêtements",
    features: ["Galerie produits", "Tailles & couleurs", "Zoom images", "Avis clients"]
  },
  food: {
    name: "Alimentation",
    icon: "🍎",
    color: "from-green-500 to-emerald-500",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    description: "Pour les produits alimentaires et épiciers",
    features: ["Catégories produits", "Panier d'achat", "Livraison", "Promotions"]
  },
  tech: {
    name: "High-Tech",
    icon: "📱",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    description: "Pour les gadgets et produits tech",
    features: ["Spécifications", "Comparaison", "Garantie", "Support technique"]
  },
  home: {
    name: "Maison & Déco",
    icon: "🏠",
    color: "from-orange-500 to-amber-500",
    bg: "bg-gradient-to-br from-orange-50 to-amber-50",
    description: "Décoration et accessoires maison",
    features: ["Collections", "Inspiration", "Conseils déco", "Garantie satisfait"]
  },
  sport: {
    name: "Sport & Fitness",
    icon: "💪",
    color: "from-red-500 to-orange-500",
    bg: "bg-gradient-to-br from-red-50 to-orange-50",
    description: "Équipements sportifs et fitness",
    features: ["Programmes", "Suivi commande", "Guide taille", "Retours gratuits"]
  },
  jewelry: {
    name: "Bijoux & Accessoires",
    icon: "💎",
    color: "from-yellow-500 to-gold-500",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
    description: "Bijoux, montres et accessoires",
    features: ["Zoom haute définition", "Certificat authenticité", "Emballage luxe", "Gravure personnalisée"]
  },
  services: {
    name: "Services",
    icon: "⚡",
    color: "from-indigo-500 to-blue-500",
    bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
    description: "Pour les services et freelances",
    features: ["Portfolio", "Témoignages", "Prise de rendez-vous", "Devis en ligne"]
  }
};

export default function PreviewPage() {
  const params = useParams();
  const templateId = params.template as string;
  const template = templateData[templateId];
  const [showChooseModal, setShowChooseModal] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Template non trouvé</h1>
          <Link href="/templates" className="text-indigo-500 hover:underline">
            Retour aux templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowChooseModal(true)}
          className={`px-8 py-4 bg-gradient-to-r ${template.color} text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Choisir ce template
        </button>
      </div>

      <header className="bg-white border-b border-zinc-200 py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-zinc-900">Aperçu - {template.name}</span>
        </div>
        <Link href="/templates" className="text-sm text-zinc-500 hover:text-zinc-700">
          ← Retour aux templates
        </Link>
      </header>

      <main className="pb-32">
        <div className={`h-80 ${template.bg} flex items-center justify-center`}>
          <div className="text-center">
            <span className="text-9xl">{template.icon}</span>
            <h1 className="text-4xl font-bold text-zinc-900 mt-6">{template.name}</h1>
            <p className="text-xl text-zinc-600 mt-2">{template.description}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12 text-center">Fonctionnalités incluses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {template.features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-zinc-900">{feature}</h3>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Section Hero</h2>
            <p className="text-zinc-600 mb-6">Votre titre accrocheur et description du produit</p>
            <button className={`px-6 py-3 bg-gradient-to-r ${template.color} text-white font-medium rounded-xl`}>
              Voir le produit
            </button>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 mb-4">Galerie Photos</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-zinc-100 rounded-lg"></div>
                <div className="aspect-square bg-zinc-100 rounded-lg"></div>
                <div className="aspect-square bg-zinc-100 rounded-lg"></div>
                <div className="aspect-square bg-zinc-100 rounded-lg"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 mb-4">Formulaire Commande</h3>
              <div className="space-y-3">
                <div className="h-10 bg-zinc-50 rounded-lg"></div>
                <div className="h-10 bg-zinc-50 rounded-lg"></div>
                <div className="h-10 bg-zinc-50 rounded-lg"></div>
                <div className={`h-12 bg-gradient-to-r ${template.color} rounded-lg opacity-50`}></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 mb-4">Témoignages</h3>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600">Excellent produit, je recommande !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showChooseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowChooseModal(false)}>
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6" 
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Type de projet</h2>
            <p className="text-zinc-600 mb-6">Voulez-vous créer une landing page (1 produit) ou une boutique complète (plusieurs produits) ?</p>
            
            <div className="space-y-4">
              <Link
                href={`/templates?create=${templateId}&type=landing`}
                className="block w-full p-4 border-2 border-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Landing Page</p>
                    <p className="text-sm text-zinc-600">Un seul produit en vente</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href={`/templates?create=${templateId}&type=boutique`}
                className="block w-full p-4 border-2 border-purple-500 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Boutique Complète</p>
                    <p className="text-sm text-zinc-600">Plusieurs produits en vente</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <button
              onClick={() => setShowChooseModal(false)}
              className="w-full mt-4 py-3 border border-zinc-300 text-zinc-600 hover:bg-zinc-50 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
