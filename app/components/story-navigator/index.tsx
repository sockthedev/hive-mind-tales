import { ClientOnly } from "remix-utils"
import { StoryNavigatorTree, StoryNavigatorTreeProps } from "./tree"

export type {
  StoryNavigatorData,
  StoryNavigatorLink,
  StoryNavigatorNode,
} from "./tree"

export const StoryNavigator: React.FC<StoryNavigatorTreeProps> = (props) => {
  return (
    <ClientOnly
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          Loading graph...
        </div>
      }
    >
      {() => <StoryNavigatorTree {...props} />}
    </ClientOnly>
  )
}
