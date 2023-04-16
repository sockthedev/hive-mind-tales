import type { StackContext } from "sst/constructs"
import { RemixSite } from "sst/constructs"

export function Site(ctx: StackContext) {
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
