"use client";

import { motion } from "framer-motion";

export function GlowLivePreview() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-rose-50 via-pink-100 to-amber-100 p-1 overflow-hidden">
      <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden relative border border-rose-100">
        <div className="absolute top-0 left-0 right-0 h-7 bg-white border-b border-rose-100 flex items-center px-3 gap-3 z-20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 h-4 bg-rose-50 rounded flex items-center px-2">
            <span className="text-[6px] text-rose-400 truncate">bella-skin.com</span>
          </div>
        </div>
        
        <div className="absolute top-7 left-0 right-0 bottom-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="h-[22%] bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 relative overflow-hidden">
              <div className="absolute top-2 left-4 w-16 h-16 bg-rose-200/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-2 right-4 w-20 h-20 bg-orange-200/50 rounded-full blur-2xl"></div>
              
              <div className="relative flex h-full p-2">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[5px] text-stone-600">Nouveau</span>
                    </div>
                    <div className="text-[7px] font-bold text-stone-900 leading-tight">Votre beauté</div>
                    <div className="text-[7px] font-bold text-stone-900 leading-tight">commence ici</div>
                    <div className="text-[5px] text-stone-500 leading-tight mb-1">Collection Printemps 2026</div>
                    <div className="flex gap-1">
                      <div className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full text-[5px] text-white font-bold shadow-md">
                        Commander
                      </div>
                      <div className="px-2 py-0.5 bg-white border border-stone-200 rounded-full text-[5px] text-stone-700 font-medium shadow-sm">
                        En savoir plus
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[5px]">
                    <span className="font-bold text-rose-500">98%</span>
                    <span className="text-stone-400">Satisfait</span>
                    <span className="w-px h-2 bg-stone-300"></span>
                    <span className="font-bold text-rose-500">15K+</span>
                    <span className="text-stone-400">Clients</span>
                  </div>
                </div>
                
                <div className="w-[35%] relative">
                  <div className="w-full h-full bg-white rounded-xl p-1.5 shadow-lg border border-stone-100">
                    <div className="w-full h-full bg-gradient-to-br from-rose-200 to-orange-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg">✨</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-lg px-1.5 py-0.5 shadow-lg border border-stone-100">
                    <span className="text-[5px] font-bold text-rose-600">3500 DA</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-white p-2">
              <div className="text-[6px] font-semibold text-stone-900 mb-1">Collection Exclusive</div>
              <div className="w-full h-[45%] bg-gradient-to-br from-rose-100 to-orange-100 rounded-lg mb-1.5 flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
              <div className="flex gap-1 mb-1">
                <div className="flex-1 h-3 bg-rose-100 rounded flex items-center justify-center text-[4px] text-rose-700">✓ Livraison</div>
                <div className="flex-1 h-3 bg-orange-100 rounded flex items-center justify-center text-[4px] text-orange-700">✓ Paiement</div>
              </div>
              <div className="w-full h-5 bg-gradient-to-r from-rose-500 to-orange-500 rounded text-[6px] text-white font-bold flex items-center justify-center">
                Commander Maintenant
              </div>
            </div>
            
            <div className="h-[12%] bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center gap-4 text-[5px] text-white/80">
              <span>contact@bellaskin.com</span>
              <span>WhatsApp</span>
            </div>
          </div>
        </div>
        
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] as const }}
          className="absolute top-8 right-2 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full text-[6px] text-white font-bold shadow-lg z-30"
        >
          Glow ✨
        </motion.div>
      </div>
    </div>
  );
}

export function SkinovaLivePreview() {
  return (
    <div className="w-full h-full bg-stone-200 p-1 overflow-hidden">
      <div className="w-full h-full bg-white shadow-2xl overflow-hidden relative border border-stone-300">
        <div className="absolute top-0 left-0 right-0 h-7 bg-stone-900 flex items-center px-3 gap-3 z-20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 h-4 bg-stone-800 rounded flex items-center px-2">
            <span className="text-[6px] text-stone-400 truncate">skinova.com</span>
          </div>
        </div>
        
        <div className="absolute top-7 left-0 right-0 bottom-0 overflow-hidden">
          <div className="h-full flex flex-col font-['Georgia',serif]">
            <div className="h-[25%] bg-white border-b border-stone-200 flex items-center px-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-stone-900 flex items-center justify-center">
                  <span className="text-[8px] text-white">S</span>
                </div>
                <span className="text-[7px] tracking-[0.2em] uppercase text-stone-900 font-semibold">Skinova</span>
              </div>
              <div className="flex-1"></div>
              <div className="flex gap-3 text-[5px] tracking-widest uppercase text-stone-500">
                <span>Collection</span>
                <span>FAQ</span>
              </div>
            </div>
            
            <div className="flex-1 bg-stone-50 p-3">
              <div className="h-0.5 w-6 bg-stone-300 mb-2"></div>
              
              <div className="text-[5px] tracking-[0.2em] uppercase text-stone-500 mb-1">Collection 2026</div>
              <div className="text-[10px] font-serif text-stone-900 leading-tight mb-0.5">L'Excellence</div>
              <div className="text-[10px] font-serif text-stone-900 leading-tight mb-2">du Soin</div>
              
              <div className="h-0.5 w-6 bg-stone-300 mb-1.5"></div>
              <div className="text-[5px] text-stone-500 leading-relaxed mb-2">Formulations révolutionnaires pour une peau transformée.</div>
              
              <div className="flex gap-2 mb-2">
                <div className="px-3 py-1 bg-stone-900 text-[5px] tracking-widest uppercase text-white">
                  Découvrir
                </div>
                <div className="px-3 py-1 border border-stone-300 text-[5px] tracking-widest uppercase text-stone-700">
                  Explorer
                </div>
              </div>
            </div>
            
            <div className="h-[30%] bg-stone-900 p-3 flex gap-2">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-serif text-white mb-0.5">4500 DA</div>
                  <div className="text-[4px] text-stone-400">Prix du produit</div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[5px]">
                    <span className="text-stone-500">Satisfaction</span>
                    <span className="text-white">99%</span>
                  </div>
                  <div className="flex justify-between text-[5px]">
                    <span className="text-stone-500">Utilisatrices</span>
                    <span className="text-white">25K+</span>
                  </div>
                </div>
              </div>
              <div className="w-[35%] aspect-[3/4] bg-gradient-to-b from-stone-200 to-stone-300 rounded-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl opacity-50">⚗️</span>
                </div>
              </div>
            </div>
            
            <div className="h-[15%] bg-stone-950 flex items-center justify-center text-[5px] text-stone-500 tracking-widest uppercase">
              <span>FAQ</span>
              <span className="mx-2">•</span>
              <span>Contact</span>
              <span className="mx-2">•</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-2 px-2 py-0.5 bg-stone-900 rounded text-[6px] text-white tracking-wider uppercase font-bold z-30">
          Skinova
        </div>
      </div>
    </div>
  );
}

export function FashionLivePreview() {
  return (
    <div className="w-full h-full bg-zinc-900 p-1 overflow-hidden">
      <div className="w-full h-full bg-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-7 bg-black flex items-center px-3 z-20">
          <div className="flex-1 text-[6px] tracking-[0.3em] uppercase text-white font-bold">VOGUE</div>
          <div className="flex gap-3 text-[5px] text-zinc-500 uppercase tracking-widest">
            <span>New</span>
            <span>Shop</span>
          </div>
        </div>
        
        <div className="absolute top-7 left-0 right-0 bottom-0 bg-zinc-100 p-2">
          <div className="h-full flex gap-2">
            <div className="w-3 flex flex-col justify-center items-center gap-1.5">
              <div className="w-0.5 h-2 bg-zinc-400 rounded-full"></div>
              <div className="w-0.5 h-2 bg-zinc-300 rounded-full"></div>
              <div className="w-0.5 h-2 bg-zinc-200 rounded-full"></div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[5px] text-zinc-400 tracking-[0.2em] uppercase mb-0.5">Spring 2026</div>
                <div className="text-[9px] font-bold text-black uppercase tracking-wider mb-0.5">New</div>
                <div className="text-[9px] font-bold text-black uppercase tracking-wider mb-1">Collection</div>
                <div className="text-[5px] text-zinc-500 mb-2">Minimal & Elegant Style</div>
                <div className="px-2 py-1 bg-black text-[5px] text-white uppercase tracking-wider font-bold inline-block">
                  Shop Now
                </div>
              </div>
              
              <div className="flex gap-1">
                <div className="flex-1 aspect-[3/4] bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-sm"></div>
                <div className="flex-1 aspect-[3/4] bg-gradient-to-b from-zinc-200 to-zinc-300 rounded-sm"></div>
                <div className="flex-1 aspect-[3/4] bg-gradient-to-b from-zinc-400 to-zinc-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-2 px-2 py-0.5 bg-white rounded text-[6px] text-black font-bold z-30">
          Fashion
        </div>
      </div>
    </div>
  );
}

export function TechLivePreview() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-950 p-1 overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-lg shadow-2xl overflow-hidden relative border border-blue-500/30">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-6 left-6 w-12 h-12 border border-cyan-400/30 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-8 right-6 w-16 h-16 border border-blue-400/20 rounded-full"
        />
        
        <div className="relative h-full flex flex-col justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-sm"></div>
            <span className="text-[6px] text-cyan-400 font-bold tracking-widest">NEXUS</span>
          </div>
          
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="text-[4px] text-cyan-400/80 tracking-[0.3em] mb-1">THE FUTURE IS NOW</div>
            <div className="text-[11px] font-bold text-cyan-400 mb-1">Innovate Today</div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 rounded mx-auto mb-2"></div>
            <div className="flex gap-1.5 justify-center mb-2">
              <div className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded text-[5px] text-white font-bold shadow-lg shadow-cyan-500/20">
                Get Started
              </div>
              <div className="px-2.5 py-1 border border-cyan-500/50 rounded text-[5px] text-cyan-400">
                Learn More
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-[4px] text-cyan-400/60">
              <div className="w-8 h-0.5 bg-cyan-400/30 rounded mb-0.5"></div>
              <div className="w-5 h-0.5 bg-cyan-400/20 rounded"></div>
            </div>
            <div className="text-[4px] text-cyan-400/60">
              <div className="w-8 h-0.5 bg-cyan-400/30 rounded mb-0.5"></div>
              <div className="w-5 h-0.5 bg-cyan-400/20 rounded"></div>
            </div>
            <div className="text-[4px] text-cyan-400/60">
              <div className="w-8 h-0.5 bg-cyan-400/30 rounded mb-0.5"></div>
              <div className="w-5 h-0.5 bg-cyan-400/20 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-2 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded text-[6px] text-cyan-400 font-bold z-30">
          Tech
        </div>
      </div>
    </div>
  );
}

export function FoodLivePreview() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-100 via-amber-50 to-red-50 p-1 overflow-hidden">
      <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden relative border border-orange-200">
        <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-r from-orange-500 via-red-400 to-orange-500 flex items-center justify-center">
          <span className="text-[6px] text-white font-bold tracking-widest uppercase">Gourmet</span>
        </div>
        
        <div className="absolute top-7 left-0 right-0 bottom-0 p-2">
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-amber-200 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-sm">🍕</span>
              </div>
              <div>
                <div className="text-[6px] font-bold text-orange-600">Restaurant</div>
                <div className="text-[5px] text-stone-500">Spécialités locales</div>
              </div>
            </div>
            
            <div className="text-[6px] font-semibold text-stone-900 mb-1">Notre Menu</div>
            <div className="grid grid-cols-3 gap-1 mb-2">
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center text-xs">🍝</div>
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center text-xs">🍖</div>
              <div className="aspect-square bg-gradient-to-br from-red-200 to-pink-200 rounded-lg flex items-center justify-center text-xs">🥗</div>
            </div>
            
            <div className="flex gap-1 mb-1">
              <div className="flex-1 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded text-[5px] text-white font-bold flex items-center justify-center shadow-md">
                Commander
              </div>
              <div className="flex-1 h-4 border-2 border-orange-300 rounded text-[5px] text-orange-500 font-bold flex items-center justify-center">
                Menu
              </div>
            </div>
            
            <div className="flex justify-center gap-3 text-[4px] text-stone-500">
              <span>⭐ 4.8</span>
              <span>30 min</span>
              <span>Livraison</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-2 px-2 py-0.5 bg-orange-500 rounded text-[6px] text-white font-bold z-30">
          Food
        </div>
      </div>
    </div>
  );
}

export function JewelryLivePreview() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-1 overflow-hidden">
      <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden relative border border-amber-300">
        <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 flex items-center justify-center">
          <span className="text-[6px] text-white font-medium tracking-[0.2em] uppercase">Luxe</span>
        </div>
        
        <div className="absolute top-7 left-0 right-0 bottom-0 p-2">
          <div className="h-full flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: [0, 0, 1, 1] as const }}
              className="w-12 h-12 border border-amber-300/50 rounded-full mb-1"
            />
            <div className="w-10 h-10 bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-300 rounded-full flex items-center justify-center shadow-xl mb-2">
              <span className="text-xl">💎</span>
            </div>
            
            <div className="text-center mb-2">
              <div className="text-[7px] font-bold text-amber-700 tracking-wider mb-0.5">Bijoux Premium</div>
              <div className="text-[5px] text-amber-600 mb-1">Collection Exclusive</div>
              <div className="flex justify-center gap-0.5 mb-1">
                <span className="text-[5px] text-amber-500">★</span>
                <span className="text-[5px] text-amber-500">★</span>
                <span className="text-[5px] text-amber-500">★</span>
                <span className="text-[5px] text-amber-500">★</span>
                <span className="text-[5px] text-amber-500">★</span>
              </div>
              <div className="text-[8px] text-amber-600 font-bold">€299</div>
            </div>
            
            <div className="w-full h-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded text-[6px] text-white font-bold flex items-center justify-center shadow-lg">
              Découvrir
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-2 px-2 py-0.5 bg-amber-500 rounded text-[6px] text-white font-bold z-30">
          Jewelry
        </div>
      </div>
    </div>
  );
}

export function SportLivePreview() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50 p-1 overflow-hidden">
      <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden relative border border-emerald-200">
        <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 flex items-center justify-center">
          <span className="text-[6px] text-white font-bold tracking-widest">⚡ FIT PRO</span>
        </div>
        
        <div className="absolute top-7 left-0 right-0 bottom-0 p-2">
          <div className="h-full flex flex-col justify-between">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mx-auto mb-1 flex items-center justify-center shadow-lg"
              >
                <span className="text-sm">💪</span>
              </motion.div>
              <div className="text-[7px] font-bold text-emerald-700 mb-0.5">Transformez-vous</div>
              <div className="text-[5px] text-stone-500 mb-1">Programme personnalisé</div>
              <div className="flex justify-center gap-2 text-[5px] text-emerald-600 font-bold">
                <span>🔥 500</span>
                <span>⚡ 4.9</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-1 mb-1">
              <div className="h-4 bg-emerald-100 rounded flex items-center justify-center text-[4px] text-emerald-700 font-medium">Cardio</div>
              <div className="h-4 bg-green-100 rounded flex items-center justify-center text-[4px] text-green-700 font-medium">Force</div>
              <div className="h-4 bg-teal-100 rounded flex items-center justify-center text-[4px] text-teal-700 font-medium">Flex</div>
            </div>
            
            <div className="h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded text-[6px] text-white font-bold flex items-center justify-center shadow-lg">
              START NOW
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-2 px-2 py-0.5 bg-emerald-500 rounded text-[6px] text-white font-bold z-30">
          Sport
        </div>
      </div>
    </div>
  );
}

export const TEMPLATE_PREVIEWS: Record<string, React.ComponentType> = {
  cosmetic: GlowLivePreview,
  skinova: SkinovaLivePreview,
  fashion: FashionLivePreview,
  tech: TechLivePreview,
  food: FoodLivePreview,
  jewelry: JewelryLivePreview,
  sport: SportLivePreview,
};
