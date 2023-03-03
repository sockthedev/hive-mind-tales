import { useField } from "remix-validated-form"
import { TitleInput, TitleInputProps } from "./title-input"

export type FormTitleInputProps = TitleInputProps & {
  name: string
}
export const FormTitleInput: React.FC<FormTitleInputProps> = (props) => {
  const { error, getInputProps } = useField(props.name)
  return <TitleInput {...props} {...getInputProps(props)} error={error} />
}
