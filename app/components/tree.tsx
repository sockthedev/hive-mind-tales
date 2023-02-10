import { hierarchy, HierarchyPointNode, tree as d3tree } from "d3-hierarchy"
import { select } from "d3-selection"
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom"
import React from "react"
import { TreeLink } from "./tree-link"
import { TreeNode } from "./tree-node"

const dimensions = {
  width: 704,
  height: 400,
}
const nodeSize = {
  x: 90,
  y: 90,
}
const separation = { siblings: 1, nonSiblings: 2 }
const translate = { x: 0, y: 0 }
const scale = 1
const scaleExtent = { min: 0.25, max: 1 }
const data: TreeNodeDatum = {
  id: "A",
  name: "A",
  active: true,
  children: [
    {
      id: "B",
      name: "B",
      active: true,
      children: [
        {
          id: "C",
          name: "C",
          active: false,
        },
        {
          id: "E",
          name: "E",
          active: false,
          children: [
            {
              id: "F",
              name: "F",
              active: false,

              children: [
                {
                  id: "G",
                  name: "G",
                  active: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "D",
      name: "D",
      active: false,
    },
  ],
}

export type TreeNodeDatum = {
  id: string
  name: string
  active: boolean
  children?: TreeNodeDatum[]
  parent?: TreeNodeDatum
}

export type TreeProps = {}

function generateTree(data: TreeNodeDatum) {
  const tree = d3tree<TreeNodeDatum>()
    .nodeSize([nodeSize.x, nodeSize.y])
    .separation((a, b) =>
      a.parent?.data.id === b.parent?.data.id
        ? separation.siblings
        : separation.nonSiblings,
    )

  const rootNode = tree(hierarchy(data, (d) => d.children))
  const nodes = rootNode.descendants()
  const links = rootNode.links()

  return { nodes, links }
}

export const Tree: React.FC<TreeProps> = () => {
  const { nodes, links } = generateTree(data)

  const scaleRef = React.useRef(1)

  const svgId = React.useId()
  const gId = React.useId()

  function centerNode(hierarchyPointNode: HierarchyPointNode<TreeNodeDatum>) {
    const svg = select(`[data-d3-id="${svgId}"]`)
    const g = select(`[data-d3-id="${gId}"]`)
    const scale = scaleRef.current

    const x = -hierarchyPointNode.x * scale + dimensions.width / 2
    const y = -hierarchyPointNode.y * scale + dimensions.height / 3
    // @ts-ignore
    g.transition()
      .duration(500)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")")
    // Sets the viewport to the new center so that it does not jump back to original
    // coordinates when dragged/zoomed
    // @ts-ignore
    svg.call(d3Zoom().transform, zoomIdentity.translate(x, y).scale(1))
  }

  React.useEffect(() => {
    const svg = select(`[data-d3-id="${svgId}"]`)
    const g = select(`[data-d3-id="${gId}"]`)

    // Sets initial offset, so that first pan and zoom does not jump back to
    // default [0,0] coords.
    svg.call(
      // @ts-ignore
      d3Zoom().transform,
      zoomIdentity.translate(translate.x, translate.y).scale(1),
    )

    // Enables panning and zooming
    svg.call(
      // @ts-ignore
      d3Zoom()
        .scaleExtent([scaleExtent.min, scaleExtent.max])
        .on("zoom", (event: any) => {
          g.attr("transform", event.transform)
          scaleRef.current = event.transform.k
        }),
    )
  }, [])

  React.useEffect(() => {
    // TODO: Center on breadcrumb node, or first
    centerNode(nodes[0].children[0])
  }, [])

  return (
    <div
      className="h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
      draggable={false}
    >
      <svg data-d3-id={svgId} width="100%" height="100%">
        <g
          data-d3-id={gId}
          className="relative"
          transform={`translate(${translate.x},${translate.y}) scale(${scale})`}
        >
          {links.map((link, i) => (
            <TreeLink key={i} link={link} />
          ))}
          {nodes.map((node, i) => (
            <TreeNode
              key={i}
              node={node}
              onClick={(node) => {
                console.log(`Clicked node ${node.data.name}`)
                centerNode(node)
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
