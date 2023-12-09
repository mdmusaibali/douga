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
    <div style={{ width: '100%', height: '100%' }}>
      {stream && (
        <div
          className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column"
          style={{ width: '100%', height: '100%' }}
        >
          <video ref={videoRef} autoPlay style={{ height: '100%', width: '100%' }}></video>
        </div>
      )}
      {!stream && (
        <div
          className="border-round border-1 surface-border p-4 surface-card flex justify-content-center align-items-center flex-column"
          style={{ width: '100%', height: '100%' }}
        >
          <ReactLogo style={{ height: '300px', width: '300px', fill: 'var(--primary-color)' }} />
          <h2>Please select a screen.</h2>
        </div>
      )}
    </div>
  )
}

export default VideoStream
