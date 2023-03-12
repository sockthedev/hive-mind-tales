import { createVerifier } from "fast-jwt"
import { Context } from "sst/context"
import type { SessionValue } from "sst/node/auth"
import { getPublicKey, useSession } from "sst/node/auth"
import { db } from "~/server/db/db"
import { Dates } from "~/server/lib/dates.js"
import { InternalError, UnauthorizedError } from "./errors.js"
import type { User } from "./users"
import { UserType } from "./users"

const AnonymousActor: User = {
  userId: UserType.Anonymous,
  userType: UserType.Anonymous,
  createdAt: "2022-09-19T22:48:01Z",
  email: `${UserType.Anonymous}@hivemindtales.com`,
  twitterId: null,
  googleId: null,
  username: UserType.Anonymous,
}

export const SystemActor: User = {
  userId: UserType.System,
  userType: UserType.System,
  email: `${UserType.System}@hivemindtales.com`,
  createdAt: Dates.nowISO8601(),
  username: UserType.System,
  twitterId: null,
  googleId: null,
}

const AuthContext = Context.create<User>(() => AnonymousActor)

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userId: string
      userType: string
    }
  }
}

export abstract class Auth {
  /**
   * Performs authorization against an API Gateway V2 request, configuring the
   * auth context with the authenticated user.
   *
   * @returns - The authenticated actor user or null
   *
   * @throws
   *
   * `UnauthorizedError`
   *
   * If the user session contains an invalid user type.
   */
  public static async useApiAuthentication() {
    const session = useSession()

    if (session.type === "user") {
      const user = await db
        .selectFrom("user")
        .where("userId", "=", session.properties.userId)
        .selectAll()
        .executeTakeFirst()

      if (user != null) {
        if (
          user.userType !== UserType.User &&
          user.userType !== UserType.Admin
        ) {
          throw new UnauthorizedError("Invalid user type for API authorization")
        }

        AuthContext.provide(user)
      }

      return user
    } else {
      AuthContext.provide(AnonymousActor)
      return null
    }
  }

  /**
   * Use this to set up authorization for a System based process. e.g. a bus event
   * handler etc.
   */
  public static useSystemAuthentication() {
    AuthContext.provide(SystemActor)
  }

  public static async parseToken(args: { token: string }) {
    // TODO: This was copied from the SST Auth module. Dax said he will lift it
    // into a separate utility for reuse;
    const jwt = createVerifier({
      algorithms: ["RS512"],
      key: getPublicKey(),
    })(args.token) as SessionValue

    if (jwt.type === "public") {
      throw new InternalError("Invalid token")
    }

    return db
      .selectFrom("user")
      .where("userId", "=", jwt.properties.userId)
      .selectAll()
      .executeTakeFirst()
  }

  /**
   * Authenticates the actor based on the given token, configuring the auth
   * context with the authenticated actor.
   *
   * @param token The token.
   *
   * @returns The authenticated actor
   */
  public static async useTokenAuthentication(args: { token: string }) {
    const actor = await this.parseToken(args)

    if (actor == null) {
      throw new InternalError(`Failed to get actor for token`)
    }

    AuthContext.provide(actor)
  }

  /**
   * Gets the current authenticated Actor.
   *
   * @returns The current authenticated Actor, or null.
   */
  public static useAuthContextActor() {
    return AuthContext.use()
  }

  public static useAuthContext() {
    const user = AuthContext.use()

    return {
      user,
      isAnonymous() {
        return user.userType === UserType.Anonymous
      },
      isAdmin() {
        return user.userType === UserType.Admin
      },
      isUser() {
        return user.userType === UserType.User
      },
      isHuman() {
        return (
          user.userType === UserType.User || user.userType === UserType.Admin
        )
      },
      isSystem() {
        return user.userType === UserType.System
      },
      isMe(otherActor: User | string) {
        if (typeof otherActor === "string") {
          return user.userType === otherActor
        }
        return user.userType === otherActor.userType
      },
    }
  }
}
