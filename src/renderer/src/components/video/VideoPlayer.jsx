import React, { useRef } from 'react'
import ReactLogo from './../../assets/multi-window.svg?react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { VideoLayout } from './layouts/video-layout'
import styles from './VideoPlayer.module.scss'

function VideoPlayer({ videoChunks, onSave, onStartOver, playLocalFile = false }) {
  // If we have chunks then it must be recording preview
  const chunkAvailable = Array.isArray(videoChunks) && videoChunks.length > 0
  const playerRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const showMediaPlayer = chunkAvailable || playLocalFile

  if (playLocalFile && !location?.state?.fullPath) {
    return (
      <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
        <h2>Unable to load the video. Please go back</h2>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <div className="border-round border-1 surface-border p-4 surface-card flex flex-column w-full h-full">
        {playLocalFile && (
          <Button
            label="Back"
            onClick={() => {
              navigate('/')
            }}
            icon="pi pi-chevron-left"
            severity="secondary"
            text
            className="align-self-start mb-4 mt-2 px-0 py-0"
          />
        )}
        {showMediaPlayer && (
          <MediaPlayer
            src={
              playLocalFile
                ? 'my-video-protocol://getMediaFile' + location?.state?.fullPath
                : URL.createObjectURL(videoChunks[0])
            }
            ref={playerRef}
            className={`${styles.player} media-player`}
          >
            <MediaProvider></MediaProvider>
            <VideoLayout />
          </MediaPlayer>
        )}
        {!playLocalFile && (
          <div className="mt-4 flex justify-content-end">
            <Button
              label="Start Over"
              severity="secondary"
              size="small"
              icon="pi pi-refresh"
              onClick={onStartOver}
              className="mr-3"
            />
            <Button label="Save" severity="success" size="small" onClick={onSave} />
          </div>
        )}
      </div>
      {!chunkAvailable && !playLocalFile && (
        <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
          <ReactLogo style={{ height: '300px', width: '300px', fill: 'var(--primary-color)' }} />
          <h2>Please select a screen.</h2>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
