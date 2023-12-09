import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import React from 'react'
import RecordTimer from './RecordTimer'

function RecordActions({
  onStartRecord,
  onStopRecord,
  sources,
  onChooseSource,
  selectedSource,
  onRefreshScreenSources,
  showScreenOptions = true,
  isRecording,
  isPaused,
  onResumeRecord,
  onPauseRecord
}) {
  return (
    <div className="flex gap-3">
      {isRecording && <RecordTimer isRecording={isRecording} isPaused={isPaused} />}
      {showScreenOptions && (
        <>
          <Button
            severity="secondary"
            icon="pi pi-refresh"
            size="small"
            onClick={onRefreshScreenSources}
            tooltip="Refresh Screens"
            tooltipOptions={{ position: 'top' }}
          />
          <Dropdown
            value={selectedSource}
            onChange={onChooseSource}
            options={sources}
            optionLabel="name"
            placeholder="Select a Screen"
            showClear
            style={{ minWidth: '400px' }}
          />
        </>
      )}
      {selectedSource && !isRecording && (
        <Button label="Record" severity="danger" size="small" onClick={onStartRecord} />
      )}
      {selectedSource && isRecording && isPaused && (
        <Button
          label="Resume"
          severity="secondary"
          size="small"
          outlined
          icon="pi pi-play"
          onClick={onResumeRecord}
        />
      )}
      {selectedSource && isRecording && !isPaused && (
        <Button
          label="Pause"
          severity="secondary"
          size="small"
          outlined
          icon="pi pi-pause"
          onClick={onPauseRecord}
        />
      )}
      {selectedSource && isRecording && (
        <Button label="Stop" size="small" severity="danger" onClick={onStopRecord} />
      )}
    </div>
  )
}

export default RecordActions
