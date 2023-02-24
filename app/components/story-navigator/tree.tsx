import useSize from "@react-hook/size"
import { select } from "d3-selection"
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom"
import React from "react"
import { StoryTree } from "~/domain/stories"
import { config } from "./config"
import {
  createNavigatorData,
  StoryNavigatorData,
  StoryNavigatorNode,
} from "./lib"
import { TreeLink } from "./tree-link"
import { TreeNode } from "./tree-node"

export type StoryNavigatorTreeProps = {
  tree: StoryTree
  activePartId: string
  onNodeClick: (node: StoryNavigatorNode) => void
}

export const StoryNavigatorTree: React.FC<StoryNavigatorTreeProps> = (
  props,
) => {
  const [data, setData] = React.useState<StoryNavigatorData | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [width, height] = useSize(containerRef)

  const scaleRef = React.useRef(1)

  const svgId = React.useId()
  const gId = React.useId()

  const centerNode = React.useCallback(
    (node: StoryNavigatorNode, animate = true) => {
      const svg = select(`[data-d3-id="${svgId}"]`)
      const g = select(`[data-d3-id="${gId}"]`)
      const scale = scaleRef.current

      const x = -node.x * scale + width / 2
      const y = -node.y * scale + height / 3

      if (animate) {
        // @ts-ignore
        g.transition()
          .duration(1000)
          .attr(
            "transform",
            "translate(" + x + "," + y + ")scale(" + scale + ")",
          )
      } else {
        g.attr(
          "transform",
          "translate(" + x + "," + y + ")scale(" + scale + ")",
        )
      }

      // Sets the viewport to the new center so that it does not jump back to
      // original coordinates when dragged/zoomed
      // @ts-ignore
      svg.call(d3Zoom().transform, zoomIdentity.translate(x, y).scale(scale))
    },
    [svgId, gId, width, height],
  )

  // Initialise the navigator data
  React.useEffect(() => {
    setData(createNavigatorData(props))
  }, [props.tree, props.activePartId])

  // After data is initialised center the active story node
  React.useEffect(() => {
    if (data == null) return
    const leafNode = data.thread[data.thread.length - 1]
    centerNode(leafNode, false)
  }, [data])

  // After the data is initialised ensure than panning and zooming are enabled
  React.useEffect(() => {
    if (data == null) return

    const svg = select(`[data-d3-id="${svgId}"]`)
    const g = select(`[data-d3-id="${gId}"]`)

    // Enables panning and zooming
    svg.call(
      // @ts-ignore
      d3Zoom()
        .scaleExtent([config.scaleExtent.min, config.scaleExtent.max])
        .on("zoom", (event: any) => {
          g.attr("transform", event.transform)
          scaleRef.current = event.transform.k
        }),
    )
  }, [data])

  return (
    <div
      className="relative h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
      draggable={false}
      ref={containerRef}
    >
      {data ? (
        <svg data-d3-id={svgId} width="100%" height="100%">
          <g
            data-d3-id={gId}
            className="relative"
            transform={`translate(${config.translate.x},${config.translate.y}) scale(${config.scale})`}
          >
            {data.links.map((link) => (
              <TreeLink
                key={link.target.data.id}
                link={link}
                thread={data.thread}
              />
            ))}
            {data.nodes.map((node) => (
              <TreeNode
                key={node.data.id}
                node={node}
                thread={data.thread}
                onClick={(node) => {
                  props.onNodeClick(node)
                  centerNode(node)
                }}
              />
            ))}
          </g>
        </svg>
      ) : null}
    </div>
  )
}
