import { useWindowSize } from "@react-hook/window-size"
import React from "react"
import {
  StoryNavigatorServerComponent,
  StoryNavigatorServerComponentProps,
} from "../resources.stories.tree/route"

export type {
  StoryNavigatorData,
  StoryNavigatorLink,
  StoryNavigatorNode,
} from "~/components/story-navigator"

export const ResponsiveStoryNavigator: React.FC<
  StoryNavigatorServerComponentProps
> = (props) => {
  const [width] = useWindowSize({
    leading: false,
  })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    setIsMobile(width < 1024)
  }, [width])

  return isMobile ? (
    <span>MOBILE</span>
  ) : (
    // This is an unholy abomination. I'm sorry. It's the only way I could
    // get the sticky nav to work, taking up the full screen height.
    <div className="absolute -top-14 left-0 h-[calc(100%+9rem)] min-h-full w-full">
      <div className="sticky top-0 left-0 h-[100vh] min-h-[100vh-3.5rem] w-full pt-14">
        <StoryNavigatorServerComponent
          storyId={props.storyId}
          activePartId={props.activePartId}
          onNodeClick={props.onNodeClick}
        />
      </div>
    </div>
  )
}
