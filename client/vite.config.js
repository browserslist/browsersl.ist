import { defineConfig } from 'vite'
import vitePluginPug from 'vite-plugin-pug-transformer'

export default defineConfig({
  build: {
    assetsDir: '.',
    assetsInlineLimit: 0
  },
  plugins: [vitePluginPug()]
})
