import invariant from "tiny-invariant"

export type StoryPart = {
  id: string
  content: string
  author: string
  parentStoryPartId?: string
}

export type StoryNode = Omit<StoryPart, "content"> & {
  children: StoryTree[]
}

export type StoryTree = StoryNode

export type StoryThread = StoryPart[]

export abstract class Stories {
  // Gets all the parts of a story
  private static async getParts(args: {
    storyId: string
  }): Promise<StoryPart[]> {
    // TODO:
    // - Convert this to a database call
    // - This is just returning mock data for now
    return [
      {
        id: "1",
        content: "<p>Story content goes here.</p>",
        author: "janedoe",
      },
      {
        id: "2",
        content: "<p>Second piece of story content goes here.</p>",
        author: "johndoe",
        parentStoryPartId: "1",
      },
      {
        id: "3",
        content: "<p>Second alt piece of story content goes here.</p>",
        author: "pling",
        parentStoryPartId: "1",
      },
      {
        id: "4",
        content: "<p>Third piece of story content goes here.</p>",
        author: "pling",
        parentStoryPartId: "2",
      },
      {
        id: "5",
        content: "<p>Fourth piece of story content goes here.</p>",
        author: "pling",
        parentStoryPartId: "4",
      },
      {
        id: "6",
        content: "<p>Third piece of story content goes here.</p>",
        author: "pling",
        parentStoryPartId: "3",
      },
    ]
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

    const breadcrumb: StoryPart[] = []

    const findParent = (partId: string) => {
      const part = parts.find((part) => part.id === partId)
      invariant(part, `Could not find part with id ${partId}`)
      breadcrumb.push(part)
      if (part.parentStoryPartId) {
        findParent(part.parentStoryPartId)
      }
    }

    findParent(args.threadEndPartId ?? parts[0].id)

    return breadcrumb.reverse()
  }

  // Gets a tree representation of all the parts for a story.
  static async getTree(args: { storyId: string }): Promise<StoryTree> {
    // TODO:
    // - Change this to a database call that just gets the minimum amount of data required to build the tree
    const parts = await this.getParts(args)

    const rootItem = parts.find((part) => part.parentStoryPartId == null)
    invariant(rootItem, "No root part found")

    const rootNode: StoryNode = {
      id: rootItem.id,
      author: rootItem.author,
      children: [],
    }

    const nodeMap = new Map<string, StoryNode>()
    nodeMap.set(rootNode.id, rootNode)

    // Note: this only works if parts are in ascending order
    parts.forEach((part) => {
      if (part === rootItem) return

      invariant(part.parentStoryPartId, "Multiple root nodes found")

      const node: StoryNode = {
        id: part.id,
        author: part.author,
        children: [],
        parentStoryPartId: part.parentStoryPartId,
      }

      nodeMap.set(part.id, node)

      const parentNode = nodeMap.get(part.parentStoryPartId)
      if (parentNode) {
        parentNode.children = parentNode.children || []
        parentNode.children.push(node)
      }
    })

    return rootNode
  }
}
