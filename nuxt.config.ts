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
  auth: {
    loadStrategy: 'client-only',
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
    'nuxt-auth-utils',
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
        base: 'client-id',
        driver: 'redis',
        url: process.env.REDIS_URL,
      },
      'track-cache': {
        base: 'track-cache',
        driver: 'redis',
        url: process.env.REDIS_URL,
      },
    },
  },

  nuxtQuery: {
    autoImports: true,
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          'data:',
          'https://i1.sndcdn.com',
        ],
      },
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
