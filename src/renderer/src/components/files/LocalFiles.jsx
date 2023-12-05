import React, { useState, useEffect } from 'react'
import { Tree } from 'primereact/tree'
import { NodeService } from '../../service/NodeService'
import { Card } from 'primereact/card'
import styles from './LocalFiles.module.scss'
import { Toolbar } from 'primereact/toolbar'

export default function LocalFiles() {
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    NodeService.getTreeNodes().then((data) => setNodes(data))
  }, [])

  return (
    <Card className={styles.localfiles}>
      <Toolbar start={<>Local Files</>} />
      <Tree value={nodes} className="w-full" />
    </Card>
  )
}
