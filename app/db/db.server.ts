import { CamelCasePlugin, Kysely } from "kysely"
import { PlanetScaleDialect } from "kysely-planetscale"
import { Config } from "sst/node/config"

import type { DB } from "./db.types"

export const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    // @ts-ignore
    url: Config.DATABASE_URL,
  }),
  plugins: [
    new CamelCasePlugin({
      underscoreBeforeDigits: true,
      underscoreBetweenUppercaseLetters: true,
    }),
  ],
  // TODO: Need to disable the query logging for production deployments;
  log: ["query", "error"],
})
