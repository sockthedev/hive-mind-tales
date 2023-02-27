import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"

export type IconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  icon: IconDefinition
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}

export const IconButton: React.FC<IconButtonProps> = ({
  className,
  size = "md",
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "focus:ring-offset- inline-flex items-center rounded-full border border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500",
        size === "sm" && "p-1",
        size === "md" && "p-1.5",
        size === "lg" && "p-2",
        size === "xl" && "p-2",
        size === "2xl" && "p-3",
        className,
      )}
    >
      <FontAwesomeIcon
        className={clsx(
          size === "sm" && "h-5 w-5",
          size === "md" && "h-5 w-5",
          size === "lg" && "h-5 w-5",
          size === "xl" && "h-6 w-6",
          size === "2xl" && "h-6 w-6",
        )}
        icon={props.icon}
      />
    </button>
  )
}
