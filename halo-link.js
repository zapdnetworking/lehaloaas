/**
 * HaloLink - Epoxy Transport Layer
 * 
 * Transport layer proxy service for optimized connections.
 * 
 * @version 2.0.0
 */

import { proxyRequest } from './proxy-utils.js';

/**
 * Create HaloLink proxy service instance
 * @returns {Object} HaloLink service with handle method
 */
export function createHaloLink() {
  return {
    name: 'HaloLink',
    handle: async (request, reply, targetUrl) => {
      return proxyRequest(request, reply, targetUrl, '/link');
    }
  };
}

