import clsx from "clsx"
import {
  hierarchy,
  HierarchyPointLink,
  HierarchyPointNode,
  tree as d3tree,
} from "d3-hierarchy"
import { select } from "d3-selection"
import { linkVertical } from "d3-shape"
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom"
import React from "react"
import invariant from "tiny-invariant"
import { StoryNode, StoryPart, StoryTree } from "~/domain/stories"

// TODO: Change this so that it is dynamically determined based on the size of the container;
const dimensions = {
  width: 704,
  height: 400,
}

const config = {
  nodeSize: {
    x: 90,
    y: 90,
  },
  separation: { siblings: 1, nonSiblings: 2 },
  translate: { x: 0, y: 0 },
  scale: 1,
  scaleExtent: { min: 0.25, max: 1 },
}

function createNavigatorData(tree: StoryTree): StoryNavigatorData {
  const d3Tree = d3tree<StoryNode>()
    .nodeSize([config.nodeSize.x, config.nodeSize.y])
    .separation((a, b) =>
      a.parent?.data.id === b.parent?.data.id
        ? config.separation.siblings
        : config.separation.nonSiblings,
    )

  const rootNode = d3Tree(hierarchy(tree, (d) => d.children))
  const nodes = rootNode.descendants()
  const links = rootNode.links()

  return { nodes, links }
}

function findNode(
  data: StoryNavigatorData,
  storyPart: StoryPart,
): StoryNavigatorNode | null {
  return data.nodes.find((node) => node.data.id === storyPart.id) ?? null
}

export type StoryNavigatorNode = HierarchyPointNode<StoryNode>

export type StoryNavigatorLink = HierarchyPointLink<StoryNode>

export type StoryNavigatorData = {
  nodes: StoryNavigatorNode[]
  links: StoryNavigatorLink[]
}

const DEFAULT_NODE_CIRCLE_RADIUS = 15

type TreeNodeProps = {
  node: StoryNavigatorNode
  onClick: (node: StoryNavigatorNode) => void
}

const TreeNode = (props: TreeNodeProps) => {
  const nodeRef = React.useRef<SVGGElement>(null)

  return (
    <g transform={`translate(${props.node.x},${props.node.y})`} ref={nodeRef}>
      <circle
        className={clsx(
          "cursor-pointer stroke-none transition duration-1000",
          // TODO: Need to make this toggle per breadcrumb data
          props.node.data.parentStoryPartId == null
            ? "fill-blue-500"
            : "fill-slate-300",
        )}
        r={DEFAULT_NODE_CIRCLE_RADIUS}
        onClick={() => {
          props.onClick(props.node)
        }}
      />
      <g className="pointer-events-none">
        <text className="fill-white stroke-none font-extrabold">
          {props.node.data.author}
        </text>
      </g>
    </g>
  )
}

function drawPath({ source, target }: StoryNavigatorLink) {
  const path = linkVertical()({
    source: [source.x, source.y],
    target: [target.x, target.y],
  })
  invariant(path, "path should be defined")
  return path
}

type TreeLinkProps = {
  link: StoryNavigatorLink
}

const TreeLink = (props: TreeLinkProps) => {
  return (
    <path
      className={clsx(
        "pointer-events-none fill-none stroke-2 transition duration-1000",
        // TODO: Need to make this toggle per breadcrumb data
        props.link.target.data.parentStoryPartId == null
          ? "stroke-blue-500"
          : "stroke-slate-300",
      )}
      d={drawPath(props.link)}
      data-source-id={props.link.source.id}
      data-target-id={props.link.target.id}
    />
  )
}

export type StoryNavigatorProps = {
  breadcrumb: StoryPart[]
  tree: StoryTree
  onNodeClick: (node: StoryNavigatorNode) => void
}

export const StoryNavigator = (props: StoryNavigatorProps) => {
  const [data, setData] = React.useState<StoryNavigatorData | null>(null)

  const scaleRef = React.useRef(1)

  const svgId = React.useId()
  const gId = React.useId()

  const centerNode = React.useCallback(
    (node: StoryNavigatorNode, animate = true) => {
      const svg = select(`[data-d3-id="${svgId}"]`)
      const g = select(`[data-d3-id="${gId}"]`)
      const scale = scaleRef.current

      const x = -node.x * scale + dimensions.width / 2
      const y = -node.y * scale + dimensions.height / 3

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

      // @ts-ignore
      // svg.transition().duration(0).attr("opacity", 1)

      // Sets the viewport to the new center so that it does not jump back to original
      // coordinates when dragged/zoomed
      // @ts-ignore
      svg.call(d3Zoom().transform, zoomIdentity.translate(x, y).scale(scale))
    },
    [svgId, gId],
  )

  // "onMount"
  // Initialise the navigator data
  React.useEffect(() => {
    setData(createNavigatorData(props.tree))
  }, [props.tree])

  // After data is initialised center the active story node
  React.useEffect(() => {
    if (data == null) return

    const leafStoryPart = props.breadcrumb[props.breadcrumb.length - 1]

    const activeNode = findNode(data, leafStoryPart)
    invariant(activeNode, "Active node not found")

    centerNode(activeNode, false)
  }, [data, props.breadcrumb])

  // After the data is initialised ensure than panning and zooming are enabled
  React.useEffect(() => {
    if (data == null) return

    const svg = select(`[data-d3-id="${svgId}"]`)
    const g = select(`[data-d3-id="${gId}"]`)

    // Sets initial offset, so that first pan and zoom does not jump back to
    // default [0,0] coords.
    svg.call(
      // @ts-ignore
      d3Zoom().transform,
      zoomIdentity.translate(config.translate.x, config.translate.y).scale(1),
    )

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
    >
      {data ? (
        <svg data-d3-id={svgId} width="100%" height="100%">
          <g
            data-d3-id={gId}
            className="relative"
            transform={`translate(${config.translate.x},${config.translate.y}) scale(${config.scale})`}
          >
            {data.links.map((link) => (
              <TreeLink key={link.source.data.id} link={link} />
            ))}
            {data.nodes.map((node) => (
              <TreeNode
                key={node.data.id}
                node={node}
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
