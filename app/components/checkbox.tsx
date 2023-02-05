import { Switch } from "@headlessui/react"
import clsx from "clsx"

export type CheckboxProps = {
  checked?: boolean
  onChange: (checked: boolean) => void
  label: string
  name?: string
  description: string
}

// TODO:
// - Add disabled support
// - Add error support
export const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label
          as="span"
          className="text-sm font-medium text-gray-900"
          passive
        >
          {props.label}
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          {props.description}
        </Switch.Description>
      </span>
      <Switch
        checked={props.checked}
        name={props.name}
        onChange={props.onChange}
        className={clsx(
          props.checked ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            props.checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
