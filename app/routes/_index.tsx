import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { badRequest } from "remix-utils"
import { ValidatedForm, validationError } from "remix-validated-form"
import { z } from "zod"
import * as zfd from "zod-form-data"

import { Divider, H3, P, Spacer } from "~/app/components"
import { FormCheckbox } from "~/app/components/form-checkbox"
import { FormRichTextInput } from "~/app/components/form-rich-text-input"
import { FormSubmitButton } from "~/app/components/form-submit-button"
import { FormTitleInput } from "~/app/components/form-title-input"
import { TwoColumnContent } from "~/app/components/two-column-content"
import { apiClient } from "~/app/server/api-client.server"
import { createStoryAction } from "~/app/server/login-action.server"
import {
  MAX_CONTENT_TEXT_LENGTH,
  MIN_CONTENT_TEXT_LENGTH,
  StoriesValidation,
} from "~/lib/stories-validation"

// TODO:
// - Pull from a pool of example stories from the backend;
const exampleStory = `
<p class="text-lg leading-7 mt-6">In the heart of the mystical forest, lived a curious mouse named Ms. Whiskers. She was an enigma to all those who crossed her path. With her striking black fur and piercing green eyes, she always managed to leave a lasting impression. But what truly set her apart was her ability to traverse the fabric of time. Some said she was a wizard, while others whispered that she was cursed. Regardless of their beliefs, everyone in the village agreed that Ms. Whiskers was a creature unlike any other.</p>
<p class="text-lg leading-7 mt-6">One fateful morning, Ms. Whiskers was suddenly awoken by a voice that echoed through her mind. It was a voice she had never heard before, yet it felt familiar. It whispered words that she couldn't understand but she knew she had to listen. With a sense of urgency, Ms. Whiskers set off on a journey that would take her far beyond the boundaries of the mystical forest and beyond the reach of time itself. In search of the missing piece of toasted cheese, she would unravel the secrets of the universe and discover the truth about herself.</p>`

export const formValidator = withZod(
  z.object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(130, { message: "Title is too long" }),
    story: z
      .string()
      .min(1, { message: "Story is required" })
      .refine((story) => {
        return StoriesValidation.isValidContentLength(story)
      }, `Story character count must be between ${MIN_CONTENT_TEXT_LENGTH} and ${MAX_CONTENT_TEXT_LENGTH} in length`),
    visibleInFeeds: zfd.checkbox({ trueValue: "true" }),
    acceptTerms: zfd
      .checkbox({ trueValue: "true" })
      .refine((value) => value, "You must accept the terms of service"),
  }),
)

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    throw badRequest("Method not allowed")
  }

  const form = await formValidator.validate(await request.formData())
  if (form.error) {
    return validationError(form.error)
  }

  const { story, part } = await apiClient({
    request,
    auth: true,
    loginAction: createStoryAction({
      title: form.data.title,
      content: form.data.story,
      visibleInFeeds: form.data.visibleInFeeds,
    }),
    thunk: (client) =>
      client.stories.create.mutate({
        title: form.data.title,
        content: form.data.story,
        visibleInFeeds: form.data.visibleInFeeds,
      }),
  })
  return redirect(`/stories/${story.storyId}/${part.partId}/share`, {
    status: 302,
  })
}

export default function HomepageRoute() {
  return (
    <TwoColumnContent
      left={() => (
        <section>
          <Spacer size="lg" />
          <img src="/logo-large.png" alt="Hive Mind Tales" className="w-1/2" />
          <H3>
            A ridiculous experiment in
            <br />
            collaborative storytelling.
          </H3>
          <P>
            Start writing a story.
            <br /> Share it.
            <br /> Watch the magic unfold.
          </P>
          <Spacer size="lg" />
        </section>
      )}
      right={() => (
        <ValidatedForm method="post" validator={formValidator}>
          <Spacer size="md" />
          <Divider
            label="Story Editor"
            hint="click any of the text below to begin editing"
          />
          <Spacer size="sm" />

          <FormTitleInput
            name="title"
            defaultValue="The Adventures of the Time-Traveling Mouse and the Missing Piece of Toasted Cheese"
          />

          <FormRichTextInput name="story" defaultValue={exampleStory} />

          <section>
            <Spacer size="lg" />
            <FormCheckbox
              label="Visible in our feeds?"
              description="Allow your story to appear in our feeds (e.g. Recent, Top, etc.). This will enable more people to read and collaborate with you. If you choose not to enable this then only those whom you share your link with will be able contribute to your story."
              name="visibleInFeeds"
              defaultChecked={true}
              value="true"
            />
            <Spacer size="lg" />
            <FormCheckbox
              label="Contains mature content?"
              description="Help keep it clean and safe for all members of our community by indicating if your story contains any violence, explitives, or content not appropriate for younger readers."
              name="containsMatureContent"
              defaultChecked={false}
              value="true"
            />
            <Spacer size="lg" />
            <FormCheckbox
              label="Accept our terms and conditions?"
              description="By checking this box you agree to our terms and conditions and confirm that your story falls in line with our rules and guidelines. Any content found to break our rules and guidelines will be removed without warning."
              name="acceptTerms"
              defaultChecked={false}
              value="true"
            />
          </section>

          <section>
            <Spacer size="lg" />
            <div className="text-center">
              <FormSubmitButton>Share It!</FormSubmitButton>
            </div>
          </section>
        </ValidatedForm>
      )}
    />
  )
}
