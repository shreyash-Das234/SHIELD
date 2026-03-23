import { useState, useEffect } from 'react'
import { CheckSquare, RefreshCw, Clock } from 'lucide-react'
import TopBar from '../components/TopBar'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, CartesianGrid } from 'recharts'

const timelineData = [
  { t: '10:30', score: 12 }, { t: '10:31', score: 18 }, { t: '10:32', score: 15 },
  { t: '10:33', score: 22 }, { t: '10:34', score: 19 }, { t: '10:35', score: 25 },
  { t: '10:36', score: 21 }, { t: '10:37', score: 30 }, { t: '10:38', score: 28 },
  { t: '10:39', score: 35 }, { t: '10:40', score: 42 }, { t: '10:41', score: 58 },
  { t: '10:42', score: 71 }, { t: '10:43', score: 87 }, { t: '10:44', score: 91 },
  { t: '10:45', score: 87 },
]

const suspiciousIPs = [
  { ip: '192.168.1.105', country: '🇨🇳 CN', reqRate: '4.2k/s', score: 91, action: 'Blocked' },
  { ip: '45.33.22.11',   country: '🇷🇺 RU', reqRate: '1.8k/s', score: 74, action: 'Rate Limited' },
  { ip: '114.12.33.90',  country: '🇰🇵 KP', reqRate: '980/s',  score: 68, action: 'CAPTCHA' },
  { ip: '203.0.113.88',  country: '🇨🇳 CN', reqRate: '760/s',  score: 62, action: 'Monitoring' },
]

const scoreColor = (s) => s >= 80 ? '#ef4444' : s >= 60 ? '#f59e0b' : '#22c55e'

function ScoreRing({ score, size = 96 }) {
  const [animScore, setAnimScore] = useState(0)
  const r = (size / 2) - 10
  const circ = 2 * Math.PI * r
  const filled = (animScore / 100) * circ
  const color = scoreColor(animScore)

  useEffect(() => {
    let frame
    let cur = 0
    const step = () => {
      cur = Math.min(cur + 1.5, score)
      setAnimScore(Math.floor(cur))
      if (cur < score) frame = requestAnimationFrame(step)
    }
    const t = setTimeout(() => { frame = requestAnimationFrame(step) }, 300)
    return () => { clearTimeout(t); cancelAnimationFrame(frame) }
  }, [score])

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={9} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={9}
          strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.04s linear, stroke 0.3s' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-mono)', color, lineHeight: 1 }}>{animScore}</span>
        <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>/ 100</span>
      </div>
    </div>
  )
}

const TooltipComp = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f1623', color: '#fff', padding: '7px 11px', borderRadius: 7, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
      <div style={{ color: '#64748b', fontSize: 11 }}>{label}</div>
      <div style={{ color: '#f87171' }}>Score: {payload[0]?.value}</div>
    </div>
  )
}

export default function AIDetectionPage() {
  const [features, setFeatures] = useState([
    { label: 'Request Rate',   level: 'High',   color: '#ef4444', pct: 87 },
    { label: 'IP Diversity',   level: 'Medium', color: '#f59e0b', pct: 62 },
    { label: 'Header Anomaly', level: 'High',   color: '#ef4444', pct: 79 },
    { label: 'Geo Clustering', level: 'Low',    color: '#22c55e', pct: 28 },
    { label: 'UA Pattern',     level: 'Medium', color: '#f59e0b', pct: 55 },
  ])
  const [animated, setAnimated] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(t)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  return (
    <>
      <TopBar title="AI Detection Details" />

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 14, marginBottom: 14 }}>
        {/* Score card */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '24px 22px', animation: 'fadeInUp 0.4s ease both', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>AI Anomaly Score</h2>
            <button onClick={handleRefresh} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
              <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
            <ScoreRing score={87} size={110} />
            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#fef2f2', color: '#ef4444',
                padding: '5px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 700,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse-dot 1.2s infinite' }} />
                Critical
              </span>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10, lineHeight: 1.5 }}>High probability of automated attack.</p>
            </div>
          </div>

          {/* Last updated */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', color: '#9ca3af' }}>
            <Clock size={11} />
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>Updated 10:45:32</span>
          </div>
        </div>

        {/* Detection Breakdown + Actions */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '24px 22px', animation: 'fadeInUp 0.4s ease 0.08s both', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 14 }}>Detection Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Behavior Type', value: 'Bot Flood',               icon: '🤖', bg: '#fef2f2',  val: '#ef4444' },
              { label: 'Confidence',    value: '87%',                      icon: '📊', bg: '#fff7ed',  val: '#ea580c' },
              { label: 'Pattern',       value: 'High freq. requests',       icon: '📈', bg: '#eff6ff',  val: '#2563eb' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: 10, padding: '14px 14px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                <p style={{ fontSize: 13.5, fontWeight: 800, color: item.val }}>{item.value}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f1623', marginBottom: 10 }}>Automated Actions Taken</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Auto-blocked',       color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
              { label: 'Rate limited',        color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { label: 'CAPTCHA triggered',   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
            ].map((a, i) => (
              <div key={i} style={{ border: `1.5px solid ${a.border}`, borderRadius: 9, padding: '12px 10px', textAlign: 'center', background: a.bg }}>
                <CheckSquare size={15} color={a.color} style={{ marginBottom: 5 }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.label}</p>
              </div>
            ))}
          </div>

          {/* Suspicious IPs mini table */}
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f1623', marginBottom: 8 }}>Top Flagged IPs</h3>
          <div style={{ background: '#f8fafc', borderRadius: 9, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
            {suspiciousIPs.map((ip, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '130px 60px 70px 60px 90px',
                padding: '8px 12px', alignItems: 'center',
                borderBottom: i < suspiciousIPs.length - 1 ? '1px solid #f1f5f9' : 'none',
                fontSize: 11.5,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#374151', fontWeight: 600 }}>{ip.ip}</span>
                <span style={{ color: '#6b7280' }}>{ip.country}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#6b7280' }}>{ip.reqRate}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: scoreColor(ip.score), fontWeight: 700 }}>{ip.score}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, background: ip.action === 'Blocked' ? '#fee2e2' : ip.action === 'Rate Limited' ? '#fef3c7' : '#eff6ff', color: ip.action === 'Blocked' ? '#dc2626' : ip.action === 'Rate Limited' ? '#d97706' : '#2563eb', padding: '2px 7px', borderRadius: 99 }}>
                  {ip.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 14 }}>
        {/* Feature contribution */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '22px', animation: 'fadeInUp 0.4s ease 0.16s both', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 4 }}>Feature Contribution</h2>
          <p style={{ fontSize: 11.5, color: '#9ca3af', marginBottom: 18 }}>Key metrics influencing the Anomaly Score</p>
          {features.map((f, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: '#374151' }}>{f.label}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: f.color }}>{f.level}</span>
              </div>
              <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: animated ? `${f.pct}%` : '0%', height: '100%',
                  background: f.color, borderRadius: 999,
                  transition: `width ${0.8 + i * 0.1}s cubic-bezier(0.4,0,0.2,1)`,
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '22px', animation: 'fadeInUp 0.4s ease 0.22s both', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>Anomaly Score Timeline</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ background: '#fef2f2', borderRadius: 7, padding: '4px 12px' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Peak</span>
                <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ef4444', marginLeft: 6 }}>91</span>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: 7, padding: '4px 12px' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Now</span>
                <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ef4444', marginLeft: 6 }}>87</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={timelineData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]} tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipComp />} />
              <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Threshold', fill: '#f59e0b', fontSize: 10, position: 'insideBottomRight' }} />
              <ReferenceLine x="10:43" stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'Attack', fill: '#ef4444', fontSize: 10, fontWeight: 700, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2.5} fill="url(#scoreGrad2)" dot={false} activeDot={{ r: 4, fill: '#ef4444' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
