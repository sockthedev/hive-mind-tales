import clsx from "clsx"

export type ColumnProps = {
  children: React.ReactNode
  size?: "md" | "md+"
}

export const Column: React.FC<ColumnProps> = (props) => {
  return (
    <div
      className={clsx(
        "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8",
        props.size === "md+" && "px-0 sm:px-0 lg:px-0",
      )}
    >
      {props.children}
    </div>
  )
}
