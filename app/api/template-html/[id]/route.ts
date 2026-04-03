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
  <meta name="viewport" content="width=1200">
  <title>Glow - Cosmetic Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    body { background: linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%); }
  </style>
</head>
<body>
  <div style="width:100%;min-height:100vh;">
    <!-- Header -->
    <header style="width:100%;padding:20px 48px;background:white;border-bottom:1px solid #fecdd3;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#f472b6,#fb923c);border-radius:12px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-weight:bold;font-size:20px;">B</span>
        </div>
        <div>
          <span style="font-size:24px;font-weight:700;background:linear-gradient(135deg,#be185d,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Bella Skin</span>
          <p style="font-size:11px;color:#9ca3af;letter-spacing:2px;text-transform:uppercase;">Cosmétiques Premium</p>
        </div>
      </div>
      <nav style="display:flex;gap:32px;">
        <a href="#" style="font-size:14px;color:#6b7280;text-decoration:none;font-weight:500;">Collection</a>
        <a href="#" style="font-size:14px;color:#6b7280;text-decoration:none;font-weight:500;">Avis</a>
        <a href="#" style="font-size:14px;color:#6b7280;text-decoration:none;font-weight:500;">Contact</a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section style="padding:80px 48px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-100px;left:-100px;width:400px;height:400px;background:rgba(244,114,182,0.2);border-radius:50%;filter:blur(100px);"></div>
      <div style="position:absolute;bottom:-100px;right:-100px;width:500px;height:500px;background:rgba(251,146,60,0.2);border-radius:50%;filter:blur(100px);"></div>
      
      <div style="display:flex;align-items:center;gap:64px;position:relative;z-index:1;">
        <div style="flex:1;">
          <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(255,255,255,0.9);border-radius:100px;border:1px solid #fecdd3;margin-bottom:24px;">
            <div style="width:8px;height:8px;background:#22c55a;border-radius:50%;"></div>
            <span style="font-size:13px;color:#374151;font-weight:500;">Nouveau • Collection Printemps 2026</span>
          </div>
          
          <h1 style="font-size:72px;font-weight:700;color:#111827;line-height:1.1;margin-bottom:24px;">
            Votre beauté<br/>commence ici
          </h1>
          
          <p style="font-size:20px;color:#6b7280;max-width:500px;line-height:1.7;margin-bottom:32px;">
            Collection exclusive de soins cosmétiques naturels, formulés pour révéler l'éclat de votre peau.
          </p>
          
          <div style="display:flex;gap:16px;margin-bottom:48px;">
            <button style="padding:16px 32px;background:linear-gradient(135deg,#f472b6,#fb923c);color:white;font-size:16px;font-weight:600;border-radius:100px;border:none;cursor:pointer;box-shadow:0 10px 40px rgba(244,114,182,0.3);">
              Commander
            </button>
            <button style="padding:16px 32px;background:white;color:#111827;font-size:16px;font-weight:600;border-radius:100px;border:2px solid #e5e7eb;cursor:pointer;">
              En savoir plus
            </button>
          </div>
          
          <div style="display:flex;align-items:center;gap:48px;padding-top:32px;border-top:1px solid #fecdd3;">
            <div style="text-align:center;">
              <p style="font-size:48px;font-weight:700;color:#f472b6;">98%</p>
              <p style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Satisfait</p>
            </div>
            <div style="width:1px;height:60px;background:#fecdd3;"></div>
            <div style="text-align:center;">
              <p style="font-size:48px;font-weight:700;color:#f472b6;">15K+</p>
              <p style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Clients</p>
            </div>
          </div>
        </div>
        
        <div style="position:relative;flex:1;">
          <div style="width:500px;height:600px;background:linear-gradient(135deg,#fdf2f8,#fef3c7);border-radius:32px;display:flex;align-items:center;justify-content:center;position:relative;box-shadow:0 40px 100px rgba(0,0,0,0.1);">
            <span style="font-size:180px;">🌸</span>
          </div>
          <div style="position:absolute;left:-40px;top:50%;transform:translateY(-50%);background:white;padding:24px;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.1);border:1px solid #fecdd3;">
            <p style="font-size:36px;font-weight:700;color:#111827;">3500 DA</p>
            <p style="font-size:14px;color:#9ca3af;">Sérum Visage</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Section -->
    <section style="padding:80px 48px;background:white;">
      <h2 style="font-size:48px;font-weight:700;color:#111827;text-align:center;margin-bottom:48px;">Collection Exclusive</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:48px;">
        <div style="width:300px;height:300px;background:linear-gradient(135deg,#fdf2f8,#fef3c7);border-radius:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
          <span style="font-size:120px;">✨</span>
        </div>
        <div style="max-width:500px;">
          <span style="display:inline-block;padding:6px 12px;background:#fef2f2;color:#dc2626;font-size:12px;font-weight:600;border-radius:100px;margin-bottom:16px;">-22% OFF</span>
          <h3 style="font-size:32px;font-weight:700;color:#111827;margin-bottom:16px;">Sérum Visage Naturel</h3>
          <p style="font-size:16px;color:#6b7280;line-height:1.7;margin-bottom:24px;">Un sérum visage enrichi en ingrédients naturels pour une peau éclatante et hydratée.</p>
          <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:32px;">
            <span style="font-size:48px;font-weight:700;background:linear-gradient(135deg,#be185d,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">3500 DA</span>
            <span style="font-size:24px;color:#d1d5db;text-decoration:line-through;">4500 DA</span>
          </div>
          <button style="width:100%;padding:20px;background:linear-gradient(135deg,#f472b6,#fb923c);color:white;font-size:18px;font-weight:600;border-radius:16px;border:none;cursor:pointer;box-shadow:0 10px 40px rgba(244,114,182,0.3);">
            Commander Maintenant
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer style="padding:40px 48px;background:#111827;color:white;text-align:center;">
      <p style="font-size:14px;color:#9ca3af;">Bella Skin © 2026 • contact@bellaskin.com</p>
    </footer>
  </div>
</body>
</html>`,
    
    skinova: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200">
  <title>Skinova - Luxury Cosmetic Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    body { background: #fafaf9; }
    .serif { font-family: 'Cormorant Garamond', serif; }
  </style>
</head>
<body>
  <div style="width:100%;min-height:100vh;">
    <!-- Header -->
    <header style="width:100%;padding:20px 48px;background:white;border-bottom:1px solid #e7e5e4;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:40px;height:40px;background:#1c1917;border-radius:50%;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;">S</span>
        </div>
        <span style="font-size:20px;letter-spacing:4px;text-transform:uppercase;font-family:'Cormorant Garamond',serif;font-weight:500;color:#1c1917;">Skinova</span>
      </div>
      <nav style="display:flex;gap:48px;">
        <a href="#" style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#78716c;text-decoration:none;font-weight:500;">Collection</a>
        <a href="#" style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#78716c;text-decoration:none;font-weight:500;">Témoignages</a>
        <a href="#" style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#78716c;text-decoration:none;font-weight:500;">FAQ</a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section style="min-height:80vh;padding:80px 48px;display:flex;align-items:center;position:relative;background:#fafaf9;">
      <div style="position:absolute;top:0;right:0;width:33%;height:100%;background:linear-gradient(270deg,rgba(253,251,249,0.8),transparent);"></div>
      
      <div style="display:flex;align-items:center;gap:120px;position:relative;z-index:1;width:100%;">
        <div style="flex:1;">
          <div style="width:64px;height:2px;background:#d6d3d1;margin-bottom:32px;"></div>
          <p style="font-size:14px;letter-spacing:4px;text-transform:uppercase;color:#a8a29e;margin-bottom:24px;">Collection Exclusive 2026</p>
          <h1 style="font-size:80px;font-family:'Cormorant Garamond',serif;font-weight:500;color:#1c1917;line-height:1.1;margin-bottom:32px;">
            L'Excellence<br/>du Soin
          </h1>
          <div style="width:64px;height:2px;background:#d6d3d1;margin-bottom:32px;"></div>
          <p style="font-size:20px;color:#a8a29e;line-height:1.7;max-width:500px;margin-bottom:40px;">
            Formulations révolutionnaires pour une peau transformée. Le secret des peaux parfaites enfin révélé.
          </p>
          <div style="display:flex;gap:24px;">
            <button style="padding:16px 48px;background:#1c1917;color:white;font-size:12px;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;font-weight:500;">Découvrir</button>
            <button style="padding:16px 48px;background:transparent;color:#57534e;font-size:12px;letter-spacing:2px;text-transform:uppercase;border:1px solid #d6d3d1;cursor:pointer;font-weight:500;">Explorer</button>
          </div>
        </div>
        
        <div style="position:relative;flex:1;">
          <div style="width:500px;height:600px;background:linear-gradient(135deg,#e7e5e4,#d6d3d1);border-radius:4px;display:flex;align-items:center;justify-content:center;position:relative;">
            <span style="font-size:200px;opacity:0.15;">⚗️</span>
          </div>
          <div style="position:absolute;left:-60px;top:50%;transform:translateY(-50%);background:white;padding:32px;box-shadow:0 40px 100px rgba(0,0,0,0.1);border:1px solid #e7e5e4;min-width:220px;">
            <p style="font-size:40px;font-family:'Cormorant Garamond',serif;color:#1c1917;">4500 DA</p>
            <p style="font-size:14px;color:#a8a29e;margin-bottom:16px;">Prix du produit</p>
            <div style="border-top:1px solid #e7e5e4;padding-top:16px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:14px;color:#78716c;">Satisfaction</span>
                <span style="font-size:14px;font-weight:500;color:#1c1917;">99%</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:14px;color:#78716c;">Utilisatrices</span>
                <span style="font-size:14px;font-weight:500;color:#1c1917;">25K+</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="font-size:14px;color:#78716c;">Note</span>
                <span style="font-size:14px;font-weight:500;color:#1c1917;">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Section -->
    <section style="padding:80px 48px;background:white;">
      <div style="display:flex;gap:120px;align-items:center;">
        <div style="flex:1;">
          <p style="font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#a8a29e;margin-bottom:16px;">Produit Star</p>
          <h2 style="font-size:48px;font-family:'Cormorant Garamond',serif;color:#1c1917;margin-bottom:24px;">Concentré Éclat</h2>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
            <span style="font-size:20px;color:#1c1917;">★★★★★</span>
            <span style="font-size:16px;color:#a8a29e;">4.9/5 (2,847 avis)</span>
          </div>
          <p style="font-size:18px;color:#78716c;line-height:1.7;max-width:500px;margin-bottom:32px;">
            Un concentré ultra-puissant qui transforme instantanément l'aspect de votre peau. Texture veloutée, fini naturel.
          </p>
          <div style="display:flex;gap:24px;margin-bottom:40px;">
            <div style="padding:16px;background:#fafaf9;display:flex;align-items:center;gap:12px;">
              <span style="font-size:20px;">✓</span>
              <span style="font-size:14px;color:#57534e;">Garantie 30 jours</span>
            </div>
            <div style="padding:16px;background:#fafaf9;display:flex;align-items:center;gap:12px;">
              <span style="font-size:20px;">✓</span>
              <span style="font-size:14px;color:#57534e;">Paiement à la livraison</span>
            </div>
          </div>
          <button style="width:100%;padding:20px;background:#1c1917;color:white;font-size:14px;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;font-weight:500;">Commander Maintenant</button>
        </div>
        <div style="flex:1;">
          <div style="width:100%;aspect-ratio:3/4;background:#f5f5f4;border-radius:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 40px 100px rgba(0,0,0,0.08);">
            <span style="font-size:200px;opacity:0.15;">⚗️</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer style="padding:48px;background:#1c1917;color:white;text-align:center;">
      <p style="font-size:14px;color:#78716c;">© 2026 SKINOVA • Excellence cosmétique</p>
    </footer>
  </div>
</body>
</html>`,
    
    fashion: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200">
  <title>Fashion Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: 'Inter', sans-serif; }
    body { background: #18181b; }
  </style>
</head>
<body>
  <div style="width:100%;min-height:100vh;">
    <!-- Header -->
    <header style="padding:24px 48px;background:#09090b;display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:28px;letter-spacing:8px;text-transform:uppercase;color:white;font-weight:700;">VOGUE</span>
      <nav style="display:flex;gap:40px;">
        <a href="#" style="font-size:13px;color:white;font-weight:500;text-decoration:none;">New</a>
        <a href="#" style="font-size:13px;color:#71717a;font-weight:500;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">Collections</a>
        <a href="#" style="font-size:13px;color:#71717a;font-weight:500;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">Shop</a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section style="min-height:80vh;display:flex;align-items:center;padding:0 48px;background:#18181b;">
      <div style="display:flex;align-items:center;gap:80px;width:100%;">
        <div style="display:flex;flex-direction:column;gap:24px;">
          <div style="width:2px;height:100px;background:#3f3f46;"></div>
          <div style="width:2px;height:60px;background:#52525b;"></div>
          <div style="width:2px;height:30px;background:#71717a;"></div>
        </div>
        
        <div style="flex:1;">
          <p style="font-size:14px;color:#71717a;letter-spacing:4px;text-transform:uppercase;margin-bottom:24px;">Spring 2026</p>
          <h1 style="font-size:120px;font-weight:700;color:white;text-transform:uppercase;letter-spacing:-2px;line-height:0.9;margin-bottom:32px;">
            New<br/>Collection
          </h1>
          <p style="font-size:20px;color:#71717a;max-width:400px;margin-bottom:40px;">Minimal & Elegant Style for the Modern Woman</p>
          <button style="padding:20px 48px;background:white;color:black;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:2px;border:none;cursor:pointer;">
            Shop Now
          </button>
        </div>
        
        <div style="flex:1;display:flex;gap:16px;">
          <div style="flex:1;aspect-ratio:3/4;background:linear-gradient(180deg,#d4d4d8,#a1a1aa);border-radius:4px;"></div>
          <div style="flex:1;aspect-ratio:3/4;background:linear-gradient(180deg,#e4e4e7,#d4d4d8);border-radius:4px;"></div>
          <div style="flex:1;aspect-ratio:3/4;background:linear-gradient(180deg,#a1a1aa,#71717a);border-radius:4px;"></div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section style="padding:80px 48px;background:#09090b;text-align:center;">
      <h2 style="font-size:48px;color:white;text-transform:uppercase;letter-spacing:8px;margin-bottom:32px;">Discover More</h2>
      <button style="padding:20px 64px;background:transparent;color:white;font-size:14px;text-transform:uppercase;letter-spacing:4px;border:2px solid white;cursor:pointer;">
        View All Products
      </button>
    </section>
  </div>
</body>
</html>`,
    
    tech: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200">
  <title>Tech Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: 'Inter', sans-serif; }
    body { background: linear-gradient(135deg, #0c1929 0%, #1e3a5f 50%, #0c1929 100%); }
  </style>
</head>
<body>
  <div style="width:100%;min-height:100vh;">
    <!-- Header -->
    <header style="padding:24px 48px;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#22d3ee,#3b82f6);border-radius:12px;"></div>
        <span style="font-size:20px;font-weight:700;color:#22d3ee;letter-spacing:4px;">NEXUS</span>
      </div>
      <button style="padding:12px 32px;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:white;font-size:14px;font-weight:600;border-radius:8px;border:none;cursor:pointer;box-shadow:0 10px 40px rgba(34,211,238,0.3);">
        Start Now
      </button>
    </header>

    <!-- Hero Section -->
    <section style="min-height:80vh;display:flex;align-items:center;justify-content:center;position:relative;padding:48px;">
      <div style="position:absolute;top:100px;left:200px;width:200px;height:200px;border:1px solid rgba(34,211,238,0.2);border-radius:50%;"></div>
      <div style="position:absolute;bottom:200px;right:200px;width:300px;height:300px;border:1px solid rgba(34,211,238,0.1);border-radius:50%;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;border:1px solid rgba(34,211,238,0.05);border-radius:50%;"></div>
      
      <div style="text-align:center;position:relative;z-index:1;">
        <p style="font-size:16px;color:#22d3ee;letter-spacing:8px;text-transform:uppercase;margin-bottom:24px;">The Future Is Here</p>
        <h1 style="font-size:96px;font-weight:700;color:white;margin-bottom:24px;line-height:1;">Innovate<br/>Today</h1>
        <p style="font-size:24px;color:rgba(34,211,238,0.7);max-width:600px;margin:0 auto 48px;">Cutting-edge technology that transforms how you work, create, and connect.</p>
        <div style="display:flex;justify-content:center;gap:16px;">
          <button style="padding:20px 48px;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:white;font-size:16px;font-weight:600;border-radius:12px;border:none;cursor:pointer;box-shadow:0 20px 60px rgba(34,211,238,0.3);">
            Get Started
          </button>
          <button style="padding:20px 48px;background:transparent;color:#22d3ee;font-size:16px;font-weight:600;border-radius:12px;border:2px solid rgba(34,211,238,0.5);cursor:pointer;">
            Learn More
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section style="padding:48px;">
      <div style="display:flex;gap:24px;">
        <div style="flex:1;padding:32px;background:rgba(30,58,95,0.5);border:1px solid rgba(34,211,238,0.2);border-radius:16px;">
          <div style="width:64px;height:64px;background:rgba(34,211,238,0.2);border-radius:12px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;font-size:32px;">⚡</div>
          <p style="font-size:24px;font-weight:600;color:white;margin-bottom:8px;">Lightning Fast</p>
          <p style="font-size:14px;color:#94a3b8;">Process data in milliseconds with our optimized algorithms.</p>
        </div>
        <div style="flex:1;padding:32px;background:rgba(30,58,95,0.5);border:1px solid rgba(34,211,238,0.2);border-radius:16px;">
          <div style="width:64px;height:64px;background:rgba(34,211,238,0.2);border-radius:12px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;font-size:32px;">🔒</div>
          <p style="font-size:24px;font-weight:600;color:white;margin-bottom:8px;">Secure</p>
          <p style="font-size:14px;color:#94a3b8;">Enterprise-grade security with end-to-end encryption.</p>
        </div>
        <div style="flex:1;padding:32px;background:rgba(30,58,95,0.5);border:1px solid rgba(34,211,238,0.2);border-radius:16px;">
          <div style="width:64px;height:64px;background:rgba(34,211,238,0.2);border-radius:12px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;font-size:32px;">📈</div>
          <p style="font-size:24px;font-weight:600;color:white;margin-bottom:8px;">Scale</p>
          <p style="font-size:14px;color:#94a3b8;">Grow from startup to enterprise without limitations.</p>
        </div>
      </div>
    </section>
  </div>
</body>
</html>`,
    
    food: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200">
  <title>Food Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: 'Inter', sans-serif; }
    body { background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #fee2e2 100%); }
  </style>
</head>
<body>
  <div style="width:100%;min-height:100vh;">
    <!-- Header -->
    <header style="padding:20px 48px;background:linear-gradient(90deg,#f97316,#ef4444,#f97316);display:flex;align-items:center;justify-content:center;">
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="font-size:40px;">🍕</span>
        <span style="font-size:28px;font-weight:700;color:white;letter-spacing:4px;text-transform:uppercase;">Gourmet</span>
      </div>
    </header>

    <!-- Hero Section -->
    <section style="min-height:80vh;display:flex;align-items:center;padding:48px;">
      <div style="display:flex;align-items:center;gap:80px;width:100%;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:24px;margin-bottom:32px;">
            <span style="font-size:80px;">🍝</span>
            <div>
              <h1 style="font-size:64px;font-weight:700;color:#111827;margin-bottom:8px;">Restaurant</h1>
              <p style="font-size:20px;color:#6b7280;">Spécialités locales</p>
            </div>
          </div>
          <p style="font-size:20px;color:#6b7280;max-width:500px;line-height:1.7;margin-bottom:40px;">
            Ingrédients frais et locaux. Saveurs authentiques. Une expérience culinaire inoubliable.
          </p>
          <div style="display:flex;gap:16px;">
            <button style="padding:20px 40px;background:linear-gradient(135deg,#f97316,#ef4444);color:white;font-size:16px;font-weight:600;border-radius:16px;border:none;cursor:pointer;box-shadow:0 10px 40px rgba(249,115,22,0.3);display:flex;align-items:center;gap:12px;">
              Commander <span style="font-size:24px;">🛒</span>
            </button>
            <button style="padding:20px 40px;background:white;color:#f97316;font-size:16px;font-weight:600;border-radius:16px;border:2px solid #fed7aa;cursor:pointer;">
              Voir le Menu
            </button>
          </div>
        </div>
        
        <div style="flex:1;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div style="aspect-ratio:1;background:linear-gradient(135deg,#fed7aa,#fecaca);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:80px;">🍕</div>
            <div style="aspect-ratio:1;background:linear-gradient(135deg,#fde68a,#fed7aa);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:80px;">🍖</div>
            <div style="aspect-ratio:1;background:linear-gradient(135deg,#fecaca,#fda4af);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:80px;">🥗</div>
            <div style="aspect-ratio:1;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:80px;">🍰</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section style="padding:80px 48px;background:linear-gradient(90deg,#f97316,#ef4444);text-align:center;">
      <h2 style="font-size:48px;font-weight:700;color:white;margin-bottom:16px;">Commandez maintenant !</h2>
      <p style="font-size:20px;color:rgba(255,255,255,0.9);">Livraison disponible 7j/7</p>
    </section>
  </div>
</body>
</html>`,
    
    jewelry: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200">
  <title>Jewelry Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: 'Cormorant Garamond', serif; }
    body { background: linear-gradient(135deg, #fef3c7 0%, #fefce8 50%, #fef3c7 100%); }
  </style>
</head>
<body>
  <div style="width:100%;min-height:100vh;">
    <!-- Header -->
    <header style="padding:24px 48px;background:linear-gradient(90deg,#d97706,#eab308,#d97706);display:flex;align-items:center;justify-content:center;">
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="font-size:32px;">💎</span>
        <span style="font-size:20px;letter-spacing:4px;text-transform:uppercase;color:white;font-weight:500;">Luxe Jewelry</span>
      </div>
    </header>

    <!-- Hero Section -->
    <section style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:48px;">
      <div style="text-align:center;">
        <div style="position:relative;width:200px;height:200px;margin:0 auto 40px;">
          <div style="position:absolute;inset:0;border:3px solid #fcd34d;border-radius:50%;animation:spin 10s linear infinite;"></div>
          <div style="width:100%;height:100%;background:linear-gradient(135deg,#fef3c7,#fde68a,#fcd34d);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 40px 100px rgba(217,119,6,0.3);">
            <span style="font-size:100px;">💎</span>
          </div>
        </div>
        <h1 style="font-size:72px;font-weight:700;color:#b45309;margin-bottom:16px;">Bijoux Premium</h1>
        <p style="font-size:24px;color:#d97706;margin-bottom:24px;">Collection Exclusive</p>
        <div style="display:flex;justify-content:center;gap:8px;margin-bottom:32px;">
          {[1,2,3,4,5].map(() => <span style="font-size:32px;color:#fcd34d;">★</span>)}
        </div>
        <p style="font-size:56px;font-weight:700;color:#b45309;margin-bottom:40px;">€299</p>
        <button style="padding:20px 56px;background:linear-gradient(135deg,#d97706,#eab308);color:white;font-size:18px;font-weight:600;border-radius:100px;border:none;cursor:pointer;box-shadow:0 20px 60px rgba(217,119,6,0.3);text-transform:uppercase;letter-spacing:2px;">
          Découvrir
        </button>
      </div>
    </section>

    <!-- Products Section -->
    <section style="padding:80px 48px;background:white;">
      <h2 style="font-size:48px;font-weight:700;color:#b45309;text-align:center;margin-bottom:48px;">Nos Créations</h2>
      <div style="display:flex;justify-content:center;gap:40px;">
        <div style="text-align:center;padding:40px;background:#fef3c7;border-radius:24px;">
          <div style="width:120px;height:120px;background:#fefce8;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:60px;">💍</div>
          <p style="font-size:24px;font-weight:600;color:#b45309;">Bagues</p>
          <p style="font-size:16px;color:#d97706;">À partir de €149</p>
        </div>
        <div style="text-align:center;padding:40px;background:#fef3c7;border-radius:24px;">
          <div style="width:120px;height:120px;background:#fefce8;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:60px;">📿</div>
          <p style="font-size:24px;font-weight:600;color:#b45309;">Colliers</p>
          <p style="font-size:16px;color:#d97706;">À partir de €199</p>
        </div>
        <div style="text-align:center;padding:40px;background:#fef3c7;border-radius:24px;">
          <div style="width:120px;height:120px;background:#fefce8;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:60px;">✧</div>
          <p style="font-size:24px;font-weight:600;color:#b45309;">Bracelets</p>
          <p style="font-size:16px;color:#d97706;">À partir de €99</p>
        </div>
      </div>
    </section>
  </div>
  <style>
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  </style>
</body>
</html>`,
    
    sport: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200">
  <title>Sport Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: 'Inter', sans-serif; }
    body { background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 50%, #d1fae5 100%); }
  </style>
</head>
<body>
  <div style="width:100%;min-height:100vh;">
    <!-- Header -->
    <header style="padding:20px 48px;background:linear-gradient(90deg,#10b981,#22c55e,#10b981);display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:32px;">⚡</span>
        <span style="font-size:24px;font-weight:700;color:white;letter-spacing:2px;text-transform:uppercase;">Fit Pro</span>
      </div>
      <button style="padding:12px 24px;background:white;color:#059669;font-size:14px;font-weight:600;border-radius:100px;border:none;cursor:pointer;">
        Join Now
      </button>
    </header>

    <!-- Hero Section -->
    <section style="min-height:80vh;display:flex;align-items:center;padding:48px;">
      <div style="display:flex;align-items:center;gap:80px;width:100%;">
        <div style="flex:1;">
          <div style="display:inline-block;padding:8px 20px;background:#d1fae5;color:#047857;font-size:16px;font-weight:600;border-radius:100px;margin-bottom:24px;">🔥 Nouveau Programme</div>
          <h1 style="font-size:72px;font-weight:800;color:#111827;line-height:1.1;margin-bottom:24px;">
            Transformez<br/>Votre Corps
          </h1>
          <p style="font-size:20px;color:#6b7280;max-width:500px;line-height:1.7;margin-bottom:32px;">
            Programme personnalisé adapté à vos objectifs. Résultats garantis en 30 jours.
          </p>
          <div style="display:flex;align-items:center;gap:32px;font-size:20px;font-weight:600;color:#059669;margin-bottom:40px;">
            <span>🔥 500+ exercices</span>
            <span>⚡ 4.9 note</span>
          </div>
          <div style="display:flex;gap:16px;">
            <button style="padding:20px 48px;background:linear-gradient(135deg,#10b981,#22c55e);color:white;font-size:18px;font-weight:700;border-radius:16px;border:none;cursor:pointer;box-shadow:0 20px 60px rgba(16,185,129,0.3);display:flex;align-items:center;gap:12px;">
              Start Now <span style="font-size:28px;">💪</span>
            </button>
            <button style="padding:20px 48px;background:white;color:#059669;font-size:18px;font-weight:600;border-radius:16px;border:3px solid #a7f3d0;cursor:pointer;">
              En savoir plus
            </button>
          </div>
        </div>
        
        <div style="flex:1;display:flex;justify-content:center;">
          <div style="width:400px;height:400px;background:linear-gradient(135deg,#34d399,#22c55e);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 40px 100px rgba(16,185,129,0.3);">
            <span style="font-size:160px;">💪</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Programs Section -->
    <section style="padding:80px 48px;background:white;">
      <h2 style="font-size:48px;font-weight:700;color:#111827;text-align:center;margin-bottom:48px;">Nos Programmes</h2>
      <div style="display:flex;justify-content:center;gap:32px;">
        <div style="flex:1;max-width:300px;padding:40px;background:#ecfdf5;border-radius:24px;text-align:center;">
          <span style="font-size:80px;display:block;margin-bottom:16px;">🏃</span>
          <p style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;">Cardio</p>
          <p style="font-size:16px;color:#6b7280;">Brûlez des calories</p>
        </div>
        <div style="flex:1;max-width:300px;padding:40px;background:#d1fae5;border-radius:24px;text-align:center;">
          <span style="font-size:80px;display:block;margin-bottom:16px;">🏋️</span>
          <p style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;">Force</p>
          <p style="font-size:16px;color:#6b7280;">Gagnez en muscle</p>
        </div>
        <div style="flex:1;max-width:300px;padding:40px;background:#ccfbf1;border-radius:24px;text-align:center;">
          <span style="font-size:80px;display:block;margin-bottom:16px;">🧘</span>
          <p style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;">Flexibilité</p>
          <p style="font-size:16px;color:#6b7280;">Améliorez votre mobilité</p>
        </div>
      </div>
    </section>
  </div>
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
