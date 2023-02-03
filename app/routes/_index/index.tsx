import React from "react"
import {
  Checkbox,
  Column,
  ComboBox,
  Divider,
  H3,
  P,
  Spacer,
} from "~/components"
import { RichTextEditor } from "~/components/rich-text-editor"
import { LoginForm } from "../resources.login"

// TODO: Pull from a pool of example stories from the backend;
const exampleStory = `
<h1>The Adventures of the Time-Traveling Mouse and the Missing Piece of Toasted Cheese</h1>
<p>In the heart of the mystical forest, lived a curious mouse named Ms. Whiskers. She was an enigma to all those who crossed her path. With her striking black fur and piercing green eyes, she always managed to leave a lasting impression. But what truly set her apart was her ability to traverse the fabric of time. Some said she was a wizard, while others whispered that she was cursed. Regardless of their beliefs, everyone in the village agreed that Ms. Whiskers was a creature unlike any other.</p>
<p>One fateful morning, Ms. Whiskers was suddenly awoken by a voice that echoed through her mind. It was a voice she had never heard before, yet it felt familiar. It whispered words that she couldn't understand but she knew she had to listen. With a sense of urgency, Ms. Whiskers set off on a journey that would take her far beyond the boundaries of the mystical forest and beyond the reach of time itself. In search of the missing piece of toasted cheese, she would unravel the secrets of the universe and discover the truth about herself.</p>`

export default function HomepageRoute() {
  const [visibleInFeeds, setVisibleInFeeds] = React.useState(true)
  const [collaborationMode, setCollaborationMode] = React.useState({
    name: "Linear",
    value: "linear",
  })
  return (
    <>
      <Column>
        <H3>A ridiculous experiment in collaborative storytelling.</H3>
        <P>
          Start writing a story. Choose your collaboration settings. Share it.
          Watch the magic unfold.
        </P>

        <section>
          <Spacer size="xl" />
          <Divider label="Story Editor" />
          <div className="text-center text-xs text-slate-400">
            <em>(click below to begin editing)</em>
          </div>
          <Spacer size="sm" />
        </section>
      </Column>

      <Column size="md+">
        <RichTextEditor
          initialContent={exampleStory}
          onUpdate={(v) => console.log(v)}
        />
      </Column>

      <Column>
        <section>
          <Spacer size="xl" />
          <Divider label="Collaboration Settings" />
          <Spacer size="md" />
          <Checkbox
            label="Visible in our feeds"
            description="Your story will appear in our lists - e.g. Recent, Most Viewed, etc."
            checked={visibleInFeeds}
            onChange={setVisibleInFeeds}
          />
          <Spacer size="md" />
          <ComboBox
            options={[
              { name: "Linear", value: "linear" },
              { name: "Tree", value: "tree" },
            ]}
            label="Collaboration Mode"
            onChange={setCollaborationMode}
            value={collaborationMode}
          />
        </section>

        <section>
          <Spacer size="xl" />
          <Divider label="Login" />
          <Spacer size="sm" />
          <LoginForm />
        </section>

        <section>
          <Spacer size="xl" />
          <Divider label="Share" />
        </section>

        <Spacer size="xl" />
      </Column>
    </>
  )
}
