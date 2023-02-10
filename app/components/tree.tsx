import clsx from "clsx"
import { hierarchy, HierarchyPointNode, tree as d3tree } from "d3-hierarchy"
import { select } from "d3-selection"
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom"
import React from "react"
import invariant from "tiny-invariant"
import { TreeLink } from "./tree-link"
import { TreeNode } from "./tree-node"

// TODO: All the following constants should probably be turned into props
// or configuration;
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

function generateTree<Data>(data: TreeData<Data>) {
  const tree = d3tree<TreeData<Data>>()
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

export type CreateTreeDataArgs<Data> = {
  items: Data[]
  id: (item: Data) => string
  name: (item: Data) => string
  parentId: (item: Data) => string | null
}

export function createTreeData<Data>(
  args: CreateTreeDataArgs<Data>,
): TreeData<Data> {
  const { items, id, name, parentId } = args

  const rootItem = items.find((item) => parentId(item) === null)
  invariant(rootItem, "No root item found")

  const rootNode: TreeData<Data> = {
    id: id(rootItem),
    name: name(rootItem),
    active: true,
    data: rootItem,
  }

  const nodeMap = new Map<string, TreeData<Data>>()
  nodeMap.set(rootNode.id, rootNode)

  items.forEach((item) => {
    if (item === rootItem) return

    const itemId = id(item)
    const itemParentId = parentId(item)
    invariant(itemParentId, "Multiple root nodes found")

    const node: TreeData<Data> = {
      id: itemId,
      name: name(item),
      active: false,
      data: item,
    }

    nodeMap.set(itemId, node)

    const parentNode = nodeMap.get(itemParentId)
    if (parentNode) {
      parentNode.children = parentNode.children || []
      parentNode.children.push(node)
      node.parent = parentNode
    }
  })

  return rootNode
}

export type TreeData<Data> = {
  id: string
  name: string
  active: boolean
  children?: TreeData<Data>[]
  parent?: TreeData<Data>
  data: Data
}

export type TreeProps<Data> = {
  data: TreeData<Data>
  onNodeClick: (node: HierarchyPointNode<TreeData<Data>>) => void
}

export const Tree = <Data extends unknown>(props: TreeProps<Data>) => {
  const { nodes, links } = generateTree(props.data)

  const scaleRef = React.useRef(1)

  const svgId = React.useId()
  const gId = React.useId()

  const [initialized, setInitialized] = React.useState(false)

  function centerNode(
    hierarchyPointNode: HierarchyPointNode<TreeData<Data>>,
    animate = true,
  ) {
    const svg = select(`[data-d3-id="${svgId}"]`)
    const g = select(`[data-d3-id="${gId}"]`)
    const scale = scaleRef.current

    const x = -hierarchyPointNode.x * scale + dimensions.width / 2
    const y = -hierarchyPointNode.y * scale + dimensions.height / 2

    if (animate) {
      // @ts-ignore
      g.transition()
        .duration(1000)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")")
    } else {
      g.attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")")
    }

    // @ts-ignore
    svg.transition().duration(0).attr("opacity", 1)

    // Sets the viewport to the new center so that it does not jump back to original
    // coordinates when dragged/zoomed
    // @ts-ignore
    svg.call(d3Zoom().transform, zoomIdentity.translate(x, y).scale(scale))
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
    setInitialized(true)
    centerNode(nodes[0].children[0], false)
  }, [])

  return (
    <div
      className={clsx(
        "relative h-full w-full cursor-grab overflow-hidden transition-all duration-500 active:cursor-grabbing",
        initialized ? "opacity-100" : "opacity-0",
      )}
      draggable={false}
    >
      <svg data-d3-id={svgId} width="100%" height="100%">
        <g
          data-d3-id={gId}
          className="relative"
          transform={`translate(${translate.x},${translate.y}) scale(${scale})`}
        >
          {links.map((link, i) => (
            <TreeLink<Data> key={i} link={link} />
          ))}
          {nodes.map((node, i) => (
            <TreeNode
              key={i}
              node={node}
              onClick={(node) => {
                centerNode(node)
                props.onNodeClick(node)
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
