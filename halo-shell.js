/**
 * HaloShell - Rammerhead-based DOM Rewriting Proxy
 * 
 * DOM manipulation proxy service for complex websites.
 * 
 * @version 2.0.0
 */

import { proxyRequest } from './proxy-utils.js';

/**
 * Create HaloShell proxy service instance
 * @returns {Object} HaloShell service with handle method
 */
export function createHaloShell() {
  return {
    name: 'HaloShell',
    handle: async (request, reply, targetUrl) => {
      return proxyRequest(request, reply, targetUrl, '/shell');
    }
  };
}

