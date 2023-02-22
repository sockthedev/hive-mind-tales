import { H1, Spacer } from "~/components"

import { ActionArgs, json, redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm, validationError } from "remix-validated-form"
import z from "zod"

import { FormInput, P } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"
import { NarrowContent } from "~/components/narrow-content"

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
  }),
)

export const action = async ({ request }: ActionArgs) => {
  console.log("🥸 request.method", request.method)
  switch (request.method) {
    case "POST": {
      const data = await validator.validate(await request.formData())
      if (data.error) {
        return validationError(data.error)
      }
      // TODO:
      // - Generate a code and send an email
      // - Log the code to console in dev
      return redirect("/login/verify")
    }
    default: {
      return json({ message: "Method not allowed" }, 405)
    }
  }
}

export default function LoginRoute() {
  return (
    <NarrowContent>
      <Spacer size="xl" />
      <H1>Login</H1>
      <Spacer size="sm" />
      <ValidatedForm method="post" validator={validator}>
        <P>Fill in your email and we'll send you a code to get logged in.</P>
        <Spacer size="md" />
        <FormInput
          autoFocus
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="your@emailaddress.com"
        />
        <Spacer size="sm" />
        <FormSubmitButton>Send Code</FormSubmitButton>
      </ValidatedForm>
    </NarrowContent>
  )
}
