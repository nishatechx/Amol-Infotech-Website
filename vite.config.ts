import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig, loadEnv } from 'vite';

function googleReviewsPlugin(apiKey: string): Plugin {
  return {
    name: 'google-reviews-api',
    configureServer(server) {
      server.middlewares.use('/api/google-reviews', async (req, res) => {
        try {
          const placeId = 'ChIJXWwTp-KM0DsR4xT4idtynas';
          const key = apiKey || process.env.VITE_GOOGLE_MAPS_API_KEY || '';

          if (!key) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing Google Maps API key' }));
            return;
          }

          const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?languageCode=en`,
            {
              method: 'GET',
              headers: {
                'X-Goog-Api-Key': key,
                'X-Goog-FieldMask':
                  'id,displayName,rating,userRatingCount,reviews,editorialSummary,googleMapsUri',
                'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1',
              },
            }
          );

          if (!response.ok) {
            const errText = await response.text();
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: errText }));
            return;
          }

          const data = await response.json();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal error' }));
        }
      });
    },
  };
}

function enquiryApiPlugin(): Plugin {
  return {
    name: 'enquiry-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/enquiry')) {
          try {
            const { handleEnquiryRequest } = await import('./src/server/enquiryHandler');
            await handleEnquiryRequest(req, res);
          } catch (err: any) {
            console.error('Enquiry handler error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: "Sorry, we couldn't submit your enquiry right now. Please try again.",
              })
            );
          }
          return;
        }
        next();
      });
    },
  };
}

function cmsApiPlugin(): Plugin {
  return {
    name: 'cms-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (
          req.url &&
          (req.url.startsWith('/api/cms') ||
            req.url.startsWith('/api/auth') ||
            req.url.startsWith('/api/public') ||
            req.url.startsWith('/api/cloudinary-signature'))
        ) {
          try {
            const { handleCmsRequest } = await import('./src/server/cmsHandler');
            const handled = await handleCmsRequest(req, res);
            if (handled) return;
          } catch (err: any) {
            console.error('CMS handler error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Internal CMS server error' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const googleMapsKey = env.VITE_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return {
    plugins: [
      react(),
      tailwindcss(),
      googleReviewsPlugin(googleMapsKey),
      enquiryApiPlugin(),
      cmsApiPlugin(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(googleMapsKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
