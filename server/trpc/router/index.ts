import { t } from "./lib/builder"
import { stories } from "./stories"
import { users } from "./users"

export const router = t.router({
  stories,
  users,
})

export type Router = typeof router
