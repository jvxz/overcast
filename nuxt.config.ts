import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        style: 'background-color: var(--color-background);',
      },
      title: 'overcast',
    },
  },

  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/globals.css'],

  devtools: { enabled: true },

  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500, 700],
    },
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
      dirs: [
        './server/schema/*',
        './server/utils/*',

      ],
      presets: [
        {
          from: 'zod',
          imports: ['z'],
        },
      ],
    },
    storage: {
      'client-id': {
        driver: 'redis',
        url: process.env.REDIS_URL,
      },
      'track-cache': {
        driver: 'redis',
        url: process.env.REDIS_URL,
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
