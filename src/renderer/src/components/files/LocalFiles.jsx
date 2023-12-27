import React, { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import styles from './LocalFiles.module.scss'
import { channels } from '../../../../shared/channels'
import { useNavigate } from 'react-router-dom'
import FileTree from '../tree/FileTree'

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
      <FileTree nodes={tree} onNodeClick={handleNodeClick} toolbarTitle="Local Files" />
    </Card>
  )
}
