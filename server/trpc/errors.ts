import { TRPCError } from "@trpc/server"

export function badRequest(message = "Bad request") {
  return new TRPCError({
    message,
    code: "BAD_REQUEST",
  })
}

export function notAuthorized(message = "Not authorized") {
  return new TRPCError({
    message,
    code: "UNAUTHORIZED",
  })
}
