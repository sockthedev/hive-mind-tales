import { Users } from "~/domain/users"

import { authProcedure } from "./lib/auth-procedure.js"
import { t } from "./lib/builder.js"

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
