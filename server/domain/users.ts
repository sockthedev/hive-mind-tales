import pRetry, { AbortError } from "p-retry"
import { ulid } from "ulid"
import { db } from "~/server/db/db"
import type { DB } from "~/server/db/db.types"
import { Dates } from "~/server/lib/dates"
import { Numbers } from "~/server/lib/numbers.js"
import { Validators } from "~/server/lib/validators.js"
import { Auth } from "./auth"
import {
  InternalError,
  InvalidArgumentError,
  UnauthorizedError,
} from "./errors.js"

export type User = DB["user"]

export enum UserType {
  Anonymous = "anonymous",
  User = "user",
  Admin = "admin",
  System = "system",
}

const MAX_USERNAME_LENGTH = 15

const USERNAME_REGEX = /^[a-z0-9]+$/

export abstract class Users {
  private static async generateUsername() {
    const username = `rando${Numbers.getRandomInt(1000000000, 9999999999)}`
    const exists = await Users.getByUsername({ username })
    if (exists) {
      return null
    }
    return username
  }

  private static async runGenerateUsername() {
    const username = await Users.generateUsername()
    if (username == null) {
      throw new AbortError("Failed to generate a unique username")
    }
    return username
  }

  public static async get(args: { actorId: string }): Promise<User | null> {
    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    const actor = await db
      .selectFrom("user")
      .selectAll()
      .where("userId", "=", args.actorId)
      .executeTakeFirst()

    if (!actor) {
      return null
    }

    if (authContext.isUser() && !authContext.isMe(actor)) {
      throw new UnauthorizedError()
    }

    return actor
  }

  public static getMe(): User {
    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    return authContext.user
  }

  public static async getByUsername(args: {
    username: string
  }): Promise<User | null> {
    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    const user = await db
      .selectFrom("user")
      .selectAll()
      .where("username", "=", args.username)
      .executeTakeFirst()

    if (!user) {
      return null
    }

    if (authContext.isUser() && !authContext.isMe(user)) {
      throw new UnauthorizedError()
    }

    return user
  }

  public static async getByEmail(args: {
    email: string
  }): Promise<User | null> {
    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    const actor = await db
      .selectFrom("user")
      .selectAll()
      .where("email", "=", args.email)
      .executeTakeFirst()

    if (!actor) {
      return null
    }

    if (authContext.isUser() && !authContext.isMe(actor)) {
      throw new UnauthorizedError()
    }

    return actor
  }

  private static validateUsername(args: { username: string }) {
    if (
      args.username === UserType.System ||
      args.username === UserType.Anonymous ||
      args.username === UserType.Admin ||
      args.username === UserType.User
    ) {
      throw new InvalidArgumentError("Invalid username")
    }

    if (args.username.length > MAX_USERNAME_LENGTH) {
      throw new InvalidArgumentError("Username is too long")
    }

    if (!USERNAME_REGEX.test(args.username)) {
      throw new InvalidArgumentError("Invalid username")
    }
  }

  public static async setUsername(args: {
    actorId: string
    username: string
  }): Promise<User> {
    Users.validateUsername(args)

    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    const userToUpdate = await Users.get(args)

    if (userToUpdate == null) {
      throw new InvalidArgumentError("User does not exist")
    }

    if (userToUpdate.userType === UserType.System) {
      throw new UnauthorizedError()
    }

    if (authContext.isUser() && !authContext.isMe(userToUpdate)) {
      throw new UnauthorizedError()
    }

    await db
      .updateTable("user")
      .set({
        username: args.username,
      })
      .where("userId", "=", args.actorId)
      .execute()

    const updatedUser = await Users.get(args)

    if (updatedUser == null) {
      throw new InternalError("Expected user to exist")
    }

    return updatedUser
  }

  public static async signUp(args: {
    username: string
    email: string
  }): Promise<User> {
    Users.validateUsername(args)

    if (!Validators.isEmail(args.email)) {
      throw new InvalidArgumentError("Invalid email")
    }

    const userId = ulid()
    const lowercaseEmail = args.email.toLowerCase()

    await db
      .insertInto("user")
      .values({
        ...args,
        userId,
        userType: lowercaseEmail.endsWith("@ctrlplusb.com")
          ? UserType.Admin
          : UserType.User,
        email: lowercaseEmail,
        createdAt: Dates.nowISO8601(),
      })
      .execute()

    const user = await Users.get({ actorId: userId })

    if (user == null) {
      throw new InternalError("Actor does not exist")
    }

    return user
  }

  public static async signUpWithGeneratedUsername(args: {
    email: string
  }): Promise<User> {
    const username = await pRetry(Users.runGenerateUsername, { retries: 10 })
    return Users.signUp({ ...args, username })
  }
}
