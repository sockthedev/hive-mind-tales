import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { Editor } from "@tiptap/react"
import clsx from "clsx"

export const MenuContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="bg-gray-800 rounded-md px-3 py-2 flex-row align-middle">
    {children}
  </div>
)

export const MenuButton: React.FC<{
  editor: Editor
  icon: IconDefinition
  isActive: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}> = ({ icon, isActive, onClick }) => (
  <button className="inline-block w-6 h-6" onClick={onClick}>
    <FontAwesomeIcon
      icon={icon}
      className={clsx("text-white font-bold text-sm", {
        "text-yellow-300": isActive,
      })}
    />
  </button>
)

export const MenuSeperator: React.FC = () => (
  <span className="text-gray-300 text-xl leading-none font-thin px-2">|</span>
)
