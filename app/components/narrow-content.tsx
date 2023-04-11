export type NarrowContentProps = {
  children: React.ReactNode
}

export const NarrowContent: React.FC<NarrowContentProps> = (props) => {
  return <div className="mx-auto max-w-2xl">{props.children}</div>
}
