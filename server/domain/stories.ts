import sanitizeHtml from "sanitize-html"
import invariant from "tiny-invariant"
import { ulid } from "ulid"
import { db } from "~/db/db.server"
import { Part, Story } from "~/db/db.types"
import { ValidationError } from "./errors.server"
import { dbNow } from "./lib/dates"
import { StoriesValidation } from "./stories-validation"

export type StoryNode = Omit<Part, "content" | "createdAt" | "storyId"> & {
  children: StoryTree[]
}

export type StoryTree = StoryNode

export type StoryThread = Part[]

export abstract class Stories {
  // Gets all the parts of a story
  private static async getParts(args: { storyId: string }): Promise<Part[]> {
    // TODO:
    // - Remove this and refactor all consumers to use more optimised queries
    return db
      .selectFrom("part")
      .where("storyId", "=", args.storyId)
      .orderBy("partId", "asc")
      .selectAll()
      .execute()
  }

  static async create(args: {
    title: string
    content: string
    createdBy: string
    visibleInFeeds: boolean
  }): Promise<{ story: Story; part: Part }> {
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
      createdBy: args.createdBy,
    }

    const part: Part = {
      partId: ulid(),
      createdBy: args.createdBy,
      content: purifiedContent,
      createdAt: dbNow(),
      storyId,
      parentPartId: null,
    }

    await db
      .transaction()
      .setIsolationLevel("read uncommitted")
      .execute(async (trx) => {
        await trx.insertInto("story").values(story).execute()
        await trx.insertInto("part").values(part).execute()
      })

    return Promise.resolve({
      story,
      part,
    })
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
    const story = await this.getStory(args)
    const part = await this.getPart({
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
    // - Utilise a recursive query to get this from the database
    // - https://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query

    const parts = await this.getParts(args)

    const breadcrumb: Part[] = []

    const findParent = (partId: string) => {
      const part = parts.find((part) => part.partId === partId)
      invariant(part, `Could not find part with id ${partId}`)
      breadcrumb.push(part)
      if (part.parentPartId) {
        findParent(part.parentPartId)
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
      .select(["partId", "parentPartId", "createdBy"])
      .execute()

    const rootItem = parts.find((part) => part.parentPartId == null)
    invariant(rootItem, "No root part found")

    const rootNode: StoryNode = {
      partId: rootItem.partId,
      parentPartId: null,
      createdBy: rootItem.createdBy,
      children: [],
    }

    const nodeMap = new Map<string, StoryNode>()
    nodeMap.set(rootNode.partId, rootNode)

    // Note: this only works if parts are in ascending order
    parts.forEach((part) => {
      if (part === rootItem) return

      invariant(part.parentPartId, "Multiple root nodes found")

      const node: StoryNode = {
        partId: part.partId,
        createdBy: part.createdBy,
        children: [],
        parentPartId: part.parentPartId,
      }

      nodeMap.set(part.partId, node)

      const parentNode = nodeMap.get(part.parentPartId)
      if (parentNode) {
        parentNode.children = parentNode.children || []
        parentNode.children.push(node)
      }
    })

    return rootNode
  }
}
