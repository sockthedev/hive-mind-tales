import {
  faBold,
  faItalic,
  faStrikethrough,
} from "@fortawesome/free-solid-svg-icons"
import type { Editor } from "@tiptap/core"
import { isTextSelection } from "@tiptap/core"
import type { EditorState } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import type { Editor as ReactEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react"

import { MenuButton, MenuContainer } from "./rich-text-editor-menu"

const shouldShow: (props: {
  editor: Editor
  view: EditorView
  state: EditorState
  oldState?: EditorState
  from: number
  to: number
}) => boolean = ({ editor, view, state, from, to }) => {
  if (!editor.isActive("paragraph")) {
    return false
  }

  // The below was lifted from the source code, i.e. the default behaviour
  // that requires a non empty selection must be present;

  const { doc, selection } = state
  const { empty } = selection

  // Sometimes check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(state.selection)

  if (!view.hasFocus() || empty || isEmptyTextBlock) {
    return false
  }

  return true
}

export const RichTextEditorMarkMenu: React.FC<{ editor: ReactEditor }> = ({
  editor,
}) => (
  <BubbleMenu
    editor={editor}
    tippyOptions={{
      duration: 100,
      popperOptions: {
        strategy: "fixed",
      },
    }}
    shouldShow={shouldShow}
  >
    <MenuContainer>
      <MenuButton
        editor={editor}
        icon={faBold}
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <MenuButton
        editor={editor}
        icon={faItalic}
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <MenuButton
        editor={editor}
        icon={faStrikethrough}
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
    </MenuContainer>
  </BubbleMenu>
)
