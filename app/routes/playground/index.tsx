import { Column } from "~/components"
import { Tree } from "~/components/tree"

export default function PlaygroundRoute() {
  return (
    <Column>
      <div className="h-[400px] w-full border-2 border-pink-500">
        <Tree />
      </div>
    </Column>
  )
}
