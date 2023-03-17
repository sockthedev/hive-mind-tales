import { useField } from "remix-validated-form"

import type { InputProps } from "./input"
import { Input } from "./input"

export type FormInputProps = InputProps & {
  name: string
}

export const FormInput: React.FC<FormInputProps> = (props) => {
  const { error, getInputProps } = useField(props.name)
  return <Input {...props} {...getInputProps(props)} error={error} />
}
