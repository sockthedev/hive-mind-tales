import clsx from "clsx"

export type SpacerProps = {
  size: "xs" | "sm" | "md" | "lg" | "xl"
}

export const Spacer: React.FC<SpacerProps> = (props) => {
  return (
    <div
      className={clsx(
        props.size === "xs" && "h-2",
        props.size === "sm" && "h-4",
        props.size === "md" && "h-8",
        props.size === "lg" && "h-12",
        props.size === "xl" && "h-16",
      )}
    ></div>
  )
}
