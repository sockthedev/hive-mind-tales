import clsx from "clsx"

export type SpacerProps = {
  size: "sm" | "md" | "lg"
}

export const Spacer: React.FC<SpacerProps> = (props) => {
  return (
    <div
      className={clsx(
        props.size === "sm" && "h-4",
        props.size === "md" && "h-8",
        props.size === "lg" && "h-12",
      )}
    ></div>
  )
}
