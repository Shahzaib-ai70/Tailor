# MIAN TAILOR and design

Next.js production site for the public storefront, gallery, contact flow, and local admin workspace.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Readiness

This project is prepared for VPS and custom-domain deployment with:

- standalone Next.js output for lean server deployment
- remote image host allowlist for existing media sources
- domain-aware metadata base support through environment variables
- non-breaking production security headers
- host binding for external VPS traffic

## Environment

Copy `.env.example` to `.env.local` for local work or `.env` on the server.

```bash
cp .env.example .env
```

Set the real domain:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
SITE_URL=https://your-domain.com
PORT=3000
HOSTNAME=0.0.0.0
```

## VPS Deploy

Recommended server baseline:

- Node.js 20 or newer
- npm 10 or newer
- Nginx or Apache reverse proxy
- SSL certificate on the domain

Build and run:

```bash
npm ci
npm run build
npm run start
```

For standalone server mode:

```bash
npm ci
npm run build
HOSTNAME=0.0.0.0 PORT=3000 npm run start:standalone
```

For PM2:

```bash
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
```

## Nginx Example

```nginx
server {
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Media Safety

The current media setup is preserved. Remote images already allowed in `next.config.ts`:

- `images.unsplash.com`
- `images.pexels.com`
- `cdn.shopify.com`

If you add new external image providers later, add their domains to `images.remotePatterns` before deploying.

## Important Note

Some admin-style features in this project are intentionally browser-local:

- gallery admin edits
- customer service live inbox
- WhatsApp settings
- local live chat history

These are stored in browser `localStorage`, so they are not shared automatically across devices, browsers, or multiple admins on the VPS. If you want shared real admin data later, the next step is adding a backend database and authentication.

## Checks

```bash
npm run lint
npm run build
```
