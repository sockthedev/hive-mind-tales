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
      name: child.author,
      children: extractNodes(child.id, storyData),
    }))
  }
  const tree: StoryTree = {
    ...root,
    children: extractNodes(root.id, storyData),
  }
  return tree
}

export function resolveBreadcrumb({
  storyParts,
  leafPartId,
}: {
  storyParts: StoryPart[]
  leafPartId: string
}): string[] {
  const breadcrumb: string[] = []

  const findParent = (partId: string) => {
    const part = storyParts.find((part) => part.id === partId)
    invariant(part, `Could not find part with id ${partId}`)
    breadcrumb.push(part.id)
    if (part.parentStoryPart) {
      findParent(part.parentStoryPart)
    }
  }

  findParent(leafPartId)

  return breadcrumb.reverse()
}
