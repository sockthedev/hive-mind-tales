import clsx from "clsx"
import { HierarchyPointLink } from "d3-hierarchy"
import { linkVertical } from "d3-shape"
import invariant from "tiny-invariant"
import { TreeData } from "./tree"

export type TreeLinkProps<Data> = {
  link: HierarchyPointLink<TreeData<Data>>
}

function drawPath<Data>({
  source,
  target,
}: HierarchyPointLink<TreeData<Data>>) {
  const path = linkVertical()({
    source: [source.x, source.y],
    target: [target.x, target.y],
  })
  invariant(path, "path should be defined")
  return path
}

export const TreeLink = <Data extends unknown>(props: TreeLinkProps<Data>) => {
  return (
    <path
      className={clsx(
        "pointer-events-none fill-none stroke-2 transition duration-1000",
        props.link.target.data.active ? "stroke-blue-500" : "stroke-slate-300",
      )}
      d={drawPath(props.link)}
      data-source-id={props.link.source.id}
      data-target-id={props.link.target.id}
    />
  )
}
