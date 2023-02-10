import { hierarchy, tree as d3tree } from "d3-hierarchy"
import React from "react"
import { TreeLink } from "./tree-link"
import { TreeNode } from "./tree-node"

const nodeSize = {
  x: 90,
  y: 90,
}
const separation = { siblings: 1, nonSiblings: 2 }
const translate = { x: 200, y: 200 }
const scale = 1
const data: TreeNodeDatum = {
  id: "A",
  name: "A",
  children: [
    {
      id: "B",
      name: "B",
      children: [
        {
          id: "C",
          name: "C",
        },
      ],
    },
    {
      id: "D",
      name: "D",
    },
  ],
}

type TreeNode = {
  name: string
  children?: TreeNode[]
}

export type TreeNodeDatum = {
  id: string
  name: string
  children?: TreeNodeDatum[]
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

  return (
    <div>
      <svg width="100%" height="100vh" style={{ border: "solid 1px pink" }}>
        <g
          transform={`translate(${translate.x},${translate.y}) scale(${scale})`}
        >
          {links.map((link, i) => (
            <TreeLink key={i} link={link} />
          ))}
          {nodes.map((node, i) => (
            <TreeNode key={i} node={node} />
          ))}
        </g>
      </svg>
    </div>
  )
}
