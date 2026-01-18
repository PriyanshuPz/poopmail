# Poopmail

A temporary email service that allows user to create disposible email addresses and recieve emails without registration.

# Setup

The UI part of the project is in `frontend` folder.

```bash
cd frontend
pnpm install
pnpm dev
```

The Ingester deployed on appwrite

```bash
cd functions/mails-ingester
appwrite run function
```

The Cloudflare worker that is grab all the emails and send to ingester

```bash

cd cf-worker
npx wrangler deploy
```
