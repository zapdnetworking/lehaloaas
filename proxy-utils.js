/**
 * Shared Proxy Utilities
 * 
 * Comprehensive proxy request handler with universal website support.
 * Handles URL rewriting, CORS, security headers, and all content types.
 * 
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @param {string} targetUrl - Target URL to proxy
 * @param {string} proxyPath - Proxy path prefix (default: '/light')
 * @returns {Promise} Response with proxied content
 */

// Shared proxy utilities for all proxy services - Enhanced for all websites

export async function proxyRequest(request, reply, targetUrl, proxyPath = '/light') {
  try {
    if (!targetUrl) {
      return reply.status(400).send({ error: 'No URL provided' });
    }

    // Decode and validate URL
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(targetUrl);
      // Fix protocol issues
      if (decodedUrl.startsWith('//')) {
        decodedUrl = 'https:' + decodedUrl;
      } else if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
        decodedUrl = 'https://' + decodedUrl;
      }
      new URL(decodedUrl); // Validate URL
    } catch (e) {
      return reply.status(400).send({ error: 'Invalid URL: ' + e.message });
    }

    // Build headers - remove proxy-specific headers and add proper ones
    const headers = {};
    const skipHeaders = ['host', 'connection', 'content-length', 'accept-encoding', 'cf-ray', 'cf-connecting-ip', 'x-forwarded-for', 'x-real-ip', 'upgrade', 'sec-websocket-key', 'sec-websocket-version'];
    
    for (const [key, value] of Object.entries(request.headers)) {
      const lowerKey = key.toLowerCase();
      if (!skipHeaders.includes(lowerKey) && value) {
        headers[key] = value;
      }
    }

    // Set proper User-Agent and headers to avoid blocking
    headers['User-Agent'] = headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    headers['Accept'] = headers['accept'] || '*/*';
    headers['Accept-Language'] = headers['accept-language'] || 'en-US,en;q=0.9';
    headers['Accept-Encoding'] = 'gzip, deflate, br';
    headers['DNT'] = '1';
    headers['Connection'] = 'keep-alive';
    headers['Upgrade-Insecure-Requests'] = '1';
    headers['Sec-Fetch-Dest'] = 'document';
    headers['Sec-Fetch-Mode'] = 'navigate';
    headers['Sec-Fetch-Site'] = 'none';
    headers['Sec-Fetch-User'] = '?1';
    headers['Cache-Control'] = 'no-cache';
    headers['Pragma'] = 'no-cache';

    // Get request body if present
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
      if (request.body) {
        body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
      } else if (request.rawBody) {
        body = request.rawBody;
      }
    }

    // Make the request
    const response = await fetch(decodedUrl, {
      method: request.method,
      headers: headers,
      body: body,
      redirect: 'follow',
    });

    // Get content type
    const contentType = response.headers.get('content-type') || 'text/html';
    const isText = contentType.includes('text/') || 
                   contentType.includes('application/json') || 
                   contentType.includes('application/javascript') || 
                   contentType.includes('application/xml') ||
                   contentType.includes('application/xhtml') ||
                   contentType.includes('application/x-javascript') ||
                   contentType.includes('text/javascript') ||
                   contentType.includes('application/ecmascript');

    // Set response headers - remove CORS restrictions from proxied content
    const responseHeaders = {};
    const blockedHeaders = [
      'content-security-policy', 
      'x-frame-options', 
      'x-content-type-options', 
      'strict-transport-security', 
      'access-control-allow-origin', 
      'access-control-allow-methods', 
      'access-control-allow-headers',
      'content-encoding',
      'transfer-encoding',
      'cross-origin-embedder-policy',
      'cross-origin-opener-policy',
      'cross-origin-resource-policy',
      'permissions-policy',
      'referrer-policy'
    ];
    
    for (const [key, value] of response.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (!blockedHeaders.includes(lowerKey)) {
        responseHeaders[key] = value;
      }
    }

    // Set content type
    reply.type(contentType);

    // Copy safe headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      reply.header(key, value);
    });

    // Add CORS headers to allow access
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', '*');
    reply.header('Access-Control-Allow-Headers', '*');
    reply.header('Access-Control-Expose-Headers', '*');
    reply.header('X-Content-Type-Options', 'nosniff');

    // Handle different content types
    if (isText && contentType.includes('text/html')) {
      // For HTML, we need comprehensive URL rewriting
      let html = await response.text();
      
      // Get base URL for relative URL resolution
      let baseUrl;
      let baseUrlObj;
      try {
        baseUrlObj = new URL(decodedUrl);
        baseUrl = baseUrlObj.origin + baseUrlObj.pathname;
        if (!baseUrl.endsWith('/') && !baseUrlObj.pathname.includes('.')) {
          baseUrl += '/';
        }
      } catch (e) {
        // If URL parsing fails, try to create a minimal baseUrlObj for protocol-relative URLs
        baseUrl = decodedUrl;
        try {
          // Attempt to create baseUrlObj from decodedUrl, defaulting to https if it fails
          baseUrlObj = new URL(decodedUrl.startsWith('http') ? decodedUrl : `https://${decodedUrl}`);
        } catch (e2) {
          // If that also fails, create a dummy object with https protocol as fallback
          baseUrlObj = { protocol: 'https:' };
        }
      }
      
      // Remove ALL blocking meta tags and policies
      html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*http-equiv=["']Referrer-Policy["'][^>]*>/gi, '');
      html = html.replace(/content-security-policy[^;]*;?/gi, '');
      html = html.replace(/<script[^>]*nonce[^>]*>/gi, (match) => match.replace(/nonce=["'][^"']*["']/gi, ''));
      
      // Comprehensive URL rewriting function
      const rewriteUrl = (url) => {
        if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('javascript:') || url.startsWith('#')) {
          return url;
        }
        try {
          let fullUrl;
          if (url.startsWith('http://') || url.startsWith('https://')) {
            fullUrl = url;
          } else if (url.startsWith('//')) {
            // Guard against undefined baseUrlObj
            const protocol = baseUrlObj?.protocol || 'https:';
            fullUrl = protocol + url;
          } else {
            fullUrl = new URL(url, baseUrl).href;
          }
          return `${proxyPath}/${encodeURIComponent(fullUrl)}`;
        } catch (e) {
          return url;
        }
      };
      
      // Rewrite absolute URLs
      html = html.replace(/href=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `href="${rewriteUrl(url)}"`;
      });
      html = html.replace(/src=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `src="${rewriteUrl(url)}"`;
      });
      html = html.replace(/action=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `action="${rewriteUrl(url)}"`;
      });
      html = html.replace(/cite=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `cite="${rewriteUrl(url)}"`;
      });
      html = html.replace(/data=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `data="${rewriteUrl(url)}"`;
      });
      html = html.replace(/formaction=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `formaction="${rewriteUrl(url)}"`;
      });
      html = html.replace(/poster=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `poster="${rewriteUrl(url)}"`;
      });
      html = html.replace(/background=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `background="${rewriteUrl(url)}"`;
      });
      
      // Rewrite relative URLs (starting with /)
      html = html.replace(/href=["'](\/[^"']*)["']/gi, (match, path) => {
        return `href="${rewriteUrl(path)}"`;
      });
      html = html.replace(/src=["'](\/[^"']*)["']/gi, (match, path) => {
        return `src="${rewriteUrl(path)}"`;
      });
      html = html.replace(/action=["'](\/[^"']*)["']/gi, (match, path) => {
        return `action="${rewriteUrl(path)}"`;
      });
      html = html.replace(/cite=["'](\/[^"']*)["']/gi, (match, path) => {
        return `cite="${rewriteUrl(path)}"`;
      });
      
      // Rewrite CSS url() functions
      html = html.replace(/url\(["']?(https?:\/\/[^"')]+)["']?\)/gi, (match, url) => {
        return `url("${rewriteUrl(url)}")`;
      });
      html = html.replace(/url\(["']?(\/[^"')]+)["']?\)/gi, (match, path) => {
        return `url("${rewriteUrl(path)}")`;
      });
      
      // Rewrite protocol-relative URLs (//example.com)
      html = html.replace(/href=["'](\/\/[^"']+)["']/gi, (match, url) => {
        return `href="${rewriteUrl(url)}"`;
      });
      html = html.replace(/src=["'](\/\/[^"']+)["']/gi, (match, url) => {
        return `src="${rewriteUrl(url)}"`;
      });
      
      // Comprehensive JavaScript URL rewriting
      // Rewrite fetch() calls
      html = html.replace(/fetch\s*\(\s*["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `fetch("${rewriteUrl(url)}"`;
      });
      html = html.replace(/fetch\s*\(\s*["'](\/[^"']+)["']/gi, (match, url) => {
        return `fetch("${rewriteUrl(url)}"`;
      });
      
      // Rewrite XMLHttpRequest
      html = html.replace(/(\.open\s*\(\s*["'])(GET|POST|PUT|DELETE|PATCH)["'],\s*["'](https?:\/\/[^"']+)["']/gi, (match, prefix, method, url) => {
        return `${prefix}${method}", "${rewriteUrl(url)}"`;
      });
      html = html.replace(/(\.open\s*\(\s*["'])(GET|POST|PUT|DELETE|PATCH)["'],\s*["'](\/[^"']+)["']/gi, (match, prefix, method, url) => {
        return `${prefix}${method}", "${rewriteUrl(url)}"`;
      });
      
      // Rewrite WebSocket connections
      html = html.replace(/new\s+WebSocket\s*\(\s*["'](wss?:\/\/[^"']+)["']/gi, (match, url) => {
        // Convert WebSocket to HTTP proxy (limited support)
        const httpUrl = url.replace(/^ws/, 'http').replace(/^wss/, 'https');
        return `new WebSocket("${rewriteUrl(httpUrl)}"`;
      });
      
      // Rewrite axios/fetch in various forms
      html = html.replace(/(axios|fetch|\.get|\.post|\.put|\.delete|\.patch)\s*\(\s*["'](https?:\/\/[^"']+)["']/gi, (match, method, url) => {
        return `${method}("${rewriteUrl(url)}"`;
      });
      
      // Rewrite window.location assignments
      html = html.replace(/window\.location\s*=\s*["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `window.location="${rewriteUrl(url)}"`;
      });
      html = html.replace(/window\.location\.href\s*=\s*["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `window.location.href="${rewriteUrl(url)}"`;
      });
      html = html.replace(/location\.href\s*=\s*["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `location.href="${rewriteUrl(url)}"`;
      });
      
      // Rewrite document.location
      html = html.replace(/document\.location\s*=\s*["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `document.location="${rewriteUrl(url)}"`;
      });
      
      // Inject comprehensive proxy script for dynamic URL rewriting
      const proxyScript = `
<script>
(function() {
  const proxyPath = '${proxyPath}';
  const baseUrl = '${baseUrl}';
  
  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        url = proxyPath + '/' + encodeURIComponent(url);
      } else if (url.startsWith('/')) {
        try {
          const fullUrl = new URL(url, baseUrl).href;
          url = proxyPath + '/' + encodeURIComponent(fullUrl);
        } catch(e) {}
      }
    }
    return originalFetch.apply(this, arguments);
  };
  
  // Override XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        url = proxyPath + '/' + encodeURIComponent(url);
      } else if (url.startsWith('/')) {
        try {
          const fullUrl = new URL(url, baseUrl).href;
          url = proxyPath + '/' + encodeURIComponent(fullUrl);
        } catch(e) {}
      }
    }
    return originalOpen.apply(this, [method, url, ...args]);
  };
  
  // Override WebSocket (convert to HTTP for now)
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    if (url.startsWith('ws://') || url.startsWith('wss://')) {
      const httpUrl = url.replace(/^ws/, 'http').replace(/^wss/, 'https');
      url = proxyPath + '/' + encodeURIComponent(httpUrl);
    }
    return new originalWebSocket(url, protocols);
  };
  
  // Override createElement for script/link tags
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName, options) {
    const element = originalCreateElement.call(this, tagName, options);
    if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'link') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if ((name === 'src' || name === 'href') && typeof value === 'string' && 
            (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/'))) {
          if (value.startsWith('http://') || value.startsWith('https://')) {
            value = proxyPath + '/' + encodeURIComponent(value);
          } else if (value.startsWith('/')) {
            try {
              const fullUrl = new URL(value, baseUrl).href;
              value = proxyPath + '/' + encodeURIComponent(fullUrl);
            } catch(e) {}
          }
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    return element;
  };
})();
</script>`;
      
      // Inject proxy script before closing head or at start of body
      if (html.includes('</head>')) {
        html = html.replace('</head>', proxyScript + '</head>');
      } else if (html.includes('<body')) {
        html = html.replace('<body', proxyScript + '<body');
      } else {
        html = proxyScript + html;
      }
      
      // Inject or update base tag
      if (html.includes('<base')) {
        html = html.replace(/<base[^>]*>/gi, `<base href="${proxyPath}/${encodeURIComponent(decodedUrl)}/">`);
      } else {
        html = html.replace(/<head[^>]*>/i, `$&<base href="${proxyPath}/${encodeURIComponent(decodedUrl)}/">`);
      }

      return reply.send(html);
    } else if (isText && (contentType.includes('javascript') || contentType.includes('ecmascript'))) {
      // For JavaScript files, rewrite URLs
      let js = await response.text();
      
      // Get base URL
      let baseUrl;
      try {
        const baseUrlObj = new URL(decodedUrl);
        baseUrl = baseUrlObj.origin + baseUrlObj.pathname;
        if (!baseUrl.endsWith('/')) {
          baseUrl += '/';
        }
      } catch (e) {
        baseUrl = decodedUrl;
      }
      
      // Rewrite common URL patterns in JavaScript
      const rewriteJsUrl = (url) => {
        if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('javascript:')) {
          return url;
        }
        try {
          let fullUrl;
          if (url.startsWith('http://') || url.startsWith('https://')) {
            fullUrl = url;
          } else if (url.startsWith('//')) {
            const baseUrlObj = new URL(decodedUrl);
            fullUrl = baseUrlObj.protocol + url;
          } else if (url.startsWith('/')) {
            fullUrl = new URL(url, baseUrl).href;
          } else {
            fullUrl = new URL(url, baseUrl).href;
          }
          return `${proxyPath}/${encodeURIComponent(fullUrl)}`;
        } catch (e) {
          return url;
        }
      };
      
      // Rewrite fetch calls
      js = js.replace(/fetch\s*\(\s*["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
        return `fetch("${rewriteJsUrl(url)}"`;
      });
      js = js.replace(/fetch\s*\(\s*["'](\/[^"']+)["']/gi, (match, url) => {
        return `fetch("${rewriteJsUrl(url)}"`;
      });
      
      // Rewrite XMLHttpRequest
      js = js.replace(/(\.open\s*\(\s*["'])(GET|POST|PUT|DELETE|PATCH)["'],\s*["'](https?:\/\/[^"']+)["']/gi, (match, prefix, method, url) => {
        return `${prefix}${method}", "${rewriteJsUrl(url)}"`;
      });
      
      return reply.send(js);
    } else if (isText && contentType.includes('css')) {
      // For CSS files, rewrite URLs
      let css = await response.text();
      
      let baseUrl;
      try {
        const baseUrlObj = new URL(decodedUrl);
        baseUrl = baseUrlObj.origin + baseUrlObj.pathname;
        if (!baseUrl.endsWith('/')) {
          baseUrl += '/';
        }
      } catch (e) {
        baseUrl = decodedUrl;
      }
      
      const rewriteCssUrl = (url) => {
        if (!url || url.startsWith('data:') || url.startsWith('#')) {
          return url;
        }
        try {
          let fullUrl;
          if (url.startsWith('http://') || url.startsWith('https://')) {
            fullUrl = url;
          } else if (url.startsWith('//')) {
            const baseUrlObj = new URL(decodedUrl);
            fullUrl = baseUrlObj.protocol + url;
          } else {
            fullUrl = new URL(url, baseUrl).href;
          }
          return `${proxyPath}/${encodeURIComponent(fullUrl)}`;
        } catch (e) {
          return url;
        }
      };
      
      // Rewrite CSS url() functions
      css = css.replace(/url\(["']?(https?:\/\/[^"')]+)["']?\)/gi, (match, url) => {
        return `url("${rewriteCssUrl(url)}")`;
      });
      css = css.replace(/url\(["']?(\/[^"')]+)["']?\)/gi, (match, path) => {
        return `url("${rewriteCssUrl(path)}")`;
      });
      css = css.replace(/url\(["']?(\/\/[^"')]+)["']?\)/gi, (match, url) => {
        return `url("${rewriteCssUrl(url)}")`;
      });
      
      return reply.send(css);
    } else if (isText) {
      // For other text content, return as-is
      const text = await response.text();
      return reply.send(text);
    } else {
      // For binary content (images, videos, etc.), stream it
      if (response.body) {
        return reply.send(response.body);
      }
      const buffer = await response.arrayBuffer();
      return reply.send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return reply.status(500).send({ 
      error: 'Proxy error', 
      message: error.message
    });
  }
}
