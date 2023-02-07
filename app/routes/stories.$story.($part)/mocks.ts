import { StoryPart } from "./types"

export const mockStoryParts: StoryPart[] = [
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
  {
    id: "4",
    content: "<p>Third piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "2",
  },
  {
    id: "5",
    content: "<p>Fourth piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "4",
  },
  {
    id: "6",
    content: "<p>Third piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "3",
  },
]
