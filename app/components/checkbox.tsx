import { Switch } from "@headlessui/react"
import { clsx } from "clsx"
import React, { Fragment } from "react"

export type CheckboxProps = React.ComponentPropsWithoutRef<"input"> & {
  defaultChecked: boolean
  label: string
  description: string
  name: string
  value: string
  error?: string
}

// TODO:
// - Add disabled support
export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const uniqId = React.useId()
  const { error, ...inputProps } = props
  const errorMessageElementId = `${inputProps.id ?? uniqId}-error`
  const errorProps = props.error
    ? {
        "aria-invalid": true,
        "aria-describedby": errorMessageElementId,
      }
    : {}

  return (
    <>
      <Switch.Group as="div" className="flex items-center justify-between">
        <span className="flex flex-grow flex-col pr-5">
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
          name={props.name}
          defaultChecked={props.defaultChecked}
          as={Fragment}
          value={props.value}
        >
          {({ checked }) => (
            <button
              {...errorProps}
              className={clsx(
                checked ? "bg-indigo-600" : "bg-gray-200",
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
              )}
            >
              <span
                aria-hidden="true"
                className={clsx(
                  checked ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                )}
              />
            </button>
          )}
        </Switch>
      </Switch.Group>
      <p className="mt-2 text-sm text-red-600" id={errorMessageElementId}>
        {error}
      </p>
    </>
  )
}
