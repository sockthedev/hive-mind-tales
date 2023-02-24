import clsx from "clsx"
import { linkVertical } from "d3-shape"
import invariant from "tiny-invariant"
import { StoryNavigatorLink, StoryNavigatorNode } from "./lib"

function drawPath({ source, target }: StoryNavigatorLink) {
  const path = linkVertical()({
    source: [source.x, source.y],
    target: [target.x, target.y],
  })
  invariant(path, "path should be defined")
  return path
}

export type TreeLinkProps = {
  link: StoryNavigatorLink
  thread: StoryNavigatorNode[]
}

export const TreeLink = (props: TreeLinkProps) => {
  const isActive = props.thread.some(
    (node) => node.data.id === props.link.target.data.id,
  )

  return (
    <path
      className={clsx(
        "pointer-events-none fill-none stroke-2 transition duration-1000",
        isActive ? "stroke-blue-500" : "stroke-slate-300",
      )}
      d={drawPath(props.link)}
      data-source-id={props.link.source.id}
      data-target-id={props.link.target.id}
    />
  )
}
