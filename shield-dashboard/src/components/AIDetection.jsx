import { useEffect, useState } from 'react'
import { HelpCircle, TrendingUp, Shield, AlertTriangle } from 'lucide-react'

function ScoreRing({ score, size = 80 }) {
  const [animScore, setAnimScore] = useState(0)
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  const filled = (animScore / 100) * circ

  useEffect(() => {
    let frame
    let cur = 0
    const step = () => {
      cur = Math.min(cur + 2, score)
      setAnimScore(cur)
      if (cur < score) frame = requestAnimationFrame(step)
    }
    const t = setTimeout(() => { frame = requestAnimationFrame(step) }, 300)
    return () => { clearTimeout(t); cancelAnimationFrame(frame) }
  }, [score])

  const color = score >= 80 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#22c55e'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={7} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.05s linear' }}
      />
    </svg>
  )
}

export default function AIDetection() {
  const [score] = useState(87)
  const [animWidth, setAnimWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimWidth(score), 500)
    return () => clearTimeout(t)
  }, [])

  const scoreColor = score >= 80 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#22c55e'
  const scoreLabel = score >= 80 ? 'Critical Risk' : score >= 50 ? 'Elevated' : 'Low Risk'
  const scoreLabelBg = score >= 80 ? '#fef2f2' : score >= 50 ? '#fef3c7' : '#dcfce7'

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
      animation: 'fadeInUp 0.4s ease 0.35s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>AI Detection Intelligence</span>
        <HelpCircle size={13} color="#9ca3af" />
      </div>

      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ScoreRing score={score} size={72} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: scoreColor, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600 }}>/ 100</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11.5, color: '#9ca3af', marginBottom: 4 }}>Current Anomaly Score</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: scoreColor }}>87</span>
            <span style={{
              background: scoreLabelBg, color: scoreColor,
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
            }}>{scoreLabel}</span>
          </div>

          {/* Mini progress bar */}
          <div style={{ height: 5, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${animWidth}%`,
              background: `linear-gradient(90deg, #f97316, ${scoreColor})`,
              borderRadius: 99,
              transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { icon: TrendingUp, label: 'Req Rate',  value: 'High',     color: '#ef4444', bg: '#fee2e2' },
          { icon: Shield,     label: 'IP Divers', value: 'Medium',   color: '#f59e0b', bg: '#fef3c7' },
          { icon: AlertTriangle, label: 'Pattern', value: 'Flood',   color: '#8b5cf6', bg: '#f5f3ff' },
        ].map((m, i) => {
          const Icon = m.icon
          return (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 7, padding: '8px 10px', border: '1px solid #f1f5f9' }}>
              <Icon size={12} color={m.color} style={{ marginBottom: 4 }} />
              <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 1 }}>{m.label}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.value}</p>
            </div>
          )
        })}
      </div>

      {/* Detail rows */}
      <div style={{ background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        {[
          { label: 'Behavior Type', value: 'Bot-like Flood',   valueColor: '#1e293b' },
          { label: 'Flagged',       value: 'ASN bypass + JS challenge skip', valueColor: '#1e293b' },
          { label: 'Action',        value: 'Auto-blocked (AI Mode)', valueColor: '#22c55e' },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '9px 12px',
            borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none',
            gap: 12,
          }}>
            <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0, marginTop: 1 }}>{row.label}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: row.valueColor, textAlign: 'right' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
