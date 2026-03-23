import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Clock, Wifi, Activity } from 'lucide-react'
import TopBar from '../components/TopBar'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
  CartesianGrid, LineChart, Line, AreaChart, Area
} from 'recharts'

const statCards = [
  { label: 'TOTAL REQUESTS',      value: '2.45M', sub: '+12% vs last hour',  subColor: '#22c55e', Icon: TrendingUp  },
  { label: 'REQUESTS/SEC (RPS)',  value: '850',   sub: 'Steady normal rate', subColor: '#22c55e', Icon: Activity    },
  { label: 'PEAK TRAFFIC',        value: '14.2k', sub: 'Spike 15 mins ago',  subColor: '#9ca3af', Icon: Minus       },
  { label: 'AVG RESPONSE TIME',   value: '42ms',  sub: '-3ms improved',      subColor: '#22c55e', Icon: TrendingDown },
]

function generateBarData(range) {
  const configs = {
    '5min': { n: 20, labels: ['10:40','','','','10:41','','','','10:42','','','','10:43','','','','10:44','','','10:45'] },
    '1h':   { n: 24, labels: Array.from({length:24}, (_,i) => i % 4 === 0 ? `${10 + Math.floor(i/4)}:${String((i%4)*15).padStart(2,'0')}` : '') },
    '24h':  { n: 24, labels: Array.from({length:24}, (_,i) => i % 3 === 0 ? `${i}:00` : '') },
  }
  const { n, labels } = configs[range]
  const attackZone = range === '5min' ? [9,14] : range === '1h' ? [11,16] : [9,13]
  return labels.map((time, i) => {
    const isAtk = i >= attackZone[0] && i <= attackZone[1]
    const isWrn = i === attackZone[0] - 1 || i === attackZone[1] + 1
    const base = range === '24h' ? 800 : 1800
    return {
      time,
      normal: base + Math.random() * 600,
      suspicious: isWrn ? 1500 + Math.random() * 2000 : 0,
      attack: isAtk ? 7000 + Math.random() * 8000 : 0,
    }
  })
}

const rpsData = Array.from({ length: 30 }, (_, i) => ({
  t: i,
  v: 700 + Math.sin(i * 0.4) * 200 + (Math.random() - 0.5) * 100
}))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f1623', color: '#fff', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {label && <div style={{ color: '#64748b', fontSize: 11, marginBottom: 3 }}>{label}</div>}
      {payload.map(p => p.value > 0 && (
        <div key={p.name} style={{ color: p.color || p.fill, marginBottom: 1 }}>
          {p.name}: {Math.round(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  )
}

const sources = [
  { country: 'United States', flag: '🇺🇸', pct: 38, safe: true },
  { country: 'China',         flag: '🇨🇳', pct: 21, safe: false },
  { country: 'Germany',       flag: '🇩🇪', pct: 14, safe: true },
  { country: 'Russia',        flag: '🇷🇺', pct: 11, safe: false },
  { country: 'United Kingdom',flag: '🇬🇧', pct: 8,  safe: true },
  { country: 'Brazil',        flag: '🇧🇷', pct: 5,  safe: true },
  { country: 'Other',         flag: '🌐',  pct: 3,  safe: true },
]

const protocols = [
  { proto: 'HTTPS',     pct: 72, count: '1.76M', color: '#3b82f6' },
  { proto: 'HTTP',      pct: 18, count: '441k',  color: '#f59e0b' },
  { proto: 'WebSocket', pct: 7,  count: '171k',  color: '#8b5cf6' },
  { proto: 'Other',     pct: 3,  count: '73k',   color: '#9ca3af' },
]

export default function TrafficMonitoringPage() {
  const [timeRange, setTimeRange] = useState('1h')
  const [barData, setBarData] = useState(() => generateBarData('1h'))
  const [liveRps, setLiveRps] = useState(850)

  useEffect(() => {
    setBarData(generateBarData(timeRange))
  }, [timeRange])

  useEffect(() => {
    const t = setInterval(() => setLiveRps(v => Math.round(v + (Math.random() - 0.5) * 60)), 1500)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <TopBar title="Traffic Monitoring" />

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 16 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 'var(--radius)', padding: '18px 20px',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
            animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.07em', marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f1623', letterSpacing: '-0.02em', marginBottom: 6 }}>
              {s.label === 'REQUESTS/SEC (RPS)' ? liveRps : s.value}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <s.Icon size={12} color={s.subColor} />
              <span style={{ fontSize: 11.5, color: s.subColor, fontWeight: 500 }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Patterns */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
        padding: '20px 22px', marginBottom: 14, boxShadow: 'var(--shadow-sm)',
        animation: 'fadeInUp 0.4s ease 0.28s both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 8 }}>Traffic Patterns</h2>
            <div style={{ display: 'flex', gap: 14 }}>
              {[['#93c5fd','Normal'],['#fbbf24','Suspicious'],['#ef4444','Attack']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 2, display: 'inline-block' }} />
                  <span style={{ fontSize: 11.5, color: '#6b7280' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            {[['5min','Last 5 min'],['1h','1 hour'],['24h','24 hours']].map(([val, lbl]) => (
              <button key={val} onClick={() => setTimeRange(val)} style={{
                padding: '6px 14px', border: 'none',
                background: timeRange === val ? '#1e293b' : '#fff',
                color: timeRange === val ? '#fff' : '#6b7280',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                borderRight: val !== '24h' ? '1px solid #e5e7eb' : 'none',
                transition: 'all 0.15s',
              }}>{lbl}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} barSize={18} margin={{ top: 4, right: 0, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => v >= 1000 ? `${Math.round(v/1000)}k` : v} tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="normal"     stackId="a" fill="#93c5fd" name="Normal"     radius={[0,0,0,0]} />
            <Bar dataKey="suspicious" stackId="a" fill="#fbbf24" name="Suspicious" radius={[0,0,0,0]} />
            <Bar dataKey="attack"     stackId="a" fill="#ef4444" name="Attack"     radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 14 }}>
        {/* Top Sources */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', animation: 'fadeInUp 0.4s ease 0.36s both' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 14 }}>Top Traffic Sources</h3>
          {sources.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{s.flag}</span>
                  <span style={{ fontSize: 12.5, color: '#374151' }}>{s.country}</span>
                  {!s.safe && <span style={{ fontSize: 9.5, fontWeight: 700, background: '#fee2e2', color: '#ef4444', padding: '1px 5px', borderRadius: 99 }}>RISK</span>}
                </div>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#6b7280', fontWeight: 600 }}>{s.pct}%</span>
              </div>
              <div style={{ height: 5, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${s.pct}%`, height: '100%', background: s.safe ? '#3b82f6' : '#ef4444', borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Protocol Breakdown */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', animation: 'fadeInUp 0.4s ease 0.42s both' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 14 }}>Protocol Breakdown</h3>
          {protocols.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: i < protocols.length - 1 ? '1px solid #f9fafb' : 'none',
            }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', width: 90 }}>{p.proto}</span>
              <div style={{ flex: 1, height: 5, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: '#6b7280', width: 44, textAlign: 'right' }}>{p.count}</span>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: '12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>HTTPS Adoption</p>
            <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#3b82f6' }}>72%</p>
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>↑ 4% vs last week</p>
          </div>
        </div>

        {/* Live RPS sparkline */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', animation: 'fadeInUp 0.4s ease 0.48s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <Wifi size={13} color="#3b82f6" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>Live RPS</h3>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse-dot 1.5s infinite', display: 'inline-block' }} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f1623', letterSpacing: '-0.04em', marginBottom: 4 }}>
            {liveRps}
          </div>
          <p style={{ fontSize: 11.5, color: '#9ca3af', marginBottom: 12 }}>requests per second</p>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={rpsData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="rpsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#rpsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {[
              { label: 'Peak today', value: '14.2k' },
              { label: 'Avg today',  value: '723' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 7, padding: '8px 10px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>{m.label}</p>
                <p style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f1623' }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
