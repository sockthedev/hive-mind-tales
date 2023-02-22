import clsx from "clsx"

export type PProps = {
  children: React.ReactNode
  className?: string
}

export const P: React.FC<PProps> = (props) => {
  return (
    <p
      className={clsx(
        "text-lg leading-7 [&:not(:first-child)]:mt-6",
        props.className,
      )}
    >
      {props.children}
    </p>
  )
}
