import { app, shell, BrowserWindow, ipcMain, desktopCapturer, dialog } from 'electron'
import { writeFile, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { channels } from '../shared'

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

function createRecordActionsWindow() {
  // Create the browser window.
  window2 = new BrowserWindow({
    show: false,
    fullscreen: false,
    autoHideMenuBar: true,
    width: 750,
    height: 56,
    // frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  window2.on('ready-to-show', () => {
    window2.show()
  })

  if (is.dev) {
    window2.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/login')
  } else {
    window2.loadFile(join(__dirname, '../renderer/record-actions.html'))
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

ipcMain.on(channels.GET_SOURCES, async (e) => {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  })

  e.sender.send(channels.GET_SOURCES, inputSources)
})

ipcMain.on(channels.SAVE_FILE, async (e, arrayBuffer) => {
  try {
    const buffer = Buffer.from(arrayBuffer)

    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: 'Save video',
      defaultPath: `dougavideo-${Date.now()}.webm`
    })

    if (filePath) {
      writeFile(filePath, buffer, () => console.log('video saved successfully!'))
    }
  } catch (error) {
    console.log('Error saving video file ', error)
  }
})

ipcMain.on(channels.OPEN_RECORD_ACTION_WINDOW, async (e) => {
  createRecordActionsWindow()
})

ipcMain.on(channels.CLOSE_RECORD_ACTION_WINDOW, async (e) => {
  if (window2) {
    window2.close()
  }
})

ipcMain.on(channels.PAUSE_RECORDING, async (e) => {
  window1.webContents.send(channels.PAUSE_RECORDING)
})

ipcMain.on(channels.RESUME_RECORDING, async (e) => {
  window1.webContents.send(channels.RESUME_RECORDING)
})

// Function to build the file tree recursively
function buildFileTree(directoryPath) {
  const files = readdirSync(directoryPath)
  const children = files.map((fileName) => {
    const filePath = path.join(directoryPath, fileName)
    const stats = statSync(filePath)
    if (stats.isDirectory()) {
      return {
        name: fileName,
        children: buildFileTree(filePath)
      }
    } else {
      return {
        name: fileName
      }
    }
  })
  return children
}
