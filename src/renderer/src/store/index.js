import { configureStore } from '@reduxjs/toolkit'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
import { recorderReducer } from './slice/recorderSlice'

export const store = configureStore({
  reducer: {
    recorder: recorderReducer
  }
  // middleware: () => [createStateSyncMiddleware()]
})
initMessageListener(store)
