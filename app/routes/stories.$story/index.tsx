import { json, LoaderArgs } from "@remix-run/node"
import { ShouldRevalidateFunction, useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { Column, H1, Spacer } from "~/components"

const mockStoryData = [
  {
    id: "1",
    content: "<p>Story content goes here.</p>",
    author: "janedoe",
  },
  {
    id: "2",
    content: "<p>Second piece of story content goes here.</p>",
    author: "johndoe",
    parentStoryPart: "1",
  },
  {
    id: "3",
    content: "<p>Second alt piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "1",
  },
]

const paramsSchema = z.object({
  story: z.string(),
  part: z.string().optional(),
})

export const loader = ({ params }: LoaderArgs) => {
  const { story, part } = paramsSchema.parse(params)
  const storyData = mockStoryData
  return json({ storyData, story, part }, 200)
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  defaultShouldRevalidate,
}) => {
  return defaultShouldRevalidate
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <Column>
      <Spacer size="xl" />
      <H1>Story</H1>
      <Spacer size="sm" />
      {data.part == null && (
        <div dangerouslySetInnerHTML={{ __html: data.storyData[0].content }} />
      )}
    </Column>
  )
}
