import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import DashboardPage       from './pages/DashboardPage'
import TrafficMonitoringPage from './pages/TrafficMonitoringPage'
import AIDetectionPage     from './pages/AIDetectionPage'
import FirewallPage        from './pages/FirewallPage'
import LogsPage            from './pages/LogsPage'
import SettingsPage        from './pages/SettingsPage'

const pages = {
  dashboard:    DashboardPage,
  traffic:      TrafficMonitoringPage,
  'ai-detection': AIDetectionPage,
  firewall:     FirewallPage,
  logs:         LogsPage,
  settings:     SettingsPage,
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const mainRef = useRef(null)

  const handleNavigate = (page) => {
    setActivePage(page)
    if (mainRef.current) mainRef.current.scrollTop = 0
  }

  const PageComponent = pages[activePage] || DashboardPage

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-main)' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <main
        ref={mainRef}
        key={activePage}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '28px 32px 40px',
          animation: 'fadeInUp 0.22s ease both',
        }}
      >
        <PageComponent onNavigate={handleNavigate} />
      </main>
    </div>
  )
}
