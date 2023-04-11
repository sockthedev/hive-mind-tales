import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import React from "react"
import { ClientOnly } from "remix-utils"
import { z } from "zod"

import { Divider, H1, Spacer } from "~/app/components"
import { LinkButton } from "~/app/components/link-button"
import { ScrollToMe } from "~/app/components/scroll-to-me"
import type { StoryNavigatorNode } from "~/app/components/story-navigator"
import { TwoColumnContent } from "~/app/components/two-column-content"
import { Username } from "~/app/components/username"
import { apiClient } from "~/app/server/api-client.server"

import { ResponsiveStoryNavigator } from "./responsive-story-navigator"

const paramsSchema = z.object({
  storyId: z.string(),
  partId: z.string().optional(),
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

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const onNodeClick = React.useCallback(
    (node: StoryNavigatorNode) => {
      navigate(`/stories/${data.story.storyId}/${node.data.partId}`, {
        preventScrollReset: true,
      })
    },
    [data.story.storyId, navigate],
  )

  return (
    <TwoColumnContent
      left={() => (
        <ClientOnly fallback={null}>
          {() => (
            <ResponsiveStoryNavigator
              storyId={data.story.storyId}
              activePartId={data.part.partId}
              onNodeClick={onNodeClick}
            />
          )}
        </ClientOnly>
      )}
      right={() => (
        <>
          <ScrollToMe className="-translate-y-14" scrollId={data.part.partId} />

          <Spacer size="lg" />

          <H1>{data.story.title}</H1>
          <span className="block text-xs italic text-slate-400">
            A story initiated by <Username>{data.story.createdBy}</Username>
          </span>

          <Spacer size="xl" />

          {data.story.rootPartId !== data.part.partId && (
            <span className="block text-right text-xs italic text-slate-400">
              Collaboration by <Username>{data.part.createdBy}</Username>;
            </span>
          )}
          <div dangerouslySetInnerHTML={{ __html: data.part.content }} />

          <Spacer size="xl" />

          <Divider
            label="Continue this thread?"
            hint="Add your own spin, or invite others below"
          />
          <Spacer size="md" />
          <div className="text-center">
            <LinkButton
              to={`/stories/${data.story.storyId}/${data.part.partId}/collaborate}`}
            >
              Collaborate
            </LinkButton>
            <LinkButton
              to={`/stories/${data.story.storyId}/${data.part.partId}/share}`}
            >
              Invite
            </LinkButton>
          </div>
        </>
      )}
    />
  )
}
