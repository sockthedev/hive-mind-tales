import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth"
import { Config } from "sst/node/config"
import invariant from "tiny-invariant"

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string
      type: "user" | "admin"
    }
  }
}

// @ts-ignore
const GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID

invariant(process.env.SITE_URL, "SITE_URL is required")
const SITE_URL = process.env.SITE_URL

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID: GOOGLE_CLIENT_ID,
      onSuccess: async (tokenset) => {
        const claims = tokenset.claims()

        // const ddb = new DynamoDBClient({})
        // await ddb.send(
        //   new PutItemCommand({
        //     TableName: Table.users.tableName,
        //     Item: marshall({
        //       userId: claims.sub,
        //       email: claims.email,
        //       picture: claims.picture,
        //       name: claims.given_name,
        //     }),
        //   }),
        // )

        return Session.parameter({
          redirect: SITE_URL,
          type: "user",
          properties: {
            userID: claims.sub,
            type: "user",
          },
        })
      },
    }),
  },
})
