import { useState } from 'react'

const useTreeFunctions = (nodes) => {
  const [expandedKeys, setExpandedKeys] = useState({})

  const expandAll = () => {
    let _expandedKeys = {}

    for (let node of nodes) {
      expandNode(node, _expandedKeys)
    }

    setExpandedKeys(_expandedKeys)
  }

  const collapseAll = () => {
    setExpandedKeys({})
  }

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true

      for (let child of node.children) {
        expandNode(child, _expandedKeys)
      }
    }
  }

  return { expandedKeys, setExpandedKeys, expandAll, collapseAll }
}
export default useTreeFunctions
