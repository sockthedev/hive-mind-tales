import { ClientOnly } from "remix-utils"
import { StoryNavigatorTree, StoryNavigatorTreeProps } from "./tree"

export type {
  StoryNavigatorData,
  StoryNavigatorLink,
  StoryNavigatorNode,
} from "./tree"

export const StoryNavigator: React.FC<StoryNavigatorTreeProps> = (props) => {
  return (
    <ClientOnly fallback={<div className="h-full w-full">Loading...</div>}>
      {() => <StoryNavigatorTree {...props} />}
    </ClientOnly>
  )
}
