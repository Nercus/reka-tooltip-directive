import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import RekaResolver from 'reka-ui/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'

export default defineConfig({
  plugins: [
    vue(),
    VueRouter({
      dts: 'src/types/route-map.d.ts',
    }),
    tailwindcss(),
    Components({
      dts: './src/types/components.d.ts',
      resolvers: [RekaResolver()],
      dirs: ['./src/components'],
    }),
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      imports: [
        'vue',
        '@vueuse/core',
        'pinia',
        VueRouterAutoImports,
        {
          'tailwind-merge': ['twMerge'],
          'class-variance-authority': ['cx', 'cva'],
        },
      ],
      dirs: ['./src/composables', './src/utils', './src/directives'],
      vueDirectives: {
        isDirective: (normalizedImportFrom, _importEntry) => {
          return normalizedImportFrom.includes('/directives/')
        },
      },
    }),
  ],
})
