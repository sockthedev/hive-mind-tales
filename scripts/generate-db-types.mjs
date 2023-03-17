import { execSync } from "child_process"
import { Config } from "sst/node/config"

try {
  execSync(
    "pnpm kysely-codegen --camel-case --dialect mysql --out-file ./server/db/db.types.ts",
    {
      stdio: "inherit",
      env: {
        ...process.env,
        // @ts-ignore
        DATABASE_URL: Config.DATABASE_URL,
      },
    },
  )
} catch (err) {
  console.error(err.stack)
  process.exit(1)
}
