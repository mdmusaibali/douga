import { readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { app } from 'electron'
import { join, extname } from 'path'

// Function to build the file tree recursively
export function buildFileTree(directoryPath) {
  const files = readdirSync(directoryPath)
  const children = files.map((fileName) => {
    const filePath = join(directoryPath, fileName)
    const stats = statSync(filePath)
    // Check if file is a video based on its extension
    const validExtensions = ['avi', 'mp4', 'mkv', 'mov', 'flv', 'wmv', 'webm'] // Customize as needed
    const extension = extname(fileName).toLowerCase().slice(1)
    if (stats.isDirectory()) {
      return {
        key: fileName,
        label: fileName,
        data: fileName,
        icon: 'pi pi-fw pi-folder',
        type: 'directory',
        path: filePath,
        children: buildFileTree(filePath)
      }
    } else if (validExtensions.includes(extension)) {
      return {
        key: fileName,
        label: fileName,
        data: fileName,
        type: 'file',
        path: filePath,
        icon: 'pi pi-fw pi-video'
      }
    } else {
      return null
    }
  })
  // Filter out null entries after filtering
  return children.filter((child) => child !== null)
}

export const makeDougaDirectoryIfNotPresent = () => {
  try {
    const videosPath = app.getPath('videos')

    if (!existsSync(videosPath + '/Douga')) {
      mkdirSync(videosPath + '/Douga')
      console.log('Made Douga directory')
    } else {
      console.log('Douga directory is already present')
    }
  } catch (error) {
    console.log('Error making douga directory', error)
  }
}
