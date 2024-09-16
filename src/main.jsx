import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { DiscordChat } from './DiscordChat/DiscordChat'
import InviteForm from './CreateChannel/InviteForm'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <DiscordChat />
    <InviteForm />
  </StrictMode>,
)
