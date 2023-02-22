export type TwoColumnContentProps = {
  left: () => React.ReactNode
  right: () => React.ReactNode
}

export const TwoColumnContent: React.FC<TwoColumnContentProps> = (props) => {
  return (
    <div className="grid h-full grid-cols-1 gap-7 lg:grid-cols-8">
      <div className="col-span-3">{props.left()}</div>
      <div className="col-span-5 overflow-auto">{props.right()}</div>
    </div>
  )
}
