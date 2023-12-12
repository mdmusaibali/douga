import React from 'react'
import RecordActions from '../components/recorder/RecordActions'
import { channels } from '../../../shared'

const { ipcRenderer } = electron

function RecorderActionView() {
  const handlePauseRecord = () => {
    ipcRenderer.send(channels.PAUSE_RECORDING)
  }
  const handleResumeRecord = () => {
    ipcRenderer.send(channels.RESUME_RECORDING)
  }
  const handleStopRecord = () => {}
  return (
    <div className="px-2 py-2">
      <RecordActions
        onPauseRecord={handlePauseRecord}
        onResumeRecord={handleResumeRecord}
        onStopRecord={handleStopRecord}
        isRecording={true}
        selectedSource={{ name: 'Test' }}
        showScreenOptions={false}
        showRecordTimer={false}
      />
    </div>
  )
}

export default RecorderActionView
