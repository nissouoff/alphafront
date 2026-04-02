"use client";

import { useState, Suspense } from "react";
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
    description: "Des landing pages élégantes pour produits de beauté et cosmétiques premium",
    gradient: "from-orange-500 via-orange-400 to-orange-600",
    accentColor: "orange",
    templates: [
      {
        id: "cosmetic",
        name: "Glow",
        description: "Design moderne avec effets néon et animations fluides",
        previewUrl: "/template/cosmetic?preview=true",
      },
      {
        id: "skinova",
        name: "Skinova",
        description: "Design luxueux et élégant pour cosmétiques premium",
        previewUrl: "/template/skinova?preview=true",
      },
    ],
  },
  fashion: {
    name: "Mode & Lifestyle",
    description: "Style épuré pour boutiques de mode",
    gradient: "from-orange-500 via-orange-400 to-orange-600",
    accentColor: "orange",
    templates: [
      {
        id: "fashion",
        name: "Moderne",
        description: "Design contemporain pour marques de mode",
        previewUrl: "/template/fashion?preview=true",
      },
    ],
  },
  food: {
    name: "Gastronomie",
    description: "Template appétissant pour restaurants et food",
    gradient: "from-orange-500 via-orange-400 to-orange-600",
    accentColor: "orange",
    templates: [
      {
        id: "food",
        name: "Moderne",
        description: "Design vibrant pour restaurants",
        previewUrl: "/template/food?preview=true",
      },
    ],
  },
  tech: {
    name: "Tech & Innovation",
    description: "Design futuriste pour produits technologiques",
    gradient: "from-orange-500 via-orange-400 to-orange-600",
    accentColor: "orange",
    templates: [
      {
        id: "tech",
        name: "Futuriste",
        description: "Design high-tech avec animations",
        previewUrl: "/template/tech?preview=true",
      },
    ],
  },
  jewelry: {
    name: "Bijoux & Luxe",
    description: "Élégance et raffinement pour bijoux",
    gradient: "from-orange-500 via-orange-400 to-orange-600",
    accentColor: "orange",
    templates: [
      {
        id: "jewelry",
        name: "Élégant",
        description: "Design raffiné pour bijoux",
        previewUrl: "/template/jewelry?preview=true",
      },
    ],
  },
  sport: {
    name: "Sport & Fitness",
    description: "Énergie et dynamisme pour sports",
    gradient: "from-orange-500 via-orange-400 to-orange-600",
    accentColor: "orange",
    templates: [
      {
        id: "sport",
        name: "Dynamique",
        description: "Design énergique pour fitness",
        previewUrl: "/template/sport?preview=true",
      },
    ],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

function TemplatePreviewModal({ template, isOpen, onClose }: {
  template: { id: string; name: string; previewUrl: string } | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleOpenPreview = () => {
    if (template) {
      window.open(template.previewUrl, '_blank');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && template && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-orange-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`/api/template-html/${template.id}`}
              className="w-full h-[600px] border-none"
              title={`Preview of ${template.name}`}
            />
            <div className="p-6 bg-black border-t border-orange-500/30 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {template.name}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-500 hover:text-black transition-all"
                >
                  Fermer
                </button>
                <button
                  onClick={handleOpenPreview}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ouvrir dans un nouvel onglet
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TemplateCard({ template, category, onPreview, onSelect }: {
  template: { id: string; name: string; description: string; previewUrl: string; previewImage?: string };
  category: typeof CATEGORY_TEMPLATES.cosmetic;
  onPreview: (template: { id: string; name: string; previewUrl: string }) => void;
  onSelect: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative bg-black rounded-2xl overflow-hidden border border-orange-500/20
        transition-all duration-500 ease-out
        ${isHovered ? 'border-orange-500/50 shadow-lg shadow-orange-500/10' : ''}
      `}>
        {/* Preview Area */}
        <div className="relative h-[320px] overflow-hidden bg-zinc-900">
          {/* Live Preview - iFrame */}
          <iframe
            src={`/api/template-html/${template.id}`}
            className="w-full h-full border-none transform scale-50 origin-top-left"
            style={{ width: '200%', height: '200%' }}
            title={`Preview of ${template.name}`}
            loading="lazy"
          />

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center gap-4"
          >
            <button
              onClick={() => onPreview(template)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black rounded-full font-bold hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Aperçu
            </button>
          </motion.div>

          {/* Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1.5 bg-orange-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-black shadow-lg">
              LIVE
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-5 bg-black border-t border-orange-500/20">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
            <p className="text-sm text-zinc-400">{template.description}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onPreview(template)}
              className="flex-1 py-2.5 px-4 border-2 border-orange-500 text-orange-500 rounded-lg font-bold hover:bg-orange-500 hover:text-black transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Aperçu
            </button>
            <button
              onClick={() => onSelect(template.id)}
              className="flex-1 py-2.5 px-4 rounded-lg font-bold text-black shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 text-sm"
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
  const [previewingTemplate, setPreviewingTemplate] = useState<{ id: string; name: string; previewUrl: string } | null>(null);

  const category = CATEGORY_TEMPLATES[categoryId as keyof typeof CATEGORY_TEMPLATES] || CATEGORY_TEMPLATES.cosmetic;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const handlePreview = (template: { id: string; name: string; previewUrl: string }) => {
    setPreviewingTemplate(template);
  };

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
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-xl border-b border-orange-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">ShopLaunch</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/templates-landing" className="text-sm text-orange-500 font-medium">
                Landing Pages
              </Link>
              <Link href="/templates" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Boutiques
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-orange-500/30">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-orange-500/20 mt-4 pt-4 space-y-3">
              <Link href="/dashboard" className="block text-zinc-400 hover:text-white py-2">Dashboard</Link>
              <Link href="/templates-landing" className="block text-orange-500 font-medium py-2">Landing Pages</Link>
              <Link href="/templates" className="block text-zinc-400 hover:text-white py-2">Boutiques</Link>
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
          className="mb-8"
        >
          <Link href="/templates-landing" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tous les templates
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-orange-500">{category.templates.length} templates disponibles</span>
          </div>
          
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
            <span className="text-4xl text-black">✨</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              {category.name}
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            {category.description}
          </p>
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
              category={category}
              onPreview={handlePreview}
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
            <div className="w-24 h-24 mx-auto mb-6 bg-zinc-900 border border-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun template disponible</h3>
            <p className="text-zinc-400">De nouveaux templates seront bientôt ajoutés.</p>
          </motion.div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border border-orange-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-orange-500/10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <span className="text-3xl text-black">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.templates.find(t => t.id === selectedTemplate)?.name}
                </h3>
                <p className="text-zinc-400">
                  Donnez un nom à votre landing page
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
                    placeholder="Ex: Ma Boutique Cosmétique"
                    className="w-full px-5 py-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border-2 border-zinc-800 text-zinc-300 font-medium rounded-xl hover:bg-zinc-900 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!landingName.trim() || creating}
                    className="flex-1 py-4 rounded-xl font-bold text-black shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-xl hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewingTemplate}
        isOpen={!!previewingTemplate}
        onClose={() => setPreviewingTemplate(null)}
      />

      {/* Footer */}
      <footer className="py-12 mt-20 border-t border-orange-500/20 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">ShopLaunch</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 ShopLaunch. Créez vos landing pages en quelques minutes.
          </p>
        </div>
      </footer>
    </div>
  );
}
