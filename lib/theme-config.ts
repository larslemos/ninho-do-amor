// lib/theme-config.ts
export type WeddingTheme = 'sky-beach' | 'branco-dourado' | 'custom';

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  fonts: {
    primary: string;
    secondary: string;
    body: string;
  };
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    decorative: string;
  };
}

export const weddingThemes: Record<WeddingTheme, ThemeConfig> = {
  'sky-beach': {
    name: 'sky-beach',
    displayName: 'Céu e Praia',
    description:
      'Inspirado nas cores do oceano e do céu, perfeito para casamentos na praia',
    fonts: {
      primary: 'Josefin Sans',
      secondary: 'Dancing Script',
      body: 'Quicksand',
    },
    colors: {
      primary: '#0369a1',
      primaryHover: '#075985',
      secondary: '#0ea5e9',
      accent: '#7dd3fc',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      decorative: '#38bdf8',
    },
  },
  'branco-dourado': {
    name: 'branco-dourado',
    displayName: 'Branco e Dourado',
    description:
      'Elegante combinação de branco e dourado para cerimônias clássicas',
    fonts: {
      primary: 'Poppins',
      secondary: 'Dancing Script',
      body: 'Josefin Sans',
    },
    colors: {
      primary: '#b45309',
      primaryHover: '#92400e',
      secondary: '#f59e0b',
      accent: '#fde047',
      textPrimary: '#451a03',
      textSecondary: '#78716c',
      decorative: '#fbbf24',
    },
  },
  custom: {
    name: 'custom',
    displayName: 'Rosa Clássico',
    description: 'Tema romântico com tons de rosa e detalhes elegantes',
    fonts: {
      primary: 'Poppins',
      secondary: 'Dancing Script',
      body: 'Quicksand',
    },
    colors: {
      primary: '#be185d',
      primaryHover: '#9f1239',
      secondary: '#ec4899',
      accent: '#f9a8d4',
      textPrimary: '#1f2937',
      textSecondary: '#6b7280',
      decorative: '#f472b6',
    },
  },
};

// Helper function to get theme configuration
export function getThemeConfig(theme: WeddingTheme): ThemeConfig {
  return weddingThemes[theme] || weddingThemes.custom;
}

// Helper function to apply theme to document
export function applyWeddingTheme(theme: WeddingTheme, element?: HTMLElement) {
  const config = getThemeConfig(theme);
  const targetElement = element || document.documentElement;

  // Set theme attribute
  targetElement.setAttribute('data-theme', theme);

  // Set CSS custom properties
  const style = targetElement.style;
  style.setProperty('--wedding-primary', config.colors.primary);
  style.setProperty('--wedding-primary-hover', config.colors.primaryHover);
  style.setProperty('--wedding-secondary', config.colors.secondary);
  style.setProperty('--wedding-accent', config.colors.accent);
  style.setProperty('--wedding-text-primary', config.colors.textPrimary);
  style.setProperty('--wedding-text-secondary', config.colors.textSecondary);
  style.setProperty('--wedding-decorative', config.colors.decorative);

  // Set font families
  style.setProperty(
    '--wedding-font-primary',
    `'${config.fonts.primary}', sans-serif`
  );
  style.setProperty(
    '--wedding-font-secondary',
    `'${config.fonts.secondary}', cursive`
  );
  style.setProperty(
    '--wedding-font-body',
    `'${config.fonts.body}', sans-serif`
  );
}
