import clsx from "clsx"
import { HierarchyPointNode } from "d3-hierarchy"
import React from "react"
import { TreeNodeDatum } from "./tree"

const DEFAULT_NODE_CIRCLE_RADIUS = 15

function transformForNode(node: HierarchyPointNode<TreeNodeDatum>) {
  return `translate(${node.x},${node.y})`
}

export type TreeNodeProps = {
  node: HierarchyPointNode<TreeNodeDatum>
  onClick: (node: HierarchyPointNode<TreeNodeDatum>) => void
}

export const TreeNode: React.FC<TreeNodeProps> = (props) => {
  const nodeRef = React.useRef<SVGGElement>(null)

  return (
    <g transform={transformForNode(props.node)} ref={nodeRef}>
      <circle
        className={clsx(
          !props.node.data.active && "fill-slate-300",
          props.node.data.active && "fill-blue-500",
          "cursor-pointer stroke-none",
        )}
        r={DEFAULT_NODE_CIRCLE_RADIUS}
        onClick={() => {
          props.onClick(props.node)
        }}
      />
      <g className="pointer-events-none">
        <text className="fill-white stroke-none font-extrabold">
          {props.node.data.name}
        </text>
      </g>
    </g>
  )
}
