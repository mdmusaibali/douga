import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import App from './App'
import 'primereact/resources/themes/vela-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
)
