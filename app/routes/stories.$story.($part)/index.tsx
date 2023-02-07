import { json, LoaderArgs } from "@remix-run/node"
import { ShouldRevalidateFunction, useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { Column, Divider, H1, P, RichTextEditor, Spacer } from "~/components"
import { mockStoryParts } from "./mocks"
import { StoryTree } from "./types"
import { convertStoryPartsToTree, resolvePartPath } from "./utils"

const paramsSchema = z.object({
  story: z.string(),
  part: z.string().optional(),
})

export const loader = ({ params }: LoaderArgs) => {
  const { story, part } = paramsSchema.parse(params)
  const tree = convertStoryPartsToTree(mockStoryParts)
  const activeStoryArc = part ? resolvePartPath({ tree, part }) : [tree.id]
  return json({ tree, story, part, activeStoryArc }, 200)
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  defaultShouldRevalidate,
}) => {
  return defaultShouldRevalidate
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()

  const hasCollaboration = data.tree.children.length > 1

  const hasExpandedStory = data.activeStoryArc.length > 1

  function renderReadMore() {
    return (
      <>
        <Column>
          <Spacer size="md" />
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

  function renderNextPart({
    parts,
    breadcrumb,
  }: {
    parts: StoryTree[]
    breadcrumb: string[]
  }) {
    return (
      <>
        <Column>
          <Spacer size="md" />
          <div
            dangerouslySetInnerHTML={{
              __html: data.tree.children[0].content,
            }}
          />
        </Column>
      </>
    )
  }

  return (
    <>
      <Column>
        <Spacer size="xl" />
        <H1>Story</H1>
        <Spacer size="sm" />

        {/* The root of the tree is the original story part */}
        <div dangerouslySetInnerHTML={{ __html: data.tree.content }} />
      </Column>

      {/* If there hasn't been any collaboration, invite it */}
      {!hasCollaboration && renderReadMore()}

      {/* If there has been collaboration, but no parts have been expanded
          then we will show the first collaboration item */}
      {hasCollaboration &&
        !hasExpandedStory &&
        renderNextPart({ parts: [], breadcrumb: [] })}
    </>
  )
}
