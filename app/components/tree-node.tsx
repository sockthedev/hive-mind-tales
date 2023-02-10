import clsx from "clsx"
import { HierarchyPointNode } from "d3-hierarchy"
import React from "react"
import { TreeData } from "./tree"

const DEFAULT_NODE_CIRCLE_RADIUS = 15

function transformForNode<Data>(node: HierarchyPointNode<TreeData<Data>>) {
  return `translate(${node.x},${node.y})`
}

export type TreeNodeProps<Data> = {
  node: HierarchyPointNode<TreeData<Data>>
  onClick: (node: HierarchyPointNode<TreeData<Data>>) => void
}

export const TreeNode = <Data extends unknown>(props: TreeNodeProps<Data>) => {
  const nodeRef = React.useRef<SVGGElement>(null)

  return (
    <g transform={transformForNode(props.node)} ref={nodeRef}>
      <circle
        className={clsx(
          "cursor-pointer stroke-none transition duration-1000",
          props.node.data.active ? "fill-blue-500" : "fill-slate-300",
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
