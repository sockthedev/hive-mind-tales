import { Placeholder } from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { RichTextEditorMarkMenu } from "./rich-text-editor-mark-menu"
import { RichTextEditorNodeMenu } from "./rich-text-editor-node-menu"

export type RichTextEditorProps = {
  className?: string
  initialContent?: string | null
  onUpdate: (content: string) => void
}

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      // TODO: This gets executed for every update. I'm wondering if we should
      // use a debounce callback instead. To be confirmed via TipTap Discord,
      // https://discord.com/channels/818568566479257641/818569721934774272/1014793086414626866
      const value = editor.getHTML()
      props.onUpdate(value)
    },
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "pl-3 border-l-2 italic my-12",
          },
        },
        heading: {
          HTMLAttributes: {
            class:
              "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "leading-7 [&:not(:first-child)]:mt-6",
          },
        },
      }),

      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Title"
          } else if (node.type.name === "paragraph") {
            return "Drop your words..."
          }
          return ""
        },
        showOnlyCurrent: false,
        includeChildren: false,
        showOnlyWhenEditable: true,
      }),
    ],
    content:
      props.initialContent ??
      `<h1>The Adventures of the Time-Traveling Mustache and the Missing Piece of Toasted Cheese</h1>
       <p>In the heart of the mystical forest, lived a curious mustache named Mr. Whiskers. He was an enigma to all those who crossed his path. With his striking black fur and piercing green eyes, he always managed to leave a lasting impression. But what truly set him apart was his ability to traverse the fabric of time. Some said he was a wizard, while others whispered that he was cursed. Regardless of their beliefs, everyone in the village agreed that Mr. Whiskers was a creature unlike any other.</p>
       <p>One fateful morning, Mr. Whiskers was suddenly awoken by a voice that echoed through his mind. It was a voice he had never heard before, yet it felt familiar. It whispered words that he couldn't understand but he knew he had to listen. With a sense of urgency, Mr. Whiskers set off on a journey that would take him far beyond the boundaries of the mystical forest and beyond the reach of time itself. In search of the missing piece of toasted cheese, he would unravel the secrets of the universe and discover the truth about himself.</p>`,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  })

  return (
    <EditorContent className={props.className} editor={editor}>
      {editor && <RichTextEditorMarkMenu editor={editor} />}
      {editor && <RichTextEditorNodeMenu editor={editor} />}
    </EditorContent>
  )
}
