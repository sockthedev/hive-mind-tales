import invariant from "tiny-invariant"
import { StoryPart, StoryTree } from "./types"

export function convertStoryPartsToTree(storyData: StoryPart[]): StoryTree {
  invariant(storyData.length > 0, "Story data must have at least one item")
  const root = storyData[0]
  const extractNodes = (
    parentId: string,
    storyData: StoryPart[],
  ): StoryTree[] => {
    const children = storyData.filter(
      (part) => part.parentStoryPart === parentId,
    )
    return children.map<StoryTree>((child) => ({
      ...child,
      children: extractNodes(child.id, storyData),
    }))
  }
  const tree: StoryTree = {
    ...root,
    children: extractNodes(root.id, storyData),
  }
  return tree
}

export function resolvePartPath({
  tree,
  part,
}: {
  tree: StoryTree
  part: string
}): string[] {
  const path: string[] = []
  let current = tree
  while (current.id !== part) {
    path.push(current.id)
    const next = current.children.find((child) => child.id === part)
    invariant(next, "Part not found in tree")
    current = next
  }
  return path
}
