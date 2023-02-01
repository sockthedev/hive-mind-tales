import { H3, P, Spacer } from "~/components"
import { RichTextEditor } from "~/components/rich-text-editor"

// TODO: Pull from a pool of example stories from the backend;
const exampleStory = `
<h1>The Adventures of the Time-Traveling Mustache and the Missing Piece of Toasted Cheese</h1>
<p>In the heart of the mystical forest, lived a curious mustache named Mr. Whiskers. He was an enigma to all those who crossed his path. With his striking black fur and piercing green eyes, he always managed to leave a lasting impression. But what truly set him apart was his ability to traverse the fabric of time. Some said he was a wizard, while others whispered that he was cursed. Regardless of their beliefs, everyone in the village agreed that Mr. Whiskers was a creature unlike any other.</p>
<p>One fateful morning, Mr. Whiskers was suddenly awoken by a voice that echoed through his mind. It was a voice he had never heard before, yet it felt familiar. It whispered words that he couldn't understand but he knew he had to listen. With a sense of urgency, Mr. Whiskers set off on a journey that would take him far beyond the boundaries of the mystical forest and beyond the reach of time itself. In search of the missing piece of toasted cheese, he would unravel the secrets of the universe and discover the truth about himself.</p>`

export default function Index() {
  return (
    <>
      <H3>A ridiculous experiment in collaborative storytelling.</H3>
      <P>
        Start writing a story. Configure the collaboration settings. Share it.
        Watch the magic unfold.
      </P>
      <Spacer size="md" />
      <img
        src="/assets/start-writing-here.png"
        alt="Start writing here"
        className="ml-10 block w-full max-w-[150px]"
      />
      <Spacer size="sm" />
      <RichTextEditor
        initialContent={exampleStory}
        onUpdate={(v) => console.log(v)}
      />
    </>
  )
}
