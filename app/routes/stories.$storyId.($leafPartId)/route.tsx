import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { json, LoaderArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import React, { Fragment } from "react"
import { z } from "zod"
import { Column, Divider, H1, P, RichTextEditor, Spacer } from "~/components"
import {
  StoryNavigator,
  StoryNavigatorNode,
} from "~/components/story-navigator"
import { Stories, StoryNode } from "~/domain/stories"
import { enhanceThread } from "./lib"

const paramsSchema = z.object({
  storyId: z.string(),
  leafPartId: z.string().optional(),
})

export const loader = async ({ params }: LoaderArgs) => {
  const { storyId, leafPartId: threadEndPartId } = paramsSchema.parse(params)

  console.log(storyId, threadEndPartId)

  const [tree, thread] = await Promise.all([
    Stories.getTree({ storyId }),
    Stories.getThread({ storyId, threadEndPartId }),
  ])

  // TODO:
  // - Consider a caching strategy here.
  return json({ tree, thread: enhanceThread({ tree, thread }), storyId }, 200)
}

const StoryNavigateGamepad: React.FC = () => {
  return (
    <div className="relative h-32 w-32 bg-pink-200">
      <button className="absolute left-2/4 h-7 w-9 -translate-x-1/2">
        <FontAwesomeIcon icon={faCaretUp} />
      </button>
      <button className="absolute left-2/4 bottom-6 h-7 w-9 -translate-x-1/2">
        <FontAwesomeIcon icon={faCaretDown} />
      </button>
      <button className="absolute right-0 bottom-1/2 h-7 w-7">
        <FontAwesomeIcon icon={faCaretRight} />
      </button>
      <button className="absolute left-0 bottom-1/2 h-7 w-7">
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </div>
  )
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  function navigateToNode(args: { node: StoryNode }) {
    const { node } = args
    navigate(`/stories/${data.storyId}/${node.id}`)
  }

  const [selectedNode, setSelectedNode] =
    React.useState<StoryNavigatorNode | null>(null)

  const onNodeClick = React.useCallback(
    (node: StoryNavigatorNode) => {
      setSelectedNode(node)
      navigateToNode({ node: node.data })
    },
    [setSelectedNode, selectedNode],
  )

  const [root, ...collaborations] = data.thread
  const lastPart = data.thread[data.thread.length - 1]
  const parent =
    data.thread.length > 1 ? data.thread[data.thread.length - 2] : null
  const hasChildren = lastPart.node.children.length > 0
  const hasSiblings = parent ? parent.node.children.length > 1 : false

  return (
    <div className="relative">
      <Column>
        <Spacer size="lg" />
        <div className="relative h-96 w-full text-center">
          <StoryNavigator
            tree={data.tree}
            thread={data.thread}
            onNodeClick={onNodeClick}
          />
        </div>
        <H1>Story</H1>
        <span className="block text-xs italic text-slate-400">
          A story initiated by @{data.tree.author}.
        </span>
        <Spacer size="sm" />
        <div dangerouslySetInnerHTML={{ __html: root.part.content }} />
        {collaborations.map((collaboration) => (
          <Fragment key={collaboration.part.id}>
            <Spacer size="sm" />
            <span className="block text-right text-xs italic text-slate-400">
              Collaboration by @{collaboration.part.author};
            </span>
            <div
              dangerouslySetInnerHTML={{
                __html: collaboration.part.content,
              }}
            />
          </Fragment>
        ))}

        <Spacer size="md" />
        <Divider label="Collaborate" />
        <P className="border-l-4 border-l-slate-200 py-2 pl-4 text-sm italic">
          Want to add your own spin to this thread? Drop your words below.{" "}
        </P>
      </Column>
      <Column size="md+">
        <Spacer size="sm" />
        <RichTextEditor
          initialContent={"<p>The story didn't end there...</p>"}
        />
      </Column>
      <StoryNavigateGamepad />
    </div>
  )
}
