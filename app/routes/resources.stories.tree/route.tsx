import { json, LoaderArgs } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import React from "react"
import { z } from "zod"
import { zfd } from "zod-form-data"
import {
  StoryNavigator,
  StoryNavigatorNode,
} from "~/components/story-navigator"
import { Stories } from "~/domain/stories"
import { enhanceThread } from "./lib"

const searchParamsSchema = zfd.formData({
  storyId: zfd.text(),
  threadEndPartId: zfd.text(z.string().optional()),
})

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const { storyId, threadEndPartId } = searchParamsSchema.parse(
    url.searchParams,
  )

  // TODO:
  // - Only fetch the tree
  // - In the tree itself when it renders and finds the endpart make
  //   that trigger a callback to active the required nodes
  const [tree, thread] = await Promise.all([
    Stories.getTree({ storyId }),
    Stories.getThread({ storyId, threadEndPartId }),
  ])

  // TODO:
  // - Consider a caching strategy here.
  return json({ tree, thread: enhanceThread({ tree, thread }), storyId }, 200)
}

export type StoryNavigatorServerComponentProps = {
  storyId: string
  endPartId?: string
  onNodeClick: (node: StoryNavigatorNode) => void
}

export const StoryNavigatorServerComponent: React.FC<
  StoryNavigatorServerComponentProps
> = (props) => {
  const fetcher = useFetcher<typeof loader>()

  const tree = fetcher.data?.tree
  const thread = fetcher.data?.thread

  React.useEffect(() => {
    if (fetcher.type === "init") {
      // TODO:
      // - This is a bit nasty, maybe use a query string builder?
      fetcher.load(
        `/resources/stories/tree?storyId=${props.storyId}${
          props.endPartId ? `&threadEndPartId=${props.endPartId}` : ""
        }`,
      )
    }
  }, [])

  if (!tree || !thread) {
    return null
  }

  return (
    <StoryNavigator
      tree={tree}
      thread={thread}
      onNodeClick={props.onNodeClick}
    />
  )
}
