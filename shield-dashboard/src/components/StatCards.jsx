import { useState, useEffect, useRef } from 'react'
import { Globe, Shield, Users, Target, TrendingUp, Minus, AlertTriangle } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

// Mini sparkline generator
function generateSparkline(base, variance, points = 10) {
  return Array.from({ length: points }, (_, i) => ({
    v: base + Math.sin(i * 0.8) * variance + (Math.random() - 0.5) * variance * 0.5
  }))
}

function Sparkline({ color, base, variance }) {
  const [data] = useState(() => generateSparkline(base, variance))
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} dot={false} isAnimationActive={true} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function useCounter(target, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = 0
    const steps = 40
    const increment = target / steps
    const interval = duration / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, interval)
    return () => clearInterval(timer)
  }, [target])
  return value
}

function StatCard({ label, rawValue, displayValue, icon: Icon, iconBg, change, sparkColor, sparkBase, sparkVariance, delay, isPercent }) {
  const animated = useCounter(rawValue, 1000)

  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius)',
      padding: '18px 20px',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      animation: `fadeInUp 0.45s ease ${delay}s both`,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} color={change.color} />
        </div>
      </div>

      <div style={{
        fontSize: 26, fontWeight: 800,
        fontFamily: 'var(--font-mono)',
        color: '#0f1623',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        animation: 'countUp 0.5s ease both',
      }}>
        {isPercent ? `${animated}%` : animated.toLocaleString()}
      </div>

      <div style={{ height: 36, margin: '4px -4px 0' }}>
        <Sparkline color={sparkColor} base={sparkBase} variance={sparkVariance} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
        <change.icon size={12} color={change.color} />
        <span style={{ fontSize: 11.5, color: change.color, fontWeight: 600 }}>{change.text}</span>
      </div>
    </div>
  )
}

export default function StatCards() {
  const cards = [
    {
      label: 'Total Requests',
      rawValue: 1425892,
      icon: Globe, iconBg: '#eff6ff',
      change: { text: '+12.5% vs last hour', color: '#22c55e', icon: TrendingUp },
      sparkColor: '#93c5fd', sparkBase: 1000, sparkVariance: 200,
    },
    {
      label: 'Blocked Requests',
      rawValue: 84231,
      icon: Shield, iconBg: '#fef2f2',
      change: { text: '+420.2% — Spike!', color: '#ef4444', icon: TrendingUp },
      sparkColor: '#fca5a5', sparkBase: 800, sparkVariance: 600,
    },
    {
      label: 'Unique IPs',
      rawValue: 18440,
      icon: Users, iconBg: '#f0fdf4',
      change: { text: 'Normal baseline', color: '#6b7280', icon: Minus },
      sparkColor: '#86efac', sparkBase: 500, sparkVariance: 80,
    },
    {
      label: 'Attack Confidence',
      rawValue: 87,
      icon: Target, iconBg: '#fef3c7',
      isPercent: true,
      change: { text: 'High probability — Botnet', color: '#f59e0b', icon: AlertTriangle },
      sparkColor: '#fcd34d', sparkBase: 60, sparkVariance: 20,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 16 }}>
      {cards.map((c, i) => (
        <StatCard key={i} {...c} delay={i * 0.06} />
      ))}
    </div>
  )
}
