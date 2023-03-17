import { Users } from "~/server/domain/users"

import { t } from "./lib/builder.js"
import { authProcedure } from "./middleware/auth-procedure.js"

export const users = t.router({
  logout: authProcedure.mutation(({ ctx }) => {
    ctx.response.headers["Set-Cookie"] =
      "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    return "👋"
  }),
  me: authProcedure.query(async () => {
    return Users.getMe()
  }),
})
