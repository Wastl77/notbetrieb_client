import { ObjectId, ChangeStreamUpdateDocument, ChangeStreamInsertDocument } from 'mongodb'
import { IpcRenderer } from 'electron'

export type Scene = {
  id: string
  _id: ObjectId
  address: {
    street: string
    object?: string
    district?: string
  }
  alarmKeyword: string
  sceneNumber: number
  initialResources: string[]
  resourceLines: {
    index: number
    type: string
    disposedType: string | null
    callsign: string | null
    status: ResourceLineStatus
    cancelledCallsign?: string
  }[]
}

export type ResourceLineStatus =
  | 'not disposed'
  | 'disposed'
  | 'alarmed'
  | 'on approach'
  | 'on scene'
  | 'left scene'
  | 'finished'
  | 'cancelled'
  | 'not neccessary'

export type Resource = {
  id: string
  _id: ObjectId
  callsign: string
  area: string
  resourceStatus: string
  type: string
  resourceLineIndex: string | null
  sceneNumber: number | null
}

export type Api = {
  resource: (callback: (resourceDoc: ChangeStreamUpdateDocument<Resource>) => void) => IpcRenderer
  scene: (
    callback: (
      sceneDoc: ChangeStreamUpdateDocument<Scene> | ChangeStreamInsertDocument<Scene>
    ) => void
  ) => IpcRenderer
  getInitialState: () => Promise<{
    resources: Record<string, Resource>
    scenes: Record<string, Scene>
  }>
}
