import clsx from "clsx"
import React from "react"
import { StoryNavigatorNode } from "./lib"

const DEFAULT_NODE_CIRCLE_RADIUS = 15

export type TreeNodeProps = {
  node: StoryNavigatorNode
  thread: StoryNavigatorNode[]
  onClick: (node: StoryNavigatorNode) => void
}

export const TreeNode = (props: TreeNodeProps) => {
  const nodeRef = React.useRef<SVGGElement>(null)
  const isActive = props.thread.some(
    (node) => node.data.partId === props.node.data.partId,
  )

  return (
    <g transform={`translate(${props.node.x},${props.node.y})`} ref={nodeRef}>
      <circle
        className={clsx(
          "cursor-pointer stroke-none transition duration-1000",
          isActive ? "fill-blue-500" : "fill-slate-300",
        )}
        r={DEFAULT_NODE_CIRCLE_RADIUS}
        onClick={() => {
          props.onClick(props.node)
        }}
      />
      {/* <g className="pointer-events-none"> */}
      {/*   <text className="fill-white stroke-none font-extrabold"> */}
      {/*     {props.node.data.author} */}
      {/*   </text> */}
      {/* </g> */}
    </g>
  )
}
