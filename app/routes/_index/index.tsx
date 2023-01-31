import { H1, H2, H3, P, Spacer } from "~/components"
import { RichTextEditor } from "~/components/rich-text-editor"

export default function Index() {
  return (
    <>
      <Spacer size="sm" />
      <H2>Hive Mind Tales</H2>
      <H3>A ridiculous experiment in collaborative storytelling</H3>
      <P>
        Start writing a story, configure how others can collaborate, then share
        the generated link to start the magic.
      </P>
      <P className="text-center">
        <em>
          (<strong>Hint:</strong> You can click on and edit any of the text
          below)
        </em>
      </P>
      <Spacer size="lg" />
      <RichTextEditor onUpdate={(v) => console.log(v)} />
    </>
  )
}
