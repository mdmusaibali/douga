import { ipcMain } from 'electron'

ipcMain.on('test', async (event, par) => {
  console.log('TEST ', event, par)
})
