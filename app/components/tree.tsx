import {
  hierarchy,
  HierarchyPointLink,
  HierarchyPointNode,
  tree as d3tree,
} from "d3-hierarchy"
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

function createD3Tree<Data>(data: RawTreeNode<Data>) {
  const tree = d3tree<RawTreeNode<Data>>()
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

function findNode<Data>(
  nodes: HierarchyPointNode<RawTreeNode<Data>>[],
  id: string,
): HierarchyPointNode<RawTreeNode<Data>> | null {
  return nodes.find((node) => node.data.id === id) ?? null
}

export type CreateRawTreeDataArgs<Data> = {
  items: Data[]
  id: (item: Data) => string
  name: (item: Data) => string
  parentId: (item: Data) => string | null
}

function createRawTreeData<Data>(
  args: CreateRawTreeDataArgs<Data>,
): RawTreeNode<Data> {
  const { items, id, name, parentId } = args

  const rootItem = items.find((item) => parentId(item) === null)
  invariant(rootItem, "No root item found")

  const rootNode: RawTreeNode<Data> = {
    id: id(rootItem),
    name: name(rootItem),
    active: true,
    data: rootItem,
  }

  const nodeMap = new Map<string, RawTreeNode<Data>>()
  nodeMap.set(rootNode.id, rootNode)

  items.forEach((item) => {
    if (item === rootItem) return

    const itemId = id(item)
    const itemParentId = parentId(item)
    invariant(itemParentId, "Multiple root nodes found")

    const node: RawTreeNode<Data> = {
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
    }
  })

  return rootNode
}

export type RawTreeNode<Data> = {
  id: string
  name: string
  active: boolean
  children?: RawTreeNode<Data>[]
  data: Data
}

export type TreeProps<Data> = CreateRawTreeDataArgs<Data> & {
  activeDataId: string
  onNodeActivated: (node: HierarchyPointNode<RawTreeNode<Data>>) => void
}

export const Tree = <Data extends unknown>(props: TreeProps<Data>) => {
  const [rawTreeData, setRawTreeData] =
    React.useState<RawTreeNode<Data> | null>(null)
  const [tree, setTree] = React.useState<{
    nodes: HierarchyPointNode<RawTreeNode<Data>>[]
    links: HierarchyPointLink<RawTreeNode<Data>>[]
  } | null>(null)

  const scaleRef = React.useRef(1)

  const svgId = React.useId()
  const gId = React.useId()

  const [activeNode, setActiveNode] = React.useState<HierarchyPointNode<
    RawTreeNode<Data>
  > | null>(null)

  function activateNode(node: HierarchyPointNode<RawTreeNode<Data>>) {
    invariant(tree, "Tree not initialized")

    // Ensure the current node and it's parents are reset to be inactive
    if (activeNode) {
      let currentNode = findNode(tree.nodes, activeNode.data.id)
      invariant(currentNode, "Node not found")
      while (currentNode) {
        currentNode.data.active = false
        currentNode = currentNode.parent
      }
    }

    // Active the new node and all of it's parents
    let currentNode: HierarchyPointNode<RawTreeNode<Data>> | null = node
    while (currentNode) {
      currentNode.data.active = true
      currentNode = currentNode.parent
    }
    centerNode(node)
    setActiveNode(node)
  }

  function centerNode(
    hierarchyPointNode: HierarchyPointNode<RawTreeNode<Data>>,
    animate = true,
  ) {
    const svg = select(`[data-d3-id="${svgId}"]`)
    const g = select(`[data-d3-id="${gId}"]`)
    const scale = scaleRef.current

    const x = -hierarchyPointNode.x * scale + dimensions.width / 2
    const y = -hierarchyPointNode.y * scale + dimensions.height / 3

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

  // onMount
  React.useEffect(() => {
    const rawTreeData = createRawTreeData(props)
    setRawTreeData(rawTreeData)
  }, [props.items])

  // Initialise the D3 tree based on raw data
  React.useEffect(() => {
    if (!rawTreeData) return
    const tree = createD3Tree(rawTreeData)
    setTree(tree)
  }, [rawTreeData])

  // After tree is initialised center the active node
  React.useEffect(() => {
    if (tree == null) return

    const activeNode = findNode(tree.nodes, props.activeDataId)
    invariant(activeNode, "Active node not found")
    centerNode(activeNode, false)
  }, [tree, props.activeDataId])

  // After the tree is initialised ensure than panning and zooming are enabled
  React.useEffect(() => {
    if (tree == null) return

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
  }, [tree])

  return (
    <div
      className="relative h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
      draggable={false}
    >
      {tree ? (
        <svg data-d3-id={svgId} width="100%" height="100%">
          <g
            data-d3-id={gId}
            className="relative"
            transform={`translate(${translate.x},${translate.y}) scale(${scale})`}
          >
            {tree.links.map((link, i) => (
              <TreeLink<Data> key={i} link={link} />
            ))}
            {tree.nodes.map((node, i) => (
              <TreeNode
                key={i}
                node={node}
                onClick={(node) => {
                  activateNode(node)
                  props.onNodeActivated(node)
                }}
              />
            ))}
          </g>
        </svg>
      ) : null}
    </div>
  )
}
