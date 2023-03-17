import pRetry, { AbortError } from "p-retry"
import { ulid } from "ulid"

import { db } from "~/server/db/db"
import type { DB } from "~/server/db/db.types"
import { Dates } from "~/server/lib/dates"
import { Validators } from "~/server/lib/validators.js"

import { getRandomItemFromArray } from "../lib/arrays"
import { getRandomInt } from "../lib/numbers"
import { Auth } from "./auth"
import {
  ForbiddenError,
  InternalError,
  InvalidArgumentError,
  UnauthorizedError,
} from "./errors.js"
import { animals } from "./lib/animals"

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
    const randomAnimal: string = getRandomItemFromArray(animals)
    const randomNumber: number = getRandomInt(0, 99999)
    // Note: there is a maximum of 22 million variations for this
    const username = `${randomAnimal}${randomNumber}`
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

  public static async getUsername(args: { userId: string }) {
    const user = await db
      .selectFrom("user")
      .select("username")
      .where("userId", "=", args.userId)
      .executeTakeFirst()

    if (user == null) {
      throw new InvalidArgumentError("User does not exist")
    }
    return user.username
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
      throw new ForbiddenError()
    }

    if (authContext.isUser() && !authContext.isMe(userToUpdate)) {
      throw new ForbiddenError()
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

  public static async updateMyUsername(args: {
    username: string
  }): Promise<User> {
    const authContext = Auth.useAuthContext()

    if (!authContext.isHuman()) {
      throw new ForbiddenError()
    }

    await db
      .updateTable("user")
      .set({
        username: args.username,
      })
      .where("userId", "=", authContext.user.userId)
      .execute()

    const updatedUser = await db
      .selectFrom("user")
      .where("userId", "=", authContext.user.userId)
      .selectAll()
      .executeTakeFirst()

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
