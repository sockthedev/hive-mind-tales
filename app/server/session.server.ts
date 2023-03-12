import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { createDecoder } from "fast-jwt"
import { unauthorized } from "remix-utils"
import * as zod from "zod"

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

export type SessionUser = zod.infer<typeof sessionDataSchema>


   function parseToken(token: string): SessionUser | null {
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

const SESSION_TOKEN_KEY = "userToken"

const SESSION_USER_DATA_KEY = "userData"

  export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "hmtSession",
    httpOnly: true,
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
})

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return sessionStorage.getSession(cookie)
}

export async function createSessionCookie({
  request,
  token,
}: {
  request: Request
  token: string
}) {
  const tokenData = parseToken(token)
  if (tokenData == null) {
    throw unauthorized({ token })
  }

  const session = await getSession(request)

  // Store the token and the user data in the session
  session.set(SESSION_TOKEN_KEY, token)
  session.set(SESSION_USER_DATA_KEY, tokenData)

  const cookie = await sessionStorage.commitSession(session, {
    // TODO: Need a config to keep this in sync with token expiry, or
    // we can extract the expiry date from the token and use that against
    // the cookie.
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return cookie
}

export async function getUser(
  request: Request,
): Promise<SessionUser | undefined> {
  const session = await getSession(request)
  return session.get(SESSION_USER_DATA_KEY)
}

export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const user = await getUser(request)
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

export async function createLogoutCookie(request: Request) {
  const session = await getSession(request)
  const cookie = await sessionStorage.destroySession(session)
  return cookie
}
