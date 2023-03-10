import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ActionArgs, json, redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm, validationError } from "remix-validated-form"
import z from "zod"
import { FormInput, H1, Spacer } from "~/app/components"
import { FormSubmitButton } from "~/app/components/form-submit-button"
import { NarrowContent } from "~/app/components/narrow-content"

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
      // - Log the code to console in dev
      return redirect("/login/verify")
    }
    default: {
      return json({ message: "Method not allowed" }, 405)
    }
  }
}

type IconButtonProps = {
  children: React.ReactNode
  icon: IconProp
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-x-2 rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <FontAwesomeIcon
        icon={props.icon}
        className="-ml-0.5 h-5 w-5"
        aria-hidden="true"
      />
      {props.children}
    </button>
  )
}

export default function LoginRoute() {
  return (
    <NarrowContent>
      <Spacer size="xl" />
      <H1>Sign in</H1>
      <Spacer size="xl" />
      <ValidatedForm method="post" validator={validator}>
        <hr />
        <IconButton icon={faTwitter}>Continue with Twitter</IconButton>
        <Spacer size="sm" />
        <IconButton icon={faGoogle}>Continue with Google</IconButton>
        <Spacer size="md" />
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-yellow-50 px-2 text-sm text-gray-500">or</span>
          </div>
        </div>
        <Spacer size="sm" />
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="your@emailaddress.com"
        />
        <Spacer size="sm" />
        <FormSubmitButton className="w-full">Continue</FormSubmitButton>
      </ValidatedForm>
    </NarrowContent>
  )
}
