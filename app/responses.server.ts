import { redirect } from "@remix-run/node"

export function methodNotAllowed() {
  return redirect(`/errors/method-not-allowed`, {
    status: 405,
  })
}

export function notFound() {
  return new Response("Not found", {
    status: 404,
  })
}

export function unauthorized() {
  return redirect(`/errors/unauthorized`, {
    status: 401,
  })
}
