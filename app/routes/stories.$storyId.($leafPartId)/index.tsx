import { json, LoaderArgs } from "@remix-run/node"
import {
  ShouldRevalidateFunction,
  useLoaderData,
  useNavigate,
} from "@remix-run/react"
import { HierarchyPointNode } from "d3-hierarchy"
import React from "react"
import invariant from "tiny-invariant"
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
import { RawTreeNode, Tree } from "~/components/tree"
import { mockStoryParts } from "./mocks"
import { StoryPart, StoryTree } from "./types"
import { convertStoryPartsToTree, resolveBreadcrumb } from "./utils"

const paramsSchema = z.object({
  storyId: z.string(),
  leafPartId: z.string().optional(),
})

export const loader = ({ params }: LoaderArgs) => {
  const { storyId, leafPartId } = paramsSchema.parse(params)
  const tree = convertStoryPartsToTree(mockStoryParts)
  const breadcrumb = leafPartId
    ? resolveBreadcrumb({ storyParts: mockStoryParts, leafPartId })
    : [tree.id]
  return json({ tree, storyId, leafPartId, breadcrumb }, 200)
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  defaultShouldRevalidate,
  currentParams,
  nextParams,
}) => {
  console.log("🤡 shouldRevalidate.currentParams=", currentParams)
  console.log("🤡 shouldRevalidate.nextParams=", nextParams)
  return defaultShouldRevalidate
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const hasCollaboration = data.tree.children.length > 1

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

  function renderReadMore({ parent }: { parent: StoryTree }) {
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

  function renderChildParts({
    parent,
    breadcrumb,
  }: {
    parent: StoryTree
    breadcrumb: string[]
  }): React.ReactNode {
    invariant(parent.children.length > 0, "Parent must have children")
    const isAtBreadcrumbEnd = breadcrumb.length <= 1
    const target =
      parent.children.find((child) => breadcrumb.includes(child.id)) ??
      parent.children[0]
    const isArcEnd = target.children.length === 0
    return (
      <>
        <Column>
          <Spacer size="sm" />
          <span className="block text-right text-xs italic text-slate-400">
            Collaboration by @{target.author};
          </span>
          <div
            dangerouslySetInnerHTML={{
              __html: target.content,
            }}
          />
        </Column>
        {isAtBreadcrumbEnd && !isArcEnd && renderReadMore({ parent: target })}
        {!isAtBreadcrumbEnd &&
          !isArcEnd &&
          renderChildParts({ parent: target, breadcrumb: breadcrumb.slice(1) })}
        {isArcEnd && renderCollaborateInvitation()}
      </>
    )
  }

  const [selectedNode, setSelectedNode] = React.useState<HierarchyPointNode<
    RawTreeNode<StoryPart>
  > | null>(null)

  const onNodeClick = React.useCallback(
    (node: HierarchyPointNode<RawTreeNode<StoryPart>>) => {
      setSelectedNode(node)
    },
    [setSelectedNode, selectedNode],
  )

  return (
    <>
      <Column>
        <Spacer size="lg" />
        <div className="relative h-96 w-full text-center">
          <Tree
            items={mockStoryParts}
            id={(d) => d.id}
            name={(d) => d.author}
            parentId={(d) => d.parentStoryPart ?? null}
            activeDataId={mockStoryParts[0].id}
            onNodeActivated={onNodeClick}
          />
        </div>
        <H1>Story</H1>
        <span className="block text-xs italic text-slate-400">
          A story initiated by @{data.tree.author}.
        </span>
        <Spacer size="sm" />
        {/* The root of the tree is the original story part */}
        <div dangerouslySetInnerHTML={{ __html: data.tree.content }} />
      </Column>

      {hasCollaboration &&
        !data.leafPartId &&
        renderReadMore({ parent: data.tree })}

      {hasCollaboration &&
        data.leafPartId &&
        renderChildParts({
          parent: data.tree,
          breadcrumb: data.breadcrumb.slice(1),
        })}

      {/* If there hasn't been any collaboration, invite it */}
      {!hasCollaboration && renderCollaborateInvitation()}
    </>
  )
}
