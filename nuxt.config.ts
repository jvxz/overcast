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
      /* use redis for default storage */ '': {
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

  runtimeConfig: {
    minio: {
      accessKey: process.env.MINIO_ACCESS_KEY,
      host: process.env.MINIO_PUBLIC_HOST,
      port: process.env.MINIO_PUBLIC_PORT,
      secretKey: process.env.MINIO_SECRET_KEY,
    },
    redis: {
      url: process.env.REDIS_URL,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
