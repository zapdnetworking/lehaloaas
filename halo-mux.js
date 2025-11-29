/**
 * HaloMux - Bare-Mux Multiplexing Layer
 * 
 * Multiplexing proxy service for handling multiple connections.
 * 
 * @version 1.0.2
 */

import { proxyRequest } from './proxy-utils.js';

/**
 * Create HaloMux proxy service instance
 * @returns {Object} HaloMux service with handle method
 */
export function createHaloMux() {
  return {
    name: 'HaloMux',
    handle: async (request, reply, targetUrl) => {
      return proxyRequest(request, reply, targetUrl, '/mux');
    }
  };
}

