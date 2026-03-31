"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import CookieConsent from "@/components/CookieConsent";

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <CookieConsent />
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">ShopLaunch</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-zinc-600 hover:text-indigo-500 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Fonctionnalités</Link>
            <Link href="#templates" className="text-zinc-600 hover:text-indigo-500 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Templates</Link>
            <Link href="#pricing" className="text-zinc-600 hover:text-indigo-500 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Tarifs</Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Bonjour, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Déconnexion
                </button>
                <Link href="/dashboard" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-indigo-500 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Connexion</Link>
                <Link href="/register" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">Commencer</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Plus de 2,000 boutiques créées</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white leading-tight mb-6">
              Créez votre landing page
              <span className="text-indigo-500"> boutique </span>
              en minutes
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
              Des pages modernes, rapides et optimisées pour convertir vos visiteurs en clients. Aucune compétence technique requise.
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 text-center">
                  Aller au Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 text-center">
                  Créer ma landing page gratuitement
                </Link>
                <Link href="#templates" className="w-full sm:w-auto px-8 py-4 border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl transition-colors text-center">
                  Voir les templates
                </Link>
              </div>
            )}
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto"></div>
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 shadow-2xl shadow-indigo-500/10 animate-float">
              <div className="flex items-center gap-2 mb-4 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-6">
                      <svg className="w-8 h-8 mx-auto text-indigo-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Mobile</p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-6">
                      <svg className="w-8 h-8 mx-auto text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Rapide</p>
                    </div>
                    <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-6">
                      <svg className="w-8 h-8 mx-auto text-pink-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">Analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Des outils puissants pour créer des landing pages qui convertissent</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🎨", title: "Templates premium", desc: "Des dizaines de designs professionnels prêts à personnaliser" },
              { icon: "📱", title: "100% responsive", desc: "Parfait sur mobile, tablette et desktop" },
              { icon: "⚡", title: "Ultra rapide", desc: "Temps de chargement optimal pour meilleur SEO" },
              { icon: "🛒", title: "E-commerce intégré", desc: "展示 produits et，接受 commandes directement" },
              { icon: "📊", title: "Analytics", desc: "Suivez vos conversions et optimisez vos performances" },
              { icon: "🔒", title: "SSL sécurisé", desc: "Certificat HTTPS inclus pour la confiance de vos clients" },
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Templates by catégorie</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Trouvez le design parfait pour votre type de boutique</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Mode & Vêtements", color: "from-pink-500 to-rose-500", href: "/register" },
              { name: "Cosmétiques", color: "from-purple-500 to-violet-500", href: "/template/cosmetic", preview: true },
              { name: "Alimentation", color: "from-green-500 to-emerald-500", href: "/register" },
              { name: "High-Tech", color: "from-blue-500 to-cyan-500", href: "/register" },
              { name: "Maison & Déco", color: "from-orange-500 to-amber-500", href: "/register" },
              { name: "Sport & Fitness", color: "from-red-500 to-orange-500", href: "/register" },
              { name: "Bijoux & Accessoires", color: "from-yellow-500 to-gold-500", href: "/register" },
              { name: "Services", color: "from-indigo-500 to-blue-500", href: "/register" },
            ].map((template, index) => (
              <Link href={template.href} key={index} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${template.color}`}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg text-center px-4">{template.name}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-4 py-2 bg-white text-zinc-900 font-medium rounded-lg text-sm w-full block text-center">
                    {template.preview ? "Voir le template" : "Utiliser ce template"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-indigo-600 dark:bg-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à lancer votre boutique ?</h2>
          <p className="text-xl text-indigo-100 mb-10">Rejoignez plus de 2,000 entrepreneurs qui ont déjà créé leur landing page avec ShopLaunch</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-center">
              Créer gratuitement
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-center">
              Voir une démo
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Tarifs simples et transparents</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Commencez gratuitement, évoluez selon vos besoins</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Gratuit</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Pour démarrer</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">0€</span>
                <span className="text-zinc-600 dark:text-zinc-400">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["1 landing page", "3 templates", "100MB stockage", "Sous-domaine ShopLaunch"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3 text-center border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                Commencer gratuitement
              </Link>
            </div>
            <div className="bg-indigo-500 dark:bg-indigo-600 rounded-2xl p-8 relative animate-pulse-glow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-full">Populaire</div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <p className="text-indigo-100 mb-6">Pour les croissance</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">29€</span>
                <span className="text-indigo-100">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["5 landing pages", "Tous les templates", "10GB stockage", "Domaine personnalisé", "Analytics avancés", "Support prioritaire"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3 text-center bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                Choisir Pro
              </Link>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Business</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Pour les entreprises</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">99€</span>
                <span className="text-zinc-600 dark:text-zinc-400">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Landing pages illimitées", "Templates exclusifs", "100GB stockage", "Multi-utilisateurs", "API personnalisée", "SLA garanti"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full py-3 text-center border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                Contacter commercial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">2,000+</div>
              <p className="text-zinc-600 dark:text-zinc-400">Landing pages créées</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">50K+</div>
              <p className="text-zinc-600 dark:text-zinc-400">Visiteurs par mois</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">98%</div>
              <p className="text-zinc-600 dark:text-zinc-400">Clients satisfaits</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">24/7</div>
              <p className="text-zinc-600 dark:text-zinc-400">Support disponible</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-zinc-900 dark:text-white">ShopLaunch</span>
              </Link>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Créez des landing pages professionnelles pour votre boutique en ligne.</p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Produit</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Fonctionnalités</Link></li>
                <li><Link href="#templates" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Templates</Link></li>
                <li><Link href="#pricing" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Tarifs</Link></li>
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Intégrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Documentation</a></li>
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Blog</a></li>
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Tutoriels</a></li>
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Confidentialité</a></li>
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Conditions</a></li>
                <li><a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">© 2026 ShopLaunch. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
