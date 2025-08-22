/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // '@tailwindcss/postcss': {},
    // The plugin name for Tailwind 3.x is just 'tailwindcss'
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
