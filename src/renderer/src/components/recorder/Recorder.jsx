import { useCallback, useEffect, useState } from 'react'
import { channels } from '../../../../shared/channels'
import VideoStream from '../video/VideoStream'
import RecordActions from './RecordActions'
import styles from './Recorder.module.scss'
import VideoPlayer from '../video/VideoPlayer'
import { useDispatch, useSelector } from 'react-redux'
import { recorderActions } from '../../store/slice/recorderSlice'

const { ipcRenderer } = electron

function Recorder() {
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [videoChunks, setVideoChunks] = useState([])
  const [stream, setStream] = useState(null)
  const [sources, setSources] = useState([])

  const dispatch = useDispatch()
  const state = useSelector((state) => state.recorder)
  const { isRecording, isPaused, isShowingSaveOptions, selectedSource } = state
  const { setIsPaused, setIsRecording, setIsShowingSaveOptions, setSelectedSource } =
    recorderActions

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
        mediaRecorder.onstart = handleStart
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
    dispatch(setSelectedSource(e.value))
    handleStream(e.value)
  }

  const getScreenSources = async () => {
    if (selectedSource) {
      dispatch(setSelectedSource(null))
    }
    const screenSources = await ipcRenderer.invoke(channels.GET_SOURCES)
    setSources(screenSources)
  }

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start()
      console.log('Recording started')
    }
  }

  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      // console.log('Recording stopped')
    }
  }, [mediaRecorder])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.pause()
      dispatch(setIsPaused(true))
      // console.log('Recording paused')
    }
  }, [mediaRecorder, setIsPaused])

  const resumeRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.resume()
      dispatch(setIsPaused(false))
      // console.log('Recording resumed')
    }
  }, [mediaRecorder, setIsPaused])

  const resetRecorder = () => {
    setVideoChunks([])
    setStream(null)
    dispatch(setSelectedSource(null))
    dispatch(setIsRecording(false))
    dispatch(setIsPaused(false))
    dispatch(setIsShowingSaveOptions(false))
    setMediaRecorder(null)
  }

  const handleDataAvailable = (e) => {
    console.log('Pushing chunk ', e.data)
    setVideoChunks((prevChunks) => [...prevChunks, e.data])
  }

  const handleStart = () => {
    dispatch(setIsRecording(true))
  }

  const handleStop = async () => {
    dispatch(setIsRecording(false))
    dispatch(setIsShowingSaveOptions(true))
  }

  const saveRecording = async () => {
    if (Array.isArray(videoChunks) && videoChunks.length < 1) return

    const blob = new Blob(videoChunks, {
      type: 'video/webm; codecs=vp9'
    })
    const arrayBuffer = await blob.arrayBuffer()

    // TODO Add a loading handler here. Will be helpful for large files
    const isSaved = await ipcRenderer.invoke(channels.SAVE_FILE, arrayBuffer)
    if (isSaved) {
      resetRecorder()
      dispatch(setIsShowingSaveOptions(false))
      ipcRenderer.send(channels.GET_DIR_FILES)
    }
  }

  useEffect(() => {
    getScreenSources()
  }, [])

  useEffect(() => {
    let removePauseListener = ipcRenderer.on(channels.PAUSE_RECORDING, pauseRecording)
    let removeResumeListener = ipcRenderer.on(channels.RESUME_RECORDING, resumeRecording)
    let removeStopListener = ipcRenderer.on(channels.STOP_RECORDING, stopRecording)
    // Clean the listener after the component is dismounted
    return () => {
      removePauseListener()
      removeResumeListener()
      removeStopListener()
    }
  }, [pauseRecording, resumeRecording, stopRecording, selectedSource, stream])

  useEffect(() => {
    if (isRecording) {
      ipcRenderer.invoke(channels.OPEN_RECORD_ACTION_WINDOW, state)
    } else {
      ipcRenderer.invoke(channels.CLOSE_RECORD_ACTION_WINDOW)
    }
  }, [isRecording])

  return (
    <div className={styles.recorder}>
      <div className={styles.recorder__preview}>
        {!isShowingSaveOptions && <VideoStream stream={stream} />}
        {isShowingSaveOptions && (
          <VideoPlayer
            videoChunks={videoChunks}
            onSave={saveRecording}
            onStartOver={resetRecorder}
          />
        )}
      </div>
      {!isShowingSaveOptions && (
        <div className={styles.recorder__actions}>
          <RecordActions
            sources={sources}
            selectedSource={selectedSource}
            onChooseSource={onChooseSource}
            onStartRecord={startRecording}
            onStopRecord={stopRecording}
            onPauseRecord={pauseRecording}
            onResumeRecord={resumeRecording}
            onRefreshScreenSources={getScreenSources}
            isRecording={isRecording}
            isPaused={isPaused}
            showScreenOptions={!isRecording}
          />
        </div>
      )}
    </div>
  )
}

export default Recorder
