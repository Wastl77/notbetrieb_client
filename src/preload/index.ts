import { IpcRenderer, IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ChangeStreamUpdateDocument, ChangeStreamInsertDocument } from 'mongodb'
import { Scene, Resource } from '../main/types'
import { Api } from '../main/types'

// Custom APIs for renderer
const api: Api = {
  resource: (callback: (resourceDoc: ChangeStreamUpdateDocument<Resource>) => void): IpcRenderer =>
    ipcRenderer.on(
      'resource',
      (_: IpcRendererEvent, resourceDoc: ChangeStreamUpdateDocument<Resource>) =>
        callback(resourceDoc)
    ),
  scene: (
    callback: (
      sceneDoc: ChangeStreamUpdateDocument<Scene> | ChangeStreamInsertDocument<Scene>
    ) => void
  ): IpcRenderer =>
    ipcRenderer.on(
      'scene',
      (
        _: IpcRendererEvent,
        sceneDoc: ChangeStreamUpdateDocument<Scene> | ChangeStreamInsertDocument<Scene>
      ) => callback(sceneDoc)
    ),
  getInitialState: (): Promise<{
    resources: Record<string, Resource>
    scenes: Record<string, Scene>
  }> => ipcRenderer.invoke('getInitialState')
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
