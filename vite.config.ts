import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    // https://github.com/unocss/unocss
    Unocss(),

    react({
      fastRefresh: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),
  ],
})
