import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import App from './App'
import 'primereact/resources/themes/lara-dark-blue/theme.css'
// import 'primereact/resources/themes/vela-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './assets/base.css'
import 'primeflex/primeflex.css'
import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </Provider>
)
