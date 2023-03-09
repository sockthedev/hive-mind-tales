// @ts-ignore
import { CharacterCount } from "@tiptap/extension-character-count"
import Placeholder from "@tiptap/extension-placeholder"
// @ts-ignore
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React from "react"
import sanitizeHtml from "sanitize-html"
import { RichTextEditorMarkMenu } from "./rich-text-input-mark-menu"

const CHARACTER_LIMIT = 3000

export type RichTextInputProps = {
  className?: string
  defaultValue?: string
  id?: string
  name?: string
  error?: string
  placeholder?: string
}

export const RichTextInput: React.FC<RichTextInputProps> = (props) => {
  const uniqId = React.useId()
  const { error, ...inputProps } = props
  const errorMessageElementId = `${inputProps.id ?? uniqId}-error`
  const errorProps = props.error
    ? {
        "aria-invalid": true,
        "aria-describedby": errorMessageElementId,
      }
    : {}

  const [html, setHtml] = React.useState(props.defaultValue)

  const editor = useEditor({
    // @ts-ignore
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
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: props.placeholder ?? "Start writing your story...",
      }),
    ],
    content: props.defaultValue ?? "<p></p>",
    editorProps: {
      attributes: {
        class: "cursor-pointer focus:cursor-auto outline-none",
      },
      // @ts-ignore
      transformPastedHTML: (html) => {
        return sanitizeHtml(html, {
          allowedTags: ["b", "i", "em", "strong", "p", "br"],
          allowedAttributes: {
            p: ["class"],
          },
        })
      },
    },
    parseOptions: {},
  })

  return (
    <>
      <EditorContent
        {...errorProps}
        id={props.id ?? uniqId}
        name={props.name}
        className={props.className}
        editor={editor}
      >
        {editor && <RichTextEditorMarkMenu editor={editor} />}
      </EditorContent>
      <span className="block text-right text-xs italic text-slate-400">
        {editor?.storage.characterCount.characters()} / {CHARACTER_LIMIT}{" "}
        characters
      </span>
      <input type="hidden" name={props.name} value={html} />
      <p className="mt-2 text-sm text-red-600" id={errorMessageElementId}>
        {error}
      </p>
    </>
  )
}
