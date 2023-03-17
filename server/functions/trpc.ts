import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda"
import { Handler } from "sst/context"

import { createContext, router } from "~/server/trpc"

const trpcHandler = awsLambdaRequestHandler({
  router,
  createContext,
  onError: ({ error }) => {
    // eslint-disable-next-line no-console
    console.error(error)
  },
  responseMeta: ({ ctx }) => {
    return {
      headers: ctx?.response.headers,
    }
  },
})

export const handler = Handler("api", trpcHandler)
