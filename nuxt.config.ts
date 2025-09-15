import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },

  css: ['~/assets/css/globals.css'],

  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    'reka-ui/nuxt',
    '@compodium/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-security',
  ],

  imports: {
    dirs: [
      '~/server/utils',
    ],
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

})
