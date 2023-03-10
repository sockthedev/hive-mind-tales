import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { createDecoder } from "fast-jwt"
import * as zod from "zod"
import { unauthorized } from "./responses.server"

const decodeJwt = createDecoder()

const sessionDataSchema = zod.object({
  userId: zod.string(),
  userType: zod.enum(["user", "admin"]),
})

const tokenSchema = zod.object({
  type: zod.literal("user"),
  properties: sessionDataSchema,
  iat: zod.number(),
})

export type SessionData = zod.infer<typeof sessionDataSchema>

function parseToken(token: string): SessionData | null {
  const decodedToken = decodeJwt(token)
  if (typeof decodedToken !== "object") {
    return null
  }
  const parseResult = tokenSchema.safeParse(decodedToken)
  return parseResult.success ? parseResult.data.properties : null
}

// TODO:
// - Make this an .env variable;
const SESSION_SECRET = "you-will-never-know"

const SESSION_TOKEN_KEY = "token"

const SESSION_USER_DATA_KEY = "userData"

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
})

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return sessionStorage.getSession(cookie)
}

export async function createSession({
  request,
  token,
  remember,
  redirectTo,
}: {
  request: Request
  token: string
  remember: boolean
  redirectTo: string
}) {
  const tokenData = parseToken(token)
  if (tokenData == null) {
    throw unauthorized()
  }

  const session = await getSession(request)
  session.set(SESSION_USER_DATA_KEY, tokenData)

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? // TODO: Need a config to keep this in sync with token expiry, or
            // we can extract the expiry date from the token and use that against
            // the cookie.
            60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  })
}

export async function getSessionData(
  request: Request,
): Promise<SessionData | undefined> {
  const session = await getSession(request)
  return session.get(SESSION_USER_DATA_KEY)
}

export async function requireSessionData(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const user = await getSessionData(request)
  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return user
}

export async function getToken(request: Request): Promise<string | undefined> {
  const session = await getSession(request)
  return session.get(SESSION_TOKEN_KEY)
}

export async function requireToken(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const token = await getToken(request)
  if (!token) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return token
}

export async function logout(request: Request) {
  const session = await getSession(request)
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  })
}
