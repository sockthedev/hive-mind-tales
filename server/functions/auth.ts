import { AuthHandler, GoogleAdapter, LinkAdapter, Session } from "sst/node/auth"
import { Config } from "sst/node/config"
import invariant from "tiny-invariant"

import { Auth } from "~/server/domain/auth"
import { Bus } from "~/server/domain/event-bus"
import { Users } from "~/server/domain/users"

async function handleSuccess(args: { email: string }) {
  Auth.useSystemAuthentication()

  invariant(args.email != null, 'Expected "email" to be defined')

  let user = await Users.getByEmail({ email: args.email })
  let isFirstLogin = false
  if (user == null) {
    // This is the first time this user is logging in. We need to create
    // a user account for them. We'll generate a username for them, but
    // the UI should invite them to configure their own.
    user = await Users.signUpWithGeneratedUsername({ email: args.email })
    isFirstLogin = true
  }

  const token = Session.create({
    type: "user",
    properties: {
      userId: user.userId,
      userType: user.userType,
    },
  })

  return {
    statusCode: 302,
    headers: {
      location: `${
        Config.SITE_URL
      }/login/sso-callback?isFirstLogin=${isFirstLogin.toString()}&token=${token}`,
    },
  }
}

export const handler = AuthHandler({
  providers: {
    link: LinkAdapter({
      async onLink(link, claims) {
        const email = claims["email"]
        invariant(email != null, 'Expected "email" to be defined')

        await Bus.publish({
          type: "send-magic-link",
          properties: {
            email: claims["email"],
            link,
          },
        })
        return {
          statusCode: 302,
          headers: {
            location: `${Config.SITE_URL}/login/magic-link-sent`,
          },
        }
      },
      async onError() {
        return {
          statusCode: 302,
          headers: {
            location: `${Config.SITE_URL}/login/magic-link-failed`,
          },
        }
      },
      async onSuccess(claims) {
        const email = claims["email"]
        invariant(email != null, 'Expected "email" to be defined')

        return handleSuccess({ email })
      },
    }),
    google: GoogleAdapter({
      mode: "oidc",
      clientID: Config.GOOGLE_CLIENT_ID,
      onSuccess: async (tokenset) => {
        const email = tokenset.claims().email
        invariant(email != null, 'Expected "email" to be defined')

        return handleSuccess({ email })
      },
    }),
  },
})
