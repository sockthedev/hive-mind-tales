import { ActionArgs, json } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm, validationError } from "remix-validated-form"
import z from "zod"

import { useFetcher } from "@remix-run/react"
import { FormInput, P } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
  }),
)

export const action = async ({ request }: ActionArgs) => {
  switch (request.method) {
    case "POST": {
      const data = await validator.validate(await request.formData())
      if (data.error) {
        return validationError(data.error)
      }
      // TODO:
      // - Generate a code and send an email
      // - Only send the code back in response for dev
      return json({ code: "123456" }, 200)
    }
    default: {
      return json({ message: "Method not allowed" }, 405)
    }
  }
}

export type LoginFormProps = {}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const fetcher = useFetcher()
  return (
    <ValidatedForm
      method="post"
      fetcher={fetcher}
      validator={validator}
      action="/resources/login"
    >
      <P>Fill in your email and we'll send you a code to get logged in.</P>
      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="your@emailaddress.com"
      />
      <FormSubmitButton />
    </ValidatedForm>
  )
}
