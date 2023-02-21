export type DividerProps = {
  label: string
}

export const Divider: React.FC<DividerProps> = (props) => {
  return (
    <div className="relative flex justify-center">
      <span className="bg-yellow-50 px-3 text-lg font-extrabold text-gray-900">
        {props.label}
      </span>
    </div>
  )
}
