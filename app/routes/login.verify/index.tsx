import { ActionArgs, json, redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm, validationError } from "remix-validated-form"
import z from "zod"

import { Link } from "@remix-run/react"
import { Column, FormInput, H1, P, Spacer } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"

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

export default function LoginRoute() {
  return (
    <Column>
      <Spacer size="xl" />
      <H1>Verify Login</H1>
      <Spacer size="sm" />
      <ValidatedForm method="post" validator={validator}>
        <P>
          Drop the code we <em>sent to your email</em> * in the prompt below to
          complete your login.
        </P>
        <Spacer size="md" />
        <FormInput
          autoFocus
          id="code"
          name="code"
          type="text"
          label="Code"
          placeholder="123456"
        />
        <Spacer size="sm" />
        <FormSubmitButton>Complete Login</FormSubmitButton>
        <P className="text-sm italic">
          * You may need to wait a minute or two to receive the code within your
          inbox. If you still haven't received it after this time you can{" "}
          <Link to="/login">try to send another code</Link>.
        </P>
      </ValidatedForm>
    </Column>
  )
}
