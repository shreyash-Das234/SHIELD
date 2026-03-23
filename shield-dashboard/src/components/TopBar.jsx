import { useState, useRef, useEffect } from 'react'
import { Bell, X, ChevronDown, User, LogOut, Settings } from 'lucide-react'

const notifications = [
  { id: 1, type: 'critical', title: 'DDoS Attack Blocked', desc: 'AS13335 HTTP Flood mitigated automatically', time: '2m ago', read: false },
  { id: 2, type: 'warning',  title: 'Rate Limit Triggered', desc: '114.12.33.90 exceeded 100 req/min', time: '7m ago', read: false },
  { id: 3, type: 'info',     title: 'Rules Updated', desc: 'Geo-blocking added for KP region', time: '1h ago', read: true },
]

const typeColors = {
  critical: '#ef4444',
  warning:  '#f59e0b',
  info:     '#3b82f6',
}

function NotificationPanel({ onClose }) {
  return (
    <div style={{
      position: 'absolute', top: '110%', right: 0,
      width: 340, background: '#fff',
      borderRadius: 12, border: '1px solid var(--border)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
      zIndex: 500, overflow: 'hidden',
      animation: 'fadeInUp 0.2s ease both',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f1623' }}>Notifications</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2 }}>
          <X size={14} />
        </button>
      </div>
      {notifications.map(n => (
        <div key={n.id} style={{
          display: 'flex', gap: 12, padding: '12px 16px',
          borderBottom: '1px solid var(--border-light)',
          background: n.read ? 'transparent' : 'rgba(59,130,246,0.02)',
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(59,130,246,0.02)'}
        >
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: typeColors[n.type],
            flexShrink: 0, marginTop: 5,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>{n.title}</span>
              <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>{n.time}</span>
            </div>
            <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.4 }}>{n.desc}</p>
          </div>
        </div>
      ))}
      <div style={{ padding: '10px 16px', textAlign: 'center' }}>
        <button style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
          View all notifications
        </button>
      </div>
    </div>
  )
}

function ProfileDropdown({ onClose }) {
  return (
    <div style={{
      position: 'absolute', top: '110%', right: 0,
      width: 200, background: '#fff',
      borderRadius: 10, border: '1px solid var(--border)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
      zIndex: 500, overflow: 'hidden',
      animation: 'fadeInUp 0.2s ease both',
    }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f1623' }}>Admin User</p>
        <p style={{ fontSize: 11.5, color: '#9ca3af' }}>admin@shield.io</p>
      </div>
      {[
        { icon: User,     label: 'Profile' },
        { icon: Settings, label: 'Settings' },
        { icon: LogOut,   label: 'Sign out', danger: true },
      ].map(({ icon: Icon, label, danger }) => (
        <button key={label} onClick={onClose} style={{
          display: 'flex', alignItems: 'center', gap: 9,
          width: '100%', padding: '9px 14px',
          border: 'none', background: 'transparent',
          color: danger ? '#ef4444' : '#374151',
          fontSize: 13, fontFamily: 'var(--font-sans)',
          cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.1s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}

export default function TopBar({ title, subtitle }) {
  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const unread = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    const handler = () => { setShowNotifs(false); setShowProfile(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid var(--border)',
    }} onMouseDown={e => e.stopPropagation()}>
      <div>
        <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f1623', fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12.5, color: '#6b7280', marginTop: 2 }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Live mode indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 99, padding: '5px 12px',
        }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e', animation: 'pulse-ring 1.8s ease-out infinite' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', position: 'relative' }} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>Live Mode</span>
          <div style={{ width: 36, height: 20, borderRadius: 99, background: '#22c55e', position: 'relative', cursor: 'pointer', marginLeft: 4 }}>
            <div style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
          </div>
        </div>

        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowNotifs(v => !v); setShowProfile(false) }} style={{
            width: 36, height: 36, borderRadius: 9,
            border: '1.5px solid var(--border)', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative', color: '#374151',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <Bell size={15} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, borderRadius: '50%',
                background: '#ef4444', color: '#fff',
                fontSize: 9, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-main)',
              }}>{unread}</span>
            )}
          </button>
          {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowProfile(v => !v); setShowNotifs(false) }} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 6px 4px 4px', borderRadius: 9,
            border: '1.5px solid var(--border)', background: '#fff',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700,
            }}>A</div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#374151' }}>Admin</span>
            <ChevronDown size={12} color="#9ca3af" />
          </button>
          {showProfile && <ProfileDropdown onClose={() => setShowProfile(false)} />}
        </div>
      </div>
    </div>
  )
}
