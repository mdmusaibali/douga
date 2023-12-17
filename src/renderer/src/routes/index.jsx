import Recorder from '../components/recorder/Recorder'
import VideoPlayer from '../components/video/VideoPlayer'
import Home from '../views/Home'
import RecorderActionView from '../views/RecorderActionView'

export default [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '',
        element: <Recorder />
      },
      {
        path: 'video/:src',
        element: <VideoPlayer showControls={true} />
      }
    ]
  },
  {
    path: '/vid-action-preview',
    element: <RecorderActionView />
  }
]
