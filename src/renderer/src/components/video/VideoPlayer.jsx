import React, { useState, useRef, useEffect } from 'react'
import ReactLogo from './../../assets/multi-window.svg?react'
import ReactPlayer from 'react-player'
import VideoPlayerActions from './VideoPlayerActions'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'

function VideoPlayer({ videoChunks, onSave, onStartOver, showControls = false }) {
  const chunkAvailable = Array.isArray(videoChunks) && videoChunks.length > 0
  const playerRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  // const queryString = window.location.search
  // const urlParams = new URLSearchParams(queryString)
  // const filePath = urlParams.get('filePath')

  const [playerState, setPlayerState] = useState({
    url: null,
    playing: true,
    played: 0
  })

  useEffect(() => {
    if (chunkAvailable) {
      setState({ url: URL.createObjectURL(videoChunks[0]) })
    }
  }, [chunkAvailable])

  const handleProgress = (state) => {
    if (!playerState.seeking) {
      setPlayerState((prevState) => ({ ...prevState, ...state }))
    }
  }

  const setState = (state) => {
    setPlayerState((prevState) => ({ ...prevState, ...state }))
  }

  const handleSeekMouseDown = (e) => {
    setState({ seeking: true })
  }

  const handleSeekChange = (e) => {
    setState({ played: parseFloat(e.value) })
  }

  const handleSeekMouseUp = (e) => {
    setState({ seeking: false })
    if (playerRef.current) {
      // TODO use target instead of state below
      console.log('MSB SEEK TO ', playerState.played)
      playerRef.current.seekTo(parseFloat(playerState.played))
    }
  }

  const handlePlay = () => {
    setState({ playing: true })
  }

  const handleEnded = () => {
    setState({ playing: false })
  }

  const togglePlay = () => {
    setState({ playing: !playerState.playing })
  }

  if (showControls && location.state.fullPath) {
    return (
      <div className="w-full h-full">
        <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
          <Button
            label="Back"
            onClick={() => {
              navigate('/')
            }}
            icon="pi pi-chevron-left"
            text
            severity="secondary"
            className="align-self-start"
          />
          <ReactPlayer
            ref={playerRef}
            url={'my-video-protocol://getMediaFile' + location.state.fullPath}
            height={'100%'}
            width={'100%'}
            controls={showControls}
          />
        </div>
      </div>
    )
  }

  if (showControls && !location.state.fullPath) {
    return (
      <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
        <h2>Unable to load the video. Please go back</h2>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      {chunkAvailable && !showControls && (
        <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
          <ReactPlayer
            ref={playerRef}
            url={playerState.url}
            playing={playerState.playing}
            onPlay={handlePlay}
            height={'100%'}
            width={'100%'}
            onProgress={handleProgress}
            onEnded={handleEnded}
            controls={showControls}
          />
          <VideoPlayerActions
            played={playerState.played}
            playing={playerState.playing}
            onSliderMouseUp={handleSeekMouseUp}
            onSliderChange={handleSeekChange}
            onSliderMouseDown={handleSeekMouseDown}
            onTogglePlay={togglePlay}
            onStartOver={onStartOver}
            onSave={onSave}
          />
        </div>
      )}
      {!chunkAvailable && !showControls && (
        <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
          <ReactLogo style={{ height: '300px', width: '300px', fill: 'var(--primary-color)' }} />
          <h2>Please select a screen.</h2>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
