import { z } from "zod"

import { Users } from "~/server/domain/users"

import { t } from "./lib/builder.js"
import { authProcedure } from "./middleware/auth-procedure.js"

export const users = t.router({
  // Mutations
  logout: authProcedure.mutation(({ ctx }) => {
    ctx.response.headers["Set-Cookie"] =
      "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    return "👋"
  }),

  updateMyUsername: authProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input }) => {
      const { username } = input
      return Users.updateMyUsername({ username })
    }),

  // Queries
  me: authProcedure.query(async () => {
    return Users.getMe()
  }),

  username: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input
      return Users.getUsername({ userId })
    }),
})
