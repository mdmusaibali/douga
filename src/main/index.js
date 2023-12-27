import { app, shell, BrowserWindow, ipcMain, desktopCapturer, dialog, protocol } from 'electron'
import { writeFile } from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { channels } from '../shared/channels'
import { buildFileTree, makeDougaDirectoryIfNotPresent } from '../shared/utils'

// Windows
let window1
let window2

function createWindow() {
  // Create the browser window.
  window1 = new BrowserWindow({
    show: false,
    fullscreen: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  window1.on('ready-to-show', () => {
    window1.maximize()
    window1.show()
  })

  window1.on('closed', () => {
    app.quit()
  })

  window1.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window1.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window1.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createRecordActionsWindow(initialState) {
  window2 = new BrowserWindow({
    show: false,
    fullscreen: false,
    autoHideMenuBar: true,
    width: 750,
    height: 70,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  window2.on('ready-to-show', () => {
    window2.show()
    window2.webContents.send(channels.INITIALIZE_STATE, initialState)
  })

  if (is.dev) {
    window2.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#vid-action-preview')
  } else {
    window2.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'vid-action-preview'
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.registerFileProtocol('my-video-protocol', (request, callback) => {
    const url = request.url.replace('my-video-protocol://getMediaFile/', '')
    try {
      return callback(url)
    } catch (error) {
      console.error(error)
      return callback(404)
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

makeDougaDirectoryIfNotPresent()

ipcMain.handle(channels.GET_SOURCES, async () => {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  })

  return inputSources.map((source) => {
    delete source.thumbnail
    return source
  })
})

ipcMain.handle(channels.SAVE_FILE, async (_, arrayBuffer) => {
  try {
    makeDougaDirectoryIfNotPresent()
    const buffer = Buffer.from(arrayBuffer)
    const videosPath = app.getPath('videos')
    const dougaPath = videosPath + '/Douga'
    const videoName = dougaPath + `/dougavideo-${Date.now()}.webm`

    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: 'Save video',
      defaultPath: videoName
    })

    if (!filePath) {
      // this means user has cancelled the save
      return false
    }

    console.log('File Path ', filePath)

    if (filePath) {
      writeFile(filePath, buffer, () => {
        console.log('File saved successfully')
      })
      return true
    }
    return false
  } catch (error) {
    console.log('Error saving video file ', error)
    return false
  }
})

// ipcMain.handle(channels.SAVE_FILE, async (_, arrayBuffer) => {
//   try {
//     makeDougaDirectoryIfNotPresent()
//     const buffer = Buffer.from(arrayBuffer)
//     const videosPath = app.getPath('videos')
//     const dougaPath = videosPath + '/Douga'
//     const videoName = dougaPath + `/dougavid-${new Date().toISOString()}.webm`

//     if (dougaPath) {
//       writeFile(videoName, buffer, () => {
//         console.log('File saved successfully')
//       })
//       return true
//     }
//     return false
//   } catch (error) {
//     console.log('Error saving video file ', error)
//     return false
//   }
// })

ipcMain.handle(channels.OPEN_RECORD_ACTION_WINDOW, async (e, initialState) => {
  createRecordActionsWindow(initialState)
})

ipcMain.handle(channels.CLOSE_RECORD_ACTION_WINDOW, async (e) => {
  if (window2) {
    window2.close()
  }
})

ipcMain.handle(channels.PAUSE_RECORDING, async (e) => {
  window1.webContents.send(channels.PAUSE_RECORDING)
})

ipcMain.handle(channels.RESUME_RECORDING, async (e) => {
  window1.webContents.send(channels.RESUME_RECORDING)
})

ipcMain.handle(channels.STOP_RECORDING, async (e) => {
  window1.webContents.send(channels.STOP_RECORDING)
})

ipcMain.on(channels.GET_DIR_FILES, async (e) => {
  const videosPath = app.getPath('videos')
  const tree = buildFileTree(videosPath)
  e.sender.send(channels.GET_DIR_FILES, tree)
})
