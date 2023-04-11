export type QuoteProps = {
  children: React.ReactNode
}

export const Quote: React.FC<QuoteProps> = (props) => {
  return (
    <p className="border-0 border-l-4 border-slate-500 bg-gray-200 p-4 text-lg leading-7 [&:not(:first-child)]:mt-6">
      {props.children}
    </p>
  )
}
