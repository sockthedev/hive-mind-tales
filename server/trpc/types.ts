// We isolate the imports/exports of this module to types only so that the site
// can import the types without importing the entire router.

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

import type { Router } from "./router"

export type TrpcRouter = Router

export type TrpcInputs = inferRouterInputs<TrpcRouter>
export type TrpcOutputs = inferRouterOutputs<TrpcRouter>
