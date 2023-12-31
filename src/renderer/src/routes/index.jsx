import Recorder from '../components/recorder/Recorder'
import VideoPlayer from '../components/video/VideoPlayer'
import CamPreview from '../views/CamPreview'
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
        element: <VideoPlayer playLocalFile={true} />
      }
    ]
  },
  {
    path: '/vid-action-preview',
    element: <RecorderActionView />
  },
  {
    path: '/cam-preview',
    element: <CamPreview />
  }
]
