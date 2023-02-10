import clsx from "clsx"
import { HierarchyPointLink } from "d3-hierarchy"
import { linkVertical } from "d3-shape"
import React from "react"
import invariant from "tiny-invariant"
import { TreeNodeDatum } from "./tree"

export type TreeLinkProps = {
  link: HierarchyPointLink<TreeNodeDatum>
}

function drawPath({ source, target }: HierarchyPointLink<TreeNodeDatum>) {
  const path = linkVertical()({
    source: [source.x, source.y],
    target: [target.x, target.y],
  })
  invariant(path, "path should be defined")
  return path
}

export const TreeLink: React.FC<TreeLinkProps> = (props) => {
  return (
    <path
      className={clsx(
        "pointer-events-none fill-none stroke-2 transition",
        !props.link.target.data.active && "stroke-slate-300",
        props.link.target.data.active && "stroke-blue-500",
      )}
      d={drawPath(props.link)}
      data-source-id={props.link.source.id}
      data-target-id={props.link.target.id}
    />
  )
}