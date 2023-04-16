import type { StackContext } from "sst/constructs"
import { Auth, Config, use } from "sst/constructs"

import { Api } from "./api"
import { Database } from "./database"

export function Authentication(ctx: StackContext) {
  const { DATABASE_URL } = use(Database)
  const { api } = use(Api)
  const GOOGLE_CLIENT_ID = new Config.Secret(ctx.stack, "GOOGLE_CLIENT_ID")
  const SITE_URL = new Config.Parameter(ctx.stack, "SITE_URL", {
    value:
      ctx.app.stage === "production"
        ? "https://www.hivemindtales.com"
        : "http://localhost:3000",
  })
  const auth = new Auth(ctx.stack, "auth", {
    authenticator: {
      handler: "server/functions/auth.handler",
      bind: [DATABASE_URL, GOOGLE_CLIENT_ID, SITE_URL],
      environment: {
        SITE_URL:
          ctx.app.stage === "production"
            ? "https://www.hivemindtales.com"
            : "http://localhost:3000",
      },
    },
  })
  auth.attach(ctx.stack, {
    api,
    prefix: "/auth",
  })
  return {
    api,
  }
}
