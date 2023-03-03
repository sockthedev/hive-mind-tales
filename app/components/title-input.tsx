import clsx from "clsx"
import React, { Fragment } from "react"
import ReactTextareaAutosize from "react-textarea-autosize"

export type TitleInputProps = Omit<
  React.ComponentPropsWithoutRef<"textarea">,
  "style"
> & {
  error?: string
}

export const TitleInput: React.FC<TitleInputProps> = (props) => {
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
    <Fragment>
      <ReactTextareaAutosize
        {...inputProps}
        {...errorProps}
        id={inputProps.id ?? uniqId}
        className={clsx(
          "w-full scroll-m-20 border-0 border-b border-transparent bg-transparent p-0 text-3xl font-extrabold tracking-tight shadow-none outline-none focus:border-b-blue-600 focus:ring-0 lg:text-5xl",
          props.className,
        )}
      />
      <p className="mt-2 text-sm text-red-600" id={errorMessageElementId}>
        {error}
      </p>
    </Fragment>
  )
}
