import { HierarchyPointNode } from "d3-hierarchy"
import React from "react"
import { Column } from "~/components"
import { RawTreeNode, Tree } from "~/components/tree"
import { mockStoryParts } from "../stories.$storyId.($leafPartId)/mocks"
import { StoryPart } from "../stories.$storyId.($leafPartId)/types"

export default function PlaygroundRoute() {
  const [selectedNode, setSelectedNode] = React.useState<HierarchyPointNode<
    RawTreeNode<StoryPart>
  > | null>(null)

  const onNodeClick = React.useCallback(
    (node: HierarchyPointNode<RawTreeNode<StoryPart>>) => {
      setSelectedNode(node)
    },
    [setSelectedNode, selectedNode],
  )

  return (
    <Column>
      <div className="h-[400px] w-full border-2 border-pink-500">
        <Tree
          items={mockStoryParts}
          id={(d) => d.id}
          name={(d) => d.author}
          parentId={(d) => d.parentStoryPart ?? null}
          activeDataId={mockStoryParts[0].id}
          onNodeActivated={onNodeClick}
        />
      </div>
    </Column>
  )
}
