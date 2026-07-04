// Hand-coded SVG icons — Travel Tetris brand palette.

// Stylised palm tree — olive fronds, tomato coconut
export function PalmTreeIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 48 72" fill="none" className={className}>
      <path d="M24 68 C23 54 25 40 24 26" stroke="#405B2E" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M24 27 C16 20 6 23 2 16"   stroke="#405B2E" strokeWidth="3" strokeLinecap="round"/>
      <path d="M24 27 C32 19 42 21 46 14"  stroke="#405B2E" strokeWidth="3" strokeLinecap="round"/>
      <path d="M24 27 C18 18 14 10 11 4"   stroke="#405B2E" strokeWidth="3" strokeLinecap="round"/>
      <path d="M24 27 C30 17 34 10 37 4"   stroke="#405B2E" strokeWidth="3" strokeLinecap="round"/>
      <path d="M24 27 C22 16 22 8 22 2"    stroke="#405B2E" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="23" cy="28" r="3.5" fill="#F35B2D"/>
    </svg>
  );
}

// 8-point asterisk / starburst — brand decoration
export function AsteriskIcon({ className = "w-6 h-6", color = "#F35B2D" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="12" y1="2"     x2="12" y2="22"    stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
      <line x1="2"  y1="12"    x2="22" y2="12"    stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
      <line x1="4.9" y1="4.9"  x2="19.1" y2="19.1" stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
      <line x1="19.1" y1="4.9" x2="4.9"  y2="19.1" stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
    </svg>
  );
}

// Wavy underline — logo accent
export function WavyLine({ className = "w-32 h-3", color = "#4F8DCB" }) {
  return (
    <svg viewBox="0 0 120 10" fill="none" className={className}>
      <path
        d="M2 7 Q12 2 22 7 Q32 12 42 7 Q52 2 62 7 Q72 12 82 7 Q92 2 102 7 Q112 12 118 7"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

// Beach illustration — flat, no gradients, brand palette
export function BeachScene({ className = "w-48 h-28" }) {
  return (
    <svg viewBox="0 0 200 110" fill="none" className={className}>
      {/* Sun */}
      <circle cx="158" cy="28" r="16" fill="#FFC84D"/>
      {/* Water lines */}
      <path d="M5 90 Q20 83 35 90 Q50 97 65 90 Q80 83 95 90 Q110 97 125 90 Q140 83 155 90 Q170 97 185 90 Q195 85 200 88"
        stroke="#4F8DCB" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M0 100 Q18 93 36 100 Q54 107 72 100 Q90 93 108 100 Q126 107 144 100 Q162 93 180 100 Q192 95 200 98"
        stroke="#4F8DCB" strokeWidth="2" strokeLinecap="round"/>
      {/* Island / sand mound */}
      <ellipse cx="100" cy="92" rx="82" ry="16" fill="#F2D7C6"/>
      {/* Left palm */}
      <path d="M72 90 C70 74 74 56 72 42"  stroke="#405B2E" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M72 43 C62 35 50 39 44 31"  stroke="#405B2E" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M72 43 C82 34 94 37 100 29" stroke="#405B2E" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M72 43 C67 33 63 24 60 16"  stroke="#405B2E" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M72 43 C77 32 81 23 84 15"  stroke="#405B2E" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="71" cy="45" r="3" fill="#F35B2D"/>
      {/* Right palm */}
      <path d="M124 88 C123 76 125 65 124 55" stroke="#405B2E" strokeWidth="3" strokeLinecap="round"/>
      <path d="M124 56 C117 49 108 52 104 45" stroke="#405B2E" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M124 56 C131 48 140 50 145 43" stroke="#405B2E" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M124 56 C121 47 119 39 117 32" stroke="#405B2E" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="124" cy="57" r="2.5" fill="#F35B2D"/>
    </svg>
  );
}

// Plane icon — share button
export function PlaneIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  );
}

// Sun decoration — used as brand accent
export function SunIcon({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="8" fill="#FFC84D"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 20 + 11 * Math.cos(rad);
        const y1 = 20 + 11 * Math.sin(rad);
        const x2 = 20 + 16 * Math.cos(rad);
        const y2 = 20 + 16 * Math.sin(rad);
        return (
          <line
            key={deg}
            x1={x1.toFixed(1)} y1={y1.toFixed(1)}
            x2={x2.toFixed(1)} y2={y2.toFixed(1)}
            stroke="#FFC84D" strokeWidth="2.5" strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
