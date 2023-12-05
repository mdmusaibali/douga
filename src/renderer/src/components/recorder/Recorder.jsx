import { useEffect, useState } from 'react'
import { channels } from '../../../../shared'
import VideoStream from '../video/VideoStream'
import RecordActions from './RecordActions'
import styles from './Recorder.module.scss'

const { ipcRenderer } = electron

function Recorder() {
  const [mediaRecorder, setMediaRecorder] = useState('')
  const videoChunks = []
  const [stream, setStream] = useState(null)
  const [sources, setSources] = useState([])
  const [selectedSource, setSelectedSource] = useState(null)

  const handleSources = (_, sources) => {
    setSources(sources)
  }

  useEffect(() => {
    handleStream(selectedSource)
  }, [selectedSource])

  async function handleStream(source) {
    if (source) {
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
        setStream(stream)
      } catch (e) {
        console.error('ERROR ', e)
      }
    } else {
      if (stream) {
        setStream(null)
      }
    }
  }

  async function onChooseSource(e) {
    setSelectedSource(e.value)
  }

  useEffect(() => {
    ipcRenderer.send(channels.GET_SOURCES)
    ipcRenderer.on(channels.GET_SOURCES, handleSources)
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners()
    }
  }, [])

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
    <div className={styles.recorder}>
      <div className={styles.recorder__preview}>
        <VideoStream stream={stream} />
      </div>
      <div className={styles.recorder__actions}>
        <RecordActions
          sources={sources}
          selectedSource={selectedSource}
          onChooseSource={onChooseSource}
          onStartRecord={startRecording}
          onStopRecord={stopRecording}
        />
      </div>
    </div>
  )
}

export default Recorder
