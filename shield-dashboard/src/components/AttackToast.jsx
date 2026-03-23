import { useState, useEffect } from 'react'
import { AlertOctagon, Shield, X, ChevronRight } from 'lucide-react'

const toastQueue = [
  {
    id: 1,
    delay: 1200,
    type: 'critical',
    icon: AlertOctagon,
    title: 'Attack Blocked',
    desc: 'DDoS attempt (HTTP Flood) from AS13335 automatically mitigated.',
  },
  {
    id: 2,
    delay: 7000,
    type: 'success',
    icon: Shield,
    title: 'System Stabilized',
    desc: 'Traffic returned to baseline. All defense rules active.',
  },
]

const colors = {
  critical: { bg: '#fff', border: '#fca5a5', dot: '#ef4444', iconBg: '#fee2e2', iconColor: '#ef4444', titleColor: '#0f1623' },
  success:  { bg: '#fff', border: '#86efac', dot: '#22c55e', iconBg: '#dcfce7', iconColor: '#16a34a', titleColor: '#0f1623' },
}

function Toast({ toast, onDismiss }) {
  const [progress, setProgress] = useState(100)
  const c = colors[toast.type]
  const Icon = toast.icon

  useEffect(() => {
    const duration = 5000
    const interval = 50
    const step = (interval / duration) * 100
    const timer = setInterval(() => {
      setProgress(p => {
        if (p - step <= 0) { clearInterval(timer); onDismiss(); return 0 }
        return p - step
      })
    }, interval)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      background: c.bg,
      border: `1.5px solid ${c.border}`,
      borderRadius: 12,
      padding: '14px 14px 10px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 11,
      boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
      width: 320,
      animation: 'slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: c.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={15} color={c.iconColor} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: c.titleColor, marginBottom: 2 }}>{toast.title}</p>
        <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.4 }}>{toast.desc}</p>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 2, marginTop: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#3b82f6', fontSize: 11.5, fontWeight: 600, padding: 0,
        }}>
          View details <ChevronRight size={11} />
        </button>
      </div>

      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#9ca3af', padding: 2, flexShrink: 0,
      }}>
        <X size={13} />
      </button>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: '#f3f4f6',
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: c.dot, borderRadius: 99,
          transition: 'width 0.05s linear',
        }} />
      </div>
    </div>
  )
}

export default function AttackToast() {
  const [visible, setVisible] = useState([])

  useEffect(() => {
    const timers = toastQueue.map(t =>
      setTimeout(() => setVisible(v => [...v, t]), t.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const dismiss = (id) => setVisible(v => v.filter(t => t.id !== id))

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      display: 'flex', flexDirection: 'column', gap: 10,
      zIndex: 1000,
    }}>
      {visible.map(t => (
        <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  )
}
