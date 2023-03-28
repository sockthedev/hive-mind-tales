# Hive Mind Tales

A ridiculous experiment in collaborative storytelling.

## Development

### SST Backend Serverless Stack

You can run the backend lambda services locally via the SST development command;

```bash
pnpm run dev:server
```

### Remix App

You can run the Remix app locally via the Remix development command;

```bash
pnpm run dev:app
```

### Local HTTPS

The domain `local.hivemindtales.com` has been configured in our DNS records to point to localhost. You can use [Caddyserver](https://caddyserver.com/) to set up an HTTPS reverse proxy to the Remix App Server instance via the following command;

```bash
caddy reverse-proxy --from local.hivemindtales.com --to localhost:3000
```
