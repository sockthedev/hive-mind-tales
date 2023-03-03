import { useField } from "remix-validated-form"
import { RichTextInput, RichTextInputProps } from "./rich-text-input"

export type FormRichTextInputProps = RichTextInputProps & {
  name: string
}
export const FormRichTextInput: React.FC<FormRichTextInputProps> = (props) => {
  const { error, getInputProps } = useField(props.name)
  return <RichTextInput {...props} {...getInputProps(props)} error={error} />
}
