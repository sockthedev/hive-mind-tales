import { json, LoaderArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import React from "react"
import { ClientOnly } from "remix-utils"
import { ValidatedForm } from "remix-validated-form"
import { z } from "zod"
import { Button, Divider, H1, Spacer } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"
import { RichTextInput } from "~/components/rich-text-input"
import { StoryNavigatorNode } from "~/components/story-navigator"
import { TwoColumnContent } from "~/components/two-column-content"
import { Stories, StoryNode } from "~/domain/stories"
import { ResponsiveStoryNavigator } from "./responsive-story-navigator"

export const formValidator = withZod(
  z.object({
    story: z.string().min(1, { message: "Story is required" }),
  }),
)

const paramsSchema = z.object({
  storyId: z.string(),
  partId: z.string().optional(),
})

export const loader = async ({ params }: LoaderArgs) => {
  const { storyId, partId } = paramsSchema.parse(params)

  const [story, part] = await Promise.all([
    Stories.getStory({ storyId }),
    Stories.getPartOrRootPart({ storyId, partId }),
  ])

  // TODO:
  // - Consider a caching strategy here.
  return json(
    {
      story,
      part,
    },
    200,
  )
}

const ScrollToMe: React.FC<{ className?: string; scrollId: string }> = (
  props,
) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const prevScrollId = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (prevScrollId.current && prevScrollId.current !== props.scrollId) {
      ref.current?.scrollIntoView({ behavior: "smooth" })
    }
    prevScrollId.current = props.scrollId
  }, [props.scrollId])

  return <div className={props.className} key={props.scrollId} ref={ref} />
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

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
        <ClientOnly fallback={null}>
          {() => (
            <ResponsiveStoryNavigator
              storyId={data.story.id}
              activePartId={data.part.id}
              onNodeClick={onNodeClick}
            />
          )}
        </ClientOnly>
      )}
      right={() => (
        <>
          <ScrollToMe className="-translate-y-14" scrollId={data.part.id} />

          <Spacer size="lg" />

          <H1>{data.story.title}</H1>
          <span className="block text-xs italic text-slate-400">
            A story initiated by @{data.story.createdBy}.
          </span>

          <Spacer size="xl" />

          {data.story.rootStoryPartId !== data.part.id && (
            <span className="block text-right text-xs italic text-slate-400">
              Collaboration by @{data.part.author};
            </span>
          )}
          <div dangerouslySetInnerHTML={{ __html: data.part.content }} />

          <Spacer size="xl" />

          {!showEditor && (
            <>
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
                <Divider
                  label="Continue this thread"
                  hint="Add your own spin by clicking the text below"
                />
                <Spacer size="sm" />
                <RichTextInput
                  defaultValue={"<p>The story didn't end there...</p>"}
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
