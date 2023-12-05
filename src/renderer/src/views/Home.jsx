import CloudFiles from '../components/files/CloudFiles'
import LocalFiles from '../components/files/LocalFiles'
import Recorder from '../components/recorder/Recorder'
import styles from './Home.module.scss'
import { Divider } from 'primereact/divider'

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.home__aside}>
        <LocalFiles />
        <Divider className="my-0" />
        <CloudFiles />
      </div>
      <Divider layout="vertical" className="mx-0" />
      <div className={styles.home__main}>
        <Recorder />
      </div>
    </div>
  )
}

export default Home