import type { SSTConfig } from "sst"
import { RemixSite } from "sst/constructs"

const PROFILE: Record<string, string> = {
  default: "sockthedev",
  production: "hmt-production",
}

const REGION: Record<string, string> = {
  default: "ap-southeast-1",
  production: "us-east-1",
}

export default {
  config(input) {
    const profile = PROFILE[input.stage || "default"]
    const region = REGION[input.stage || "default"]

    return {
      name: "hmt",
      region,
      profile,
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

    app.stack(function Site(ctx) {
      const site = new RemixSite(ctx.stack, "site")
      ctx.stack.addOutputs({
        url: site.url ?? "http://localhost:3000",
      })
    })
  },
} satisfies SSTConfig
