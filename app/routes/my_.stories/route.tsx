import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"

import { H2, Spacer } from "~/app/components"
import { H1 } from "~/app/components/h1"
import { LinkButton } from "~/app/components/link-button"
import { NarrowContent } from "~/app/components/narrow-content"
import { P } from "~/app/components/p"
import { apiClient } from "~/app/server/api-client.server"

export async function loader({ request }: LoaderArgs) {
  const stories = await apiClient({
    request,
    thunk: (client) => client.stories.mine.query(),
    auth: true,
  })

  return {
    stories,
  }
}

export default function MyStoriesRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <NarrowContent>
      <Spacer size="lg" />

      <H1>My Stories</H1>
      <P>Here are all the stories you've started...</P>

      <Spacer size="md" />

      {data.stories.map((story) => (
        <div key={story.storyId}>
          <H2>{story.title}</H2>
          <div dangerouslySetInnerHTML={{ __html: story.content }} />
          <P>
            <LinkButton
              to={`/stories/${story.storyId}/${story.rootPartId}/read`}
            >
              Read
            </LinkButton>
          </P>
          <Spacer size="lg" />
        </div>
      ))}
    </NarrowContent>
  )
}
