# Hive Mind Tales

A ridiculous experiment in collaborative storytelling.

## Prerequisites

You need the following tools installed on your machine;

> Example install commands are for Mac OS utilising the Homebrew package manager.

- pnpm

  ```bash
  brew install pnpm
  ```

- Node v18

  ```bash
  brew install nvm
  nvm install 18
  ```

- MySQL Client

  ```bash
  brew install mysql-client
  ```

- Planetscale CLI

  ```bash
  brew install pscale
  ```

## Development

### SST Serverless Stack

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

### Database

The migrations are located at `server/db/migrations/`, you need to run these manually utilising the Planetscale CLI.

Use the following template for your CLI command;

```bash
pscale shell {db-name} {db-branch} < {script-path}
```

For example;

```bash
pscale shell hive-mind-tales development < ./server/db/migrations/0001-user.sql
```
