import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React from "react"
import { RichTextEditorMarkMenu } from "./rich-text-editor-mark-menu"
import { RichTextEditorNodeMenu } from "./rich-text-editor-node-menu"

export type RichTextEditorProps = {
  className?: string
  initialContent: string
  name?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const [html, setHtml] = React.useState(props.initialContent)

  const editor = useEditor({
    onUpdate: ({ editor }) => {
      // TODO: This gets executed for every update. I'm wondering if we should
      // use a debounce callback instead? Current Discord thread seems to think
      // it's fine:
      // https://discord.com/channels/818568566479257641/818569721934774272/1014793086414626866
      setHtml(editor.getHTML())
    },
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "pl-3 border-l-2 italic my-4",
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
    ],
    content: props.initialContent ?? `<h1></h1><p></p>`,
    editorProps: {
      attributes: {
        class:
          "cursor-pointer focus:cursor-auto py-4 px-4 sm:px-6 lg:px-8 transition-all border border-transparent outline-none focus:shadow-2xl focus:border-slate-100 focus:bg-yellow-100",
      },
    },
  })

  return (
    <>
      <EditorContent
        name={props.name}
        className={props.className}
        editor={editor}
      >
        {editor && <RichTextEditorMarkMenu editor={editor} />}
        {editor && <RichTextEditorNodeMenu editor={editor} />}
      </EditorContent>
      <input type="hidden" name={props.name} value={html} />
    </>
  )
}
