import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bodyParser from 'body-parser'
import NodeCache from 'node-cache'

const cache = new NodeCache();

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'custom-endpoint',
      configureServer({ middlewares }) {
        middlewares.use(bodyParser.json())
        middlewares.use('/fetch', async(req, res, next) => {
          if (req.method === 'POST') {
              //const reqUrl = req.body.url;
              console.log(JSON.stringify(req.body));
              const reqUrl = req.body.url;
              const cachedBody = cache.get(reqUrl);
            if (cachedBody) {
                console.log(`Got from the cache ${reqUrl}`);
                res.write(cachedBody);
                res.end();
            }
            else {
                const response = await fetch(reqUrl);
                const body = await response.text()
                cache.set(reqUrl, body, 60);
                res.write(body);
                res.end();
            }
          } else {
            // for any other request, go to the next middleware
            next()
          }
        })
      },
    },
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
