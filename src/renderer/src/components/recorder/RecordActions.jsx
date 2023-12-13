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
  onPauseRecord,
  showRecordTimer = true
}) {
  return (
    <div className="flex gap-3 align-items-center">
      {isRecording && (
        <div className="flex flex-column">
          {showRecordTimer && <RecordTimer isRecording={isRecording} isPaused={isPaused} />}
          {selectedSource && (
            <p className="my-0 text-s font-light">Recording {selectedSource.name}</p>
          )}
        </div>
      )}
      {showScreenOptions && (
        <>
          <Button
            severity="secondary"
            label="Refresh Screens"
            icon="pi pi-refresh"
            size="small"
            onClick={onRefreshScreenSources}
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
      <div className="flex align-items-center ml-auto gap-3">
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
    </div>
  )
}

export default RecordActions
