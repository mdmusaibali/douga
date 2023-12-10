import { Button } from 'primereact/button'
import { Slider } from 'primereact/slider'
import React from 'react'

function VideoPlayerActions({
  played,
  playing,
  onSliderMouseDown,
  onSliderChange,
  onSliderMouseUp,
  onTogglePlay,
  onStartOver,
  onSave
}) {
  return (
    <div className="pa-2 align-self-start w-full">
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={played}
        onMouseDown={onSliderMouseDown}
        onChange={onSliderChange}
        onMouseUp={onSliderMouseUp}
      />
      {/* <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={playerState.played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="w-full"
            /> */}
      <div className="flex align-items-center mt-3">
        <div className="mr-auto">
          <Button
            icon={`pi pi-${playing ? 'pause' : 'play'}`}
            severity="secondary"
            size="small"
            onClick={onTogglePlay}
          />
        </div>

        <div>
          <Button
            label="Start Over"
            severity="secondary"
            size="small"
            icon="pi pi-refresh"
            onClick={onStartOver}
            className="mr-3"
          />
          <Button label="Done" severity="success" size="small" onClick={onSave} />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerActions
