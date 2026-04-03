"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

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
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          bg: "bg-zinc-900",
          gradient: "from-zinc-900 via-zinc-800 to-zinc-900",
          card: "bg-zinc-800/50 border-zinc-700/50",
          cardHover: "hover:border-purple-500/50",
          text: "text-zinc-100",
          textMuted: "text-zinc-400",
          border: "border-zinc-700/50",
          button: "bg-purple-500",
          headerBg: "bg-zinc-900/80",
          headerBorder: "border-zinc-700/50",
          badge: "bg-purple-500/20 text-purple-300",
          accent: "from-purple-400 to-pink-400",
          accentText: "text-purple-400",
        };
      case "blue":
        return {
          bg: "bg-blue-950",
          gradient: "from-blue-950 via-blue-900 to-blue-950",
          card: "bg-blue-900/50 border-blue-700/50",
          cardHover: "hover:border-blue-500/50",
          text: "text-blue-100",
          textMuted: "text-blue-300",
          border: "border-blue-700/50",
          button: "bg-blue-500",
          headerBg: "bg-blue-900/80",
          headerBorder: "border-blue-700/50",
          badge: "bg-blue-500/20 text-blue-300",
          accent: "from-blue-400 to-cyan-400",
          accentText: "text-blue-400",
        };
      case "orange":
        return {
          bg: "bg-zinc-950",
          gradient: "from-zinc-950 via-zinc-900 to-zinc-950",
          card: "bg-zinc-900/50 border-orange-500/30",
          cardHover: "hover:border-orange-500/50",
          text: "text-orange-50",
          textMuted: "text-orange-200/60",
          border: "border-orange-500/30",
          button: "bg-orange-500",
          headerBg: "bg-zinc-950/80 backdrop-blur-xl",
          headerBorder: "border-orange-500/30",
          badge: "bg-orange-500/20 text-orange-300",
          accent: "from-orange-400 to-red-400",
          accentText: "text-orange-400",
        };
      default:
        return {
          bg: "bg-zinc-50",
          gradient: "from-zinc-50 via-white to-zinc-50",
          card: "bg-white/80 border-zinc-200",
          cardHover: "hover:border-zinc-400",
          text: "text-zinc-900",
          textMuted: "text-zinc-600",
          border: "border-zinc-200",
          button: "bg-zinc-900",
          headerBg: "bg-white/80 backdrop-blur-xl",
          headerBorder: "border-zinc-200",
          badge: "bg-zinc-900/10 text-zinc-700",
          accent: "from-zinc-600 to-zinc-800",
          accentText: "text-zinc-800",
        };
    }
  };

  const c = getThemeClasses();

  if (loading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${c.gradient}`}>
        <div className={`animate-spin w-12 h-12 border-4 ${c.button} border-t-transparent rounded-full`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${c.gradient}`}>
      {/* Header */}
      <header className={`border-b ${c.headerBorder} ${c.headerBg} backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/dashboard" className={`flex items-center gap-2 sm:gap-3 ${c.text}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${c.accent} rounded-xl flex items-center justify-center`}>
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={`text-lg sm:text-xl font-bold ${c.text}`}>ShopLaunch</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className={`${c.textMuted} hover:${c.text} transition-colors`}>
              Dashboard
            </Link>
            <Link href="/templates-landing" className={c.text}>
              Landing Pages
            </Link>
            <Link href="/templates" className={`${c.textMuted} hover:${c.text} transition-colors`}>
              Boutiques
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-700/50 px-4 py-4 space-y-3">
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-400 hover:text-white transition-colors py-2"
            >
              Dashboard
            </Link>
            <Link 
              href="/templates-landing" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white font-medium py-2"
            >
              Landing Pages
            </Link>
            <Link 
              href="/templates" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-400 hover:text-white transition-colors py-2"
            >
              Boutiques
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse"></span>
            Templates Professionnels
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2">
            Créez votre <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Landing Page</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-zinc-400 max-w-2xl mx-auto px-4">
            Sélectionnez un template, personnalisez-le et publiez-le en quelques minutes
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {TEMPLATES.map((template) => (
            <div 
              key={template.id}
              className="group relative bg-zinc-800/50 rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Preview Image */}
              <div className={`h-40 sm:h-48 md:h-64 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-20 sm:w-32 h-20 sm:h-32 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-black/20 rounded-full blur-3xl"></div>
                </div>
                
                {/* Template Preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <span className="text-5xl sm:text-6xl md:text-8xl block mb-2 sm:mb-4">{template.emoji}</span>
                    <span className="text-white/90 text-sm sm:text-base md:text-lg font-medium">{template.name}</span>
                  </div>
                </div>

                {/* Hover Overlay - Hidden on mobile, shown on hover for desktop */}
                <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-4">
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
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{template.name}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6">{template.description}</p>
                
                <Link
                  href={`/templates-category?category=${template.id}`}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${template.gradient} text-white hover:opacity-90 text-sm sm:text-base`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
