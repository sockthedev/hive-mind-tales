export type TwoColumnContentProps = {
  left: () => React.ReactNode
  right: () => React.ReactNode
}

export const TwoColumnContent: React.FC<TwoColumnContentProps> = (props) => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-1">{props.left()}</div>
        <div className="col-span-2">{props.right()}</div>
      </div>
    </div>
  )
}
