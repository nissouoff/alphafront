"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createLanding } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_TEMPLATES = {
  cosmetic: {
    name: "Cosmétiques",
    description: "Des landing pages élégantes pour produits de beauté et cosmétiques premium. Designs modernes et conversions optimisées.",
    gradient: "from-rose-400 via-pink-400 to-rose-500",
    accentColor: "rose",
    icon: "✨",
    templates: [
      {
        id: "cosmetic",
        name: "Glow",
        description: "Design moderne avec effets néon et animations fluides",
        previewUrl: "/template/cosmetic?preview=true",
        features: ["Animations fluides", "Effets néon", "Conversion optimisée"],
      },
      {
        id: "skinova",
        name: "Skinova",
        description: "Design luxueux et élégant pour cosmétiques premium",
        previewUrl: "/template/skinova?preview=true",
        features: ["Style luxe", "Typographie élégante", "Images plein écran"],
      },
    ],
  },
  fashion: {
    name: "Mode & Lifestyle",
    description: "Style épuré pour boutiques de mode",
    gradient: "from-pink-400 via-rose-400 to-pink-500",
    accentColor: "pink",
    icon: "👗",
    templates: [
      {
        id: "fashion",
        name: "Chic",
        description: "Design contemporain pour marques de mode",
        previewUrl: "/template/fashion?preview=true",
        features: ["Grid élégant", "Galerie photos", "Lookbook"],
      },
    ],
  },
  food: {
    name: "Gastronomie",
    description: "Template appétissant pour restaurants et food",
    gradient: "from-amber-400 via-orange-400 to-amber-500",
    accentColor: "amber",
    icon: "🍽️",
    templates: [
      {
        id: "food",
        name: "Gourmet",
        description: "Design vibrant pour restaurants",
        previewUrl: "/template/food?preview=true",
        features: ["Menu interactif", "Photos appétissantes", "Réservation"],
      },
    ],
  },
  tech: {
    name: "Tech & Innovation",
    description: "Design futuriste pour produits technologiques",
    gradient: "from-cyan-400 via-blue-400 to-cyan-500",
    accentColor: "cyan",
    icon: "🚀",
    templates: [
      {
        id: "tech",
        name: "Nexus",
        description: "Design high-tech avec animations",
        previewUrl: "/template/tech?preview=true",
        features: ["Animations futuristes", "Effets glassmorphism", "Dark mode"],
      },
    ],
  },
  jewelry: {
    name: "Bijoux & Luxe",
    description: "Élégance et raffinement pour bijoux",
    gradient: "from-yellow-400 via-amber-400 to-yellow-500",
    accentColor: "amber",
    icon: "💎",
    templates: [
      {
        id: "jewelry",
        name: "Prestige",
        description: "Design raffiné pour bijoux",
        previewUrl: "/template/jewelry?preview=true",
        features: ["Style luxe", "Or et argent", "Galerie premium"],
      },
    ],
  },
  sport: {
    name: "Sport & Fitness",
    description: "Énergie et dynamisme pour sports",
    gradient: "from-emerald-400 via-green-400 to-emerald-500",
    accentColor: "emerald",
    icon: "💪",
    templates: [
      {
        id: "sport",
        name: "FitPro",
        description: "Design énergique pour fitness",
        previewUrl: "/template/sport?preview=true",
        features: ["Énergie haute", "Programmes", "Tracking"],
      },
    ],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
  }
};

function useScaleIframe(containerRef: React.RefObject<HTMLDivElement | null>, iframeWidth = 1200) {
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const scaleX = width / iframeWidth;
      const scaleY = height / 900;
      setScale(Math.min(scaleX, scaleY, 1) * 0.98);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [containerRef, iframeWidth]);

  return scale;
}

function TemplateCard({ template, onSelect }: {
  template: { id: string; name: string; description: string; previewUrl: string; features?: string[] };
  onSelect: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const scale = useScaleIframe(previewRef, 1200);

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 ease-out
        ${isHovered ? 'shadow-2xl shadow-rose-500/10 -translate-y-2' : 'shadow-gray-200'}
      `}>
        {/* Preview Area */}
        <div 
          ref={previewRef}
          className="relative h-[280px] sm:h-[350px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-rose-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
          </div>

          {/* Scaled Preview */}
          <div 
            className="absolute left-1/2 origin-top transition-transform duration-300"
            style={{
              transform: `translateX(-50%) scale(${scale})`,
              width: '1200px',
              height: '900px',
            }}
          >
            <iframe
              src={`/api/template-html/${template.id}`}
              className="w-full h-full border-none bg-white shadow-xl"
              title={`Preview of ${template.name}`}
              loading="lazy"
            />
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4"
          >
            <button
              onClick={() => window.open(template.previewUrl, '_blank')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-xl cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Aperçu
            </button>
          </motion.div>

          {/* Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              LIVE
            </span>
          </div>

          {/* Gradient Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
        </div>

        {/* Card Footer */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{template.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
          </div>

          {/* Features Tags */}
          {template.features && (
            <div className="flex flex-wrap gap-2 mb-5">
              {template.features.slice(0, 3).map((feature, i) => (
                <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => window.open(template.previewUrl, '_blank')}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Aperçu
            </button>
            <button
              onClick={() => onSelect(template.id)}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white shadow-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:shadow-xl hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Utiliser
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesCategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleSelect = (templateId: string) => {
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erreur lors de la création";
      toast.error(message);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-xl group-hover:shadow-rose-500/40 transition-all">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ShopLaunch</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/templates-landing" className="text-sm text-rose-500 font-semibold">
                Landing Pages
              </Link>
              <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Boutiques
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-rose-500/30">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-rose-100 mt-4 pt-4 space-y-3">
              <Link href="/dashboard" className="block text-gray-600 hover:text-gray-900 py-2 font-medium">Dashboard</Link>
              <Link href="/templates-landing" className="block text-rose-500 font-semibold py-2">Landing Pages</Link>
              <Link href="/templates" className="block text-gray-600 hover:text-gray-900 py-2 font-medium">Boutiques</Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/templates-landing" className="inline-flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tous les templates
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-rose-200 rounded-full mb-8 shadow-sm"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">{category.templates.length} templates disponibles</span>
          </motion.div>
          
          {/* Icon */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/20"
          >
            <span className="text-4xl">{category.icon}</span>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-rose-800 to-gray-900 bg-clip-text text-transparent">
              {category.name}
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            {category.description}
          </motion.p>

          {/* Decorative Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-24 h-1 mx-auto mt-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full origin-center"
          />
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {category.templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {category.templates.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-white border border-rose-200 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun template disponible</h3>
            <p className="text-gray-500">De nouveaux templates seront bientôt ajoutés.</p>
          </motion.div>
        )}

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-rose-500/5 border border-rose-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Besoin d&apos;un template sur mesure ?
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Notre équipe peut créer un template personnalisé pour votre marque.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-rose-500/30 transition-all">
              Contacter-nous
            </button>
          </div>
        </motion.div>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.templates.find(t => t.id === selectedTemplate)?.name}
                </h3>
                <p className="text-gray-500">
                  Donnez un nom à votre landing page
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la landing page
                  </label>
                  <input
                    type="text"
                    value={landingName}
                    onChange={(e) => setLandingName(e.target.value)}
                    placeholder="Ex: Ma Boutique Cosmétique"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!landingName.trim() || creating}
                    className="flex-1 py-4 rounded-xl font-semibold text-white shadow-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:shadow-xl hover:shadow-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        Créer ma landing
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 mt-20 bg-white border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">ShopLaunch</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 ShopLaunch. Creez vos landing pages en quelques minutes.
          </p>
        </div>
      </footer>
    </div>
  );
}
