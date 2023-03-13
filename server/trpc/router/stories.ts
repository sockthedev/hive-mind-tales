import { z } from "zod"

import { Stories } from "~/server/domain/stories.js"

import { authProcedure } from "./lib/auth-procedure.js"
import { t } from "./lib/builder.js"

export const stories = t.router({
  // Mutations
  create: authProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        visibleInFeeds: z.boolean(),
      }),
    )
    .mutation(({ input }) => {
      return Stories.create({
        title: input.title,
        content: input.content,
        visibleInFeeds: input.visibleInFeeds,
      })
    }),
  addPart: authProcedure
    .input(
      z.object({
        storyId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return Stories.addPart({
        storyId: input.storyId,
        content: input.content,
      })
    }),

  // Queries
  getTree: t.procedure
    .input(z.object({ storyId: z.string() }))
    .query(({ input }) => {
      return Stories.getTree({ storyId: input.storyId })
    }),
  getStory: t.procedure
    .input(z.object({ storyId: z.string() }))
    .query(({ input }) => {
      return Stories.getStory({ storyId: input.storyId })
    }),
  getPartOrRootPart: t.procedure
    .input(z.object({ storyId: z.string(), partId: z.string().optional() }))
    .query(({ input }) => {
      return Stories.getPartOrRootPart({
        storyId: input.storyId,
        partId: input.partId,
      })
    }),
  mine: authProcedure.query(() => {
    return Stories.getMyStories()
  }),
})
