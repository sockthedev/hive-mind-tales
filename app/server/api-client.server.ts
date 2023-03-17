import { redirect } from "@remix-run/node"
import {
  createTRPCProxyClient,
  httpBatchLink,
  TRPCClientError,
} from "@trpc/client"
import memoizeOne from "memoize-one"
import { serverError, unauthorized } from "remix-utils"
import invariant from "tiny-invariant"

import type { TrpcRouter } from "~/server/trpc/types"

import type { LoginAction } from "./login-action.server"
import {
  createLoginActionCookie,
  createRedirectAction,
} from "./login-action.server"
import { getToken } from "./session.server"

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

type TrpcClient = ReturnType<typeof trpc>

export async function apiClient<
  Thunk extends (client: TrpcClient) => any,
>(args: {
  request: Request
  thunk: Thunk
  auth?: boolean
  loginAction?: LoginAction
}): Promise<
  Thunk extends (client: TrpcClient) => Promise<infer Result> ? Result : never
> {
  let token: string | undefined = undefined
  if (args.auth) {
    token = await getToken(args.request)
    if (!token) {
      throw redirect("/login", {
        headers: {
          "Set-Cookie": await createLoginActionCookie(
            args.loginAction
              ? args.loginAction
              : createRedirectAction({
                  url: new URL(args.request.url).pathname,
                }),
          ),
        },
        status: 302,
      })
    }
  }
  const client = trpc(token)
  try {
    const result = await args.thunk(client)
    return result
  } catch (err: any) {
    if (err instanceof TRPCClientError) {
      if (err.data.code === "UNAUTHORIZED") {
        throw redirect("/login", {
          headers: {
            "Set-Cookie": await createLoginActionCookie(
              args.loginAction
                ? args.loginAction
                : createRedirectAction({
                    url: new URL(args.request.url).pathname,
                  }),
            ),
          },
          status: 302,
        })
      } else if (err.data.code === "FORBIDDEN") {
        throw unauthorized({ message: err.data.message })
      }
    }
    throw serverError(
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
    )
  }
}
