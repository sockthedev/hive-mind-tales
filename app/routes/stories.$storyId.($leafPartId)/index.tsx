import { json, LoaderArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import React, { Fragment } from "react"
import { z } from "zod"
import {
  Button,
  Column,
  Divider,
  H1,
  P,
  RichTextEditor,
  Spacer,
} from "~/components"
import { StoryNavigator, StoryNavigatorNode } from "~/components/tree"
import { Stories, StoryNode } from "~/domain/stories"

const paramsSchema = z.object({
  storyId: z.string(),
  leafPartId: z.string().optional(),
})

export const loader = async ({ params }: LoaderArgs) => {
  const { storyId, leafPartId } = paramsSchema.parse(params)

  const [tree, breadcrumb] = await Promise.all([
    Stories.getTree({ storyId }),
    Stories.getBreadcrumb({ storyId, leafPartId }),
  ])

  // TODO:
  // - Consider a caching strategy here.
  return json({ tree, breadcrumb, storyId }, 200)
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const hasChildren = data.tree.children.length > 1

  function renderCollaborateInvitation() {
    return (
      <>
        <Column>
          <Spacer size="xs" />
          <P className="border-l-4 border-l-slate-200 py-2 pl-4 text-sm italic">
            This story arc ends here... or does it? Keep it alive by
            collaborating a paragraph or few below.
          </P>
          <Spacer size="sm" />
          <Divider label="Collaborate" />
        </Column>
        <Column size="md+">
          <RichTextEditor
            initialContent={"<p>The story didn't end there...</p>"}
          />
        </Column>
      </>
    )
  }

  function renderReadMore({ parent }: { parent: StoryNode }) {
    return (
      <Column>
        <Spacer size="xs" />
        <P className="border-l-4 border-l-slate-200 py-2 pl-4 text-sm italic">
          This story arc has been continued by others...
        </P>
        <Spacer size="sm" />
        <P>
          <Button
            onClick={() => {
              navigate(`/stories/${data.storyId}/${parent.children[0].id}`)
            }}
          >
            Read more
          </Button>
        </P>
      </Column>
    )
  }

  const [selectedNode, setSelectedNode] =
    React.useState<StoryNavigatorNode | null>(null)

  const onNodeClick = React.useCallback(
    (node: StoryNavigatorNode) => {
      setSelectedNode(node)
    },
    [setSelectedNode, selectedNode],
  )

  const [root, ...collaborations] = data.breadcrumb

  return (
    <>
      <Column>
        <Spacer size="lg" />
        <div className="relative h-96 w-full text-center">
          <StoryNavigator
            tree={data.tree}
            breadcrumb={data.breadcrumb}
            onNodeClick={onNodeClick}
          />
        </div>
        <H1>Story</H1>
        <span className="block text-xs italic text-slate-400">
          A story initiated by @{data.tree.author}.
        </span>
        <Spacer size="sm" />
        <div dangerouslySetInnerHTML={{ __html: root.content }} />
        {collaborations.map((collaboration) => (
          <Fragment key={collaboration.id}>
            <Spacer size="sm" />
            <span className="block text-right text-xs italic text-slate-400">
              Collaboration by @{collaboration.author};
            </span>
            <div
              dangerouslySetInnerHTML={{
                __html: collaboration.content,
              }}
            />
          </Fragment>
        ))}
      </Column>

      {hasChildren && renderReadMore({ parent: data.tree })}

      {/* If there hasn't been any collaboration, invite it */}
      {!hasChildren && renderCollaborateInvitation()}
    </>
  )
}
