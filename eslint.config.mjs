import antfu from '@antfu/eslint-config'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'perfectionist/sort-objects': 'warn',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': [
        'warn',
        {
          multiline: {
            max: 1,
          },
          singleline: {
            max: 2,
          },
        },
      ],
      'vue/no-empty-component-block': 'warn',
      'vue/no-multiple-template-root': 'off',
      'vue/sort-keys': 'warn',
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: './app/assets/css/globals.css',
      },
    },
    typescript: true,
    vue: true,
  }),
)
