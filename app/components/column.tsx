export type ColumnProps = {
  children: React.ReactNode
}

export const Column: React.FC<ColumnProps> = (props) => {
  return <div className={"mx-auto max-w-7xl"}>{props.children}</div>
}
