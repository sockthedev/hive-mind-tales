import { HierarchyPointNode } from "d3-hierarchy"
import React from "react"
import { TreeNodeDatum } from "./tree"

const DEFAULT_NODE_CIRCLE_RADIUS = 15

function transformForNode(
  node: HierarchyPointNode<TreeNodeDatum>,
  shouldTranslateToOrigin = false,
) {
  const { parent } = node
  if (shouldTranslateToOrigin) {
    const hasParent = parent !== null && parent !== undefined
    const originX = hasParent ? parent.x : 0
    const originY = hasParent ? parent.y : 0
    return `translate(${originX},${originY})`
  }
  return `translate(${node.x},${node.y})`
}

export type TreeNodeProps = {
  node: HierarchyPointNode<TreeNodeDatum>
}

export const TreeNode: React.FC<TreeNodeProps> = (props) => {
  const nodeRef = React.useRef<SVGGElement>(null)

  // React.useEffect(() => {
  //   if (nodeRef.current) {
  //     select(nodeRef.current)
  //       .attr("transform", transformForNode(props.node))
  //       .style("opacity", 1)
  //   }
  // }, [])

  return (
    <g transform={transformForNode(props.node)} ref={nodeRef}>
      <circle
        r={DEFAULT_NODE_CIRCLE_RADIUS}
        onClick={(evt) => {
          // toggleNode()
          // onNodeClick(evt)
        }}
      />
      <g className="rd3t-label">
        <text className="fill-white stroke-none font-extrabold">
          {props.node.data.name}
        </text>
      </g>
    </g>
  )
}
