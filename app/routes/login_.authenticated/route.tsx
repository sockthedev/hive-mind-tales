import type { LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { apiClient } from "~/app/server/api-client.server"
import { parseLoginActionCookie } from "~/app/server/login-action.server"

export const loader = async ({ request, params }: LoaderArgs) => {
  const loginAction = await parseLoginActionCookie(request)

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
        throw redirect(`/stories/${story.storyId}/${part.partId}/share`, {
          status: 302,
        })
      }
      case "create-part": {
        const part = await apiClient({
          request,
          auth: true,
          thunk: (client) => client.stories.addPart.mutate(loginAction.payload),
        })
        throw redirect(`/stories/${part.storyId}/${part.partId}/share`, {
          status: 302,
        })
      }
      case "redirect": {
        throw redirect(loginAction.payload.url, {
          status: 302,
        })
      }
    }
  }

  if (params["isFirstLogin"] !== "true") {
    throw redirect("/")
  }
}

export default function AuthenticatedRoute() {
  return (
    <div>
      <h1>Welcome to Hive Mind Tales</h1>
    </div>
  )
}
