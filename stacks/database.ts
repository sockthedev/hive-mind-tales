import type { StackContext } from "sst/constructs"
import { Config } from "sst/constructs"

export function Database(ctx: StackContext) {
  const DATABASE_URL = new Config.Secret(ctx.stack, "DATABASE_URL")
  return {
    DATABASE_URL,
  }
}
