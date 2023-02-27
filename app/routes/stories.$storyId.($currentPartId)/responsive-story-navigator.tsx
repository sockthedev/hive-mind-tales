import { faClose, faSitemap } from "@fortawesome/free-solid-svg-icons"
import { useWindowSize } from "@react-hook/window-size"
import React from "react"
import { IconButton } from "~/components/icon-button"
import {
  FullStackStoryNavigator,
  FullStackStoryNavigatorProps,
} from "../resources.stories.tree/route"

export type {
  StoryNavigatorData,
  StoryNavigatorLink,
  StoryNavigatorNode,
} from "~/components/story-navigator"

export const ResponsiveStoryNavigator: React.FC<
  FullStackStoryNavigatorProps
> = (props) => {
  const [width] = useWindowSize({
    leading: false,
  })
  const [isMobile, setIsMobile] = React.useState(false)
  const [showMobileNav, setShowMobileNav] = React.useState(false)

  React.useEffect(() => {
    setIsMobile(width < 1024)
  }, [width])

  // TODO:
  // - Look into doing the mobile view without the use of JS logic. i.e. pure
  //   CSS approach.

  return isMobile ? (
    <div className="pointer-events-none fixed top-0 left-0 z-50 h-screen w-screen">
      <div className="pointer-events-auto absolute bottom-2 right-2">
        <IconButton
          icon={faSitemap}
          onClick={() => setShowMobileNav(true)}
          size="2xl"
        />
      </div>
      {showMobileNav && (
        <div className="pointer-events-auto absolute top-0 left-0 h-screen w-screen bg-yellow-50">
          <FullStackStoryNavigator
            storyId={props.storyId}
            activePartId={props.activePartId}
            onNodeClick={(n) => {
              setShowMobileNav(false)
              props.onNodeClick(n)
            }}
          />
          <div className="pointer-events-auto absolute bottom-2 right-2">
            <IconButton
              icon={faClose}
              onClick={() => setShowMobileNav(false)}
              size="2xl"
            />
          </div>
        </div>
      )}
    </div>
  ) : (
    // This is an unholy abomination. I'm sorry. It's the only way I could
    // get the sticky nav to work, taking up the full screen height.
    <div className="absolute -top-14 left-0 h-[calc(100%+9rem)] min-h-full w-full">
      <div className="sticky top-0 left-0 h-[100vh] min-h-[100vh-3.5rem] w-full pt-14">
        <FullStackStoryNavigator
          storyId={props.storyId}
          activePartId={props.activePartId}
          onNodeClick={props.onNodeClick}
        />
      </div>
    </div>
  )
}
