import { CamelCasePlugin, Kysely } from "kysely"
import { PlanetScaleDialect } from "kysely-planetscale"
import { Config } from "sst/node/config"
import { fetch } from "undici"

import type { DB } from "./db.types"

export const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: Config.DATABASE_URL,
    fetch,
  }),
  plugins: [
    new CamelCasePlugin({
      underscoreBeforeDigits: true,
      underscoreBetweenUppercaseLetters: true,
    }),
  ],
  log(event): void {
    if (process.env.NODE_ENV === "production") {
      return
    }
    if (event.level === "query") {
      console.log("📦 QUERY")
      console.log(event.query.sql)
      console.log(event.query.parameters)
    } else if (event.level === "error") {
      console.log("📦 ERROR 🔥")
      console.error(event.error)
    }
  },
})
