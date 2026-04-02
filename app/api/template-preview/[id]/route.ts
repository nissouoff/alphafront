import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const templates: Record<string, { name: string; gradient: string; color1: string; color2: string }> = {
    cosmetic: {
      name: 'Glow',
      gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #fcd34d 100%)',
      color1: '#ec4899',
      color2: '#f59e0b'
    },
    skinova: {
      name: 'Skinova',
      gradient: 'linear-gradient(135deg, #f5f3ff 0%, #e5e5e5 50%, #d4d4d4 100%)',
      color1: '#78716c',
      color2: '#57534e'
    },
    fashion: {
      name: 'Fashion',
      gradient: 'linear-gradient(135deg, #27272a 0%, #3f3f46 50%, #52525b 100%)',
      color1: '#71717a',
      color2: '#a1a1aa'
    },
    food: {
      name: 'Food',
      gradient: 'linear-gradient(135deg, #fed7aa 0%, #fbbf24 50%, #f87171 100%)',
      color1: '#ea580c',
      color2: '#dc2626'
    },
    tech: {
      name: 'Tech',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)',
      color1: '#0284c7',
      color2: '#0d9488'
    },
    jewelry: {
      name: 'Jewelry',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #f59e0b 100%)',
      color1: '#d97706',
      color2: '#b45309'
    },
    sport: {
      name: 'Sport',
      gradient: 'linear-gradient(135deg, #dcfce7 0%, #4ade80 50%, #2dd4bf 100%)',
      color1: '#16a34a',
      color2: '#0d9488'
    }
  };

  const template = templates[id] || templates.cosmetic;
  const { name, gradient, color1, color2 } = template;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:0.15" />
          <stop offset="50%" style="stop-color:${color2};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${color1};stop-opacity:0.05" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="600" fill="#fafafa"/>
      <rect width="800" height="600" fill="url(#bgGrad)"/>
      
      <!-- Decorative elements -->
      <circle cx="80" cy="80" r="120" fill="${color1}" opacity="0.08"/>
      <circle cx="720" cy="520" r="180" fill="${color2}" opacity="0.08"/>
      
      <!-- Browser mockup -->
      <g filter="url(#shadow)">
        <!-- Browser frame -->
        <rect x="50" y="50" width="700" height="500" rx="16" fill="white"/>
        
        <!-- Browser header bar -->
        <rect x="50" y="50" width="700" height="50" rx="16" fill="#f5f5f5"/>
        <rect x="50" y="92" width="700" height="8" fill="#f5f5f5"/>
        
        <!-- Traffic lights -->
        <circle cx="75" cy="75" r="7" fill="#ff5f57"/>
        <circle cx="98" cy="75" r="7" fill="#febc2e"/>
        <circle cx="121" cy="75" r="7" fill="#28c840"/>
        
        <!-- Address bar -->
        <rect x="150" y="62" width="550" height="26" rx="6" fill="#e8e8e8"/>
        <text x="170" y="80" fill="#71717a" font-size="11" font-family="system-ui">localhost:3000/template/${id}</text>
      </g>
      
      <!-- Hero Content -->
      <g>
        <!-- Title placeholder -->
        <rect x="100" y="140" width="200" height="20" rx="4" fill="${color1}" opacity="0.3"/>
        <rect x="100" y="170" width="350" height="32" rx="6" fill="${color1}" opacity="0.5"/>
        
        <!-- Description -->
        <rect x="100" y="220" width="280" height="14" rx="3" fill="#a1a1aa"/>
        <rect x="100" y="245" width="220" height="14" rx="3" fill="#a1a1aa"/>
        
        <!-- CTA Button -->
        <rect x="100" y="280" width="140" height="42" rx="8" fill="${color1}"/>
        <text x="170" y="306" text-anchor="middle" fill="white" font-size="13" font-weight="600">Commander</text>
        
        <!-- Secondary button -->
        <rect x="260" y="280" width="120" height="42" rx="8" fill="none" stroke="${color1}" stroke-width="2"/>
        <text x="320" y="306" text-anchor="middle" fill="${color1}" font-size="13" font-weight="600">En savoir plus</text>
      </g>
      
      <!-- Product Image Area -->
      <g>
        <rect x="450" y="130" width="260" height="320" rx="12" fill="${gradient}"/>
        <circle cx="580" cy="280" r="80" fill="white" opacity="0.4"/>
        <text x="580" y="290" text-anchor="middle" fill="${color1}" font-size="48">✨</text>
        
        <!-- Price tag -->
        <rect x="460" y="400" width="100" height="30" rx="6" fill="white" opacity="0.9"/>
        <rect x="475" y="415" width="70" height="12" rx="3" fill="${color2}" opacity="0.7"/>
      </g>
      
      <!-- Features Section -->
      <g>
        <rect x="100" y="360" width="280" height="140" rx="10" fill="#fafafa"/>
        
        <!-- Feature 1 -->
        <circle cx="130" cy="390" r="16" fill="${color1}" opacity="0.2"/>
        <rect x="160" y="382" width="100" height="10" rx="2" fill="#71717a"/>
        <rect x="160" y="400" width="60" height="8" rx="2" fill="#a1a1aa"/>
        
        <!-- Feature 2 -->
        <circle cx="130" cy="440" r="16" fill="${color2}" opacity="0.2"/>
        <rect x="160" y="432" width="120" height="10" rx="2" fill="#71717a"/>
        <rect x="160" y="450" width="80" height="8" rx="2" fill="#a1a1aa"/>
        
        <!-- Feature 3 -->
        <circle cx="130" cy="480" r="16" fill="${color1}" opacity="0.2"/>
        <rect x="160" y="472" width="90" height="10" rx="2" fill="#71717a"/>
        <rect x="160" y="490" width="70" height="8" rx="2" fill="#a1a1aa"/>
      </g>
      
      <!-- Stats -->
      <g>
        <rect x="400" y="480" width="310" height="50" rx="8" fill="#fafafa"/>
        <rect x="430" y="498" width="50" height="16" rx="3" fill="${color1}" opacity="0.5"/>
        <rect x="500" y="498" width="40" height="16" rx="3" fill="#a1a1aa"/>
        <rect x="560" y="498" width="30" height="16" rx="3" fill="#a1a1aa"/>
      </g>
      
      <!-- Footer -->
      <g>
        <rect x="50" y="520" width="700" height="30" fill="#f5f5f5"/>
        <rect x="100" y="532" width="80" height="6" rx="2" fill="#a1a1aa"/>
        <rect x="620" y="532" width="60" height="6" rx="2" fill="#a1a1aa"/>
      </g>
      
      <!-- Template Name Badge -->
      <g filter="url(#shadow)">
        <rect x="620" y="20" width="120" height="28" rx="14" fill="white"/>
        <circle cx="638" cy="34" r="8" fill="${color1}"/>
        <text x="655" y="39" fill="#18181b" font-size="11" font-weight="600">${name}</text>
      </g>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
