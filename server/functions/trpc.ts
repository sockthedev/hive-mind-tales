import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda"
import { Handler } from "sst/context"
import { createContext, router } from "~/server/trpc"

const trpcHandler = awsLambdaRequestHandler({
  router,
  createContext,
  responseMeta: ({ ctx }) => {
    return {
      headers: ctx?.response.headers,
    }
  },
})

export const handler = Handler("api", trpcHandler)
