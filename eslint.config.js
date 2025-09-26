import js from '@eslint/js';
import nextConfig from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';

export default [
  js.configs.recommended,
  ...nextConfig,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  {
    ignores: [
      '.next/',
      'node_modules/',
      'build/',
      '*.config.js',
      '*.config.mjs',
    ],
  },
];
