export type StoryPart = {
  id: string
  content: string
  author: string
  parentStoryPart?: string
}

export type StoryNode = StoryPart & { children: StoryTree[] }

export type StoryTree = StoryNode
