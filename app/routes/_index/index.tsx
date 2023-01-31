import { H1, H2, P, Spacer } from "~/components"
import { RichTextEditor } from "~/components/rich-text-editor"

export default function Index() {
  return (
    <>
      <Spacer size="sm" />
      <H1>Hive Mind Tales</H1>
      <H2>A ridiculous experiment in storytelling</H2>
      <P>
        Hive Mind Tales is a collaborative storytelling experiment. Start
        writing a story then click the "Configure" button. We'll then show you a
        few options allowing you to customize how others can collaborate with
        your story. When you're happy click the "Collaborate" button and a
        unique link will be generated allowing others to begin collorating with
        you.
      </P>
      <Spacer size="md" />
      <hr />
      <Spacer size="sm" />
      <em>
        Click the text below to edit your story. Feel free to change the title
        and the body of course.
      </em>
      <Spacer size="sm" />
      <hr />
      <Spacer size="md" />
      <RichTextEditor onUpdate={(v) => console.log(v)} />
    </>
  )
}
