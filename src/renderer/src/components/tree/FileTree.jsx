import React, { useEffect } from 'react'
import { Tree } from 'primereact/tree'
import { Toolbar } from 'primereact/toolbar'
import useTreeFunctions from '../../hooks/useTreeFunctions'
import { Button } from 'primereact/button'

export default function FileTree({ nodes, onNodeClick, toolbarTitle }) {
  const { collapseAll, expandAll, expandedKeys, setExpandedKeys } = useTreeFunctions(nodes)

//   useEffect(() => {
//     expandAll()
//   }, [nodes])

  const TreeControls = () => {
    return (
      <div className="flex align-items-center">
        <Button
          icon={'fa-solid fa-up-right-and-down-left-from-center'}
          className="py-0"
          size="small"
          rounded
          text
          severity="secondary"
          onClick={expandAll}
        />
        <Button
          icon={'fa-solid fa-down-left-and-up-right-to-center'}
          className="py-0"
          size="small"
          rounded
          text
          severity="secondary"
          onClick={collapseAll}
        />
      </div>
    )
  }

  return (
    <>
      <Toolbar start={toolbarTitle} end={TreeControls} className="py-1" />
      <Tree
        value={nodes}
        expandedKeys={expandedKeys}
        onNodeClick={onNodeClick}
        onToggle={(e) => setExpandedKeys(e.value)}
        selectionMode={onNodeClick ? 'single' : undefined}
        className="w-full"
      />
    </>
  )
}
