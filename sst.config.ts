import type { SSTConfig } from "sst"
import { Api, Auth, Config, RemixSite, StackContext, use } from "sst/constructs"

function Database(ctx: StackContext) {
  const DATABASE_URL = new Config.Secret(ctx.stack, "DATABASE_URL")
  return {
    DATABASE_URL,
  }
}

function Site(ctx: StackContext) {
  const { DATABASE_URL } = use(Database)
  const site = new RemixSite(ctx.stack, "site", {
    runtime: "nodejs16.x",
    customDomain:
      ctx.app.stage === "production"
        ? {
            domainName: "hivemindtales.com",
            hostedZone: "hivemindtales.com",
            domainAlias: "www.hivemindtales.com",
          }
        : undefined,
    bind: [DATABASE_URL],
  })
  ctx.stack.addOutputs({
    url: site.url ?? "http://localhost:3000",
  })
}

function Authentication(ctx: StackContext) {
  const { DATABASE_URL } = use(Database)
  const GOOGLE_CLIENT_ID = new Config.Secret(ctx.stack, "GOOGLE_CLIENT_ID")
  const api = new Api(ctx.stack, "api", {
    customDomain: {
      domainName:
        ctx.app.stage === "production"
          ? "api.hivemindtales.com"
          : `api.${ctx.app.stage}.hivemindtales.com`,
      hostedZone: "hivemindtales.com",
    },
    defaults: {
      function: {
        bind: [DATABASE_URL],
      },
    },
    routes: {
      "GET /session": "functions/session.handler",
    },
  })
  const auth = new Auth(ctx.stack, "auth", {
    authenticator: {
      handler: "functions/auth.handler",
      bind: [DATABASE_URL, GOOGLE_CLIENT_ID],
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

export default {
  config(input) {
    return {
      name: "hmt",
      region: input.stage === "production" ? "us-east-1" : "ap-southeast-1",
      profile: "sockthedev",
    }
  },
  stacks(app) {
    if (app.stage !== "production") {
      app.setDefaultRemovalPolicy("destroy")
    }

    app.setDefaultFunctionProps({
      runtime: "nodejs16.x",
      nodejs: {
        format: "esm",
      },
      memorySize: "512 MB",
      logRetention: "one_day",
    })

    app.stack(Database)
    app.stack(Site)
    app.stack(Authentication)
  },
} satisfies SSTConfig
