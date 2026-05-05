import { LogtoProvider, UserScope, type LogtoConfig } from '@logto/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthSubBridge } from './components/AuthSubBridge'
import { AppProvider } from './context/AppContext'
import './index.css'

const logtoConfig: LogtoConfig = {
  endpoint: 'https://df4in1.logto.app/',
  appId: 'prjzjqxbbnjokkfvs3d4r',
  scopes: [
    UserScope.Profile,
    UserScope.Email,
    UserScope.Phone,
    UserScope.CustomData,
    UserScope.Identities,
  ],
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogtoProvider config={logtoConfig}>
      <BrowserRouter>
        <AuthSubBridge />
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </LogtoProvider>
  </StrictMode>,
)
