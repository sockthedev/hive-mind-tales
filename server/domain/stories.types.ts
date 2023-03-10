import { Part } from "../db/db.types"

export type { Part } from "../db/db.types"

export type StoryNode = Omit<Part, "content" | "createdAt" | "storyId"> & {
  children: StoryTree[]
}

export type StoryTree = StoryNode

export type StoryThread = Part[]
