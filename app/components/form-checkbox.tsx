import { useField } from "remix-validated-form"
import { Checkbox, CheckboxProps } from "./checkbox"

export type FormCheckboxProps = CheckboxProps & {
  name: string
}
export const FormCheckbox: React.FC<FormCheckboxProps> = (props) => {
  const { error, getInputProps } = useField(props.name)
  return <Checkbox {...props} {...getInputProps(props)} error={error} />
}
