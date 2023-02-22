export type DividerProps = {
  label: string
  hint?: string
}

export const Divider: React.FC<DividerProps> = (props) => {
  return (
    <div className="relative text-center">
      <span className="px-3 text-lg font-extrabold text-gray-600">
        {props.label}
      </span>
      {props.hint && (
        <div className="text-center text-xs italic text-gray-400">
          ({props.hint})
        </div>
      )}
    </div>
  )
}
