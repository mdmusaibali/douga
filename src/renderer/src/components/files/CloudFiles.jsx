import React, { useState, useEffect } from 'react'
import { Tree } from 'primereact/tree'
import { NodeService } from '../../service/NodeService'
import { Card } from 'primereact/card'
import styles from './CloudFiles.module.scss'
import { Toolbar } from 'primereact/toolbar'

export default function CloudFiles() {
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    NodeService.getTreeNodes().then((data) => setNodes(data))
  }, [])

  return (
    <Card className={styles.cloudfiles}>
      <Toolbar start={<>Cloud Files</>} />
      <Tree value={nodes} className="w-full" />
    </Card>
  )
}
