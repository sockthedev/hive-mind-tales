import { useField } from "remix-validated-form"
import { Input, InputProps } from "./input"

export type FormInputProps = InputProps & {
  name: string
}

export const FormInput: React.FC<FormInputProps> = (props) => {
  const { error, getInputProps } = useField(props.name)
  return <Input {...getInputProps(props)} error={error} />
}
