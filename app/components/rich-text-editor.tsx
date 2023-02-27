import { CharacterCount } from "@tiptap/extension-character-count"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React from "react"
import { RichTextEditorMarkMenu } from "./rich-text-editor-mark-menu"
import { RichTextEditorNodeMenu } from "./rich-text-editor-node-menu"

const CHARACTER_LIMIT = 3000

export type RichTextEditorProps = {
  className?: string
  initialContent: string
  name?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const [html, setHtml] = React.useState(props.initialContent)

  const editor = useEditor({
    onUpdate: ({ editor }) => {
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
            class: "text-lg leading-7 mt-6",
          },
        },
      }),
      CharacterCount.configure({
        limit: CHARACTER_LIMIT,
      }),
    ],
    content: props.initialContent ?? `<h1></h1><p></p>`,
    editorProps: {
      attributes: {
        class: "cursor-pointer focus:cursor-auto outline-none",
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
      <span className="block text-right text-xs italic text-slate-400">
        {editor?.storage.characterCount.characters()} / {CHARACTER_LIMIT}{" "}
        characters
      </span>
      <input type="hidden" name={props.name} value={html} />
    </>
  )
}
