import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { z } from "zod"

import { H1, H2, Spacer } from "~/app/components"
import { NarrowContent } from "~/app/components/narrow-content"
import { Quote } from "~/app/components/quote"
import { Username } from "~/app/components/username"
import { apiClient } from "~/app/server/api-client.server"

const paramsSchema = z.object({
  storyId: z.string(),
  partId: z.string(),
})

export async function loader({ request, params }: LoaderArgs) {
  const { storyId, partId } = paramsSchema.parse(params)

  const [story, part] = await apiClient({
    request,
    thunk: (client) =>
      Promise.all([
        client.stories.getStory.query({ storyId }),
        client.stories.getPartOrRootPart.query({ storyId, partId }),
      ]),
  })

  // TODO: Cache control headers?
  return json(
    {
      story,
      part,
    },
    200,
  )
}

export default function ShareStoryPartRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <NarrowContent>
      <Spacer size="lg" />

      <H1>Share</H1>

      <Quote>
        You are inviting others to collaborate on the following story...
      </Quote>

      <H2>{data.story.title}</H2>
      <span className="block text-xs italic text-slate-400">
        A story initiated by <Username>{data.story.createdByUsername}</Username>
      </span>

      <Spacer size="sm" />

      <Quote>
        They will be invited to continue the story after this part...
      </Quote>

      {data.story.rootPartId !== data.part.partId && (
        <span className="block text-right text-xs italic text-slate-400">
          Collaboration by <Username>{data.part.createdByUsername}</Username>;
        </span>
      )}
      <div dangerouslySetInnerHTML={{ __html: data.part.content }} />

      <Spacer size="md" />

      <Quote>
        Select any of the following methods below to create your invitation...
      </Quote>

      <a
        className="twitter-share-button"
        href="https://twitter.com/intent/tweet?text=Hello%20world"
      >
        Tweet
      </a>
    </NarrowContent>
  )
}
