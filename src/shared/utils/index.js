import { readdirSync, statSync, existsSync, mkdir, mkdirSync } from 'fs'
import { join } from 'path'

// Function to build the file tree recursively
export function buildFileTree(directoryPath) {
  const files = readdirSync(directoryPath)
  const children = files.map((fileName) => {
    const filePath = join(directoryPath, fileName)
    const stats = statSync(filePath)
    if (stats.isDirectory()) {
      return {
        key: fileName,
        label: fileName,
        data: fileName,
        icon: 'pi pi-fw pi-folder',
        children: buildFileTree(filePath)
      }
    } else {
      return {
        key: fileName,
        label: fileName,
        data: fileName,
        icon: 'pi pi-fw pi-video'
      }
    }
  })
  return children
}

export const makeDougaDirectory = (directoryPath) => {
  if (!existsSync(directoryPath + '/Douga')) {
    mkdirSync(directoryPath + '/Douga')
    console.log('Made Douga directory')
  } else {
    console.log('Douga directory is already present')
  }
}
