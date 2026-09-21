import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const API_ROUTES = {
  '/api/ai': './api/ai.js',
  '/api/account': './api/account.js',
}

const applyServerEnv = (mode, root) => {
  // Load both VITE_* and server-only variables into the Vite process for local API handlers.
  // This only affects the local dev server process; VITE_* remains subject to Vite's normal
  // browser exposure rules, while server-only secrets are never injected into the client.
  const env = loadEnv(mode, root, '')
  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) process.env[key] = value
  }
}

const createVercelStyleResponse = (res) => {
  if (typeof res.status !== 'function') {
    res.status = (statusCode) => {
      res.statusCode = statusCode
      return res
    }
  }
  if (typeof res.setHeader !== 'function') {
    throw new Error('Local API response object does not support setHeader().')
  }
  return res
}

const readRequestBody = async (req) => {
  if (req.body !== undefined) return req.body
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req.body = undefined
    return req.body
  }

  const chunks = []
  let total = 0
  const MAX_BODY_BYTES = 256 * 1024

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > MAX_BODY_BYTES) {
      const error = new Error('Request body is too large for local API development.')
      error.code = 'BODY_TOO_LARGE'
      throw error
    }
    chunks.push(buffer)
  }

  req.body = Buffer.concat(chunks).toString('utf8')
  return req.body
}

const localApiPlugin = () => ({
  name: 'resummetry-local-api',
  apply: 'serve',
  configureServer(server) {
    // IMPORTANT: register before Vite's SPA fallback so /api/* cannot become index.html.
    server.middlewares.use(async (req, res, next) => {
      const pathname = String(req.url || '').split('?')[0]
      const route = API_ROUTES[pathname]
      if (!route) return next()

      try {
        createVercelStyleResponse(res)
        await readRequestBody(req)

        const modulePath = path.resolve(server.config.root, route)
        const url = `${pathToFileURL(modulePath).href}?t=${Date.now()}`
        const module = await import(url)
        if (typeof module.default !== 'function') {
          return next(new Error(`API handler for ${pathname} does not export a default function.`))
        }

        await module.default(req, res)
      } catch (error) {
        if (error?.code === 'BODY_TOO_LARGE') {
          if (!res.headersSent) {
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: error.message }))
          }
          return
        }

        server.config.logger.error(`[Resummetry local API] ${pathname}: ${error?.stack || error}`)
        if (!res.headersSent) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Local API handler failed.' }))
        } else {
          res.end()
        }
      }
    })
  },
})

export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  if (command === 'serve') applyServerEnv(mode, root)

  return {
    plugins: [
      tailwindcss(),
      localApiPlugin(),
    ],
  }
})
