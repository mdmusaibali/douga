import React, { useState, useEffect } from 'react'
import { NodeService } from '../../service/NodeService'
import { Card } from 'primereact/card'
import styles from './CloudFiles.module.scss'
import FileTree from '../tree/FileTree'

export default function CloudFiles() {
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    NodeService.getTreeNodes().then((data) => setNodes(data))
  }, [])

  return (
    <Card className={styles.cloudfiles}>
      <FileTree nodes={nodes} toolbarTitle="Cloud Files" />
    </Card>
  )
}
