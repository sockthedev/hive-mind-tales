import { json, LoaderArgs } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import React from "react"
import { zfd } from "zod-form-data"
import {
  StoryNavigatorNode,
  StoryNavigatorTree,
} from "~/components/story-navigator"
import { Stories } from "~/domain/stories"

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

export type StoryNavigatorServerComponentProps = {
  storyId: string
  activePartId: string
  onNodeClick: (node: StoryNavigatorNode) => void
}

export const StoryNavigatorServerComponent: React.FC<
  StoryNavigatorServerComponentProps
> = (props) => {
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
    <StoryNavigatorTree
      tree={tree}
      activePartId={props.activePartId}
      onNodeClick={props.onNodeClick}
    />
  )
}
