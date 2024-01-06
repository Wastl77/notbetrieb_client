import Versions from './components/Versions'
import { useEffect } from 'react'

function App(): JSX.Element {
  useEffect(() => {
    //@ts-ignore dont know how to fix
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
