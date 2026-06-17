// src/lib/design-system.ts

export const XStarsDesignSystem = {
  colors: {
    primary: {
      red: '#E50914',
      redHover: '#FF0A16',
      redDark: '#B20710',
      redGlow: 'rgba(229, 9, 20, 0.3)',
    },
    neutral: {
      black: '#000000',
      deepBlack: '#0A0A0A',
      darkGraphite: '#141414',
      graphite: '#1A1A1A',
      mediumGray: '#2A2A2A',
      lightGray: '#404040',
      border: '#333333',
      muted: '#737373',
      white: '#FFFFFF',
      whiteAlpha: 'rgba(255, 255, 255, 0.7)',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      heavy: 'rgba(255, 255, 255, 0.15)',
      border: 'rgba(255, 255, 255, 0.2)',
    },
  },
  
  typography: {
    fontFamily: {
      display: "'Inter', 'SF Pro Display', system-ui, sans-serif",
      body: "'Inter', 'SF Pro Text', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      hero: 'clamp(2.5rem, 5vw, 5rem)',
      h1: 'clamp(2rem, 4vw, 3.5rem)',
      h2: 'clamp(1.5rem, 3vw, 2.5rem)',
      h3: 'clamp(1.25rem, 2vw, 1.75rem)',
      body: '1rem',
      small: '0.875rem',
      caption: '0.75rem',
    },
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      cinematic: '800ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      cinematic: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
  },
  
  shadows: {
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
    elevated: '0 8px 30px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(229, 9, 20, 0.3)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  
  glassmorphism: {
    light: {
      background: 'rgba(20, 20, 20, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    heavy: {
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
  },
};
