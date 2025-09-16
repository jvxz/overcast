import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/globals.css'],

  devtools: { enabled: true },

  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },

  imports: {
    dirs: [
      '~/server/utils',
    ],
  },

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
    '@peterbud/nuxt-query',
  ],

  nitro: {
    imports: {
      dirs: ['./server/schema/*'],
      presets: [
        {
          from: 'zod',
          imports: ['z'],
        },
      ],
    },
    storage: {
      clientId: {
        base: 'clientId',
        driver: 'redis',
        url: process.env.REDIS_URL,
      },
    },
    typescript: {
      tsConfig: {
        compilerOptions: {
          plugins: [{
            name: '@effect/language-service',
          }],
        },
      },
    },
  },

  nuxtQuery: {
    autoImports: true,
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
