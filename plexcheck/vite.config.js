import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/, 
        /\.md$/, 
      ],
      imports: [
        'vue',
        'vue-router',
      ],
      dirs: [
        //'./hooks', //import useApi from "@/hooks/useApi";
      ],
      viteOptimizeDeps: true,
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  compilerOptions: {
    isCustomElement: (tag) => tag === 'v-calendar',
  },
})
