/**
 * LeHalo Routes
 * 
 * Route handlers for homepage, browser interface, proxy services, and error pages.
 * Includes catch-all route for relative paths from proxied sites.
 * 
 * @version 2.0.0
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// rootDir should point to the repository root (this directory)
const rootDir = __dirname;

/**
 * Setup all routes for LeHalo server
 * @param {Object} fastify - Fastify instance
 * @param {Object} services - Proxy service instances
 */
export function setupRoutes(fastify, services) {
  // Homepage
  fastify.get('/', async (request, reply) => {
    const html = readFileSync(join(rootDir, 'index.html'), 'utf-8');
    reply.type('text/html').send(html);
  });

  // Browser page (tabbed interface)
  fastify.get('/browser', async (request, reply) => {
    try {
      const html = readFileSync(join(rootDir, 'browser.html'), 'utf-8');
      return reply.type('text/html').send(html);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to load browser page' });
    }
  });

  // Legacy proxy page (redirect to browser)
  fastify.get('/proxy', async (request, reply) => {
    return reply.redirect('/browser');
  });

  // Proxy routes - catch all for proxy paths
  fastify.all('/light', async (request, reply) => {
    const url = request.query.url || request.query.u;
    if (!url) {
      return reply.redirect('/');
    }
    // For browser requests, redirect to browser
    if (request.headers.accept && request.headers.accept.includes('text/html')) {
      return reply.redirect(`/browser?url=${encodeURIComponent(url)}`);
    }
    return services.light.handle(request, reply, url);
  });

  // Catch-all proxy route - must be registered last to catch everything
  fastify.all('/light/*', async (request, reply) => {
    // Get the full path including query string
    const fullPath = request.url;
    let urlPath = fullPath.replace('/light/', '');
    
    // Include query string if present
    if (request.url.includes('?')) {
      const urlObj = new URL(request.url, `http://${request.headers.host}`);
      urlPath = urlPath.split('?')[0] + (urlObj.search || '');
    }
    
    if (!urlPath || urlPath === '') {
      return reply.redirect('/');
    }
    
    // Decode the URL path
    try {
      urlPath = decodeURIComponent(urlPath);
    } catch (e) {
      // If decoding fails, try using it as-is
    }
    
    // If it's not a full URL, it's a relative path - we need the base URL from referer or store it
    // For now, if it doesn't start with http, treat it as needing the base URL
    if (!urlPath.startsWith('http://') && !urlPath.startsWith('https://')) {
      // This is a relative path - we need to get the base URL
      // Check referer header to get the original site
      const referer = request.headers.referer || request.headers.referrer;
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          // Extract the original proxied URL from referer
          if (refererUrl.pathname.startsWith('/light/')) {
            const baseUrl = refererUrl.pathname.replace('/light/', '');
            const decodedBase = decodeURIComponent(baseUrl);
            const baseUrlObj = new URL(decodedBase);
            // Combine base URL with relative path
            urlPath = new URL(urlPath, decodedBase).href;
          } else {
            // Fallback: assume it's github.com or try to construct
            urlPath = 'https://github.com' + (urlPath.startsWith('/') ? '' : '/') + urlPath;
          }
        } catch (e) {
          // If we can't parse, try common defaults
          urlPath = 'https://github.com' + (urlPath.startsWith('/') ? '' : '/') + urlPath;
        }
      } else {
        // No referer - assume it's a search or default to a common site
        // For now, default to github.com
        urlPath = 'https://github.com' + (urlPath.startsWith('/') ? '' : '/') + urlPath;
      }
    }
    
    return services.light.handle(request, reply, urlPath);
  });

  fastify.all('/shell', async (request, reply) => {
    const url = request.query.url || request.query.u;
    if (!url) {
      return reply.redirect('/');
    }
    return services.shell.handle(request, reply, url);
  });

  fastify.all('/shell/*', async (request, reply) => {
    let url = request.url.replace('/shell/', '');
    if (!url || url === '') {
      return reply.redirect('/');
    }
    try {
      url = decodeURIComponent(url);
    } catch (e) {
      // Use as-is if decoding fails
    }
    return services.shell.handle(request, reply, url);
  });

  fastify.all('/wisp/*', async (request, reply) => {
    const url = decodeURIComponent(request.url.replace('/wisp/', ''));
    return services.wisp.handle(request, reply, url);
  });

  fastify.all('/link', async (request, reply) => {
    const url = request.query.url || request.query.u;
    if (!url) {
      return reply.redirect('/');
    }
    return services.link.handle(request, reply, url);
  });

  fastify.all('/link/*', async (request, reply) => {
    let url = request.url.replace('/link/', '');
    if (!url || url === '') {
      return reply.redirect('/');
    }
    try {
      url = decodeURIComponent(url);
    } catch (e) {
      // Use as-is if decoding fails
    }
    return services.link.handle(request, reply, url);
  });

  fastify.all('/mux', async (request, reply) => {
    const url = request.query.url || request.query.u;
    if (!url) {
      return reply.redirect('/');
    }
    return services.mux.handle(request, reply, url);
  });

  fastify.all('/mux/*', async (request, reply) => {
    let url = request.url.replace('/mux/', '');
    if (!url || url === '') {
      return reply.redirect('/');
    }
    try {
      url = decodeURIComponent(url);
    } catch (e) {
      // Use as-is if decoding fails
    }
    return services.mux.handle(request, reply, url);
  });

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'LeHalo', network: 'ZAPD' };
  });

  // Error page
  fastify.get('/error', async (request, reply) => {
    const html = readFileSync(join(rootDir, 'error.html'), 'utf-8');
    reply.type('text/html').send(html);
  });

  // Catch-all route for unmatched paths - treat as relative paths from proxied site
  // This MUST be registered last
  fastify.all('/*', async (request, reply) => {
    // Skip if it's already a known route
    const knownRoutes = ['/', '/browser', '/proxy', '/health', '/error'];
    const path = request.url.split('?')[0];
    
    // Check if it's a static file route - these should be handled by static handlers
    // but if we somehow reach here, trigger 404 handler
    if (path.startsWith('/ui/') || path.startsWith('/assets/')) {
      return reply.callNotFound();
    }
    
    // Known routes should be handled by their specific handlers
    // but if we somehow reach here, trigger 404 handler
    if (knownRoutes.includes(path)) {
      return reply.callNotFound();
    }
    
    // This is an unmatched route - likely a relative path from a proxied site
    // Check referer to get the base URL
    const referer = request.headers.referer || request.headers.referrer;
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        // If referer is from our proxy, extract the original URL
        if (refererUrl.pathname.startsWith('/light/')) {
          const baseUrl = decodeURIComponent(refererUrl.pathname.replace('/light/', ''));
          const baseUrlObj = new URL(baseUrl);
          // Construct full URL from relative path (include query string)
          const relativePath = request.url;
          let fullUrl;
          try {
            fullUrl = new URL(relativePath, baseUrlObj.origin + baseUrlObj.pathname).href;
          } catch (e) {
            // If that fails, try with just origin
            fullUrl = new URL(relativePath, baseUrlObj.origin).href;
          }
          return services.light.handle(request, reply, fullUrl);
        } else if (refererUrl.pathname.startsWith('/shell/')) {
          const baseUrl = decodeURIComponent(refererUrl.pathname.replace('/shell/', ''));
          const baseUrlObj = new URL(baseUrl);
          const relativePath = request.url;
          const fullUrl = new URL(relativePath, baseUrlObj.origin + baseUrlObj.pathname).href;
          return services.shell.handle(request, reply, fullUrl);
        } else if (refererUrl.pathname.startsWith('/link/')) {
          const baseUrl = decodeURIComponent(refererUrl.pathname.replace('/link/', ''));
          const baseUrlObj = new URL(baseUrl);
          const relativePath = request.url;
          const fullUrl = new URL(relativePath, baseUrlObj.origin + baseUrlObj.pathname).href;
          return services.link.handle(request, reply, fullUrl);
        } else if (refererUrl.pathname.startsWith('/mux/')) {
          const baseUrl = decodeURIComponent(refererUrl.pathname.replace('/mux/', ''));
          const baseUrlObj = new URL(baseUrl);
          const relativePath = request.url;
          const fullUrl = new URL(relativePath, baseUrlObj.origin + baseUrlObj.pathname).href;
          return services.mux.handle(request, reply, fullUrl);
        }
      } catch (e) {
        // Fall through to try default
      }
    }
    
    // If we can't determine the base URL, try common defaults or return helpful error
    // For common paths, assume they might be from a popular site
    const commonSites = ['github.com', 'youtube.com', 'google.com'];
    for (const site of commonSites) {
      try {
        const testUrl = `https://${site}${request.url}`;
        new URL(testUrl); // Validate
        // Don't auto-redirect, just return helpful message
        break;
      } catch (e) {
        // Continue
      }
    }
    
    return reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      hint: 'This might be a relative path from a proxied site. Make sure you accessed it through the proxy by clicking a link from a proxied page.'
    });
  });
}

