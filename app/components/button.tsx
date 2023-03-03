import clsx from "clsx"

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}

export const Button: React.FC<ButtonProps> = ({
  className,
  size = "md",
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        size === "sm" && "px-2.5 py-1.5 text-xs",
        size === "md" && "px-3 py-2 text-sm",
        size === "lg" && "px-4 py-2 text-sm",
        size === "xl" && "px-4 py-2 text-base",
        size === "2xl" && "px-6 py-3 text-base",
        className,
      )}
    >
      {props.children ?? "Submit"}
    </button>
  )
}
