import { json, LoaderArgs } from "@remix-run/node"
import { ShouldRevalidateFunction, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { z } from "zod"
import { Column, Divider, H1, P, RichTextEditor, Spacer } from "~/components"

const mockStoryParts: StoryPart[] = [
  {
    id: "1",
    content: "<p>Story content goes here.</p>",
    author: "janedoe",
  },
  {
    id: "2",
    content: "<p>Second piece of story content goes here.</p>",
    author: "johndoe",
    parentStoryPart: "1",
  },
  {
    id: "3",
    content: "<p>Second alt piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "1",
  },
  {
    id: "4",
    content: "<p>Third piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "2",
  },
  {
    id: "5",
    content: "<p>Fourth piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "4",
  },
  {
    id: "6",
    content: "<p>Third piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "3",
  },
]

type StoryPart = {
  id: string
  content: string
  author: string
  parentStoryPart?: string
}

type StoryNode = StoryPart & { children: StoryTree[] }

type StoryTree = StoryNode

function convertStoryPartsToTree(storyData: StoryPart[]): StoryTree {
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
      children: extractNodes(child.id, storyData),
    }))
  }
  const tree: StoryTree = {
    ...root,
    children: extractNodes(root.id, storyData),
  }
  return tree
}

function resolvePartPath({
  tree,
  part,
}: {
  tree: StoryTree
  part: string
}): string[] {
  const path: string[] = []
  let current = tree
  while (current.id !== part) {
    path.push(current.id)
    const next = current.children.find((child) => child.id === part)
    invariant(next, "Part not found in tree")
    current = next
  }
  return path
}

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
      {hasCollaboration && !hasExpandedStory && (
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
      )}
    </>
  )
}
