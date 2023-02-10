// TODO: Convert the type back to StoryPart[]
export const mockStoryParts: any = [
  {
    id: "1",
    content: "<p>Story content goes here.</p>",
    author: "janedoe",
    __rd3t: {
      collapsed: false,
    },
  },
  {
    id: "2",
    content: "<p>Second piece of story content goes here.</p>",
    author: "johndoe",
    parentStoryPart: "1",
    __rd3t: {
      collapsed: false,
    },
  },
  {
    id: "3",
    content: "<p>Second alt piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "1",
    __rd3t: {
      collapsed: true,
    },
  },
  {
    id: "4",
    content: "<p>Third piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "2",
    __rd3t: {
      collapsed: true,
    },
  },
  {
    id: "5",
    content: "<p>Fourth piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "4",
    __rd3t: {
      collapsed: true,
    },
  },
  {
    id: "6",
    content: "<p>Third piece of story content goes here.</p>",
    author: "pling",
    parentStoryPart: "3",
    __rd3t: {
      collapsed: true,
    },
  },
]
