import Versions from './components/Versions'
import { useEffect } from 'react'

function App(): JSX.Element {
  useEffect(() => {
    ;(async (): Promise<void> => {
      //@ts-ignore dont know how to fix
      const state = await window.api.getInitialState()
      console.log(state)
    })()
  }, [])

  useEffect(() => {
    //@ts-ignore dont know how to fix
    window.api.resource((event: any, resourceDoc: any) => {
      console.log('useEffect', event, resourceDoc)
    })
  })

  return (
    <div className="container">
      <Versions></Versions>
    </div>
  )
}

export default App
