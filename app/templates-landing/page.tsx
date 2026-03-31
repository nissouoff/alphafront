"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const TEMPLATES = [
  {
    id: "cosmetic",
    name: "Cosmétique Futuriste",
    description: "Template moderne et élégant pour produits cosmétiques",
    image: "/screenshots/cosmetic-futuristic.png",
    emoji: "✨",
    gradient: "from-purple-600 via-pink-500 to-rose-500",
  },
  {
    id: "fashion",
    name: "Mode & Lifestyle",
    description: "Style épuré pour boutiques de mode",
    image: "/screenshots/fashion.png",
    emoji: "👗",
    gradient: "from-zinc-900 via-zinc-700 to-zinc-500",
  },
  {
    id: "food",
    name: "Gastronomie",
    description: "Template appétissant pour restaurants et food",
    image: "/screenshots/food.png",
    emoji: "🍕",
    gradient: "from-orange-500 via-red-500 to-yellow-500",
  },
  {
    id: "tech",
    name: "Tech & Innovation",
    description: "Design futuriste pour produits technologiques",
    image: "/screenshots/tech.png",
    emoji: "📱",
    gradient: "from-blue-600 via-cyan-500 to-teal-500",
  },
  {
    id: "jewelry",
    name: "Bijoux & Luxe",
    description: "Élégance et raffinement pour bijoux",
    image: "/screenshots/jewelry.png",
    emoji: "💎",
    gradient: "from-amber-500 via-yellow-400 to-orange-400",
  },
  {
    id: "sport",
    name: "Sport & Fitness",
    description: "Énergie et dynamisme pour sports",
    image: "/screenshots/sport.png",
    emoji: "💪",
    gradient: "from-green-600 via-emerald-500 to-teal-400",
  },
];

export default function TemplatesLandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handlePreview = (templateId: string) => {
    window.open(`/template/${templateId}?preview=true`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">ShopLaunch</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/templates-landing" className="text-white font-medium">
              Landing Pages
            </Link>
            <Link href="/templates" className="text-zinc-400 hover:text-white transition-colors">
              Boutiques
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            Templates Professionnels
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Créez votre <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Landing Page</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Sélectionnez un template, personnalisez-le et publiez-le en quelques minutes
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((template) => (
            <div 
              key={template.id}
              className="group relative bg-zinc-800/50 rounded-3xl overflow-hidden border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Preview Image */}
              <div className={`h-64 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-black/20 rounded-full blur-3xl"></div>
                </div>
                
                {/* Template Preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-8xl block mb-4">{template.emoji}</span>
                    <span className="text-white/90 text-lg font-medium">{template.name}</span>
                  </div>
                </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <Link
                  href={`/templates-category?category=${template.id}`}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Voir les templates
                </Link>
              </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                <p className="text-zinc-400 text-sm mb-6">{template.description}</p>
                
                <Link
                  href={`/templates-category?category=${template.id}`}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${template.gradient} text-white hover:opacity-90`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Voir les templates
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
