import React from "react"
import { Checkbox, ComboBox, Divider, H3, P, Spacer } from "~/components"
import { RichTextEditor } from "~/components/rich-text-editor"
import { LoginForm } from "../resources.login"

// TODO: Pull from a pool of example stories from the backend;
const exampleStory = `
<h1>The Adventures of the Time-Traveling Mustache and the Missing Piece of Toasted Cheese</h1>
<p>In the heart of the mystical forest, lived a curious mustache named Mr. Whiskers. He was an enigma to all those who crossed his path. With his striking black fur and piercing green eyes, he always managed to leave a lasting impression. But what truly set him apart was his ability to traverse the fabric of time. Some said he was a wizard, while others whispered that he was cursed. Regardless of their beliefs, everyone in the village agreed that Mr. Whiskers was a creature unlike any other.</p>
<p>One fateful morning, Mr. Whiskers was suddenly awoken by a voice that echoed through his mind. It was a voice he had never heard before, yet it felt familiar. It whispered words that he couldn't understand but he knew he had to listen. With a sense of urgency, Mr. Whiskers set off on a journey that would take him far beyond the boundaries of the mystical forest and beyond the reach of time itself. In search of the missing piece of toasted cheese, he would unravel the secrets of the universe and discover the truth about himself.</p>`

export default function HomepageRoute() {
  const [visibleInFeeds, setVisibleInFeeds] = React.useState(true)
  const [collaborationMode, setCollaborationMode] = React.useState({
    name: "Linear",
    value: "linear",
  })
  return (
    <>
      <H3>A ridiculous experiment in collaborative storytelling.</H3>
      <P>
        Start writing a story. Choose your collaboration settings. Share it.
        Watch the magic unfold.
      </P>

      <section>
        <Spacer size="xl" />
        {/* <img */}
        {/*   src="/assets/start-writing-here.png" */}
        {/*   alt="Start writing here" */}
        {/*   className="ml-10 block w-full max-w-[150px] sm:max-w-[175px]" */}
        {/* /> */}
        <Divider label="Story Editor" />
        <Spacer size="sm" />
        <RichTextEditor
          initialContent={exampleStory}
          onUpdate={(v) => console.log(v)}
        />
      </section>

      <section>
        <Spacer size="xl" />
        {/* <div className="flex flex-row justify-end pr-10 sm:pr-32"> */}
        {/*   <img */}
        {/*     src="/assets/awesome-configure-settings.png" */}
        {/*     alt="Awesome! Now, configure your settings" */}
        {/*     className="ml-10 block w-full max-w-[150px] sm:max-w-[175px]" */}
        {/*   /> */}
        {/* </div> */}
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
        {/* <img */}
        {/*   src="/assets/login-to-save-story.png" */}
        {/*   alt="You need to be logged in so we can save your story" */}
        {/*   className="ml-12 block w-full max-w-[175px] sm:max-w-[200px]" */}
        {/* /> */}
        <Divider label="Login" />
        <Spacer size="sm" />
        <LoginForm />
      </section>

      <section>
        <Spacer size="xl" />
        {/* <img */}
        {/*   src="/assets/woot-share-it.png" */}
        {/*   alt="Woot! Let's share it!" */}
        {/*   className="ml-12 block w-full max-w-[175px] sm:max-w-[200px]" */}
        {/* /> */}
        <Divider label="Share" />
      </section>

      <Spacer size="xl" />
    </>
  )
}
