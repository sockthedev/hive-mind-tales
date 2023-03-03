import { ActionArgs, json, redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm, validationError } from "remix-validated-form"
import z from "zod"

import { Link } from "@remix-run/react"
import { FormInput, H1, P, Spacer } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"
import { NarrowContent } from "~/components/narrow-content"

export const validator = withZod(
  z.object({
    code: z.string().min(1, { message: "Code is required" }),
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
      // - Verify the code
      //   - if code is valid then create the user record if they don't already
      //     have one, generate a random username too, and if it is their
      //     first time logging in then redirect them to the pick username
      //     route
      //   - if the code is invalid send back an error asking them to retry
      return redirect("/login/pick-username", 302)
    }
    default: {
      return json({ message: "Method not allowed" }, 405)
    }
  }
}

export default function LoginVerifyRoute() {
  return (
    <NarrowContent>
      <Spacer size="xl" />
      <H1>Check your email</H1>
      <Spacer size="xl" />
      <ValidatedForm method="post" validator={validator}>
        <P>Enter the verification code that was sent to your email address.</P>
        <Spacer size="md" />
        <FormInput
          id="code"
          name="code"
          type="text"
          label="Code"
          placeholder="123456"
        />
        <Spacer size="sm" />
        <FormSubmitButton className="w-full">Continue</FormSubmitButton>
        <Spacer size="sm" />
        <Link className="font-semibold text-indigo-700" to="/login">
          Use another method
        </Link>
      </ValidatedForm>
    </NarrowContent>
  )
}
