import { TRPCError } from "@trpc/server"

import { Auth } from "~/server/domain/auth"
import { ForbiddenError, UnauthorizedError } from "~/server/domain/errors"

import { t } from "../lib/builder"

const authMiddleware = t.middleware(async ({ next }) => {
  const authResult = await Auth.useApiAuthentication()
  if (authResult instanceof ForbiddenError) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: authResult.message,
    })
  }
  if (authResult instanceof UnauthorizedError) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: authResult.message,
    })
  }
  return next()
})

export const authProcedure = t.procedure.use(authMiddleware)
