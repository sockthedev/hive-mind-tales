import { json, LoaderArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import React from "react"
import { ValidatedForm } from "remix-validated-form"
import { z } from "zod"
import { Button, Divider, H1, RichTextEditor, Spacer } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"
import { StoryNavigatorNode } from "~/components/story-navigator"
import { TwoColumnContent } from "~/components/two-column-content"
import { Stories, StoryNode } from "~/domain/stories"
import { StoryNavigatorServerComponent } from "../resources.stories.tree/route"

export const formValidator = withZod(
  z.object({
    story: z.string().min(1, { message: "Story is required" }),
    visibleInFeeds: z.enum(["on", "off"]).optional().default("off"),
  }),
)

const paramsSchema = z.object({
  storyId: z.string(),
  currentPartId: z.string().optional(),
})

export const loader = async ({ params }: LoaderArgs) => {
  const { storyId, currentPartId } = paramsSchema.parse(params)

  const [story, currentPart] = await Promise.all([
    Stories.getStory({ storyId }),
    Stories.getPartOrRootPart({ storyId, partId: currentPartId }),
  ])

  // TODO:
  // - Consider a caching strategy here.
  return json(
    {
      story,
      currentPart,
    },
    200,
  )
}

const ScrollToMe: React.FC<{ scrollId: string }> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }, [props.scrollId])

  return <div ref={ref} />
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  console.log("🤡", data)

  const [showEditor, setShowEditor] = React.useState(false)

  function navigateToNode(args: { node: StoryNode }) {
    const { node } = args
    navigate(`/stories/${data.story.id}/${node.id}`, {
      preventScrollReset: true,
    })
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

  return (
    <TwoColumnContent
      left={() => (
        <div className="absolute -top-14 left-0 h-[calc(100%+9rem)] min-h-full w-full">
          <div className="sticky top-0 left-0 h-[100vh] min-h-[100vh-3.5rem] w-full pt-14">
            <StoryNavigatorServerComponent
              storyId={data.story.id}
              activePartId={data.currentPart.id}
              onNodeClick={onNodeClick}
            />
          </div>
        </div>
      )}
      right={() => (
        <>
          <Spacer size="lg" />
          <ScrollToMe scrollId={data.currentPart.id} />
          <H1>{data.story.title}</H1>
          <span className="block text-xs italic text-slate-400">
            A story initiated by @{data.story.createdBy}.
          </span>
          <Spacer size="sm" />
          {data.story.rootStoryPartId !== data.currentPart.id && (
            <span className="block text-right text-xs italic text-slate-400">
              Collaboration by @{data.currentPart.author};
            </span>
          )}
          <div dangerouslySetInnerHTML={{ __html: data.currentPart.content }} />
          <Spacer size="sm" />

          {!showEditor && (
            <>
              <Spacer size="md" />
              <Divider
                label="Want to continue this thread?"
                hint="Click the button to add your spin"
              />
              <Spacer size="md" />
              <div className="text-center">
                <Button onClick={() => setShowEditor(true)}>Collaborate</Button>
              </div>
            </>
          )}

          {showEditor && (
            <>
              <ValidatedForm method="post" validator={formValidator}>
                <Spacer size="md" />
                <Divider
                  label="Continue this thread"
                  hint="Add your own spin by clicking the text below"
                />
                <Spacer size="sm" />
                <RichTextEditor
                  initialContent={"<p>The story didn't end there...</p>"}
                />
                <Spacer size="lg" />
                <div className="text-center">
                  <FormSubmitButton>Submit</FormSubmitButton>
                </div>
              </ValidatedForm>
            </>
          )}
        </>
      )}
    />
  )
}
