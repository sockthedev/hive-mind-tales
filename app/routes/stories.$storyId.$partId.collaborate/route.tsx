import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import { badRequest } from "remix-utils"
import { ValidatedForm, validationError } from "remix-validated-form"
import { z } from "zod"

import { Divider } from "~/app/components/divider"
import { FormRichTextInput } from "~/app/components/form-rich-text-input"
import { FormSubmitButton } from "~/app/components/form-submit-button"
import { H1 } from "~/app/components/h1"
import { H2 } from "~/app/components/h2"
import { NarrowContent } from "~/app/components/narrow-content"
import { P } from "~/app/components/p"
import { Spacer } from "~/app/components/spacer"
import { apiClient } from "~/app/server/api-client.server"
import { createPartAction } from "~/app/server/login-action.server"
import { getToken } from "~/app/server/session.server"
import {
  MAX_CONTENT_TEXT_LENGTH,
  MIN_CONTENT_TEXT_LENGTH,
  StoriesValidation,
} from "~/lib/stories-validation"

const DEFAULT_COLLABORATE_CONTENT = "<p>The story didn't end there...</p>"

const paramsSchema = z.object({
  storyId: z.string(),
  partId: z.string(),
})

export async function loader({ request, params }: LoaderArgs) {
  const { storyId, partId } = paramsSchema.parse(params)

  const [story, part] = await apiClient({
    request,
    thunk: (client) =>
      Promise.all([
        client.stories.getStory.query({ storyId }),
        client.stories.getPartOrRootPart.query({ storyId, partId }),
      ]),
  })

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

export const formSchema = withZod(
  z.object({
    storyId: z.string().min(1, "storyId is required"),
    parentId: z.string().min(1, "parentId is required"),
    content: z
      .string()
      .min(1, { message: "Story is required" })
      .refine((story) => {
        return StoriesValidation.isValidContentLength(story)
      }, `Story character count must be between ${MIN_CONTENT_TEXT_LENGTH} and ${MAX_CONTENT_TEXT_LENGTH} in length`),
  }),
)

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
    const part = await apiClient({
      request,
      thunk: (client) =>
        client.stories.addPart.mutate({
          storyId: form.data.storyId,
          parentId: form.data.parentId,
          content: form.data.content,
        }),
      auth: true,
      loginAction: createPartAction({
        storyId: form.data.storyId,
        parentId: form.data.parentId,
        content: form.data.content,
      }),
    })
    return redirect(`/stories/${form.data.storyId}/${part.partId}`)
  }
}

export default function StoryCollaborateRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <NarrowContent>
      <Spacer size="lg" />

      <H1>Collaborate</H1>

      <P>Woot! You are starting a collaboration on the the story...</P>

      <H2>{data.story.title}</H2>

      <P>You are continuing the following part of the story...</P>

      <div dangerouslySetInnerHTML={{ __html: data.part.content }} />

      <Spacer size="xl" />

      <ValidatedForm method="POST" validator={formSchema}>
        <Divider
          label="Write your words"
          hint="Edit the text below to add your spin to this story thread"
        />
        <Spacer size="sm" />
        <FormRichTextInput
          name="content"
          defaultValue={DEFAULT_COLLABORATE_CONTENT}
        />
        <Spacer size="lg" />
        <div className="text-center">
          <input type="hidden" name="storyId" value={data.story.storyId} />
          <input type="hidden" name="parentId" value={data.part.partId} />
          <FormSubmitButton>Submit</FormSubmitButton>
        </div>
      </ValidatedForm>
    </NarrowContent>
  )
}
