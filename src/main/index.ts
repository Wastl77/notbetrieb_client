import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { MongoClient } from 'mongodb'
import { Scene, Resource } from './types'

let actualSessionName: string

const fetchSessionName = async (): Promise<void> =>
  await fetch('http://localhost:8000/admin/get-actual-session')
    .then((response) => response.text())
    .then((data) => {
      actualSessionName = data
    })
    .catch((error) => {
      console.error('Error:', error)
    })

const handleGetInitialState = async (): Promise<{
  resources: Record<string, Resource>
  scenes: Record<string, Scene>
}> => {
  const result: {
    resources: Record<string, Resource>
    scenes: Record<string, Scene>
  } = { resources: {}, scenes: {} }

  const client = new MongoClient(
    'mongodb://localhost:27017/?maxPoolSize=500&w=majority&directConnection=true'
  )

  try {
    await client.connect()
    const db = client.db(actualSessionName)
    const resourceCollection = db.collection('Resource')

    const resourceCursor = resourceCollection.find<Resource>({})
    for await (const doc of resourceCursor) {
      doc.id = doc._id.toString()
      result.resources[doc.callsign] = doc
    }

    const sceneCollection = db.collection('Scene')

    const sceneCursor = sceneCollection.find<Scene>({})
    for await (const doc of sceneCursor) {
      doc.id = doc._id.toString()
      result.scenes[doc.sceneNumber!] = doc
    }
  } catch (error) {
    console.error('Fehler Mongo DB get initial state: ', error)
  } finally {
    client.close() //!Test!!!
  }
  return result
}

const registerChangeStream = async (
  sessionName: string,
  mainWindow: BrowserWindow
): Promise<void> => {
  try {
    const resourceClient = new MongoClient(
      'mongodb://localhost:27017/?maxPoolSize=500&w=majority&directConnection=true'
    )
    await resourceClient.connect()
    const db = resourceClient.db(sessionName)
    const collection = db.collection('Resource')

    const resourceChangeStream = collection.watch<Resource>([], { fullDocument: 'updateLookup' })
    resourceChangeStream.on('change', (change) => {
      console.log('ResourceChangeStream: ', change)
      mainWindow.webContents.send('resource', change)
    })
  } catch (error) {
    console.error('Fehler Mongo DB ResourceStream: ', error)
  }

  try {
    const sceneClient = new MongoClient(
      'mongodb://localhost:27017/?maxPoolSize=500&w=majority&directConnection=true'
    )
    await sceneClient.connect()
    const db = sceneClient.db(sessionName)
    const collection = db.collection('Scene')

    const resourceChangeStream = collection.watch<Scene>([], { fullDocument: 'updateLookup' })
    resourceChangeStream.on('change', (change) => {
      console.log('SceneChangeStream: ', change)
      mainWindow.webContents.send('scene', change)
    })
  } catch (error) {
    console.error('Fehler Mongo DB SceneStream: ', error)
  }
}

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 900,
    // height: 670,
    fullscreen: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // await fetchSessionName()
  // ipcMain.handle('getInitialState', handleGetInitialState)

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // registerChangeStream(actualSessionName, mainWindow)
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
