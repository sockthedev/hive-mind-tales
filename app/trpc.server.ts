import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import memoizeOne from "memoize-one"
import invariant from "tiny-invariant"
import type { TrpcRouter } from "~/server/trpc/types"

invariant(
  process.env["API_URL"] != null,
  '"API_URL" environment variable is not set',
)

const apiUrl = process.env["API_URL"]

export const trpc = memoizeOne((token?: string) => {
  return createTRPCProxyClient<TrpcRouter>({
    links: [
      httpBatchLink({
        url: new URL("/trpc", apiUrl).toString(),
        fetch(url, options) {
          return fetch(url, {
            ...options,
            headers: token
              ? {
                  authorization: `Bearer ${token}`,
                }
              : undefined,
          })
        },
      }),
    ],
  })
})
