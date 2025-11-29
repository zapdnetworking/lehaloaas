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




# <img src="assets/lehalo-logo.png" alt="LeHalo Logo" width="48" height="48" style="vertical-align:middle;"> LeHalo

<p align="center">
    <img src="assets/lehalo-logo.png" alt="LeHalo Banner" width="256" height="auto">
</p>

**LeHalo — A division of the ZAPD Network**

> A modern web browsing experience powered by cutting-edge proxy technology. Built with Node.js and Fastify, featuring a sleek dark/yellow UI and modular proxy services.

---

## 📝 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

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

---

## ✨ Features

- ⚡ **Fast & Reliable:** Lightning-fast connections powered by advanced proxy technology
- 🛡️ **Secure:** Privacy and security are top priorities
- 🎨 **Sleek Design:** Beautiful, modern interface with dark/yellow theme
- 🧩 **Modular Architecture:** Multiple proxy services (HaloLight, HaloShell, HaloWisp, HaloLink, HaloMux)
- 💬 **Community:** [Join our Discord server](https://discord.gg/DgSHpwyf) for support and updates

---

## 🚀 One-Click Deploy

| Vercel | Replit | Glitch | Heroku | Netlify |
|--------|--------|--------|--------|---------|
| [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/zapdnetworking/lehaloaas) | [![Run on Replit](https://replit.com/badge/github/zapdnetworking/lehaloaas)](https://replit.com/github/zapdnetworking/lehaloaas) | [![Remix on Glitch](https://img.shields.io/badge/Glitch-Remix-blue?logo=glitch)](https://glitch.com/edit/#!/import/github/zapdnetworking/lehaloaas) | [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/zapdnetworking/lehaloaas) | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/zapdnetworking/lehaloaas) |

---

## 🛠️ Installation

```bash
git clone <repository-url>
cd lehalo
npm install
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000) by default.

---

## ⚙️ Configuration

Environment variables:

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

---

## 📁 Project Structure

```text
lehalo/
├── server.js          # Main server entry point
├── index.js           # Route setup
├── halo-light.js      # Ultraviolet-based proxy
├── halo-shell.js      # Rammerhead-based proxy
├── halo-wisp.js       # Wisp Protocol WebSocket
├── halo-link.js       # Epoxy transport
├── halo-mux.js        # Bare-Mux multiplexing
├── index.html         # Homepage
├── browser.html       # Browser UI
├── error.html         # Error page
├── styles.css         # Stylesheet
├── app.js             # Client-side JavaScript
├── assets/            # Static assets
│   ├── lehalo-logo.png
│   └── lehalo-icon.png
└── README.md          # Documentation
```

---

## 🧩 Proxy Services

- **HaloLight** — Ultraviolet-based proxy engine for URL rewriting and content proxying.
- **HaloShell** — Rammerhead-based DOM rewriting proxy for advanced web compatibility.
- **HaloWisp** — Wisp Protocol WebSocket transport for real-time communication.
- **HaloLink** — Epoxy transport layer for efficient data transfer.
- **HaloMux** — Bare-Mux multiplexing layer for connection management.

---

## 📸 Screenshots

<p align="center">
    <img src="assets/lehalo-logo.png" alt="LeHalo Homepage" width="256" height="auto">
</p>

---

## 🤔 FAQ

- **Is LeHalo free?**
    - Yes! Open source under AGPL-3.0.
- **How do I use the proxy?**
    - Enter a URL in the search bar and hit the arrow!
- **Can I deploy on my own server?**
    - Absolutely. See the deploy buttons above or run locally.
- **Where can I get help?**
    - [Join our Discord](https://discord.gg/DgSHpwyf) or open an issue!

---

## 👥 Contributors

- [ZAPD Network](https://github.com/zapdnetworking)
- [Your Name Here!](https://github.com/zapdnetworking/lehaloaas)

---

## 🌐 Links

- [Project Homepage](https://github.com/zapdnetworking/lehaloaas)
- [Discord Community](https://discord.gg/DgSHpwyf)

---

## 🧑‍💻 Advanced Usage

- **Custom Port:** Set `PORT` env variable before starting.
- **Production Mode:** Set `NODE_ENV=production` for optimized logging.
- **Reverse Proxy:** Deploy behind Nginx, Caddy, or Cloudflare for extra features.

---

> Made with ❤️ by ZAPD Network
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

