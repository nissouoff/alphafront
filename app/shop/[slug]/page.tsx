"use client";

import { useState, useEffect, use, useRef } from "react";
import { storeProductData } from "@/lib/productStorage";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  biography: string;
  photos: string[];
  mainPhoto: number;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Content {
  logo: string;
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  contactEmail: string;
  footerText: string;
}

export default function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [landing, setLanding] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const viewTracked = useRef(false);

  useEffect(() => {
    loadLanding();
  }, [slug]);

  const loadLanding = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      console.log('Loading landing from:', `${baseUrl}/shop/${slug}`);
      const response = await fetch(`${baseUrl}/shop/${slug}`);
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.status === 403) {
        setError("Cette boutique est actuellement hors ligne.");
        setLoading(false);
        return;
      }
      
      if (response.status === 404) {
        setError("Boutique non trouvée.");
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        setError("Une erreur est survenue.");
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Landing loaded:', data);
      setLanding(data.landing);
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error loading landing:', err);
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (viewTracked.current || !landing) return;
    
    const viewKey = `viewed_${slug}`;
    if (localStorage.getItem(viewKey)) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      console.log('Tracking view for:', slug, 'API URL:', baseUrl);
      
      const response = await fetch(`${baseUrl}/shop/${slug}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: 'direct' }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('View tracked successfully:', data);
        localStorage.setItem(viewKey, 'true');
        viewTracked.current = true;
      } else {
        console.error('View tracking failed:', response.status);
      }
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  useEffect(() => {
    viewTracked.current = false;
    if (landing) {
      trackView();
    }
  }, [landing, slug]);

  const handleOrder = (product: Product) => {
    const dataId = storeProductData({ product, landing });
    window.open(`/shop/${slug}/product?id=${dataId}&shopSlug=${slug}`, '_blank');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;

    setSubmittingReview(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${baseUrl}/shop/${slug}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      });

      if (response.ok) {
        const data = await response.json();
        setReviews([data.review, ...reviews]);
        setReviewForm({ name: '', rating: 5, comment: '' });
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
              star <= rating ? 'text-yellow-400' : 'text-zinc-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Oups !</h1>
          <p className="text-zinc-600 mb-6">{error}</p>
          <a href="/" className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (!landing) return null;

  const content: Content = landing.content || {
    logo: '',
    brandName: 'Ma Boutique',
    heroTitle: 'Bienvenue',
    heroSubtitle: 'Découvrez nos produits',
    ctaButton: 'Découvrir',
    contactEmail: 'contact@exemple.com',
    footerText: '© 2026 Ma Boutique',
  };

  const products: Product[] = landing?.products || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {content.logo ? (
              <img src={content.logo} alt={content.brandName} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✨</span>
              </div>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{content.brandName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-zinc-600 hover:text-pink-500 transition-colors font-medium">Produits</a>
            <a href="#reviews" className="text-zinc-600 hover:text-pink-500 transition-colors font-medium">Avis</a>
            <a href="#about" className="text-zinc-600 hover:text-pink-500 transition-colors font-medium">À propos</a>
            <a href="#contact" className="text-zinc-600 hover:text-pink-500 transition-colors font-medium">Contact</a>
          </div>
        </div>
      </nav>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-6">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-pink-600">Nouvelle collection 2026</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6 leading-tight">
                {content.heroTitle}
              </h1>
              <p className="text-xl text-zinc-600 mb-8">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#products" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-105 text-center">
                  {content.ctaButton}
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-pink-500/20">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  {products.length > 0 && products[0]?.photos?.length > 0 ? (
                    <img src={products[0].photos[0]} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-8xl">💄</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Nos Best-Sellers</h2>
            <p className="text-lg text-zinc-600">Les produits les plus populaires de notre collection</p>
          </div>
          {products.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 hover:shadow-xl hover:shadow-pink-500/20 transition-all cursor-pointer group"
                  onClick={() => handleOrder(product)}
                >
                  <div className="aspect-square bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                    {product.photos?.length > 0 ? (
                      <img src={product.photos[product.mainPhoto || 0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">💄</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{product.name}</h3>
                  <p className="text-zinc-500 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{product.price} DZD</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrder(product);
                      }}
                      className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p>Aucun produit disponible</p>
            </div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Avis clients</h2>
            {reviews.length > 0 && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-lg text-zinc-600">
                  {averageRating.toFixed(1)}/5 ({reviews.length} avis)
                </span>
              </div>
            )}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-colors"
            >
              {showReviewForm ? 'Fermer' : 'Laisser un avis'}
            </button>
          </div>

          {showReviewForm && (
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-12">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Votre avis</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Votre nom</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Entrez votre nom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Note</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className={`text-3xl cursor-pointer hover:scale-110 transition-transform ${
                          star <= reviewForm.rating ? 'text-yellow-400' : 'text-zinc-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Commentaire</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Partagez votre expérience..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50"
                >
                  {submittingReview ? 'Envoi en cours...' : 'Envoyer mon avis'}
                </button>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{review.name}</p>
                        <p className="text-sm text-zinc-500">{new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p className="text-4xl mb-4">💬</p>
                <p>Soyez le premier à laisser un avis !</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-gradient-to-br from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Pourquoi choisir {content.brandName} ?</h2>
          <p className="text-xl text-pink-100 mb-12">Des ingrédients naturels pour des résultats visibles</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold mb-2">100% Naturel</h3>
              <p className="text-pink-100">Ingrédients biologiques certifiés</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🐰</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Cruelty-Free</h3>
              <p className="text-pink-100">Non testé sur les animaux</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">♻️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Éco-responsable</h3>
              <p className="text-pink-100">Emballages recyclables</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Contactez-nous</h2>
            <p className="text-lg text-zinc-600">Une question ? Nous sommes là pour vous aider</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <p className="text-zinc-600 mb-4">Envoyez-nous un email à</p>
            <a href={`mailto:${content.contactEmail}`} className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              {content.contactEmail}
            </a>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {content.logo ? (
              <img src={content.logo} alt={content.brandName} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✨</span>
              </div>
            )}
            <span className="text-xl font-bold">{content.brandName}</span>
          </div>
          <p className="text-zinc-400">{content.footerText}</p>
          <div className="pt-8 mt-8 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm">© 2026 {content.brandName}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
