import React, { useState, useEffect, useCallback } from 'react'
import { Tree } from 'primereact/tree'
import { NodeService } from '../../service/NodeService'
import { Card } from 'primereact/card'
import styles from './LocalFiles.module.scss'
import { Toolbar } from 'primereact/toolbar'
import { channels } from '../../../../shared/channels'
import { useNavigate, useNavigation } from 'react-router-dom'

const { ipcRenderer } = electron

export default function LocalFiles() {
  const [tree, setTree] = useState([])
  const navigate = useNavigate()

  const handleGetDirFiles = useCallback(
    (e, filesTree) => {
      console.log('Got files ', filesTree)
      setTree(filesTree)
    },
    [setTree]
  )

  useEffect(() => {
    ipcRenderer.send(channels.GET_DIR_FILES)
  }, [])

  useEffect(() => {
    let removeGetDirFilesListener = ipcRenderer.on(channels.GET_DIR_FILES, handleGetDirFiles)
    return () => {
      removeGetDirFilesListener()
    }
  }, [handleGetDirFiles])

  const handleNodeClick = ({ node, originalEvent }) => {
    if (node?.type !== 'file') return
    navigate('/video/' + node.key, {
      state: {
        fullPath: node.path
      }
    })
    console.log(node)
  }

  return (
    <Card className={styles.localfiles}>
      <Toolbar start={<>Local Files</>} />
      <Tree value={tree} className="w-full" onNodeClick={handleNodeClick} selectionMode="single" />
    </Card>
  )
}
