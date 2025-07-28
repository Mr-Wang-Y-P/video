import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(),],
  base : './',
  server: {
    // 指定开发服务器端口
    port: 8080, 
    // 启用 CORS
    cors: true 
  }
})
