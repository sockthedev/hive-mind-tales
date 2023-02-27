import clsx from "clsx"

export type SpacerProps = {
  size: "xs" | "sm" | "md" | "lg" | "xl"
}

export const Spacer: React.FC<SpacerProps> = (props) => {
  return (
    <div
      className={clsx(
        props.size === "xs" && "h-1 lg:h-2",
        props.size === "sm" && "h-2 lg:h-4",
        props.size === "md" && "h-4 lg:h-8",
        props.size === "lg" && "h-8 lg:h-12",
        props.size === "xl" && "h-12 lg:h-16",
      )}
    ></div>
  )
}
