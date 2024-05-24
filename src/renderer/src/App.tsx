import IncidentForm from './components/IncidentForm'
import { useEffect, useState } from 'react'
import { Scene, Resource, Api } from '../../main/types'

declare global {
  interface Window {
    api: Api
  }
}

function App(): JSX.Element {
  const [resources, setResources] = useState<Record<string, Resource>>({})
  const [scenes, setScenes] = useState<Record<string, Scene>>({})

  useEffect(() => {
    ;(async (): Promise<void> => {
      const state = await window.api.getInitialState()
      console.log(state)
      setResources(state.resources)
      setScenes(state.scenes)
    })()
  }, [])

  useEffect(() => {
    window.api.resource((resourceDoc) => {
      setResources((prev) => ({
        ...prev,
        [resourceDoc.fullDocument!.callsign]: resourceDoc.fullDocument!
      }))
    })
  })

  useEffect(() => {
    window.api.scene((sceneDoc) => {
      setScenes((prev) => ({
        ...prev,
        [sceneDoc.fullDocument!.sceneNumber]: sceneDoc.fullDocument
      }))
    })
  })

  return <IncidentForm></IncidentForm>
}

export default App
