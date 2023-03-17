import sanitizeHtml from "sanitize-html"
import invariant from "tiny-invariant"
import { ulid } from "ulid"

import { StoriesValidation } from "~/lib/stories-validation"
import { db } from "~/server/db/db"
import type { Part, Story } from "~/server/db/db.types"
import { Auth } from "~/server/domain/auth"
import {
  InvalidArgumentError,
  UnauthorizedError,
  ValidationError,
} from "~/server/domain/errors"
import { dbNow } from "~/server/domain/lib/dates"
import type {
  StoryNode,
  StoryThread,
  StoryTree,
} from "~/server/domain/stories.types"

export abstract class Stories {
  // Gets all the parts of a story
  private static async getParts(args: { storyId: string }): Promise<Part[]> {
    // TODO:
    // - Remove Stories.and refactor all consumers to use more optimised queries
    return db
      .selectFrom("part")
      .where("storyId", "=", args.storyId)
      .orderBy("partId", "asc")
      .selectAll()
      .execute()
  }

  static async addPart(args: {
    storyId: string
    parentId: string
    content: string
  }): Promise<Part> {
    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    const parentPart = await Stories.getPart({ partId: args.parentId })
    if (!parentPart) {
      throw new InvalidArgumentError("Parent part not found")
    }

    const purifiedContent = sanitizeHtml(args.content, {
      allowedTags: ["b", "i", "em", "s", "strong", "p", "br"],
      allowedAttributes: {
        p: ["class"],
      },
    })

    if (!StoriesValidation.isValidContentLength(args.content)) {
      throw new ValidationError("Content is too long")
    }

    const part: Part = {
      partId: ulid(),
      createdBy: authContext.user.userId,
      content: purifiedContent,
      createdAt: dbNow(),
      storyId: args.storyId,
      parentId: parentPart.partId,
    }

    await db.insertInto("part").values(part).execute()

    return part
  }

  static async create(args: {
    title: string
    content: string
    visibleInFeeds: boolean
  }): Promise<{ story: Story; part: Part }> {
    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    const purifiedContent = sanitizeHtml(args.content, {
      allowedTags: ["b", "i", "em", "s", "strong", "p", "br"],
      allowedAttributes: {
        p: ["class"],
      },
    })

    if (!StoriesValidation.isValidContentLength(args.content)) {
      throw new ValidationError("Content is too long")
    }

    const storyId = ulid()
    const rootPartId = ulid()

    const story: Story = {
      storyId,
      title: args.title,
      rootPartId,
      createdAt: dbNow(),
      createdBy: authContext.user.userId,
    }

    const part: Part = {
      partId: rootPartId,
      createdBy: authContext.user.userId,
      content: purifiedContent,
      createdAt: dbNow(),
      storyId,
      parentId: null,
    }

    try {
      await db
        .transaction()
        .setIsolationLevel("read uncommitted")
        .execute(async (trx) => {
          await trx.insertInto("story").values(story).execute()
          await trx.insertInto("part").values(part).execute()
        })
    } catch (error: any) {
      console.error(error)
      throw error
    }

    return {
      story,
      part,
    }
  }

  static async getStory(args: { storyId: string }): Promise<Story> {
    return db
      .selectFrom("story")
      .where("storyId", "=", args.storyId)
      .selectAll()
      .executeTakeFirstOrThrow()
  }

  static async getPart(args: { partId: string }): Promise<Part> {
    return db
      .selectFrom("part")
      .where("partId", "=", args.partId)
      .selectAll()
      .executeTakeFirstOrThrow()
  }

  static async getPartOrRootPart(args: {
    storyId: string
    partId?: string
  }): Promise<Part> {
    const story = await Stories.getStory(args)
    const part = await Stories.getPart({
      partId: args.partId ?? story.rootPartId,
    })
    return part
  }

  // Gets a breadcrumb of story parts from the root to the target left part.
  // If the leaf part is not specified, then only the root part is returned
  // within the breadcrumb.
  static async getThread(args: {
    storyId: string
    threadEndPartId?: string
  }): Promise<StoryThread> {
    // TODO:
    // - Utilise a recursive query to get Stories.from the database
    // - https://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query

    const parts = await Stories.getParts(args)

    const breadcrumb: Part[] = []

    const findParent = (partId: string) => {
      const part = parts.find((part) => part.partId === partId)
      invariant(part, `Could not find part with id ${partId}`)
      breadcrumb.push(part)
      if (part.parentId) {
        findParent(part.parentId)
      }
    }

    findParent(args.threadEndPartId ?? parts[0].partId)

    return breadcrumb.reverse()
  }

  // Gets a tree representation of all the parts for a story.
  static async getTree(args: { storyId: string }): Promise<StoryTree> {
    const parts = await db
      .selectFrom("part")
      .where("storyId", "=", args.storyId)
      .orderBy("partId", "asc")
      .select(["partId", "parentId", "createdBy"])
      .execute()

    const rootItem = parts.find((part) => part.parentId == null)
    invariant(rootItem, "No root part found")

    const rootNode: StoryNode = {
      partId: rootItem.partId,
      parentId: null,
      createdBy: rootItem.createdBy,
      children: [],
    }

    const nodeMap = new Map<string, StoryNode>()
    nodeMap.set(rootNode.partId, rootNode)

    // Note: Stories.only works if parts are in ascending order
    parts.forEach((part) => {
      if (part === rootItem) return

      invariant(part.parentId, "Multiple root nodes found")

      const node: StoryNode = {
        partId: part.partId,
        createdBy: part.createdBy,
        children: [],
        parentId: part.parentId,
      }

      nodeMap.set(part.partId, node)

      const parentNode = nodeMap.get(part.parentId)
      if (parentNode) {
        parentNode.children = parentNode.children || []
        parentNode.children.push(node)
      }
    })

    return rootNode
  }

  static async getMyStories() {
    const authContext = Auth.useAuthContext()

    if (authContext.isAnonymous()) {
      throw new UnauthorizedError()
    }

    const stories = await db
      .selectFrom("story as s")
      .innerJoin("part as p", "p.partId", "s.rootPartId")
      .where("s.createdBy", "=", authContext.user.userId)
      .select(["s.storyId", "s.title", "s.rootPartId", "p.content"])
      .orderBy("s.createdAt", "desc")
      .execute()

    return stories
  }
}
