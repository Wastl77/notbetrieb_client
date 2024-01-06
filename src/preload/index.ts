import { IpcRenderer, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  resource: (
    callback: (event: Electron.IpcRendererEvent, resourceDoc: object) => void
  ): IpcRenderer =>
    ipcRenderer.on('resource', (event, resourceDoc) => callback(event, resourceDoc)),
  scene: (callback: (event: Electron.IpcRendererEvent, sceneDoc: object) => void): IpcRenderer =>
    ipcRenderer.on('scene', (event, sceneDoc) => callback(event, sceneDoc))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
