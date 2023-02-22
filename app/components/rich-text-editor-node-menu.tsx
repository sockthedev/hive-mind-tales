import {
  faHeading,
  faPlusCircle,
  faQuoteLeft,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"
import type { Editor } from "@tiptap/core"
import type { EditorState } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import type { Editor as ReactEditor } from "@tiptap/react"
import { FloatingMenu } from "@tiptap/react"
import React from "react"
import { MenuButton, MenuContainer } from "./rich-text-editor-menu"

const shouldShow: (props: {
  editor: Editor
  view: EditorView
  state: EditorState
  oldState?: EditorState
}) => boolean = ({ editor, view }) => {
  // Only show the menu if in an empty paragraph node;

  if (!editor.isActive("paragraph") || editor.isActive("blockquote")) {
    return false
  }
  const text = view.state.selection.$head.parent.textContent
  const isEmpty = text.length === 0
  return isEmpty
}

export const RichTextEditorNodeMenu: React.FC<{ editor: ReactEditor }> = ({
  editor,
}) => {
  const [showButtons, setShowButtons] = React.useState(false)

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        offset: () => [0, 10],
        popperOptions: {
          // strategy: "absolute",
          placement: "left",
        },
        onHide: () => {
          setShowButtons(false)
        },
      }}
      shouldShow={shouldShow}
    >
      <MenuContainer>
        <MenuButton
          editor={editor}
          icon={showButtons ? faTimesCircle : faPlusCircle}
          isActive={false}
          onClick={() => {
            setShowButtons(!showButtons)
          }}
        />
        {showButtons && (
          <>
            <MenuButton
              editor={editor}
              icon={faHeading}
              isActive={false}
              onClick={() => {
                editor.chain().focus().setHeading({ level: 1 }).run()
                setShowButtons(false)
              }}
            />
            <MenuButton
              editor={editor}
              icon={faQuoteLeft}
              isActive={false}
              onClick={() => {
                editor.chain().focus().setBlockquote().run()
                setShowButtons(false)
              }}
            />
          </>
        )}
      </MenuContainer>
    </FloatingMenu>
  )
}
