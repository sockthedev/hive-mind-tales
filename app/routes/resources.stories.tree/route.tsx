import { json, LoaderArgs } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import React from "react"
import { zfd } from "zod-form-data"
import {
  StoryNavigator,
  StoryNavigatorNode,
} from "~/app/components/story-navigator"
import { Stories } from "~/domain/stories.server"

const searchParamsSchema = zfd.formData({
  storyId: zfd.text(),
})

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const { storyId } = searchParamsSchema.parse(url.searchParams)

  const tree = await Stories.getTree({ storyId })

  // TODO:
  // - Consider a caching strategy here.
  return json({ tree }, 200)
}

export type FullStackStoryNavigatorProps = {
  storyId: string
  activePartId: string
  onNodeClick: (node: StoryNavigatorNode) => void
}

export const FullStackStoryNavigator: React.FC<FullStackStoryNavigatorProps> = (
  props,
) => {
  const fetcher = useFetcher<typeof loader>()

  React.useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(`/resources/stories/tree?storyId=${props.storyId}`)
    }
  }, [props.storyId])

  const tree = fetcher.data?.tree
  if (!tree) {
    return null
  }

  return (
    <StoryNavigator
      tree={tree}
      activePartId={props.activePartId}
      onNodeClick={props.onNodeClick}
    />
  )
}
