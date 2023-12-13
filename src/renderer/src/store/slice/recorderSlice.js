import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isRecording: false,
  isPaused: false,
  isShowingSaveOptions: false
}

const recorderSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setIsRecording(state, { payload }) {
      state.isRecording = payload
    },
    setIsPaused(state, { payload }) {
      state.isPaused = payload
    },
    setIsShowingSaveOptions(state, { payload }) {
      state.isShowingSaveOptions = payload
    },
    setState(state, { payload }) {
      Object.entries(payload).forEach(([key, value]) => {
        state[key] = value
      })
    }
  }
})

export const recorderReducer = recorderSlice.reducer
export const recorderActions = recorderSlice.actions
