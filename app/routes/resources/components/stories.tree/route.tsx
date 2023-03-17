import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import React from "react"
import { zfd } from "zod-form-data"

import type { StoryNavigatorNode } from "~/app/components/story-navigator"
import { StoryNavigator } from "~/app/components/story-navigator"
import { apiClient } from "~/app/server/api-client.server"

const searchParamsSchema = zfd.formData({
  storyId: zfd.text(),
})

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const { storyId } = searchParamsSchema.parse(url.searchParams)

  const tree = await apiClient({
    request,
    thunk: (client) => client.stories.getTree.query({ storyId }),
  })

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
      fetcher.load(
        `/resources/components/stories/tree?storyId=${props.storyId}`,
      )
    }
  }, [fetcher, props.storyId])

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
