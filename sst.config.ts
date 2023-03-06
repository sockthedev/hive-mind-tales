import type { SSTConfig } from "sst"
import { Config, RemixSite, StackContext } from "sst/constructs"

function Site(ctx: StackContext) {
  const DATABASE_URL = new Config.Secret(ctx.stack, "DATABASE_URL")
  const site = new RemixSite(ctx.stack, "site", {
    customDomain: {
      domainName: "hivemindtales.com",
      hostedZone: "hivemindtales.com",
    },
    bind: [DATABASE_URL],
  })
  ctx.stack.addOutputs({
    url: site.url ?? "http://localhost:3000",
  })
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

    app.stack(Site)
  },
} satisfies SSTConfig
