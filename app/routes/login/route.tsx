import type { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm } from "remix-validated-form"
import invariant from "tiny-invariant"
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

export const loader = async () => {
  invariant(process.env["API_URL"], "API_URL is required")
  return json({
    apiUrl: process.env["API_URL"],
  })
}

type IconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  children: React.ReactNode
  icon: IconProp
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  icon,
  ...props
}) => {
  return (
    <button
      {...props}
      className="flex w-full items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <FontAwesomeIcon
        icon={icon}
        className="-ml-0.5 h-5 w-5"
        aria-hidden="true"
      />
      {children}
    </button>
  )
}

export default function LoginRoute() {
  const { apiUrl } = useLoaderData<typeof loader>()
  return (
    <NarrowContent>
      <Spacer size="xl" />
      <H1>Sign in</H1>
      <Spacer size="xl" />
      <hr />

      <form method="GET" action={`${apiUrl}/auth/twitter/authorize`}>
        <IconButton icon={faTwitter} type="submit">
          Continue with Twitter
        </IconButton>
      </form>

      <Spacer size="sm" />

      <form method="GET" action={`${apiUrl}/auth/google/authorize`}>
        <IconButton icon={faGoogle} type="submit">
          Continue with Google
        </IconButton>
      </form>

      <Spacer size="md" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-yellow-50 px-2 text-sm text-gray-500">or</span>
        </div>
      </div>

      <Spacer size="sm" />

      <ValidatedForm method="POST" validator={validator}>
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
