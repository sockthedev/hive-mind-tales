import { useIsSubmitting } from "remix-validated-form"
import { Button, ButtonProps } from "./button"

export type FormSubmitButtonProps = ButtonProps & {
  children?: React.ReactNode
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  children,
  ...props
}) => {
  const isSubmitting = useIsSubmitting()
  return (
    <Button {...props} type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : children ?? "Submit"}
    </Button>
  )
}
