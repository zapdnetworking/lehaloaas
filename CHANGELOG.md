# Changelog

All notable changes to LeHalo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-28

### Fixed
- **Critical:** Fixed binary data corruption in content-type parser (Buffer concatenation issue)
- **Critical:** Fixed hanging connections in catch-all route (bare return statements)
- **Critical:** Fixed TypeError when baseUrlObj is undefined in protocol-relative URL rewriting
- Improved error handling in body parser with proper error event handling
- Enhanced baseUrlObj initialization with fallback values

### Changed
- Content-type parser now properly handles binary data using Buffer.concat()
- Catch-all route now properly sends HTTP responses using reply.callNotFound()
- URL rewriting function now safely handles undefined baseUrlObj with optional chaining

## [1.0.2] - 2025-01-28

### Added
- Comprehensive URL rewriting for all website types
- JavaScript fetch/XMLHttpRequest interception
- Dynamic proxy script injection for runtime URL rewriting
- Enhanced iframe permissions for full website compatibility
- Relative URL handling with referer-based base URL resolution
- CSS url() function rewriting
- WebSocket support (converted to HTTP)
- Catch-all route for unmatched paths
- Enhanced error handling and logging
- Support for complex websites (YouTube, Twitch, ChatGPT, Character.ai, Netflix, Walmart, etc.)
- Form action and formaction attribute rewriting
- Protocol-relative URL support
- Comprehensive security header removal

### Changed
- Improved proxy utilities with shared logic across all services
- Enhanced CORS configuration (completely permissive)
- Better query string and path parameter handling
- Improved base URL resolution for relative paths
- Enhanced iframe sandbox permissions
- Better JavaScript URL pattern matching

### Fixed
- Fixed 404 errors for relative paths (e.g., `/login?return_to=...`)
- Fixed URL encoding/decoding issues
- Fixed query string handling in proxy routes
- Fixed relative URL rewriting in HTML
- Fixed JavaScript fetch/XHR URL rewriting
- Fixed CSS resource loading
- Fixed form submissions through proxy

### Performance
- Optimized URL rewriting patterns
- Improved response streaming
- Better memory management for large responses

## [1.0.1] - 2025-01-28

### Added
- Tabbed browser interface
- Bookmarks system
- Browsing history
- Settings panel
- Keyboard shortcuts
- Homepage integration in new tabs
- Logo throughout entire site

### Changed
- Browser homepage now loads LeHalo homepage instead of blank page
- Improved tab management
- Enhanced UI with logo placement

## [1.0.0] - 2025-01-28

### Added
- Initial release
- Fastify server with modular proxy services
- Dark/yellow theme UI
- Homepage with search and quick links
- Funny text randomizer (20 taglines)
- Discord community link
- Multiple proxy services (HaloLight, HaloShell, HaloWisp, HaloLink, HaloMux)
- Session persistence
- Tab cloaking
- Error pages
- AGPL-3.0 license
- Complete documentation

---

[1.0.2]: https://github.com/yourusername/lehalo/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/yourusername/lehalo/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/yourusername/lehalo/releases/tag/v1.0.0

