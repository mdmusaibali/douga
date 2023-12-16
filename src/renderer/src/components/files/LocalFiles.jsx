import React, { useState, useEffect } from 'react'
import { Tree } from 'primereact/tree'
import { NodeService } from '../../service/NodeService'
import { Card } from 'primereact/card'
import styles from './LocalFiles.module.scss'
import { Toolbar } from 'primereact/toolbar'
import { channels } from '../../../../shared/channels'

const { ipcRenderer } = electron

export default function LocalFiles() {
  const [nodes, setNodes] = useState([])
  const [tree, setTree] = useState([])

  useEffect(() => {
    ;(async () => {
      const treeArr = await ipcRenderer.invoke(channels.GET_DIR_FILES)
      setTree(treeArr)
    })()
  }, [])

  useEffect(() => {
    NodeService.getTreeNodes().then((data) => setNodes(data))
  }, [])

  return (
    <Card className={styles.localfiles}>
      <Toolbar start={<>Local Files</>} />
      <Tree value={tree} className="w-full" />
    </Card>
  )
}
