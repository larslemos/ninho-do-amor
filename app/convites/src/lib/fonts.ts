export interface FontOption {
  value: string;
  label: string;
  category: 'script' | 'serif' | 'sans-serif' | 'decorative';
  googleFont: boolean;
  preview: string;
}

export const FONT_OPTIONS: FontOption[] = [
  // Elegant Scripts
  {
    value: 'Great Vibes',
    label: 'Great Vibes',
    category: 'script',
    googleFont: true,
    preview: 'Beautiful Script'
  },
  {
    value: 'Dancing Script',
    label: 'Dancing Script',
    category: 'script',
    googleFont: true,
    preview: 'Elegant Dancing'
  },
  {
    value: 'Allura',
    label: 'Allura',
    category: 'script',
    googleFont: true,
    preview: 'Romantic Allure'
  },
  {
    value: 'Alex Brush',
    label: 'Alex Brush',
    category: 'script',
    googleFont: true,
    preview: 'Handwritten Style'
  },
  {
    value: 'Sacramento',
    label: 'Sacramento',
    category: 'script',
    googleFont: true,
    preview: 'Sophisticated Script'
  },
  {
    value: 'Satisfy',
    label: 'Satisfy',
    category: 'script',
    googleFont: true,
    preview: 'Casual Script'
  },
  {
    value: 'Kaushan Script',
    label: 'Kaushan Script',
    category: 'script',
    googleFont: true,
    preview: 'Modern Script'
  },

  // Serif Fonts
  {
    value: 'Playfair Display',
    label: 'Playfair Display',
    category: 'serif',
    googleFont: true,
    preview: 'Classic Elegance'
  },
  {
    value: 'Crimson Text',
    label: 'Crimson Text',
    category: 'serif',
    googleFont: true,
    preview: 'Traditional Serif'
  },
  {
    value: 'EB Garamond',
    label: 'EB Garamond',
    category: 'serif',
    googleFont: true,
    preview: 'Historic Serif'
  },
  {
    value: 'Lora',
    label: 'Lora',
    category: 'serif',
    googleFont: true,
    preview: 'Modern Serif'
  },
  {
    value: 'Cormorant Garamond',
    label: 'Cormorant Garamond',
    category: 'serif',
    googleFont: true,
    preview: 'Refined Serif'
  },

  // Sans-serif Fonts
  {
    value: 'Montserrat',
    label: 'Montserrat',
    category: 'sans-serif',
    googleFont: true,
    preview: 'Clean Modern'
  },
  {
    value: 'Open Sans',
    label: 'Open Sans',
    category: 'sans-serif',
    googleFont: true,
    preview: 'Friendly Sans'
  },
  {
    value: 'Poppins',
    label: 'Poppins',
    category: 'sans-serif',
    googleFont: true,
    preview: 'Geometric Sans'
  },
  {
    value: 'Roboto',
    label: 'Roboto',
    category: 'sans-serif',
    googleFont: true,
    preview: 'Technical Sans'
  },
  {
    value: 'Inter',
    label: 'Inter',
    category: 'sans-serif',
    googleFont: true,
    preview: 'Professional Sans'
  },

  // Decorative Fonts
  {
    value: 'Cinzel',
    label: 'Cinzel',
    category: 'decorative',
    googleFont: true,
    preview: 'Ancient Roman'
  },
  {
    value: 'Pacifico',
    label: 'Pacifico',
    category: 'decorative',
    googleFont: true,
    preview: 'Playful Brush'
  },
  {
    value: 'Amatic SC',
    label: 'Amatic SC',
    category: 'decorative',
    googleFont: true,
    preview: 'Hand Drawn'
  },
  {
    value: 'Courgette',
    label: 'Courgette',
    category: 'decorative',
    googleFont: true,
    preview: 'Casual Script'
  }
];

export const FONT_CATEGORIES = [
  { value: 'all', label: 'Todas as Fontes' },
  { value: 'script', label: 'Scripts Elegantes' },
  { value: 'serif', label: 'Serif Clássicas' },
  { value: 'sans-serif', label: 'Sans-serif Modernas' },
  { value: 'decorative', label: 'Decorativas' }
];

export const getFilteredFonts = (category: string): FontOption[] => {
  if (category === 'all') return FONT_OPTIONS;
  return FONT_OPTIONS.filter(font => font.category === category);
};