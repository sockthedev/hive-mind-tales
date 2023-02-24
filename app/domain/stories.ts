import invariant from "tiny-invariant"

const mockStoryParts: StoryPart[] = [
      {
        id: "1",
        content: `
          <p>In the heart of the mystical forest, lived a curious mouse named Ms. Whiskers. She was an enigma to all those who crossed her path. With her striking black fur and piercing green eyes, she always managed to leave a lasting impression. But what truly set her apart was her ability to traverse the fabric of time. Some said she was a wizard, while others whispered that she was cursed. Regardless of their beliefs, everyone in the village agreed that Ms. Whiskers was a creature unlike any other.</p>
          <p>One fateful morning, Ms. Whiskers was suddenly awoken by a voice that echoed through her mind. It was a voice she had never heard before, yet it felt familiar. It whispered words that she couldn't understand but she knew she had to listen. With a sense of urgency, Ms. Whiskers set off on a journey that would take her far beyond the boundaries of the mystical forest and beyond the reach of time itself. In search of the missing piece of toasted cheese, she would unravel the secrets of the universe and discover the truth about herself.</p>
        `,
        author: "janedoe",
      },
      {
        id: "2",
        content: `
          <p>For days, Ms. Whiskers scurried through dense forests and climbed steep mountains, following the strange voice that guided her every step. She crossed rivers and battled fierce beasts, but her determination never wavered. Finally, after what felt like an eternity, she arrived at a cavernous opening that seemed to lead into the very heart of the earth.</p>
          <p>With her heart pounding in her chest, Ms. Whiskers crept inside and was immediately enveloped by darkness. She could barely see her own paw in front of her face, but she continued forward, relying on her intuition to guide her. Suddenly, she heard a faint rustling sound, and her whiskers twitched in excitement. She knew that the missing piece of toasted cheese was close at hand. With bated breath, she advanced into the darkness, ready for whatever lay ahead.</p>
        `,
        author: "johndoe",
        parentStoryPartId: "1",
      },
      {
        id: "3",
        content: "<p>Second alt piece of story content goes here.</p>",
        author: "pling",
        parentStoryPartId: "1",
      },
      {
        id: "4",
        content: ` 
            <p>As she drew closer, the rustling sound grew louder, until Ms. Whiskers could make out a dim shape in the distance. She approached cautiously, her senses alert for any sign of danger. As she drew closer, the shape became clearer, until she could see that it was a small creature - a fellow mouse, much like herself.<p>
            <p>"Who are you?" Ms. Whiskers asked, her voice trembling with excitement.</p>
            <p>The other mouse looked up, startled, and sniffed the air suspiciously. "I am a traveler, much like yourself," she said. "I have been searching for the missing piece of toasted cheese, just like you. But it seems that we are not alone in our quest." With a flick of her tail, she motioned to the shadows, where the glint of sharp eyes could be seen. "There are others who seek the cheese, and they will stop at nothing to find it. We must be careful."</p>
        `,
        author: "pling",
        parentStoryPartId: "2",
      },
      {
        id: "5",
        content: `
          <p>Ms. Whiskers peered into the shadows, her heart beating faster with every passing moment. She knew that danger lurked in the darkness, but she was determined to find the missing piece of toasted cheese. "We can't give up now," she said, her voice firm. "We've come too far to turn back."</p>
          <p>With a nod, the other mouse agreed. "Very well," she said. "But we must be quick. The others are not far behind us." Together, the two mice crept deeper into the darkness, their senses on high alert. The rustling grew louder and more insistent, until they could see the outlines of a dozen or more creatures lurking in the shadows.</p>
          <p>"We've found it!" one of the creatures hissed, its eyes gleaming with a fierce intensity. "The missing piece of toasted cheese is ours!" Ms. Whiskers and the other mouse exchanged a nervous glance, then darted forward, their paws pounding on the cold stone floor. A fierce battle ensued, with claws and teeth flying in all directions. But in the end, it was Ms. Whiskers who emerged victorious, clutching the missing piece of toasted cheese in her paws. With a triumphant squeak, she and the other mouse made their way back to the light, ready to face whatever challenges lay ahead.</p>
        `,
        author: "pling",
        parentStoryPartId: "4",
      },
      {
        id: "6",
        content: "<p>Third piece of story content goes here.</p>",
        author: "pling",
        parentStoryPartId: "3",
      },
    ]

export type Story = {
  id: string
  title: string
  rootStoryPartId: string
  createdAt: string
  createdBy: string
}

export type StoryPart = {
  id: string
  content: string
  author: string
  parentStoryPartId?: string
}

export type StoryNode = Omit<StoryPart, "content"> & {
  children: StoryTree[]
}

export type StoryTree = StoryNode

export type StoryThread = StoryPart[]

export abstract class Stories {
  // Gets all the parts of a story
  private static async getParts(args: {
    storyId: string
  }): Promise<StoryPart[]> {
    // TODO:
    // - Convert this to a database call
    // - This is just returning mock data for now
    return mockStoryParts; 
  }

  static async getStory(args: { storyId: string }): Promise<Story> {
    return {
      id: args.storyId,
      title:
        "The Adventures of the Time-Traveling Mouse and the Missing Piece of Toasted Cheese",
      rootStoryPartId: "1",
      createdAt: "2023-02-18T14:30:00.000Z",
      createdBy: "janedoe",
    }
  }

  static async getPart(args: { partId: string }): Promise<StoryPart> {
    const part = mockStoryParts.find((part) => part.id === args.partId)
    invariant(part, `Could not find story part with id ${args.partId}`)
    return part
  }

  static async getPartOrRootPart(args: { storyId: string, partId?: string }): Promise<StoryPart> {
    const story = await this.getStory(args);
    const part = await this.getPart({ partId: args.partId ?? story.rootStoryPartId })
    return part;
  }

  // Gets a breadcrumb of story parts from the root to the target left part.
  // If the leaf part is not specified, then only the root part is returned
  // within the breadcrumb.
  static async getThread(args: {
    storyId: string
    threadEndPartId?: string
  }): Promise<StoryThread> {
    // TODO:
    // - Utilise a recursive query to get this from the database
    // - https://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query

    const parts = await this.getParts(args)

    const breadcrumb: StoryPart[] = []

    const findParent = (partId: string) => {
      const part = parts.find((part) => part.id === partId)
      invariant(part, `Could not find part with id ${partId}`)
      breadcrumb.push(part)
      if (part.parentStoryPartId) {
        findParent(part.parentStoryPartId)
      }
    }

    findParent(args.threadEndPartId ?? parts[0].id)

    return breadcrumb.reverse()
  }

  // Gets a tree representation of all the parts for a story.
  static async getTree(args: { storyId: string }): Promise<StoryTree> {
    // TODO:
    // - Change this to a database call that just gets the minimum amount of data required to build the tree
    const parts = await this.getParts(args)

    const rootItem = parts.find((part) => part.parentStoryPartId == null)
    invariant(rootItem, "No root part found")

    const rootNode: StoryNode = {
      id: rootItem.id,
      author: rootItem.author,
      children: [],
    }

    const nodeMap = new Map<string, StoryNode>()
    nodeMap.set(rootNode.id, rootNode)

    // Note: this only works if parts are in ascending order
    parts.forEach((part) => {
      if (part === rootItem) return

      invariant(part.parentStoryPartId, "Multiple root nodes found")

      const node: StoryNode = {
        id: part.id,
        author: part.author,
        children: [],
        parentStoryPartId: part.parentStoryPartId,
      }

      nodeMap.set(part.id, node)

      const parentNode = nodeMap.get(part.parentStoryPartId)
      if (parentNode) {
        parentNode.children = parentNode.children || []
        parentNode.children.push(node)
      }
    })

    return rootNode
  }
}
