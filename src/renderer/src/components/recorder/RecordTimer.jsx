import React, { useState, useEffect } from 'react'

const RecordTimer = ({ isRecording, isPaused }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    let timer

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      clearInterval(timer)
    }
  }, [isRunning])

  useEffect(() => {
    if (isRecording) {
      handleStart()
    } else {
      handleReset()
    }
  }, [isRecording])

  useEffect(() => {
    if (isPaused) {
      handleStop()
    } else {
      handleStart()
    }
  }, [isPaused])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return (
    <div>
      <p>{formatTime(time)}</p>
    </div>
  )
}

export default RecordTimer
