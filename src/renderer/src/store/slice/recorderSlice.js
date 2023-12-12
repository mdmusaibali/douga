import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mediaRecorder: null,
  videoChunks: [],
  stream: null,
  sources: [],
  selectedSource: null,
  isRecording: false,
  isPaused: false,
  isShowingSaveOptions: false
}

const recorderSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setMediaRecorder(state, { payload }) {
      state.mediaRecorder = payload
    },
    setVideoChunks(state, { payload }) {
      state.videoChunks = payload
    },
    setStream(state, { payload }) {
      state.stream = payload
    },
    setSources(state, { payload }) {
      state.sources = payload
    },
    setSelectedSource(state, { payload }) {
      state.selectedSource = payload
    },
    setIsRecording(state, { payload }) {
      state.isRecording = payload
    },
    setIsPaused(state, { payload }) {
      state.isPaused = payload
    },
    setIsShowingSaveOptions(state, { payload }) {
      state.isShowingSaveOptions = payload
    }
  }
})

export const recorderReducer = recorderSlice.reducer
export const recorderActions = recorderSlice.actions
