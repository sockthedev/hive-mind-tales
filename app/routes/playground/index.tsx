import { HierarchyPointNode } from "d3-hierarchy"
import React from "react"
import rfdc from "rfdc"
import invariant from "tiny-invariant"
import { Column } from "~/components"
import { createTreeData, Tree, TreeData } from "~/components/tree"
import { mockStoryParts } from "../stories.$storyId.($leafPartId)/mocks"
import { StoryPart } from "../stories.$storyId.($leafPartId)/types"

const cloneDeep = rfdc({ proto: false, circles: true })

// TODO: Move this to a util
function findNode(
  newData: TreeData<StoryPart>,
  id: string,
): TreeData<StoryPart> | undefined {
  if (newData.id === id) {
    return newData
  }
  if (newData.children) {
    for (const child of newData.children) {
      const found = findNode(child, id)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

export default function PlaygroundRoute() {
  const [data, setData] = React.useState<TreeData<StoryPart>>(
    createTreeData({
      items: mockStoryParts,
      id: (d) => d.id,
      name: (d) => d.author,
      parentId: (d) => d.parentStoryPart ?? null,
    }),
  )
  const [selectedNode, setSelectedNode] =
    React.useState<TreeData<StoryPart> | null>(null)

  const onNodeClick = React.useCallback(
    (node: HierarchyPointNode<TreeData<StoryPart>>) => {
      setData((data) => {
        // TODO: This doesn't work anymore because of circular references 🙈
        const newData = cloneDeep(data)

        // Ensure the current node and it's parents are reset to be inactive
        if (selectedNode) {
          let currentNode: TreeData<StoryPart> | undefined = findNode(
            newData,
            selectedNode.id,
          )
          invariant(currentNode, "Node not found")
          while (currentNode) {
            currentNode.active = false
            console.log(`Deactivating ${currentNode.id}`)
            currentNode = currentNode.parent
          }
        }

        // Active the newly selected node and all of it's parents
        const nodeToToggle = findNode(newData, node.data.id)
        invariant(nodeToToggle, "Node not found")
        if (nodeToToggle) {
          let currentNode: TreeData<StoryPart> | undefined = nodeToToggle
          while (currentNode) {
            currentNode.active = true
            console.log(`Activating ${currentNode.id}`)
            currentNode = currentNode.parent
          }
          setSelectedNode(nodeToToggle)
        }

        return newData
      })
    },
    [setSelectedNode, selectedNode],
  )

  return (
    <Column>
      <div className="h-[400px] w-full border-2 border-pink-500">
        <Tree data={data} onNodeClick={onNodeClick} />
      </div>
    </Column>
  )
}
