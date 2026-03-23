import { useState } from 'react'
import {
  LayoutDashboard, Activity, Brain, Shield,
  FileText, Settings, LogOut, Zap
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',          page: 'dashboard',    badge: null },
  { icon: Activity,        label: 'Traffic Monitoring', page: 'traffic',       badge: null },
  { icon: Brain,           label: 'AI Detection',       page: 'ai-detection',  badge: '87', badgeColor: '#ef4444' },
  { icon: Shield,          label: 'Firewall & Rules',   page: 'firewall',      badge: null },
  { icon: FileText,        label: 'Logs & Activity',    page: 'logs',          badge: '3',  badgeColor: '#f59e0b' },
  { icon: Settings,        label: 'Settings',           page: 'settings',      badge: null },
]

export default function Sidebar({ activePage, onNavigate }) {
  const [hovered, setHovered] = useState(null)

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      borderRight: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59,130,246,0.45)',
            flexShrink: 0,
          }}>
            <Zap size={17} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 17,
            fontWeight: 700,
            color: '#f1f5f9',
            letterSpacing: '0.06em',
          }}>SHIELD</span>
        </div>
        <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.5, fontWeight: 400 }}>
          Smart Heuristic Intelligence<br />Engine for Layered Defense
        </p>
      </div>

      {/* Status pill */}
      <div style={{ padding: '10px 14px 4px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.15)',
          borderRadius: 99, padding: '5px 10px',
        }}>
          <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: '#22c55e', animation: 'pulse-ring 1.8s ease-out infinite',
            }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', position: 'relative' }} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#4ade80', letterSpacing: '0.02em' }}>
            Protection Active
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 10px', flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', padding: '8px 8px 4px', marginBottom: 2 }}>
          NAVIGATION
        </p>
        {navItems.map(({ icon: Icon, label, page, badge, badgeColor }) => {
          const isActive = activePage === page
          const isHovered = hovered === page

          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              onMouseEnter={() => setHovered(page)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                width: '100%',
                padding: '9px 10px',
                borderRadius: 8,
                border: 'none',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.08) 100%)'
                  : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: isActive ? '#60a5fa' : isHovered ? '#94a3b8' : '#475569',
                fontSize: 13,
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                marginBottom: 1,
                textAlign: 'left',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                position: 'relative',
              }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  background: badgeColor,
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 99,
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.6,
                }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Threat summary */}
      <div style={{ padding: '10px 14px', margin: '0 10px 10px', background: 'rgba(239,68,68,0.07)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#f87171', marginBottom: 4 }}>⚠ Active Incident</p>
        <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>DDoS from AS13335 — auto-mitigated</p>
      </div>

      {/* Logout */}
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 9,
          width: '100%', padding: '9px 10px',
          borderRadius: 8, border: 'none',
          background: 'transparent',
          color: '#475569', fontSize: 13,
          fontFamily: 'var(--font-sans)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  )
}
