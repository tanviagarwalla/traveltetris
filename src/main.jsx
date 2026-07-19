import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import * as amplitude from '@amplitude/unified'
import './index.css'
import App from './App.jsx'

inject()

amplitude.initAll('4c49cebc01efbbb1f02d5aa3bdb6fd7c', {
  analytics: { autocapture: true },
  sessionReplay: { sampleRate: 1 },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
