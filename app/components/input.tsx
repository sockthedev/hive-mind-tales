import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import React from "react"

export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string
  error?: string
}

export const Input: React.FC<InputProps> = (props) => {
  const uniqId = React.useId()
  const { label, ...inputProps } = props
  const errorMessageElementId = `${inputProps.id ?? uniqId}-error`
  const errorProps = props.error
    ? {
        "aria-invalid": true,
        "aria-describedby": errorMessageElementId,
      }
    : {}
  return (
    <div>
      <label
        htmlFor={inputProps.id ?? uniqId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          {...inputProps}
          {...errorProps}
          className={clsx(
            "block w-full rounded-md pr-10 focus:outline-none sm:text-sm",
            props.error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500",
          )}
        />
        {props.error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-red-600" id={errorMessageElementId}>
        {props.error}
      </p>
    </div>
  )
}
