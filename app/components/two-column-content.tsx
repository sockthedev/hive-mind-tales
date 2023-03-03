export type TwoColumnContentProps = {
  left: () => React.ReactNode
  right: () => React.ReactNode
}

export const TwoColumnContent: React.FC<TwoColumnContentProps> = (props) => {
  return (
    <div className="relative flex flex-col lg:flex-row">
      <div className="relative lg:h-full lg:w-2/5">{props.left()}</div>
      <div className="lg:w-3/5 lg:pl-7">{props.right()}</div>
    </div>
  )
}
