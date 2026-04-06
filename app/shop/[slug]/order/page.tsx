"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductData } from "@/lib/productStorage";
import { createOrder } from "@/lib/api";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj",
  "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bchar", "Ouled Djellal", "Boukadir",
  "Touggourt", "Djanet", "In Salah", "In Guezzam"
];

interface Product {
  id: string;
  name: string;
  title: string;
  price: string;
  description: string;
  biography: string;
  photos: string[];
  mainPhoto: number;
  stock?: number;
  unlimitedStock?: boolean;
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

interface LandingData {
  id?: number;
  name?: string;
  slug?: string;
  content: Content;
  products: Product[];
}

interface OrderData {
  product: Product;
  landing: LandingData;
}

function OrderPageContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [deliveryType, setDeliveryType] = useState<"home" | "pickup">("home");

  const [formData, setFormData] = useState({
    customerName: "",
    customer_firstname: "",
    phone: "",
    wilaya: "",
    commune: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const data = getProductData(id);
      if (data) {
        const productData: Product = {
          id: data.productId,
          name: data.productName || data.productTitle,
          title: data.productTitle,
          price: data.productPrice,
          description: '',
          biography: '',
          photos: data.productPhoto ? [data.productPhoto] : [],
          mainPhoto: 0,
          stock: 100,
          unlimitedStock: true,
        };
        const landingInfo: LandingData = {
          id: data.landingId as any,
          name: data.landingName,
          slug: data.landingSlug,
          content: { logo: '', brandName: data.landingName, heroTitle: '', heroSubtitle: '', ctaButton: '', contactEmail: '', footerText: '' },
          products: [productData],
        };
        setProduct(productData);
        setLandingData(landingInfo);
      } else {
        setError("Produit non trouvé ou données expirées. Veuillez retourner à la boutique et réessayer.");
      }
    } else {
      setError("Produit non trouvé");
    }
    setLoading(false);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      let formatted = cleaned;
      if (cleaned.length > 4) {
        formatted = `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError("Le nom est obligatoire.");
      return false;
    }
    if (!formData.customer_firstname.trim()) {
      setError("Le prénom est obligatoire.");
      return false;
    }
    if (!formData.wilaya) {
      setError("La wilaya est obligatoire.");
      return false;
    }
    
    const phone = formData.phone || (formData as any).customer_phone;
    const phoneRegex = /^(05|06|07)\d{8}$/;
    
    if (!phone) {
      setError("Le numéro de téléphone est obligatoire.");
      return false;
    }
    
    const cleanPhone = phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError("Le numéro de téléphone doit contenir 10 chiffres et commencer par 05, 06 ou 07.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !landingData) return;
    
    if (!validateForm()) {
      return;
    }
    
    const phone = formData.phone || (formData as any).customer_phone;
    const cleanPhone = phone.replace(/\s/g, '');
    
    const blockedClients = JSON.parse(localStorage.getItem("blocked_clients") || "[]");
    const isBlocked = blockedClients.some((client: { phone: string }) => client.phone === cleanPhone);
    
    if (isBlocked) {
      setError("Ce numéro de téléphone est bloqué. Veuillez contacter le service client.");
      return;
    }
    
    if (!product.unlimitedStock && (product.stock || 0) <= 0) {
      setError("Ce produit est en rupture de stock.");
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      const result = await createOrder(
        {
          landingId: slug,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productPhoto: product.photos?.[product.mainPhoto || 0] || '',
          quantity: 1,
          total: parseFloat(product.price || '0'),
          customer: {
            name: formData.customerName || (formData as any).customer_name || '',
            phone: cleanPhone,
            wilaya: formData.wilaya,
            commune: formData.commune || '',
            address: formData.address || '',
          },
        }
      );

      if (result.order) {
        const now = new Date();
        localStorage.setItem('order_confirmation', JSON.stringify({
          order: result.order,
          productName: product.name,
          productPrice: product.price,
          customerName: formData.customerName || (formData as any).customer_name,
          customerFirstname: formData.customer_firstname,
          phone: cleanPhone,
          wilaya: formData.wilaya,
          commune: formData.commune,
          address: formData.address,
          landingName: landingData?.content?.brandName || 'la boutique',
          orderId: result.order.id,
          shopSlug: slug,
          orderDate: now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          orderTime: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        }));
        router.push(`/shop/${slug}/order/confirmation`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la commande");
    } finally {
      setSubmitting(false);
    }
  };

  const content = landingData?.content || {
    logo: '',
    brandName: 'Ma Boutique',
    heroTitle: 'Bienvenue',
    heroSubtitle: 'Découvrez nos produits',
    ctaButton: 'Découvrir',
    contactEmail: 'contact@exemple.com',
    footerText: '© 2026 Ma Boutique',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error && !product) {
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
          <a href={`/shop/${slug}`} className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            Retour à la boutique
          </a>
        </div>
      </div>
    );
  }

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
          <Link 
            href={`/shop/${slug}/product?id=${searchParams.get('id')}`}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au produit
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8 text-center">Finaliser la commande</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Informations de livraison</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-zinc-900"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      name="customer_firstname"
                      value={formData.customer_firstname}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-zinc-900"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Numéro de téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-zinc-900"
                    placeholder="0555 00 00 00"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Format: 0X XX XX XX XX</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Wilaya *</label>
                  <select
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-zinc-900"
                  >
                    <option value="">Sélectionnez une wilaya</option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Commune</label>
                  <input
                    type="text"
                    name="commune"
                    value={formData.commune}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-zinc-900"
                    placeholder="Nom de la commune"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Adresse complète</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none text-zinc-900"
                    placeholder="Rue, numéro de rue, étage, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-4">Mode de livraison *</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("home")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        deliveryType === "home"
                          ? "border-pink-500 bg-pink-50"
                          : "border-zinc-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          deliveryType === "home" ? "bg-pink-500 text-white" : "bg-zinc-100 text-zinc-600"
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-zinc-900">Livraison à domicile</p>
                          <p className="text-sm text-zinc-500">Livraison par messager</p>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        deliveryType === "pickup"
                          ? "border-pink-500 bg-pink-50"
                          : "border-zinc-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          deliveryType === "pickup" ? "bg-pink-500 text-white" : "bg-zinc-100 text-zinc-600"
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-zinc-900">Retrait au bureau</p>
                          <p className="text-sm text-zinc-500">Retrait à l&apos;agence</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Notes (optionnel)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none text-zinc-900"
                    placeholder="Instructions spéciales, préférences, etc."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Vérifier le numéro
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Récapitulatif</h2>
              
              {product && (
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden flex-shrink-0">
                    {product.photos?.length > 0 ? (
                      <img src={product.photos[product.mainPhoto || 0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">💄</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-zinc-900 truncate">{product.name}</h3>
                    <p className="text-sm text-zinc-700 line-clamp-2">{product.description}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 border-t border-zinc-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-800">Sous-total</span>
                  <span className="font-bold text-zinc-900">{product?.price} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-800">Livraison</span>
                  <span className="font-bold text-green-600">Confirmée</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-800">Paiement</span>
                  <span className="font-bold text-zinc-900">Cash à la livraison</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-zinc-900">Total</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {product?.price} DZD
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">Paiement sécurisé à la livraison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <OrderPageContentWrapper />
    </Suspense>
  );
}

function OrderPageContentWrapper() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('shopSlug') || 'preview';
  return <OrderPageContent slug={slug} />;
}
