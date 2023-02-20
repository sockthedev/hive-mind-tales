// app/routes/hello/server.ts

import { LoaderArgs } from "@remix-run/node"

export const loader = async (_args: LoaderArgs) => {
  return {
    message: `Hello world`,
  }
}

export type Loader = typeof loader
