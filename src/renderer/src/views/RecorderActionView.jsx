import React, { useEffect } from 'react'
import RecordActions from '../components/recorder/RecordActions'
import { channels } from '../../../shared/channels'
import { useDispatch, useSelector } from 'react-redux'
import { recorderActions } from '../store/slice/recorderSlice'

const { ipcRenderer } = electron

function RecorderActionView() {
  const state = useSelector((state) => state.recorder)
  const { isRecording, isPaused, selectedSource, isRecordingAudio, isShowingCamPreview } = state
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('STATE ', state)
  }, [state])

  const initialiseState = (e, state) => {
    console.log('Initialising state', state)
    dispatch(recorderActions.setState(state))
  }

  useEffect(() => {
    ipcRenderer.on(channels.INITIALIZE_STATE, initialiseState)
    return () => {
      ipcRenderer.removeListener(channels.TEST, initialiseState)
    }
  }, [])

  const handlePauseRecord = () => {
    ipcRenderer.invoke(channels.PAUSE_RECORDING)
  }

  const handleResumeRecord = () => {
    ipcRenderer.invoke(channels.RESUME_RECORDING)
  }

  const handleStopRecord = () => {
    ipcRenderer.invoke(channels.STOP_RECORDING)
  }

  const toggleRecordingAudio = () => {
    dispatch(recorderActions.setIsRecordingAudio(!isRecordingAudio))
  }

  const toggleShowCamPreview = () => {
    dispatch(recorderActions.setIsShowingCamPreview(!isShowingCamPreview))
  }

  return (
    <div
      className="border-1 surface-border px-2 py-2 mt-1"
      style={{ backgroundColor: 'var(--surface-a)', borderRadius: 10, overflow: 'hidden' }}
    >
      <RecordActions
        onPauseRecord={handlePauseRecord}
        onResumeRecord={handleResumeRecord}
        onStopRecord={handleStopRecord}
        isRecording={isRecording}
        isPaused={isPaused}
        selectedSource={selectedSource}
        showScreenOptions={false}
        showRecordTimer={false}
        isRecordingAudio={isRecordingAudio}
        toggleRecordingAudio={toggleRecordingAudio}
        isShowingCamPreview={isShowingCamPreview}
        toggleShowCamPreview={toggleShowCamPreview}
      />
    </div>
  )
}

export default RecorderActionView
