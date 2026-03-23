import { useState } from 'react'
import { Zap, Globe, Shield, Filter, BarChart2, ChevronRight } from 'lucide-react'

const initialRules = [
  { id: 1, icon: Zap,      iconColor: '#f59e0b', iconBg: '#fef3c7', title: 'Global Rate Limiting', desc: 'Max 50 req/sec per IP',              enabled: true,  blocked: 1842 },
  { id: 2, icon: Globe,    iconColor: '#3b82f6', iconBg: '#eff6ff', title: 'Geo-blocking (Strict)', desc: 'Blocking 4 high-risk regions',       enabled: true,  blocked: 4210 },
  { id: 3, icon: Shield,   iconColor: '#8b5cf6', iconBg: '#f5f3ff', title: 'AI Heuristics',         desc: 'Auto-drop score > 80',               enabled: true,  blocked: 327  },
  { id: 4, icon: Filter,   iconColor: '#ef4444', iconBg: '#fee2e2', title: 'SQL Injection Filter',  desc: 'Drop known SQLi payloads',           enabled: true,  blocked: 56   },
  { id: 5, icon: BarChart2, iconColor: '#22c55e', iconBg: '#dcfce7', title: 'DDoS Threshold',       desc: 'Alert on > 10k req/min per IP',      enabled: false, blocked: 0    },
]

function Toggle({ enabled, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange() }} style={{
      width: 36, height: 20, borderRadius: 999,
      background: enabled ? '#3b82f6' : '#e2e8f0',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2,
        left: enabled ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

export default function DefenseRules({ onManage }) {
  const [rules, setRules] = useState(initialRules)
  const toggle = (id) => setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))

  const activeCount = rules.filter(r => r.enabled).length
  const totalBlocked = rules.filter(r => r.enabled).reduce((s, r) => s + r.blocked, 0)

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
      animation: 'fadeInUp 0.4s ease 0.4s both',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>Active Defense Rules</span>
          <span style={{
            background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 800,
            padding: '2px 7px', borderRadius: 99,
          }}>{activeCount} ON</span>
        </div>
        <button onClick={onManage} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
          Manage <ChevronRight size={11} />
        </button>
      </div>

      {/* Summary bar */}
      <div style={{
        background: '#f8fafc', borderRadius: 8, padding: '8px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, border: '1px solid #f1f5f9',
      }}>
        <span style={{ fontSize: 11.5, color: '#6b7280' }}>Total blocked today</span>
        <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f1623' }}>
          {totalBlocked.toLocaleString()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {rules.map((r, i) => {
          const Icon = r.icon
          return (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 8px', borderRadius: 8,
              borderBottom: i < rules.length - 1 ? '1px solid #f8fafc' : 'none',
              opacity: r.enabled ? 1 : 0.55,
              transition: 'opacity 0.2s',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: r.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={13} color={r.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b' }}>{r.title}</p>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>{r.desc}</p>
              </div>
              {r.enabled && r.blocked > 0 && (
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#6b7280', flexShrink: 0 }}>
                  {r.blocked.toLocaleString()}
                </span>
              )}
              <Toggle enabled={r.enabled} onChange={() => toggle(r.id)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
