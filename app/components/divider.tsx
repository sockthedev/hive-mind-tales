export type DividerProps = {
  label?: string
}

export const Divider: React.FC<DividerProps> = (props) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      {props.label && (
        <div className="relative flex justify-center">
          <span className="bg-yellow-50 px-3 text-lg font-medium text-gray-900">
            {props.label}
          </span>
        </div>
      )}
    </div>
  )
}
