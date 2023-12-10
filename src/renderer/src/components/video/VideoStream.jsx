import React, { useEffect, useRef } from 'react'
import ReactLogo from './../../assets/multi-window.svg?react'

function VideoStream({ stream }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = (e) => videoRef.current.play()
    }
  }, [stream])

  return (
    <div className="w-full h-full">
      {stream && (
        <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
          <video ref={videoRef} autoPlay className="w-full h-full"></video>
        </div>
      )}
      {!stream && (
        <div className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column w-full h-full">
          <ReactLogo style={{ height: '300px', width: '300px', fill: 'var(--primary-color)' }} />
          <h2>Please select a screen.</h2>
        </div>
      )}
    </div>
  )
}

export default VideoStream
