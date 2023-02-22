import { ActionArgs, json, redirect } from "@remix-run/server-runtime"
import { withZod } from "@remix-validated-form/with-zod"
import React from "react"
import { ValidatedForm, validationError } from "remix-validated-form"
import { z } from "zod"
import { Checkbox, Divider, H3, P, Spacer } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"
import { RichTextEditor } from "~/components/rich-text-editor"
import { TwoColumnContent } from "~/components/two-column-content"

// TODO: Pull from a pool of example stories from the backend;
const exampleStory = `
<h1>The Adventures of the Time-Traveling Mouse and the Missing Piece of Toasted Cheese</h1>
<p>In the heart of the mystical forest, lived a curious mouse named Ms. Whiskers. She was an enigma to all those who crossed her path. With her striking black fur and piercing green eyes, she always managed to leave a lasting impression. But what truly set her apart was her ability to traverse the fabric of time. Some said she was a wizard, while others whispered that she was cursed. Regardless of their beliefs, everyone in the village agreed that Ms. Whiskers was a creature unlike any other.</p>
<p>One fateful morning, Ms. Whiskers was suddenly awoken by a voice that echoed through her mind. It was a voice she had never heard before, yet it felt familiar. It whispered words that she couldn't understand but she knew she had to listen. With a sense of urgency, Ms. Whiskers set off on a journey that would take her far beyond the boundaries of the mystical forest and beyond the reach of time itself. In search of the missing piece of toasted cheese, she would unravel the secrets of the universe and discover the truth about herself.</p>`

export const validator = withZod(
  z.object({
    story: z.string().min(1, { message: "Story is required" }),
    visibleInFeeds: z.enum(["on", "off"]).optional().default("off"),
  }),
)

export const action = async ({ request }: ActionArgs) => {
  switch (request.method) {
    case "POST": {
      const data = await validator.validate(await request.formData())
      if (data.error) {
        return validationError(data.error)
      }
      // TODO:
      // - Check if the user is logged in
      // - Save the story to the DB
      // - If the user is logged in forward them to share page,
      // - Else forward them to login page first
      const storyId = "abc123"
      return redirect("/login", {
        headers: {
          "Set-Cookie": `story=${encodeURIComponent(storyId)}`,
        },
        status: 302,
      })
    }
    default: {
      return json({ message: "Method not allowed" }, 405)
    }
  }
}

export default function HomepageRoute() {
  const [visibleInFeeds, setVisibleInFeeds] = React.useState(true)
  return (
    <TwoColumnContent
      left={() => (
        <section className="text-gray-600">
          <H3>A ridiculous experiment in collaborative storytelling.</H3>
          <P>
            Start writing a story.
            <br /> Share it.
            <br /> Watch the magic unfold.
          </P>
        </section>
      )}
      right={() => (
        <ValidatedForm method="post" validator={validator}>
          <Spacer size="md" />
          <Divider
            label="Story Editor"
            hint="click any of the text below to begin editing"
          />
          <Spacer size="sm" />

          <RichTextEditor initialContent={exampleStory} name="story" />

          <section>
            <Spacer size="lg" />
            <Checkbox
              label="Visible in our feeds"
              description="Your story could appear in our feeds - e.g. Recent, Top, etc."
              checked={visibleInFeeds}
              onChange={setVisibleInFeeds}
              name="visibleInFeeds"
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
