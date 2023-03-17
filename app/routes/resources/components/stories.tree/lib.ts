import invariant from "tiny-invariant"
import type {
  Part,
  StoryNode,
  StoryThread,
  StoryTree,
} from "~/server/domain/stories.types"

export type EnhancedStoryThreadItem = {
  node: StoryNode
  part: Part
}

export type EnhancedStoryThread = EnhancedStoryThreadItem[]

// Gets a breadcrumb of story parts from the root to the target leaf part.
// If the leaf part is not specified, then only the root part is returned
// within the breadcrumb.
export function enhanceThread(args: {
  tree: StoryTree
  thread: StoryThread
}): EnhancedStoryThread {
  // TODO:
  // - Utilise a recursive query to get this from the database
  //   https://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query

  const enhancedThread: EnhancedStoryThread = []

  // Handle the root part
  let [part, ...otherParts] = args.thread
  let node = args.tree
  invariant(node.partId === part.partId, "Thread does not match tree")
  enhancedThread.push({ part, node })

  // Handle all the other parts
  while (otherParts.length > 0) {
    const [nextPart, ...remainingParts] = otherParts
    const nextNode = node.children.find(
      (child) => child.partId === nextPart.partId,
    )
    invariant(nextNode, "Thread does not match tree")
    enhancedThread.push({ part: nextPart, node: nextNode })
    node = nextNode
    otherParts = remainingParts
  }

  return enhancedThread
}
