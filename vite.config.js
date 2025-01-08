import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "@svgr/webpack"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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