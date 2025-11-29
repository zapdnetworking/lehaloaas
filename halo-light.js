/**
 * HaloLight - Ultraviolet-based Proxy Engine
 * 
 * Primary proxy service for URL rewriting and content proxying.
 * Recommended for most websites.
 * 
 * @version 2.0.0
 */

import { proxyRequest } from './proxy-utils.js';

/**
 * Create HaloLight proxy service instance
 * @returns {Object} HaloLight service with handle method
 */
export function createHaloLight() {
  return {
    name: 'HaloLight',
    handle: async (request, reply, targetUrl) => {
      return proxyRequest(request, reply, targetUrl, '/light');
    }
  };
}
