import React, { useEffect, useRef } from 'react'

function VideoStream({ stream }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = (e) => videoRef.current.play()
    }
  }, [stream])

  return (
    <div>
      {stream && <video ref={videoRef} autoPlay style={{ height: '100%', width: '100%' }}></video>}
      {!stream && <p>Please select a source.</p>}
    </div>
  )
}

export default VideoStream
