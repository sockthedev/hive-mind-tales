export type NarrowContentProps = {
  children: React.ReactNode
}

export const NarrowContent: React.FC<NarrowContentProps> = (props) => {
  return <div className="mx-auto max-w-xl">{props.children}</div>
}
