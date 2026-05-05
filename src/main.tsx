import { LogtoProvider, type LogtoConfig } from '@logto/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import './index.css'

const logtoConfig: LogtoConfig = {
  endpoint: 'https://df4in1.logto.app/',
  appId: 'prjzjqxbbnjokkfvs3d4r',
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogtoProvider config={logtoConfig}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </LogtoProvider>
  </StrictMode>,
)
