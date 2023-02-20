import clsx from "clsx"

export type ColumnProps = {
  children: React.ReactNode
  size?: "md" | "md+"
}

export const Column: React.FC<ColumnProps> = (props) => {
  const { size = "md" } = props
  return (
    <div
      className={clsx(
        size === "md+" && "px-0 sm:px-0 lg:px-0",
        size === "md" && "px-4 sm:px-6 lg:px-8",
        "mx-auto max-w-3xl",
      )}
    >
      {props.children}
    </div>
  )
}
