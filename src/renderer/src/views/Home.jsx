import { Outlet } from 'react-router-dom'
import CloudFiles from '../components/files/CloudFiles'
import LocalFiles from '../components/files/LocalFiles'
import styles from './Home.module.scss'
import { Divider } from 'primereact/divider'

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.home__aside}>
        <LocalFiles />
        {/* Adding Cloud files soon */}
        {/* <Divider className="my-0" />
        <CloudFiles /> */}
      </div>
      <Divider layout="vertical" className="mx-0" />
      <div className={styles.home__main}>
        <Outlet />
      </div>
    </div>
  )
}

export default Home
