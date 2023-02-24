import {
  hierarchy,
  HierarchyPointLink,
  HierarchyPointNode,
  tree as d3tree,
} from "d3-hierarchy"
import invariant from "tiny-invariant"
import { StoryNode, StoryTree } from "~/domain/stories"
import { config } from "./config"

function findNode(args: {
  nodes: StoryNavigatorNode[]
  storyPartId: string
}): StoryNavigatorNode | null {
  return args.nodes.find((node) => node.data.id === args.storyPartId) ?? null
}

export function createNavigatorData(args: {
  tree: StoryTree
  activePartId: string
}): StoryNavigatorData {
  const d3Tree = d3tree<StoryNode>()
    .nodeSize([config.nodeSize.x, config.nodeSize.y])
    .separation((a, b) =>
      a.parent?.data.id === b.parent?.data.id
        ? config.separation.siblings
        : config.separation.nonSiblings,
    )

  const rootNode = d3Tree(hierarchy(args.tree, (d) => d.children))
  const nodes = rootNode.descendants()
  const links = rootNode.links()

  const thread: StoryNavigatorNode[] = []
  let currentNode = findNode({ nodes, storyPartId: args.activePartId })
  invariant(currentNode, "Could not find active node in tree")
  thread.push(currentNode)
  while (currentNode.data.parentStoryPartId) {
    const parentNode = findNode({
      nodes,
      storyPartId: currentNode.data.parentStoryPartId,
    })
    invariant(parentNode, "Could not node in tree")
    thread.push(parentNode)
    currentNode = parentNode
  }
  thread.reverse()

  return { nodes, links, thread }
}

export type StoryNavigatorNode = HierarchyPointNode<StoryNode>

export type StoryNavigatorLink = HierarchyPointLink<StoryNode>

export type StoryNavigatorData = {
  nodes: StoryNavigatorNode[]
  links: StoryNavigatorLink[]
  thread: StoryNavigatorNode[]
}
