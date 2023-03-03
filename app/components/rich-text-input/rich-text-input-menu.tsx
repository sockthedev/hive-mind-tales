import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { Editor } from "@tiptap/react"
import clsx from "clsx"

export const MenuContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex-row rounded-md bg-gray-800 px-3 py-2 align-middle">
    {children}
  </div>
)

export const MenuButton: React.FC<{
  editor: Editor
  icon: IconDefinition
  isActive: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}> = ({ icon, isActive, onClick }) => (
  <button className="inline-block h-6 w-6" onClick={onClick} type="button">
    <FontAwesomeIcon
      icon={icon}
      className={clsx("text-sm font-bold text-white", {
        "text-yellow-300": isActive,
      })}
    />
  </button>
)

export const MenuSeperator: React.FC = () => (
  <span className="px-2 text-xl font-thin leading-none text-gray-300">|</span>
)
