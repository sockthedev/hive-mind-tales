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
      className="fill-none stroke-black"
      d={drawPath(props.link)}
      data-source-id={props.link.source.id}
      data-target-id={props.link.target.id}
    />
  )
}
