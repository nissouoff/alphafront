"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createLanding } from "@/lib/api";

export default function TemplatesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [createType, setCreateType] = useState<'landing' | 'boutique'>('landing');
  const [selectedEditor, setSelectedEditor] = useState<'cosmetic' | 'smart'>('cosmetic');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleCreate = async (type: 'landing' | 'boutique') => {
    if (!user) return;
    
    setCreating(true);
    setCreateType(type);
    
    try {
      const landingName = type === 'landing' 
        ? (selectedEditor === 'smart' ? 'Ma Landing Smart' : 'Ma Landing Cosmétique')
        : 'Ma Boutique';
      
      const result = await createLanding(
        landingName,
        selectedEditor === 'smart' ? 'smart' : 'cosmetic',
        type === 'landing'
      );
      
      if (result.landing?.id) {
        toast.success(type === 'landing' ? 'Landing créée !' : 'Boutique créée !');
        router.push(`/editor/${selectedEditor}?id=${result.landing.id}`);
      } else {
        toast.error('Erreur lors de la création');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="animate-spin w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-zinc-900">ShopLaunch</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">Bonjour, {user.name}</span>
            <Link href="/dashboard" className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
              Retour
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            Choisissez votre éditeur
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Créez votre landing page
          </h1>
          <p className="text-lg text-zinc-600 max-w-xl mx-auto">
            Sélectionnez un éditeur et commencez à créer votre page en quelques minutes
          </p>
        </div>

        {/* Editor Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Smart Editor */}
          <button
            onClick={() => setSelectedEditor('smart')}
            className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
              selectedEditor === 'smart'
                ? 'border-rose-500 bg-rose-50 shadow-lg ring-4 ring-rose-200'
                : 'border-zinc-200 bg-white hover:border-rose-300 hover:shadow-md'
            }`}
          >
            {selectedEditor === 'smart' && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                selectedEditor === 'smart' ? 'bg-gradient-to-br from-rose-500 to-orange-500' : 'bg-zinc-100'
              }`}>
                <span className="text-3xl">🚀</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">Smart Editor</h3>
                <p className="text-sm text-zinc-600 mb-3">Éditeur innovant avec navigation par sections et édition inline intuitive</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">Navigation par sections</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Édition inline</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Mode aperçu</span>
                </div>
              </div>
            </div>
          </button>

          {/* Cosmetic Editor */}
          <button
            onClick={() => setSelectedEditor('cosmetic')}
            className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
              selectedEditor === 'cosmetic'
                ? 'border-purple-500 bg-purple-50 shadow-lg ring-4 ring-purple-200'
                : 'border-zinc-200 bg-white hover:border-purple-300 hover:shadow-md'
            }`}
          >
            {selectedEditor === 'cosmetic' && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                selectedEditor === 'cosmetic' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-zinc-100'
              }`}>
                <span className="text-3xl">💎</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">Classic Editor</h3>
                <p className="text-sm text-zinc-600 mb-3">Éditeur classique avec sidebar et contrôles détaillés</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Sidebar fixe</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">Contrôles avancés</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">Couleurs</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Create Actions */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
          <div className="p-8">
            <div className="flex items-start justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                  {selectedEditor === 'smart' ? 'Smart Editor' : 'Classic Editor'}
                </h2>
                <p className="text-zinc-600 mb-4">
                  {selectedEditor === 'smart' 
                    ? 'Éditeur nouvelle génération avec une expérience utilisateur fluide et intuitive. Parfait pour les débutants.'
                    : 'Éditeur éprouvé avec tous les contrôles avancés pour les utilisateurs expérimentés.'
                  }
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 ${selectedEditor === 'smart' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'} text-xs font-medium rounded-full`}>✓ Éditeur visuel</span>
                  <span className={`px-3 py-1 ${selectedEditor === 'smart' ? 'bg-orange-100 text-orange-700' : 'bg-pink-100 text-pink-700'} text-xs font-medium rounded-full`}>✓ Multi-photos</span>
                  <span className={`px-3 py-1 ${selectedEditor === 'smart' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'} text-xs font-medium rounded-full`}>✓ Couleurs personnalisables</span>
                  <span className={`px-3 py-1 ${selectedEditor === 'smart' ? 'bg-green-100 text-green-700' : 'bg-violet-100 text-violet-700'} text-xs font-medium rounded-full`}>✓ Responsive</span>
                  <span className={`px-3 py-1 ${selectedEditor === 'smart' ? 'bg-teal-100 text-teal-700' : 'bg-fuchsia-100 text-fuchsia-700'} text-xs font-medium rounded-full`}>✓ Auto-sauvegarde</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleCreate('landing')}
                  disabled={creating}
                  className={`px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2 ${
                    selectedEditor === 'smart' 
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {creating && createType === 'landing' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Créer une Landing
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleCreate('boutique')}
                  disabled={creating}
                  className={`px-8 py-3 font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 ${
                    selectedEditor === 'smart'
                      ? 'bg-white border-2 border-rose-500 text-rose-600 hover:bg-rose-50'
                      : 'bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {creating && createType === 'boutique' ? (
                    <>
                      <div className={`w-5 h-5 border-2 ${selectedEditor === 'smart' ? 'border-rose-500' : 'border-purple-500'} border-t-transparent rounded-full animate-spin`}></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Créer une Boutique
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="font-bold text-zinc-900 mb-2">Édition Visuelle</h3>
            <p className="text-sm text-zinc-600">Modifiez votre landing en cliquant directement sur les éléments. Simple et intuitif.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-zinc-900 mb-2">Galerie Photos</h3>
            <p className="text-sm text-zinc-600">Ajoutez jusqu&apos;à 9 photos par produit pour mettre en valeur vos créations.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-zinc-900 mb-2">En Ligne Rapidement</h3>
            <p className="text-sm text-zinc-600">Publiez votre landing en un clic et partagez-la avec vos clients.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
