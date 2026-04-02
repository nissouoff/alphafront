// SVG-based template previews
export function generateTemplatePreviewSVG(templateId: string, name: string): string {
  const templates: Record<string, { gradient: string; color1: string; color2: string }> = {
    cosmetic: {
      gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #fcd34d 100%)',
      color1: '#ec4899',
      color2: '#f59e0b'
    },
    skinova: {
      gradient: 'linear-gradient(135deg, #f5f3ff 0%, #e5e5e5 50%, #d4d4d4 100%)',
      color1: '#78716c',
      color2: '#57534e'
    },
    fashion: {
      gradient: 'linear-gradient(135deg, #27272a 0%, #3f3f46 50%, #52525b 100%)',
      color1: '#71717a',
      color2: '#a1a1aa'
    },
    food: {
      gradient: 'linear-gradient(135deg, #fed7aa 0%, #fbbf24 50%, #f87171 100%)',
      color1: '#ea580c',
      color2: '#dc2626'
    },
    tech: {
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)',
      color1: '#0284c7',
      color2: '#0d9488'
    },
    jewelry: {
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #f59e0b 100%)',
      color1: '#d97706',
      color2: '#b45309'
    },
    sport: {
      gradient: 'linear-gradient(135deg, #dcfce7 0%, #4ade80 50%, #2dd4bf 100%)',
      color1: '#16a34a',
      color2: '#0d9488'
    }
  };

  const style = templates[templateId] || templates.cosmetic;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${style.color1};stop-opacity:0.1" />
          <stop offset="50%" style="stop-color:${style.color2};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${style.color1};stop-opacity:0.05" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.1"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="600" fill="url(#bgGrad)"/>
      
      <!-- Decorative circles -->
      <circle cx="100" cy="100" r="150" fill="${style.color1}" opacity="0.1"/>
      <circle cx="700" cy="500" r="200" fill="${style.color2}" opacity="0.1"/>
      
      <!-- Browser mockup -->
      <g filter="url(#shadow)">
        <!-- Browser frame -->
        <rect x="50" y="50" width="700" height="500" rx="12" fill="white"/>
        
        <!-- Browser header -->
        <rect x="50" y="50" width="700" height="40" rx="12" fill="#f5f5f5"/>
        <rect x="50" y="82" width="700" height="8" fill="#f5f5f5"/>
        
        <!-- Browser buttons -->
        <circle cx="75" cy="70" r="6" fill="#ff5f57"/>
        <circle cx="95" cy="70" r="6" fill="#febc2e"/>
        <circle cx="115" cy="70" r="6" fill="#28c840"/>
        
        <!-- Browser address bar -->
        <rect x="140" y="60" width="580" height="20" rx="5" fill="#e5e5e5"/>
        
        <!-- Hero section mockup -->
        <rect x="80" y="120" width="200" height="16" rx="4" fill="${style.color1}" opacity="0.3"/>
        <rect x="80" y="145" width="300" height="24" rx="4" fill="${style.color1}" opacity="0.6"/>
        <rect x="80" y="180" width="250" height="12" rx="3" fill="#a1a1aa"/>
        <rect x="80" y="200" width="200" height="12" rx="3" fill="#a1a1aa"/>
        
        <!-- CTA Button -->
        <rect x="80" y="230" width="120" height="36" rx="8" fill="${style.color1}"/>
        <rect x="100" y="243" width="80" height="10" rx="3" fill="white" opacity="0.9"/>
        
        <!-- Product card mockup -->
        <rect x="400" y="120" width="280" height="320" rx="12" fill="#fafafa"/>
        <rect x="420" y="140" width="240" height="200" rx="8" fill="${style.gradient}"/>
        
        <!-- Image placeholder -->
        <circle cx="540" cy="240" r="60" fill="white" opacity="0.5"/>
        <text x="540" y="245" text-anchor="middle" fill="${style.color1}" font-size="24">✨</text>
        
        <!-- Product info -->
        <rect x="420" y="360" width="180" height="14" rx="3" fill="${style.color1}" opacity="0.5"/>
        <rect x="420" y="385" width="120" height="24" rx="4" fill="${style.color2}" opacity="0.7"/>
        
        <!-- Features section -->
        <rect x="80" y="300" width="280" height="200" rx="8" fill="#fafafa"/>
        <circle cx="120" cy="340" r="20" fill="${style.color1}" opacity="0.2"/>
        <circle cx="120" cy="390" r="20" fill="${style.color2}" opacity="0.2"/>
        <circle cx="120" cy="440" r="20" fill="${style.color1}" opacity="0.2"/>
        <rect x="155" y="330" width="150" height="10" rx="3" fill="#71717a"/>
        <rect x="155" y="380" width="120" height="10" rx="3" fill="#71717a"/>
        <rect x="155" y="430" width="140" height="10" rx="3" fill="#71717a"/>
        
        <!-- Footer -->
        <rect x="50" y="510" width="700" height="40" rx="0" fill="#f5f5f5"/>
        <rect x="50" y="510" width="700" height="40" rx="12" fill="#f5f5f5" clip-path="url(#topOnly)"/>
        <rect x="200" y="525" width="100" height="8" rx="2" fill="#a1a1aa"/>
        <rect x="320" y="525" width="80" height="8" rx="2" fill="#a1a1aa"/>
        <rect x="420" y="525" width="60" height="8" rx="2" fill="#a1a1aa"/>
      </g>
      
      <!-- Template name badge -->
      <g filter="url(#shadow)">
        <rect x="50" y="10" width="140" height="32" rx="16" fill="white"/>
        <circle cx="70" cy="26" r="10" fill="${style.color1}"/>
        <text x="88" y="31" fill="#18181b" font-size="12" font-weight="600">${name}</text>
      </g>
    </svg>
  `;
}

export function getTemplatePreviewUrl(templateId: string): string {
  return `/api/template-preview/${templateId}`;
}
