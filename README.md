# Mian Tailer

Luxury tailor website with:

- Public homepage
- Separate gallery, cart, contact, about, and services pages
- Admin login and dashboard
- Gallery upload, edit, delete, and live frontend refresh
- Contact request management
- Order management
- SQLite database storage
- Local uploads storage

## Local Run

```bash
npm install
npm start
```

Open:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/gallery`
- `http://127.0.0.1:3000/admin`
- `http://127.0.0.1:3000/health`

## Default Admin Login

- Username: `admin`
- Password: `mian123`

Change the password from the admin panel after first login.

## Production Environment

The server supports these environment variables:

- `HOST`
  - Default: `0.0.0.0`
  - Use this on VPS so the app is reachable by Nginx or your server IP.
- `PORT`
  - Default: `3000`
- `TRUST_PROXY`
  - Set to `true` when the app runs behind Nginx or another reverse proxy.
- `COOKIE_SECURE`
  - Set to `true` after HTTPS is active on your domain.
- `ADMIN_USERNAME`
  - Only used on first boot when the database does not exist yet.
- `ADMIN_PASSWORD`
  - Only used on first boot when the database does not exist yet.

## VPS Deploy With GitHub

### 1. Prepare the VPS

Ubuntu example:

```bash
sudo apt update
sudo apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 2. Clone the project

```bash
cd /var/www
sudo git clone YOUR_GITHUB_REPO_URL mian-tailer
sudo chown -R $USER:$USER /var/www/mian-tailer
cd /var/www/mian-tailer
npm install
```

### 3. Start the app safely with PM2

```bash
sudo npm install -g pm2
cd /var/www/mian-tailer
HOST=0.0.0.0 PORT=3000 TRUST_PROXY=true pm2 start server.js --name mian-tailer
pm2 save
pm2 startup
```

Check:

```bash
curl http://127.0.0.1:3000/health
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/mian-tailer`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/mian-tailer /etc/nginx/sites-enabled/mian-tailer
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Point your domain

Add these DNS records at your domain provider:

- `A` record for `@` -> your VPS public IP
- `A` record for `www` -> your VPS public IP

Wait for DNS propagation, then open:

- `http://yourdomain.com`

### 6. Enable HTTPS

After the domain points correctly:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Then restart PM2 with secure cookies:

```bash
cd /var/www/mian-tailer
pm2 delete mian-tailer
HOST=0.0.0.0 PORT=3000 TRUST_PROXY=true COOKIE_SECURE=true pm2 start server.js --name mian-tailer
pm2 save
```

## Important Deployment Notes

- The `data/` and `uploads/` folders are ignored in Git on purpose.
- On a new VPS they will be created automatically when the app starts.
- If you ever move the VPS, back up `data/` and `uploads/` because they contain your database and uploaded images.
- If you change `ADMIN_USERNAME` or `ADMIN_PASSWORD` later, they do not overwrite an existing database user automatically.
- Use the admin panel to change the password after first login.

## Update On VPS After New GitHub Push

```bash
cd /var/www/mian-tailer
git pull
npm install
pm2 restart mian-tailer
```
