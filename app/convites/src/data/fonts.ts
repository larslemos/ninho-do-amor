export interface FontOption {
  value: string;
  label: string;
  category: 'script' | 'serif' | 'sans-serif' | 'decorative';
  googleFont?: string;
  fallback?: string;
}

export const fontOptions: FontOption[] = [
  // Elegant Script Fonts
  { value: 'Great Vibes', label: 'Great Vibes', category: 'script', googleFont: 'Great Vibes', fallback: 'cursive' },
  { value: 'Dancing Script', label: 'Dancing Script', category: 'script', googleFont: 'Dancing Script', fallback: 'cursive' },
  { value: 'Pacifico', label: 'Pacifico', category: 'script', googleFont: 'Pacifico', fallback: 'cursive' },
  { value: 'Satisfy', label: 'Satisfy', category: 'script', googleFont: 'Satisfy', fallback: 'cursive' },
  { value: 'Allura', label: 'Allura', category: 'script', googleFont: 'Allura', fallback: 'cursive' },
  { value: 'Alex Brush', label: 'Alex Brush', category: 'script', googleFont: 'Alex Brush', fallback: 'cursive' },
  { value: 'Tangerine', label: 'Tangerine', category: 'script', googleFont: 'Tangerine', fallback: 'cursive' },
  { value: 'Petit Formal Script', label: 'Petit Formal Script', category: 'script', googleFont: 'Petit Formal Script', fallback: 'cursive' },
  
  // Serif Fonts
  { value: 'Times New Roman', label: 'Times New Roman', category: 'serif', fallback: 'serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'serif', googleFont: 'Playfair Display', fallback: 'serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'serif', googleFont: 'Merriweather', fallback: 'serif' },
  { value: 'Lora', label: 'Lora', category: 'serif', googleFont: 'Lora', fallback: 'serif' },
  { value: 'Crimson Text', label: 'Crimson Text', category: 'serif', googleFont: 'Crimson Text', fallback: 'serif' },
  { value: 'Georgia', label: 'Georgia', category: 'serif', fallback: 'serif' },
  { value: 'Baskerville', label: 'Baskerville', category: 'serif', fallback: 'serif' },
  
  // Sans-Serif Fonts
  { value: 'Arial', label: 'Arial', category: 'sans-serif', fallback: 'sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'sans-serif', googleFont: 'Montserrat', fallback: 'sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'sans-serif', googleFont: 'Open Sans', fallback: 'sans-serif' },
  { value: 'Roboto', label: 'Roboto', category: 'sans-serif', googleFont: 'Roboto', fallback: 'sans-serif' },
  { value: 'Lato', label: 'Lato', category: 'sans-serif', googleFont: 'Lato', fallback: 'sans-serif' },
  { value: 'Poppins', label: 'Poppins', category: 'sans-serif', googleFont: 'Poppins', fallback: 'sans-serif' },
  { value: 'Helvetica', label: 'Helvetica', category: 'sans-serif', fallback: 'sans-serif' },
  { value: 'Verdana', label: 'Verdana', category: 'sans-serif', fallback: 'sans-serif' },
  
  // Decorative Fonts
  { value: 'Lobster', label: 'Lobster', category: 'decorative', googleFont: 'Lobster', fallback: 'cursive' },
  { value: 'Bangers', label: 'Bangers', category: 'decorative', googleFont: 'Bangers', fallback: 'cursive' },
  { value: 'Fredoka One', label: 'Fredoka One', category: 'decorative', googleFont: 'Fredoka One', fallback: 'cursive' },
  { value: 'Chewy', label: 'Chewy', category: 'decorative', googleFont: 'Chewy', fallback: 'cursive' },
  { value: 'Righteous', label: 'Righteous', category: 'decorative', googleFont: 'Righteous', fallback: 'cursive' },
  { value: 'Bungee', label: 'Bungee', category: 'decorative', googleFont: 'Bungee', fallback: 'cursive' }
];

export const getFontFamily = (fontValue: string): string => {
  const font = fontOptions.find(f => f.value === fontValue);
  if (!font) return 'serif';
  
  if (font.googleFont) {
    return `"${font.googleFont}", ${font.fallback}`;
  }
  
  return `"${font.value}", ${font.fallback}`;
};

export const loadGoogleFonts = () => {
  const googleFonts = fontOptions
    .filter(font => font.googleFont)
    .map(font => font.googleFont)
    .filter((value, index, self) => self.indexOf(value) === index);
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${googleFonts.map(font => `family=${font}:wght@300;400;700&`).join('')}display=swap`;
  document.head.appendChild(link);
};
