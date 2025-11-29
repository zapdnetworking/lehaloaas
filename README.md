# LeHalo

**LeHalo — A division of the ZAPD Network**

A modern web browsing experience powered by cutting-edge proxy technology. Built with Node.js and Fastify, featuring a sleek dark/yellow UI and modular proxy services.

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

```
Copyright (C) 2025 LeHalo — A division of the ZAPD Network

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

## Features

- **Fast & Reliable**: Lightning-fast connections powered by advanced proxy technology
- **Secure**: Privacy and security are top priorities
- **Sleek Design**: Beautiful, modern interface with dark/yellow theme
- **Modular Architecture**: Multiple proxy services (HaloLight, HaloShell, HaloWisp, HaloLink, HaloMux)
- **Community**: Join our Discord server for support and updates

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lehalo
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## Configuration

Environment variables:
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

## Project Structure

```
lehalo/
├── server.js          # Main server entry point
├── routes/            # Route handlers
│   └── index.js      # Route setup
├── services/         # Proxy service modules
│   ├── halo-light.js # Ultraviolet-based proxy
│   ├── halo-shell.js # Rammerhead-based proxy
│   ├── halo-wisp.js  # Wisp Protocol WebSocket
│   ├── halo-link.js  # Epoxy transport
│   └── halo-mux.js   # Bare-Mux multiplexing
├── ui/               # Frontend files
│   ├── index.html    # Homepage
│   ├── error.html    # Error page
│   ├── styles.css    # Stylesheet
│   └── app.js        # Client-side JavaScript
├── assets/           # Static assets
│   ├── lehalo-logo.png
│   └── lehalo-icon.png
└── docs/             # Documentation
    └── README.md
```

## Proxy Services

### HaloLight
Ultraviolet-based proxy engine for URL rewriting and content proxying.

### HaloShell
Rammerhead-based DOM rewriting proxy for advanced web compatibility.

### HaloWisp
Wisp Protocol WebSocket transport for real-time communication.

### HaloLink
Epoxy transport layer for efficient data transfer.

### HaloMux
Bare-Mux multiplexing layer for connection management.

## Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

### Netlify
1. Build command: `npm install`
2. Publish directory: `.`
3. Start command: `npm start`

### Replit
1. Import repository
2. Run: `npm install && npm start`

## Community

Join our Discord server: [https://discord.gg/DgSHpwyf](https://discord.gg/DgSHpwyf)

## Branding

- **Site Title**: LeHalo
- **Metadata**: "LeHalo — A division of the ZAPD Network"
- **Footer**: © 2025 LeHalo — A division of the ZAPD Network

## Color Theme

- Background: `#0A0A0C` (dark charcoal)
- Primary Accent: `#F4D23D` (light golden yellow)
- Highlight/Glow: `#FFD95F` (brighter yellow)
- Text: `#EDEDED`
- Secondary Background: `#1B1B21`

## Contributing

This project is open source under the AGPL-3.0 license. Contributions are welcome!

## Support

For support, questions, or feature requests, please join our Discord server.

---

**LeHalo — A division of the ZAPD Network**

