import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import React from "react"
import { badRequest, ClientOnly } from "remix-utils"
import { ValidatedForm, validationError } from "remix-validated-form"
import { z } from "zod"

import { Button, Divider, H1, Spacer } from "~/app/components"
import { FormSubmitButton } from "~/app/components/form-submit-button"
import { RichTextInput } from "~/app/components/rich-text-input"
import type { StoryNavigatorNode } from "~/app/components/story-navigator"
import { TwoColumnContent } from "~/app/components/two-column-content"
import { createLoginActionCookie } from "~/app/server/login-action-cookie.server"
import { getToken } from "~/app/server/session.server"
import { trpc } from "~/app/server/trpc.server"
import {
  MAX_CONTENT_TEXT_LENGTH,
  MIN_CONTENT_TEXT_LENGTH,
  StoriesValidation,
} from "~/lib/stories-validation"
import type { StoryNode } from "~/server/domain/stories.types"

import { ResponsiveStoryNavigator } from "./responsive-story-navigator"

export const formSchema = withZod(
  z.object({
    storyId: z.string().min(1, "Story ID is required"),
    content: z
      .string()
      .min(1, { message: "Story is required" })
      .refine((story) => {
        return StoriesValidation.isValidContentLength(story)
      }, `Story character count must be between ${MIN_CONTENT_TEXT_LENGTH} and ${MAX_CONTENT_TEXT_LENGTH} in length`),
  }),
)

const paramsSchema = z.object({
  storyId: z.string(),
  partId: z.string().optional(),
})

export async function loader({ params }: LoaderArgs) {
  const { storyId, partId } = paramsSchema.parse(params)

  const [story, part] = await Promise.all([
    trpc().stories.getStory.query({ storyId }),
    trpc().stories.getPartOrRootPart.query({ storyId, partId }),
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

export async function action({ request }: ActionArgs) {
  if (request.method !== "POST") {
    throw badRequest("Method not allowed")
  }

  const form = await formSchema.validate(await request.formData())
  if (form.error) {
    return validationError(form.error)
  }

  const token = await getToken(request)

  if (token) {
    const part = await trpc(token).stories.addPart.mutate({
      storyId: form.data.storyId,
      content: form.data.content,
    })
    return redirect(`/stories/${form.data.storyId}/${part.partId}/share`, {
      status: 302,
    })
  } else {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await createLoginActionCookie("create-part", {
          storyId: form.data.storyId,
          content: form.data.content,
        }),
      },
      status: 302,
    })
  }
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

  const navigateToNode = React.useCallback(
    (args: { node: StoryNode }) => {
      const { node } = args
      navigate(`/stories/${data.story.storyId}/${node.partId}`, {
        preventScrollReset: true,
      })
    },
    [data.story.storyId, navigate],
  )

  const onNodeClick = React.useCallback(
    (node: StoryNavigatorNode) => {
      navigateToNode({ node: node.data })
    },
    [navigateToNode],
  )

  return (
    <TwoColumnContent
      left={() => (
        <ClientOnly fallback={null}>
          {() => (
            <ResponsiveStoryNavigator
              storyId={data.story.storyId}
              activePartId={data.part.partId}
              onNodeClick={onNodeClick}
            />
          )}
        </ClientOnly>
      )}
      right={() => (
        <>
          <ScrollToMe className="-translate-y-14" scrollId={data.part.partId} />

          <Spacer size="lg" />

          <H1>{data.story.title}</H1>
          <span className="block text-xs italic text-slate-400">
            A story initiated by @{data.story.createdBy}.
          </span>

          <Spacer size="xl" />

          {data.story.rootPartId !== data.part.partId && (
            <span className="block text-right text-xs italic text-slate-400">
              Collaboration by @{data.part.createdBy};
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
              <ValidatedForm method="post" validator={formSchema}>
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
                  <input
                    type="hidden"
                    name="storyId"
                    value={data.story.storyId}
                  />
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
