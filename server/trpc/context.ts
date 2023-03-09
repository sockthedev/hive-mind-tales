import type {
  APIGatewayProxyEventV2,
  Context as APIGWContext,
} from "aws-lambda"

export type LambdaContext = {
  event: APIGatewayProxyEventV2
  context: APIGWContext
}

// Note: The context is created for each request;
export function createContext({ event, context }: LambdaContext): Context {
  // Returning an empty context currently;
  return {
    event,
    context,
    response: {
      headers: {},
    },
  }
}

export type Context = {
  event: APIGatewayProxyEventV2
  context: APIGWContext
  response: {
    headers: Record<string, string>
  }
}
