import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import React from 'react'

function RecordActions({ onStartRecord, onStopRecord, sources, onChooseSource, selectedSource }) {
  return (
    <div>
      <Dropdown
        value={selectedSource}
        onChange={onChooseSource}
        options={sources}
        optionLabel="name"
        placeholder="Select a Source"
        showClear
      />
      <Button
        label="Start Recording"
        severity="success"
        icon="pi pi-check"
        onClick={onStartRecord}
      />
      <Button label="Stop Recording" severity="danger" icon="pi pi-check" onClick={onStopRecord} />
    </div>
  )
}

export default RecordActions
