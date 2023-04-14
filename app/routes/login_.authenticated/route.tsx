import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import { badRequest } from "remix-utils"
import { ValidatedForm, validationError } from "remix-validated-form"
import { z } from "zod"

import { FormInput } from "~/app/components/form-input"
import { FormSubmitButton } from "~/app/components/form-submit-button"
import { H1 } from "~/app/components/h1"
import { NarrowContent } from "~/app/components/narrow-content"
import { P } from "~/app/components/p"
import { Spacer } from "~/app/components/spacer"
import { apiClient } from "~/app/server/api-client.server"
import { parseLoginActionCookie } from "~/app/server/login-action.server"

export const loader = async ({ request }: LoaderArgs) => {
  const user = await apiClient({
    request,
    auth: true,
    thunk: (client) => client.users.me.query(),
  })

  const loginAction = await parseLoginActionCookie(request)

  let redirectUrl = "/"

  if (loginAction) {
    switch (loginAction.type) {
      case "create-story": {
        const { story, part } = await apiClient({
          request,
          auth: true,
          thunk: (client) =>
            client.stories.create.mutate({
              title: loginAction.payload.title,
              content: loginAction.payload.content,
              visibleInFeeds: loginAction.payload.visibleInFeeds,
            }),
        })

        redirectUrl = `/stories/${story.storyId}/${part.partId}/share`
        break
      }
      case "create-part": {
        const part = await apiClient({
          request,
          auth: true,
          thunk: (client) => client.stories.addPart.mutate(loginAction.payload),
        })
        redirectUrl = `/stories/${part.storyId}/${part.partId}/share`
        break
      }
      case "redirect": {
        redirectUrl = loginAction.payload.url
        break
      }
    }
  }

  const url = new URL(request.url)
  if (url.searchParams.get("isFirstLogin") !== "true") {
    throw redirect(redirectUrl)
  }

  return {
    username: user.username,
    redirectUrl,
  }
}

export const formSchema = withZod(
  z.object({
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(15, { message: "Username cannot be more than 15 characters long" })
      .regex(
        /^[a-z][a-z0-9]{0,14}$/i,
        "Username must start with a letter and can only contain numbers or letters",
      ),
    redirectUrl: z.string().min(1, "redirectUrl is required"),
  }),
)

export async function action({ request }: ActionArgs) {
  if (request.method !== "POST") {
    throw badRequest("Method not allowed")
  }

  const form = await formSchema.validate(await request.formData())
  if (form.error) {
    return validationError(form.error)
  }

  await apiClient({
    request,
    auth: true,
    thunk: (client) =>
      client.users.updateMyUsername.mutate({
        username: form.data.username,
      }),
  })

  return redirect(form.data.redirectUrl)
}

export default function AuthenticatedRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <NarrowContent>
      <Spacer size="xl" />
      <H1>Customize your Username</H1>
      <Spacer size="xl" />
      <ValidatedForm method="POST" validator={formSchema}>
        <P>
          We've automatically assigned a username to you. This is what we'll
          display against your stories. You can customize it now, or change it
          later.
        </P>
        <Spacer size="md" />
        <FormInput
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="captainmarvel"
          defaultValue={data.username}
        />
        <input type="hidden" name="redirectUrl" value={data.redirectUrl} />
        <Spacer size="sm" />
        <FormSubmitButton className="w-full">
          Save and continue
        </FormSubmitButton>
        <Spacer size="sm" />
        <Link className="font-semibold text-indigo-700" to={data.redirectUrl}>
          Skip and continue
        </Link>
      </ValidatedForm>
    </NarrowContent>
  )
}
