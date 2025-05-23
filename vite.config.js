import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
  build: {
    target: 'esnext'
  }
})