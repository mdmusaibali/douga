import { Button } from 'primereact/button'
import { channels } from './../../shared'
import { useEffect, useRef, useState } from 'react'

const { ipcRenderer } = electron

function App(){
  const videoRef = useRef(null)
  const [mediaRecorder, setMediaRecorder] = useState('')
  const videoChunks = []

  async function handleStream(_, source) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id
          }
        }
      })

      // Create the Media Recorder
      const options = { mimeType: 'video/webm; codecs=vp9' }
      const mediaRecorder = new MediaRecorder(stream, options)
      // Register Event Handlers
      mediaRecorder.ondataavailable = handleDataAvailable
      mediaRecorder.onstop = handleStop

      setMediaRecorder(mediaRecorder)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = (e) => videoRef.current.play()
      }
    } catch (e) {
      handleError(e)
    }
  }

  const selectSource = () => {
    ipcRenderer.send(channels.SET_SOURCE)
  }

  useEffect(() => {
    // Listen for the event
    ipcRenderer.on(channels.SET_SOURCE, handleStream)
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners()
    }
  }, [])

  const handleError = (e) => {
    console.error('ERROR ', e)
  }

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start()
      console.log('Recording started')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      console.log('Recording stopped')
    }
  }

  const handleDataAvailable = (e) => {
    console.log('Pushing chunk ', e.data)
    videoChunks.push(e.data)
  }

  const handleStop = async () => {
    if (Array.isArray(videoChunks) && videoChunks.length < 1) return

    console.log('VIDEO CHUNKS ', videoChunks)
    const blob = new Blob(videoChunks, {
      type: 'video/webm; codecs=vp9'
    })
    const arrayBuffer = await blob.arrayBuffer()

    ipcRenderer.send(channels.SAVE_FILE, arrayBuffer)
  }

  return (
    <div className="card">
      <video src="" ref={videoRef} style={{ height: '500px', width: '500px' }}></video>
      <div>
        <Button label="Select source" icon="pi pi-check" onClick={selectSource} />
        <Button
          label="Start Recording"
          severity="success"
          icon="pi pi-check"
          onClick={startRecording}
        />
        <Button
          label="Stop Recording"
          severity="danger"
          icon="pi pi-check"
          onClick={stopRecording}
        />
      </div>
    </div>
  )
}

export default App
