import invariant from "tiny-invariant"
import { StoryPart } from "./types"

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
