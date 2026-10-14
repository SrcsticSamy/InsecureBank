import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to intercept /.env and /robots.txt before Vite's built-in file guards
function spaFallbackPlugin(): Plugin {
  return {
    name: 'spa-special-routes-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        if (url === '/.env' || url === '/env' || url === '/robots.txt') {
          // If browser request or user navigating directly, serve index.html for SPA routing
          const indexPath = path.resolve(__dirname, 'index.html')
          if (fs.existsSync(indexPath)) {
            res.setHeader('Content-Type', 'text/html')
            res.statusCode = 200
            fs.createReadStream(indexPath).pipe(res)
            return
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [spaFallbackPlugin(), react()],
  server: {
    port: 5173,
  },
})
