import { t } from "./lib/builder"
import { users } from "./users"

export const router = t.router({
  users,
})

export type Router = typeof router
