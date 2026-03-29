// ─── Option 1 — Inline SVG component (recommended) ──────────────────────────
// Use this in your Navbar, Sidebar, email header etc.
// Easy to change color, size via props

export function ArkioIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="96" height="96" rx="22" fill="#1d9e75" />
      <circle cx="48" cy="66" r="5.5" fill="white" />
      <path
        d="M36 54 Q36 42 48 42 Q60 42 60 54"
        fill="none" stroke="white" strokeWidth="5"
        strokeLinecap="round" opacity="0.95"
      />
      <path
        d="M27 46 Q27 28 48 28 Q69 28 69 46"
        fill="none" stroke="white" strokeWidth="5"
        strokeLinecap="round" opacity="0.65"
      />
      <path
        d="M18 38 Q18 14 48 14 Q78 14 78 38"
        fill="none" stroke="white" strokeWidth="5"
        strokeLinecap="round" opacity="0.35"
      />
    </svg>
  )
}

// ─── Option 2 — Full logo lockup (icon + wordmark) ───────────────────────────
export function ArkioLogo({ size = 'md' }) {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 17

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <ArkioIcon size={iconSize} />
      <span style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: fontSize,
        fontWeight: 700,
        color: '#eefaf6',
        letterSpacing: '-0.3px',
      }}>
        Arkio.
      </span>
    </div>
  )
}

// ─── Option 3 — favicon.svg in /public ───────────────────────────────────────
// Copy the favicon SVG from arkio-icons.svg into /public/favicon.svg
// Then in your index.html:
// <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

// ─── Usage examples ──────────────────────────────────────────────────────────

// In Navbar:
// <ArkioLogo size="md" />

// In Sidebar (smaller):
// <ArkioLogo size="sm" />

// Standalone icon only (e.g. mobile app icon):
// <ArkioIcon size={48} />

// With Tailwind class:
// <ArkioIcon size={32} className="rounded-xl" />