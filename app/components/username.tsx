import clsx from "clsx"

export type UsernameProps = {
  children: string
  className?: string
}

export const Username: React.FC<UsernameProps> = (props) => {
  return (
    <span className={clsx("font-bold", props.className)}>
      @{props.children}
    </span>
  )
}
