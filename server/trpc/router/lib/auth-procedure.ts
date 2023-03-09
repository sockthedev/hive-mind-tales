import { Auth } from "~/server/domain/auth"

import { t } from "./builder"

const authMiddleware = t.middleware(async ({ next }) => {
  await Auth.useApiAuthentication()
  return next()
})

export const authProcedure = t.procedure.use(authMiddleware)
