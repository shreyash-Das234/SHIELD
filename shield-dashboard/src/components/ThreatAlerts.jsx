import { useState, useEffect } from 'react'
import { Bot, Database, Zap, Globe, X, AlertOctagon, ChevronRight } from 'lucide-react'

const initialAlerts = [
  { id: 1, icon: Bot,          iconBg: '#fee2e2', iconColor: '#ef4444', severity: 'critical', title: 'Bot activity blocked (HTTP Flood)', detail: 'Targeting /login from AS13335', time: '10:43:21', isNew: true },
  { id: 2, icon: Database,     iconBg: '#fee2e2', iconColor: '#ef4444', severity: 'critical', title: 'SQLi Attempt Mitigated',             detail: 'IP 192.168.45.2',              time: '10:41:05', isNew: false },
  { id: 3, icon: Zap,          iconBg: '#fef3c7', iconColor: '#f59e0b', severity: 'warning',  title: 'High traffic detected',             detail: 'Unusual spike from EU region',  time: '10:39:12', isNew: false },
  { id: 4, icon: Globe,        iconBg: '#fef3c7', iconColor: '#f59e0b', severity: 'warning',  title: 'Geo-block triggered',               detail: '47 requests from CN blocked',   time: '10:37:44', isNew: false },
]

const severityColors = {
  critical: { bg: '#fef2f2', color: '#ef4444', label: 'Critical' },
  warning:  { bg: '#fef3c7', color: '#d97706', label: 'Warning' },
  info:     { bg: '#eff6ff', color: '#2563eb', label: 'Info' },
}

export default function ThreatAlerts({ onViewAll }) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [highlight, setHighlight] = useState(null)

  // Simulate new alert arriving
  useEffect(() => {
    const t = setTimeout(() => {
      const newAlert = {
        id: Date.now(),
        icon: AlertOctagon,
        iconBg: '#fee2e2', iconColor: '#ef4444',
        severity: 'critical',
        title: 'New DDoS wave detected',
        detail: '2.1k req/s from AS4134',
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isNew: true,
      }
      setAlerts(prev => [newAlert, ...prev.slice(0, 3)])
      setHighlight(newAlert.id)
      setTimeout(() => setHighlight(null), 2000)
    }, 5500)
    return () => clearTimeout(t)
  }, [])

  const dismiss = (id) => setAlerts(a => a.filter(x => x.id !== id))

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
      animation: 'fadeInUp 0.4s ease 0.3s both',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>Recent Threats</span>
          <span style={{
            background: '#fee2e2', color: '#ef4444', fontSize: 10, fontWeight: 800,
            padding: '2px 7px', borderRadius: 99, fontFamily: 'var(--font-mono)',
          }}>{alerts.filter(a => a.severity === 'critical').length}</span>
        </div>
        <button
          onClick={onViewAll}
          style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
          View All <ChevronRight size={11} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {alerts.map((a) => {
          const Icon = a.icon
          const sc = severityColors[a.severity]
          const isHigh = highlight === a.id
          return (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '9px 10px', borderRadius: 8,
              background: isHigh ? '#fff5f5' : 'transparent',
              border: `1px solid ${isHigh ? '#fecaca' : 'transparent'}`,
              transition: 'all 0.3s ease',
              animation: a.isNew && a.id !== initialAlerts[0].id ? 'fadeInUp 0.3s ease both' : 'none',
              position: 'relative',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 7,
                background: a.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={13} color={a.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                  <span style={{ fontSize: 9.5, fontWeight: 700, background: sc.bg, color: sc.color, padding: '1px 6px', borderRadius: 99, flexShrink: 0 }}>{sc.label}</span>
                </div>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>
                  {a.detail} <span style={{ fontFamily: 'var(--font-mono)' }}>• {a.time}</span>
                </p>
              </div>
              <button onClick={() => dismiss(a.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#d1d5db', padding: 1, flexShrink: 0, lineHeight: 0,
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
                onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
              >
                <X size={11} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
