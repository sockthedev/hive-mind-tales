import { createCookie } from "@remix-run/node"
import { createTypedCookie } from "remix-utils"
import { z } from "zod"

import type { MapDiscriminatedUnion } from "~/lib/type-magic"

const actionsSchema = z.union([
  z.object({
    type: z.literal("create-story"),
    payload: z.object({
      title: z.string(),
      content: z.string(),
      visibleInFeeds: z.boolean(),
    }),
  }),
  z.object({
    type: z.literal("create-part"),
    payload: z.object({
      storyId: z.string(),
      parentId: z.string(),
      content: z.string(),
    }),
  }),
  z.object({
    type: z.literal("redirect"),
    payload: z.object({
      url: z.string(),
    }),
  }),
])

export type LoginAction = z.infer<typeof actionsSchema>

type ActionMap = MapDiscriminatedUnion<LoginAction, "type">

const cookie = createCookie("loginAction", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
})

const typedCookie = createTypedCookie({ cookie, schema: actionsSchema })

export function createStoryAction(
  payload: ActionMap["create-story"]["payload"],
) {
  return {
    type: "create-story",
    payload,
  } as const
}

export function createPartAction(payload: ActionMap["create-part"]["payload"]) {
  return {
    type: "create-part",
    payload,
  } as const
}

export function createRedirectAction(
  payload: ActionMap["redirect"]["payload"],
) {
  return {
    type: "redirect",
    payload: payload,
  } as const
}

export async function createLoginActionCookie(action: LoginAction) {
  const cookie = await typedCookie.serialize(action)
  return cookie
}

export async function parseLoginActionCookie(request: Request) {
  let loginAction = await typedCookie.parse(request.headers.get("Cookie"))
  return loginAction
}
