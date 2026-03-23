import TopBar from '../components/TopBar'
import StatCards from '../components/StatCards'
import LiveTrafficChart from '../components/LiveTrafficChart'
import ThreatAlerts from '../components/ThreatAlerts'
import AIDetection from '../components/AIDetection'
import DefenseRules from '../components/DefenseRules'
import AttackToast from '../components/AttackToast'

export default function DashboardPage({ onNavigate }) {
  return (
    <>
      <TopBar title="Dashboard" />
      <StatCards />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, marginBottom: 14 }}>
        <LiveTrafficChart />
        <ThreatAlerts onViewAll={() => onNavigate?.('logs')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <AIDetection />
        <DefenseRules onManage={() => onNavigate?.('firewall')} />
      </div>
      <AttackToast />
    </>
  )
}
