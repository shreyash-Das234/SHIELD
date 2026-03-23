import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from 'recharts'

const baseData = [
  { time: '10:40', value: 1200, type: 'normal' },
  { time: '',      value: 1350, type: 'normal' },
  { time: '',      value: 1100, type: 'normal' },
  { time: '',      value: 1280, type: 'normal' },
  { time: '10:41', value: 1500, type: 'normal' },
  { time: '',      value: 1380, type: 'normal' },
  { time: '',      value: 2800, type: 'warning' },
  { time: '',      value: 3600, type: 'warning' },
  { time: '10:42', value: 4200, type: 'warning' },
  { time: '',      value: 7200, type: 'attack' },
  { time: '',      value: 9100, type: 'attack' },
  { time: '',      value: 10200, type: 'attack' },
  { time: '10:43', value: 10400, type: 'attack' },
  { time: '',      value: 9600,  type: 'attack' },
  { time: '',      value: 8700,  type: 'attack' },
  { time: '',      value: 5200,  type: 'warning' },
  { time: '10:44', value: 3400,  type: 'warning' },
  { time: '',      value: 1900,  type: 'normal' },
  { time: '',      value: 1600,  type: 'normal' },
  { time: '',      value: 1450,  type: 'normal' },
  { time: '10:45', value: 1380,  type: 'normal' },
  { time: '',      value: 1300,  type: 'normal' },
  { time: '',      value: 1180,  type: 'normal' },
  { time: '',      value: 1220,  type: 'normal' },
]

const typeColor = { normal: '#93c5fd', warning: '#fbbf24', attack: '#ef4444' }

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#0f1623', color: '#fff', padding: '8px 12px',
      borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {d.time && <div style={{ color: '#64748b', fontSize: 11, marginBottom: 3 }}>{d.time}</div>}
      <div style={{ color: typeColor[d.type] }}>{payload[0].value.toLocaleString()} req/s</div>
      <div style={{ color: '#64748b', fontSize: 11, marginTop: 2, textTransform: 'capitalize' }}>{d.type}</div>
    </div>
  )
}

export default function LiveTrafficChart() {
  const [data, setData] = useState(baseData)
  const [tick, setTick] = useState(0)

  // Simulate live updates — periodically nudge the last few bars
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
      setData(d => d.map((item, i) => {
        if (i >= d.length - 4) {
          const jitter = (Math.random() - 0.5) * 200
          return { ...item, value: Math.max(800, item.value + jitter) }
        }
        return item
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const peak = Math.max(...data.map(d => d.value))
  const attackCount = data.filter(d => d.type === 'attack').length

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
      padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
      animation: 'fadeInUp 0.4s ease 0.24s both',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>Live Traffic</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>(Req/s)</span>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
              animation: 'pulse-dot 1.5s ease-in-out infinite', display: 'inline-block',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[['#93c5fd','Normal'],['#fbbf24','Suspicious'],['#ef4444','Attack']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, background: color, borderRadius: 2, display: 'inline-block' }} />
                <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Last 5 Minutes</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ background: '#fef2f2', borderRadius: 6, padding: '3px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ef4444' }}>{attackCount}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>ATTACK BARS</div>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: 6, padding: '3px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#16a34a' }}>{(peak / 1000).toFixed(1)}k</div>
              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>PEAK</div>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={14} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', fill: '#9ca3af' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v}
            tick={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', fill: '#9ca3af' }}
            axisLine={false} tickLine={false}
            ticks={[0, 2500, 5000, 7500, 10000]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={typeColor[entry.type]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
