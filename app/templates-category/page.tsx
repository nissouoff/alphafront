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
        preview: "/template/fashion?preview=true",
        previewUrl: "/template/fashion?preview=true",
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
        preview: "/template/food?preview=true",
        previewUrl: "/template/food?preview=true",
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
        preview: "/template/tech?preview=true",
        previewUrl: "/template/tech?preview=true",
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
        preview: "/template/jewelry?preview=true",
        previewUrl: "/template/jewelry?preview=true",
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
        preview: "/template/sport?preview=true",
        previewUrl: "/template/sport?preview=true",
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/templates-landing" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tous les templates
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.gradient} rounded-full text-sm font-medium text-white mb-6`}>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            {category.templates.length} templates disponibles
          </div>
          <div className={`w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <span className="text-4xl">{category.emoji}</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Templates <span className={`bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>{category.name}</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.templates.map((template) => (
            <div 
              key={template.id}
              className="group relative bg-zinc-800/50 rounded-3xl overflow-hidden border border-zinc-700/50 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10"
            >
              {/* Preview Image */}
              <div className="h-72 bg-zinc-700 relative">
                {template.preview ? (
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-cover object-center"
                    style={{ objectPosition: 'center top' }}
                  />
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-50`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <span className="text-6xl block mb-2">{category.emoji}</span>
                        <span className="text-white/90 text-lg font-medium">{template.name}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
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
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                <p className="text-zinc-400 text-sm mb-6">{template.description}</p>
                
                <button
                  onClick={() => handleChoose(template.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${category.gradient} text-white hover:opacity-90`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="bg-zinc-800 rounded-3xl p-8 max-w-md w-full border border-zinc-700 shadow-2xl">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <span className="text-3xl">{category.emoji}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {category.templates.find(t => t.id === selectedTemplate)?.name}
              </h3>
              <p className="text-zinc-400">
                Entrez le nom de votre landing page
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nom de la landing page
                </label>
                <input
                  type="text"
                  value={landingName}
                  onChange={(e) => setLandingName(e.target.value)}
                  placeholder="Ex: Ma Boutique Cosmetique"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-zinc-600 text-zinc-300 font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!landingName.trim() || creating}
                  className={`flex-1 py-3 bg-gradient-to-r ${category.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
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
