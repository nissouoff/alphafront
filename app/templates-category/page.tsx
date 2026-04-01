"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createLanding } from "@/lib/api";

const CATEGORY_TEMPLATES = {
  cosmetic: {
    name: "Cosmétiques",
    description: "Template moderne et élégant pour produits cosmétiques",
    gradient: "from-rose-500 via-pink-500 to-purple-500",
    emoji: "✨",
    templates: [
      {
        id: "cosmetic",
        name: "Futuriste",
        description: "Design moderne avec effets néon et animations fluides",
        preview: "/previews/cosmetic.png",
        previewUrl: "/template/cosmetic?preview=true",
        bgPreview: "from-rose-100 via-pink-50 to-purple-50",
      },
    ],
  },
  fashion: {
    name: "Mode & Lifestyle",
    description: "Style épuré pour boutiques de mode",
    gradient: "from-zinc-900 via-zinc-700 to-zinc-500",
    emoji: "👗",
    templates: [
      {
        id: "fashion",
        name: "Moderne",
        description: "Design contemporain pour marques de mode",
        preview: "/previews/fashion.png",
        previewUrl: "/template/fashion?preview=true",
        bgPreview: "from-zinc-100 via-gray-50 to-zinc-100",
      },
    ],
  },
  food: {
    name: "Gastronomie",
    description: "Template appétissant pour restaurants et food",
    gradient: "from-orange-500 via-red-500 to-yellow-500",
    emoji: "🍕",
    templates: [
      {
        id: "food",
        name: "Moderne",
        description: "Design vibrant pour restaurants",
        preview: "/previews/food.png",
        previewUrl: "/template/food?preview=true",
        bgPreview: "from-orange-100 via-red-50 to-yellow-50",
      },
    ],
  },
  tech: {
    name: "Tech & Innovation",
    description: "Design futuriste pour produits technologiques",
    gradient: "from-blue-600 via-cyan-500 to-teal-500",
    emoji: "📱",
    templates: [
      {
        id: "tech",
        name: "Futuriste",
        description: "Design high-tech avec animations",
        preview: "/previews/tech.png",
        previewUrl: "/template/tech?preview=true",
        bgPreview: "from-blue-100 via-cyan-50 to-teal-50",
      },
    ],
  },
  jewelry: {
    name: "Bijoux & Luxe",
    description: "Élégance et raffinement pour bijoux",
    gradient: "from-amber-500 via-yellow-400 to-orange-400",
    emoji: "💎",
    templates: [
      {
        id: "jewelry",
        name: "Élégant",
        description: "Design raffiné pour bijoux",
        preview: "/previews/jewelry.png",
        previewUrl: "/template/jewelry?preview=true",
        bgPreview: "from-amber-100 via-yellow-50 to-orange-50",
      },
    ],
  },
  sport: {
    name: "Sport & Fitness",
    description: "Énergie et dynamisme pour sports",
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    emoji: "💪",
    templates: [
      {
        id: "sport",
        name: "Dynamique",
        description: "Design énergique pour fitness",
        preview: "/previews/sport.png",
        previewUrl: "/template/sport?preview=true",
        bgPreview: "from-green-100 via-emerald-50 to-teal-50",
      },
    ],
  },
};

export default function TemplatesCategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <TemplatesCategoryContent />
    </Suspense>
  );
}

function TemplatesCategoryContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') || 'cosmetic';
  const { user, loading } = useAuth();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [landingName, setLandingName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const category = CATEGORY_TEMPLATES[categoryId as keyof typeof CATEGORY_TEMPLATES] || CATEGORY_TEMPLATES.cosmetic;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handlePreview = (previewUrl: string) => {
    window.open(previewUrl, '_blank');
  };

  const handleChoose = (templateId: string) => {
    setSelectedTemplate(templateId);
    setLandingName(category.templates.find(t => t.id === templateId)?.name || '');
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!user || !landingName.trim() || !selectedTemplate) return;
    
    setCreating(true);
    
    try {
      const templateCategory = selectedTemplate.split('-')[0];
      const result = await createLanding(
        landingName.trim(),
        templateCategory,
        true
      );
      
      if (result.landing?.id) {
        toast.success("Landing créée !");
        setShowModal(false);
        router.push(`/editor/landing?id=${result.landing.id}&template=${templateCategory}`);
      } else {
        toast.error("Erreur lors de la création");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">ShopLaunch</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
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
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link href="/templates-landing" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm sm:text-base">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Tous les templates</span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${category.gradient} rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6`}>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
            {category.templates.length} templates disponibles
          </div>
          <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${category.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
            <span className="text-2xl sm:text-3xl md:text-4xl">{category.emoji}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2">
            Templates <span className={`bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>{category.name}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-zinc-400 max-w-2xl mx-auto px-4">
            {category.description}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {category.templates.map((template) => (
            <div 
              key={template.id}
              className="group relative bg-zinc-800/50 rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-700/50 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10"
            >
              {/* Browser Preview Frame */}
              <div className="h-40 sm:h-48 md:h-64 bg-zinc-700 relative">
                {/* Browser Chrome */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-600 flex items-center px-2 gap-1.5 z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  <div className="flex-1 mx-2">
                    <div className="bg-zinc-700 rounded px-2 py-0.5 text-[9px] text-zinc-300 truncate">
                      localhost:3000/template/{template.id}
                    </div>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="absolute top-6 left-0 right-0 bottom-0 overflow-hidden">
                  {template.preview ? (
                    <div className="w-full h-full relative">
                      <img 
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.classList.add('bg-gradient-to-br', 'from-rose-100', 'to-amber-100');
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-center">
                                <div class="w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl mx-auto mb-2 flex items-center justify-center">
                                  <span class="text-2xl">${category.emoji}</span>
                                </div>
                                <p class="text-zinc-600 text-xs font-medium">${template.name}</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${template.bgPreview || category.gradient} opacity-50 flex items-center justify-center`}>
                      <div className="text-center">
                        <span className="text-5xl sm:text-6xl block mb-2">{category.emoji}</span>
                        <span className="text-white/90 text-sm font-medium">{template.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Overlay - Hidden on mobile */}
                <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-4">
                  <button
                    onClick={() => handlePreview(template.previewUrl || template.preview)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Aperçu
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{template.name}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6">{template.description}</p>
                
                {/* Preview button - visible on mobile */}
                <button
                  onClick={() => handlePreview(template.previewUrl || template.preview)}
                  className="md:hidden w-full py-2.5 mb-2 border border-zinc-600 text-zinc-300 font-medium rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Aperçu
                </button>

                <button
                  onClick={() => handleChoose(template.id)}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${category.gradient} text-white hover:opacity-90 text-sm sm:text-base`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Utiliser ce template
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full border border-zinc-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${category.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                <span className="text-2xl sm:text-3xl">{category.emoji}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {category.templates.find(t => t.id === selectedTemplate)?.name}
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base">
                Entrez le nom de votre landing page
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nom de la landing page
                </label>
                <input
                  type="text"
                  value={landingName}
                  onChange={(e) => setLandingName(e.target.value)}
                  placeholder="Ex: Ma Boutique Cosmetique"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-base"
                  autoFocus
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-zinc-600 text-zinc-300 font-medium rounded-xl hover:bg-zinc-700 transition-colors text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!landingName.trim() || creating}
                  className={`flex-1 py-3 bg-gradient-to-r ${category.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base`}
                >
                  {creating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Créer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
