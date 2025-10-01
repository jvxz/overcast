import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        style: 'background-color: var(--card);',
      },
      link: [
        { href: '/favicon.ico', rel: 'icon', type: 'image/x-icon' },
      ],
      titleTemplate: '%siteName',
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
      preload: true,
      weights: [400, 500, 700],
    },
  },

  icon: {
    clientBundle: {
      scan: true,
    },
    customCollections: [{
      dir: './public/assets/icons/',
      prefix: 'tabler',
    }],
    provider: 'none',
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
    '@nuxtjs/seo',
    'nuxt-posthog',
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

  posthog: {
    proxy: true,
  },

  routeRules: {
    '/api/user/meta': {
      cache: {
        maxAge: 60,
      },
    },
    '/api/user/tracks': {
      cache: {
        maxAge: 60,
      },
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          process.env.NUXT_PUBLIC_SITE_URL!,
          'data:',
          'https://i1.sndcdn.com', // covers
          'https://a1.sndcdn.com', // avatars
        ],
      },
    },
    rateLimiter: process.env.NODE_ENV === 'production' ? undefined : false,
    sri: false, // for bundled font files
  },

  site: {
    name: 'overcast',
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
