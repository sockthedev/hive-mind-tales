import { createCookie } from "@remix-run/node";
import { createTypedCookie } from "remix-utils";
import { z } from "zod";

const schema = z.object({
  type: z.literal("create-story"),
  payload: z.object({
    title: z.string(),
    content: z.string(),
    visibleInFeeds: z.boolean(),
  })
})

const cookie = createCookie("loginAction", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
});

const typedCookie = createTypedCookie({ cookie, schema });

export async function createLoginActionCookie(type: 'create-story', payload: { title: string; content: string; visibleInFeeds: boolean }) {
  const cookie = await typedCookie.serialize({
    type,
    payload,
  });
  return cookie
}

export async function parseLoginActionCookie(request: Request) {
  let loginAction = await typedCookie.parse(request.headers.get("Cookie"));
  return loginAction
}
