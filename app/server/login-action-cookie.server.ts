import { createCookie } from "@remix-run/node"
import { createTypedCookie } from "remix-utils"
import { z } from "zod"

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
      content: z.string(),
    }),
  }),
])

type Actions = z.infer<typeof actionsSchema>

type ActionType = Actions["type"]

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = Extract<
  T,
  Record<K, V>
>

type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>
}

type ActionMap = MapDiscriminatedUnion<Actions, "type">

const cookie = createCookie("loginAction", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
})

const typedCookie = createTypedCookie({ cookie, schema: actionsSchema })

export async function createLoginActionCookie<T extends ActionType>(
  type: T,
  payload: ActionMap[T]["payload"],
) {
  // @ts-ignore The type checking doesn't work here with the discrimated union
  // map, but I know it's working correctly, so ignoring.
  const cookie = await typedCookie.serialize({
    type,
    payload,
  })
  return cookie
}

export async function parseLoginActionCookie(request: Request) {
  let loginAction = await typedCookie.parse(request.headers.get("Cookie"))
  return loginAction
}
