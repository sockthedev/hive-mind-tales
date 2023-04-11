import * as iam from "aws-cdk-lib/aws-iam"
import type { SSTConfig } from "sst"
import type { StackContext } from "sst/constructs"
import {
  Api,
  Auth,
  Config,
  EventBus,
  Queue,
  RemixSite,
  use,
} from "sst/constructs"

function Database(ctx: StackContext) {
  const DATABASE_URL = new Config.Secret(ctx.stack, "DATABASE_URL")
  return {
    DATABASE_URL,
  }
}

function Bus(ctx: StackContext) {
  const bus = new EventBus(ctx.stack, "bus", {
    rules: {
      send_magic_link: {
        pattern: {
          detailType: ["send-magic-link"],
        },
        targets: {
          auth: new Queue(ctx.stack, "auth-on-send-magic-link-queue", {
            consumer: {
              function: {
                handler: "server/functions/bus/auth.onSendMagicLink",
                permissions: [
                  new iam.PolicyStatement({
                    actions: ["ses:SendEmail", "SES:SendRawEmail"],
                    resources: ["*"],
                    effect: iam.Effect.ALLOW,
                  }),
                ],
              },
            },
          }),
        },
      },
    },
  })

  return { bus }
}

function Site(ctx: StackContext) {
  const site = new RemixSite(ctx.stack, "site", {
    runtime: "nodejs16.x",
    buildCommand: "pnpm remix build",
    customDomain:
      ctx.app.stage === "production"
        ? {
            domainName: "hivemindtales.com",
            hostedZone: "hivemindtales.com",
            domainAlias: "www.hivemindtales.com",
          }
        : undefined,
    environment: {
      API_URL:
        ctx.app.stage === "production"
          ? "https://api.hivemindtales.com"
          : `https://api.${ctx.app.stage}.hivemindtales.com`,
    },
    waitForInvalidation: ctx.app.stage === "production",
  })
  ctx.stack.addOutputs({
    url: site.url ?? "http://localhost:3000",
  })
}

function ApiGateway(ctx: StackContext) {
  const { DATABASE_URL } = use(Database)
  const { bus } = use(Bus)
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
        bind: [bus, DATABASE_URL],
      },
    },
    routes: {
      // We need to define GET and POST instead of ANY otherwise our CORS
      // policy will not work.
      // https://github.com/trpc/trpc/discussions/2095#discussioncomment-3116235
      "GET /trpc/{proxy+}": "server/functions/trpc.handler",
      "POST /trpc/{proxy+}": "server/functions/trpc.handler",
    },
  })
  return {
    api,
  }
}

function Authentication(ctx: StackContext) {
  const { DATABASE_URL } = use(Database)
  const { api } = use(ApiGateway)
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
    app.stack(Bus)
    app.stack(ApiGateway)
    app.stack(Authentication)
    app.stack(Site)
  },
} satisfies SSTConfig
