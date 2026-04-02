import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const templates: Record<string, string> = {
    cosmetic: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <title>Glow - Cosmetic Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; transform: scale(0.5); transform-origin: top left; }
    * { box-sizing: border-box; }
  </style>
</head>
<body class="min-h-screen bg-white">
  <header class="bg-white border-b border-zinc-100 shadow-sm py-2 px-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
          <span class="text-white text-sm font-bold">B</span>
        </div>
        <span class="text-base font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">Bella Skin</span>
      </div>
      <nav class="flex items-center gap-4 text-xs">
        <a href="#" class="text-zinc-600">Collection</a>
        <a href="#" class="text-zinc-600">Avis</a>
      </nav>
    </div>
  </header>

  <section class="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8 px-4 relative overflow-hidden">
    <div class="absolute top-8 left-4 w-24 h-24 bg-rose-200/40 rounded-full blur-xl"></div>
    <div class="absolute bottom-8 right-4 w-32 h-32 bg-orange-200/40 rounded-full blur-xl"></div>
    
    <div class="relative z-10 flex gap-6">
      <div class="flex-1 space-y-4">
        <div class="inline-flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full shadow-sm border border-rose-100 text-xs">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          <span class="text-zinc-700">Nouveau</span>
        </div>
        
        <h1 class="text-3xl font-bold text-zinc-900 leading-tight">
          Votre beauté<br>commence ici
        </h1>
        
        <p class="text-sm text-zinc-600">
          Collection exclusive de soins cosmétiques naturels.
        </p>
        
        <div class="flex gap-2">
          <a href="#" class="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold rounded-full shadow">
            Commander
          </a>
          <a href="#" class="px-4 py-2 bg-white text-zinc-800 text-xs font-bold rounded-full shadow border">
            En savoir plus
          </a>
        </div>
        
        <div class="flex items-center gap-4 pt-2">
          <div class="text-center">
            <p class="text-xl font-bold text-rose-500">98%</p>
            <p class="text-[10px] text-zinc-500">Satisfait</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-rose-500">15K+</p>
            <p class="text-[10px] text-zinc-500">Clients</p>
          </div>
        </div>
      </div>
      
      <div class="w-40 relative">
        <div class="bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl p-4 shadow-lg flex flex-col items-center">
          <span class="text-5xl">🌸</span>
        </div>
        <div class="absolute -left-2 bottom-4 bg-white rounded-xl p-2 shadow-lg border max-w-[120px]">
          <p class="text-sm font-bold text-zinc-900">3500 DA</p>
          <p class="text-[10px] text-zinc-500">Best-seller</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-6 bg-white px-4">
    <h2 class="text-xl font-bold text-zinc-900 mb-2">Collection Exclusive</h2>
    <div class="flex gap-4 items-start">
      <div class="w-24 h-24 bg-gradient-to-br from-rose-200 to-orange-200 rounded-xl flex items-center justify-center">
        <span class="text-3xl">✨</span>
      </div>
      <div class="flex-1">
        <p class="text-sm text-zinc-600 mb-2">Sérum Visage Naturel - 3500 DA</p>
        <div class="flex gap-2 mb-2">
          <div class="px-2 py-1 bg-green-50 rounded text-[10px]">✓ Livraison</div>
          <div class="px-2 py-1 bg-orange-50 rounded text-[10px]">✓ Paiement</div>
        </div>
        <button class="w-full py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold rounded-lg">
          Commander
        </button>
      </div>
    </div>
  </section>

  <section class="py-4 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-4">
    <p class="text-xs text-center">contact@bellaskin.com</p>
  </section>

  <footer class="py-4 bg-zinc-900 text-white px-4 text-center">
    <p class="text-xs text-zinc-400">Bella Skin © 2026</p>
  </footer>
</body>
</html>`,
    
    skinova: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <title>Skinova - Luxury Cosmetic Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; transform: scale(0.5); transform-origin: top left; }
    .font-serif { font-family: 'Cormorant Garamond', serif; }
    * { box-sizing: border-box; }
  </style>
</head>
<body class="min-h-screen bg-stone-50">
  <header class="bg-white border-b border-stone-200 py-2 px-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center">
          <span class="text-white font-serif text-sm">S</span>
        </div>
        <span class="text-sm tracking-widest uppercase font-serif font-medium text-stone-900">Skinova</span>
      </div>
      <nav class="flex items-center gap-4 text-[10px] tracking-widest uppercase text-stone-500">
        <a href="#">Collection</a>
        <a href="#">FAQ</a>
      </nav>
    </div>
  </header>

  <section class="min-h-[60vh] flex items-center px-4 py-6">
    <div class="flex gap-6 w-full">
      <div class="flex-1">
        <div class="h-px w-8 bg-stone-300 mb-4"></div>
        <p class="text-[10px] tracking-[0.2em] uppercase text-stone-500 mb-3">Collection 2026</p>
        <h1 class="text-4xl font-serif font-medium text-stone-900 mb-3 leading-tight">
          L'Excellence<br>du Soin
        </h1>
        <div class="h-px w-8 bg-stone-300 mb-3"></div>
        <p class="text-xs text-stone-500 mb-4 max-w-[200px]">
          Formulations révolutionnaires pour une peau transformée.
        </p>
        <div class="flex gap-2">
          <button class="px-4 py-2 bg-stone-900 text-white text-[10px] tracking-widest uppercase">Découvrir</button>
          <button class="px-4 py-2 border border-stone-300 text-stone-700 text-[10px] tracking-widest uppercase">Explorer</button>
        </div>
      </div>
      
      <div class="w-36 relative">
        <div class="aspect-[4/5] bg-gradient-to-br from-stone-200 to-stone-300 rounded flex items-center justify-center">
          <span class="text-5xl opacity-30">⚗️</span>
        </div>
        <div class="absolute -left-3 top-1/2 -translate-y-1/2 bg-white p-3 shadow-xl border border-stone-100 min-w-[100px]">
          <p class="text-xl font-serif text-stone-900">4500 DA</p>
          <p class="text-[10px] text-stone-500">Prix</p>
          <div class="pt-2 mt-2 border-t border-stone-100 space-y-1">
            <div class="flex justify-between text-[10px]">
              <span class="text-stone-500">Satis</span>
              <span class="text-stone-900">99%</span>
            </div>
            <div class="flex justify-between text-[10px]">
              <span class="text-stone-500">Users</span>
              <span class="text-stone-900">25K+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-4 bg-white px-4">
    <h2 class="text-lg font-serif text-stone-900 mb-3">Concentré Éclat</h2>
    <div class="flex gap-3 items-start">
      <div class="w-20 h-20 bg-stone-100 rounded flex items-center justify-center">
        <span class="text-3xl opacity-30">⚗️</span>
      </div>
      <div class="flex-1">
        <div class="flex text-stone-900 text-xs mb-1">★★★★★</div>
        <p class="text-xs text-stone-600 mb-2">4500 DA - Concentré ultra-puissant</p>
        <div class="flex gap-1 mb-2">
          <span class="px-1 py-0.5 bg-stone-100 text-[10px]">✓ Livraison</span>
          <span class="px-1 py-0.5 bg-stone-100 text-[10px]">✓ Garantie</span>
        </div>
        <button class="w-full py-2 bg-stone-900 text-white text-[10px] tracking-widest uppercase">Commander</button>
      </div>
    </div>
  </section>

  <section class="py-4 bg-stone-900 text-white px-4 text-center">
    <p class="text-sm font-serif mb-2">Prête à transformer votre peau ?</p>
    <button class="px-4 py-1 bg-white text-stone-900 text-[10px] tracking-widest uppercase">Commander</button>
  </section>

  <footer class="py-2 bg-stone-950 text-white px-4 text-center">
    <p class="text-[10px] text-stone-500">© 2026 SKINOVA</p>
  </footer>
</body>
</html>`,
    
    fashion: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fashion Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-zinc-900">
  <header class="bg-black py-4">
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <div class="text-2xl tracking-[0.3em] uppercase text-white font-bold">VOGUE</div>
      <nav class="flex gap-8 text-zinc-400 text-sm uppercase tracking-widest">
        <a href="#" class="text-white hover:text-zinc-300">New</a>
        <a href="#" class="hover:text-zinc-300">Collections</a>
        <a href="#" class="hover:text-zinc-300">Shop</a>
      </nav>
    </div>
  </header>

  <section class="min-h-[80vh] flex items-center bg-zinc-100">
    <div class="max-w-7xl mx-auto px-6 w-full">
      <div class="flex gap-12">
        <div class="w-16 flex flex-col justify-center items-center gap-4">
          <div class="w-0.5 h-24 bg-zinc-400"></div>
          <div class="w-0.5 h-16 bg-zinc-300"></div>
          <div class="w-0.5 h-8 bg-zinc-200"></div>
        </div>
        
        <div class="flex-1 grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div>
              <p class="text-sm text-zinc-500 tracking-[0.3em] uppercase mb-4">Spring 2026</p>
              <h1 class="text-6xl lg:text-8xl font-bold text-black uppercase tracking-wider leading-none">
                New<br>Collection
              </h1>
            </div>
            
            <p class="text-lg text-zinc-600">Minimal & Elegant Style</p>
            
            <button class="px-8 py-4 bg-black text-white uppercase tracking-wider font-bold">
              Shop Now
            </button>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-1 aspect-[3/4] bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-sm"></div>
            <div class="flex-1 aspect-[3/4] bg-gradient-to-b from-zinc-200 to-zinc-300 rounded-sm"></div>
            <div class="flex-1 aspect-[3/4] bg-gradient-to-b from-zinc-400 to-zinc-500 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 bg-black text-white">
    <div class="max-w-7xl mx-auto px-6 text-center">
      <h2 class="text-4xl uppercase tracking-widest mb-8">Discover More</h2>
      <button class="px-12 py-4 border border-white uppercase tracking-widest">
        View All Products
      </button>
    </div>
  </section>
</body>
</html>`,
    
    tech: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <title>Tech Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; transform: scale(0.5); transform-origin: top left; }
    * { box-sizing: border-box; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-950">
  <header class="py-2 px-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded"></div>
        <span class="text-sm font-bold text-cyan-400 tracking-widest">NEXUS</span>
      </div>
      <button class="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded font-bold">Get Started</button>
    </div>
  </header>

  <section class="min-h-[60vh] flex items-center relative overflow-hidden px-4 py-6">
    <div class="absolute top-8 left-8 w-24 h-24 border border-cyan-400/20 rounded-full animate-pulse"></div>
    
    <div class="text-center w-full relative z-10">
      <p class="text-cyan-400 tracking-[0.3em] uppercase text-xs mb-3">The Future Is Here</p>
      <h1 class="text-4xl font-bold text-white mb-3">Innovate Today</h1>
      <p class="text-sm text-cyan-400/70 mb-4 max-w-xs mx-auto">Cutting-edge technology for the modern world.</p>
      <div class="flex justify-center gap-2">
        <button class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded shadow-lg">Get Started</button>
        <button class="px-4 py-2 border border-cyan-500/50 text-cyan-400 text-xs font-bold rounded">Learn More</button>
      </div>
    </div>
  </section>

  <section class="py-4 px-4">
    <div class="flex gap-2">
      <div class="flex-1 bg-blue-900/30 border border-cyan-500/20 rounded-lg p-3">
        <div class="w-6 h-6 bg-cyan-500/20 rounded mb-2"></div>
        <p class="text-xs font-bold text-white">Fast</p>
      </div>
      <div class="flex-1 bg-blue-900/30 border border-cyan-500/20 rounded-lg p-3">
        <div class="w-6 h-6 bg-cyan-500/20 rounded mb-2"></div>
        <p class="text-xs font-bold text-white">Secure</p>
      </div>
      <div class="flex-1 bg-blue-900/30 border border-cyan-500/20 rounded-lg p-3">
        <div class="w-6 h-6 bg-cyan-500/20 rounded mb-2"></div>
        <p class="text-xs font-bold text-white">Scale</p>
      </div>
    </div>
  </section>
</body>
</html>`,
    
    food: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <title>Food Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; transform: scale(0.5); transform-origin: top left; }
    * { box-sizing: border-box; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-50">
  <header class="bg-gradient-to-r from-orange-500 via-red-400 to-orange-500 text-white py-2 px-4">
    <div class="flex items-center justify-center">
      <span class="text-base font-bold tracking-wider uppercase">Gourmet</span>
    </div>
  </header>

  <section class="min-h-[60vh] flex items-center px-4 py-6">
    <div class="flex gap-4 w-full">
      <div class="flex-1 space-y-3">
        <div class="flex items-center gap-2">
          <span class="text-4xl">🍕</span>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Restaurant</h1>
            <p class="text-xs text-gray-600">Spécialités locales</p>
          </div>
        </div>
        <p class="text-xs text-gray-600">Ingrédients frais et locaux.</p>
        <div class="flex gap-2">
          <button class="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg shadow">Commander</button>
          <button class="px-4 py-2 border-2 border-orange-300 text-orange-500 text-xs font-bold rounded-lg">Menu</button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 w-32">
        <div class="aspect-square bg-gradient-to-br from-orange-200 to-red-200 rounded-xl flex items-center justify-center text-2xl">🍝</div>
        <div class="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl flex items-center justify-center text-2xl">🍖</div>
        <div class="aspect-square bg-gradient-to-br from-red-200 to-pink-200 rounded-xl flex items-center justify-center text-2xl">🥗</div>
        <div class="aspect-square bg-gradient-to-br from-yellow-200 to-amber-200 rounded-xl flex items-center justify-center text-2xl">🍰</div>
      </div>
    </div>
  </section>
</body>
</html>`,
    
    jewelry: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <title>Jewelry Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cormorant Garamond', serif; margin: 0; padding: 0; transform: scale(0.5); transform-origin: top left; }
    * { box-sizing: border-box; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
  <header class="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white py-2 px-4">
    <div class="flex items-center justify-center">
      <span class="text-sm tracking-[0.2em] uppercase font-medium">Luxe Jewelry</span>
    </div>
  </header>

  <section class="min-h-[60vh] flex items-center px-4 py-6">
    <div class="text-center w-full">
      <div class="w-24 h-24 mx-auto mb-4 relative">
        <div class="absolute inset-0 border-2 border-amber-300 rounded-full animate-spin" style="animation-duration: 20s;"></div>
        <div class="w-full h-full bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-300 rounded-full flex items-center justify-center shadow-xl">
          <span class="text-4xl">💎</span>
        </div>
      </div>
      <h1 class="text-3xl font-bold text-amber-700 mb-2">Bijoux Premium</h1>
      <p class="text-sm text-amber-600 mb-2">Collection Exclusive</p>
      <div class="flex justify-center gap-1 mb-2">
        <span class="text-lg text-amber-500">★</span>
        <span class="text-lg text-amber-500">★</span>
        <span class="text-lg text-amber-500">★</span>
        <span class="text-lg text-amber-500">★</span>
        <span class="text-lg text-amber-500">★</span>
      </div>
      <p class="text-xl font-bold text-amber-700 mb-3">€299</p>
      <button class="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold rounded shadow-lg uppercase tracking-wider">Découvrir</button>
    </div>
  </section>
</body>
</html>`,
    
    sport: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=0.5">
  <title>Sport Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; transform: scale(0.5); transform-origin: top left; }
    * { box-sizing: border-box; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50">
  <header class="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white py-2 px-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-lg">⚡</span>
        <span class="text-sm font-bold tracking-wider uppercase">Fit Pro</span>
      </div>
    </div>
  </header>

  <section class="min-h-[60vh] flex items-center px-4 py-6">
    <div class="flex gap-4 w-full items-center">
      <div class="flex-1 space-y-3">
        <div class="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">🔥 Nouveau</div>
        <h1 class="text-2xl font-extrabold text-gray-900 leading-tight">Transformez<br>Votre Corps</h1>
        <p class="text-xs text-gray-600">Programme personnalisé</p>
        <div class="flex items-center gap-3 text-xs font-bold text-emerald-600">
          <span>🔥 500+</span>
          <span>⚡ 4.9</span>
        </div>
        <div class="flex gap-2">
          <button class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-lg shadow-lg">Start</button>
          <button class="px-4 py-2 border-2 border-emerald-300 text-emerald-600 text-xs font-bold rounded-lg">Plus</button>
        </div>
      </div>
      <div class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
        <span class="text-4xl">💪</span>
      </div>
    </div>
  </section>

  <section class="py-3 px-4 bg-white">
    <div class="grid grid-cols-3 gap-2">
      <div class="p-2 bg-emerald-50 rounded-lg text-center">
        <span class="text-xl">🏃</span>
        <p class="text-[10px] font-bold text-gray-900">Cardio</p>
      </div>
      <div class="p-2 bg-green-50 rounded-lg text-center">
        <span class="text-xl">🏋️</span>
        <p class="text-[10px] font-bold text-gray-900">Force</p>
      </div>
      <div class="p-2 bg-teal-50 rounded-lg text-center">
        <span class="text-xl">🧘</span>
        <p class="text-[10px] font-bold text-gray-900">Flex</p>
      </div>
    </div>
  </section>
</body>
</html>`
  };

  const template = templates[id] || templates.cosmetic;

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
