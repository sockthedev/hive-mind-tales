import { H1, Spacer } from "~/components"

import { ActionArgs, json, redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm, validationError } from "remix-validated-form"
import z from "zod"

import { Link } from "@remix-run/react"
import { FormInput, P } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"
import { NarrowContent } from "~/components/narrow-content"

export const validator = withZod(
  z.object({
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(15, { message: "Username cannot be more than 15 characters long" })
      .regex(
        /^[a-z][a-z0-9]{0,14}$/i,
        "Username must start with a letter and can only contain numbers or letters",
      ),
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
      // - Save the username
      // - Redirect to the story
      return redirect("/stories/abd32fdsdf234343", {
        status: 302,
      })
    }
    default: {
      return json({ message: "Method not allowed" }, 405)
    }
  }
}

export default function LoginPickUsernameRoute() {
  return (
    <NarrowContent>
      <Spacer size="xl" />
      <H1>Update Username</H1>
      <Spacer size="xl" />
      <ValidatedForm method="post" validator={validator}>
        <P>
          We've automatically assigned a username to you. You can customize it
          now, or update it later.
        </P>
        <Spacer size="md" />
        <FormInput
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="captainmarvel"
        />
        <Spacer size="sm" />
        <FormSubmitButton className="w-full">
          Save and continue
        </FormSubmitButton>
        <Spacer size="sm" />
        <Link className="font-semibold text-indigo-700" to="/login">
          Skip and continue
        </Link>
      </ValidatedForm>
    </NarrowContent>
  )
}
