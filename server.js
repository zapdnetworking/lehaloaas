/**
 * LeHalo Server - Main Entry Point
 * 
 * LeHalo V2.0.0 — A division of the ZAPD Network
 * Modern web browsing experience with tabbed interface and universal proxy support
 * 
 * @author ZAPD Network
 * @license AGPL-3.0
 */

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

import { createHaloLight } from './halo-light.js';
import { createHaloShell } from './halo-shell.js';
import { createHaloWisp } from './halo-wisp.js';
import { createHaloLink } from './halo-link.js';
import { createHaloMux } from './halo-mux.js';
import { setupRoutes } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: {
    level: 'info'
  },
  bodyLimit: 10485760, // 10MB
  requestIdLogLabel: false,
  disableRequestLogging: false
});

// Register body parser for all content types
// Collects chunks as Buffers to preserve binary data integrity
fastify.addContentTypeParser('*', function (request, payload, done) {
  const chunks = [];
  payload.on('data', chunk => {
    chunks.push(chunk);
  });
  payload.on('end', () => {
    // Combine all chunks into a single Buffer to preserve binary data
    const data = Buffer.concat(chunks);
    done(null, data);
  });
  payload.on('error', (err) => {
    done(err, null);
  });
});

// Initialize server
const init = async () => {
  try {
    // CORS support - Completely permissive
    fastify.addHook('onRequest', async (request, reply) => {
      // Allow all origins
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
      reply.header('Access-Control-Allow-Headers', '*');
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header('Access-Control-Expose-Headers', '*');
      reply.header('Access-Control-Max-Age', '86400');
      
      if (request.method === 'OPTIONS') {
        return reply.code(200).send();
      }
    });

    // Register static file serving for UI and assets
    // Map `/ui/*` and `/assets/*` to files in the repository root so the frontend
    // can reference `/ui/...` and `/assets/...` paths without requiring a separate directory tree.
    await fastify.register(fastifyStatic, {
      root: join(__dirname),
      prefix: '/ui/'
    });

    await fastify.register(fastifyStatic, {
      root: join(__dirname, 'assets'),
      prefix: '/assets/',
      decorateReply: false
    });

    // Initialize proxy services
    const haloServices = {
      light: createHaloLight(),
      shell: createHaloShell(),
      wisp: createHaloWisp(),
      link: createHaloLink(),
      mux: createHaloMux()
    };

    // Setup routes
    setupRoutes(fastify, haloServices);

    // Global error handler
    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error({
        err: error,
        url: request.url,
        method: request.method
      });
      
      // Don't expose internal errors in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      reply.status(error.statusCode || 500).send({
        error: error.name || 'Internal Server Error',
        message: isDevelopment ? error.message : 'An unexpected error occurred',
        ...(isDevelopment && { stack: error.stack })
      });
    });

    // 404 handler for unmatched routes
    fastify.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        error: 'Not Found',
        message: `Route ${request.method}:${request.url} not found`,
        hint: 'Make sure you accessed this through the proxy interface'
      });
    });

    // Start server
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`LeHalo server running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

init();

