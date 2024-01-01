import { useEffect, useRef, useState } from 'react'
import styles from './CamPreview.module.scss'

export default function CamPreview() {
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)

  const getCamStream = async () => {
    const source = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {}
    })
    const stream = new MediaStream(source)
    console.log('STREAM ', stream)
    setStream(stream)
  }

  useEffect(() => {
    getCamStream()
  }, [])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = (e) => videoRef.current.play()
    }
  }, [stream])

  return (
    <div className={`${styles['cam-preview']} draggable-area prevent-select`}>
      <video ref={videoRef} muted autoPlay className="w-full h-full"></video>
    </div>
  )
}
