import { useState, useMemo } from 'react'
import { Search, Download, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import TopBar from '../components/TopBar'

const allLogs = [
  { id:1,  time:'10:45:22 AM', ip:'192.168.1.105', event:'HTTP Flood',         action:'Auto-Blocked',     status:'blocked' },
  { id:2,  time:'10:42:15 AM', ip:'45.33.22.11',   event:'SQL Injection',      action:'Dropped Payload',  status:'blocked' },
  { id:3,  time:'10:38:05 AM', ip:'114.12.33.90',  event:'Login Brute Force',  action:'Rate Limited',     status:'warning' },
  { id:4,  time:'10:35:50 AM', ip:'8.8.4.4',       event:'Geo Blocked (CN)',   action:'Auto-Blocked',     status:'blocked' },
  { id:5,  time:'10:32:10 AM', ip:'192.168.1.55',  event:'Normal Traffic',     action:'Allowed',          status:'safe'    },
  { id:6,  time:'10:29:45 AM', ip:'103.45.22.19',  event:'Suspicious Headers', action:'Challenged (CAPTCHA)', status:'warning' },
  { id:7,  time:'10:20:12 AM', ip:'172.16.0.4',    event:'Normal Traffic',     action:'Allowed',          status:'safe'    },
  { id:8,  time:'10:15:02 AM', ip:'203.0.113.88',  event:'Bot User Agent',     action:'Auto-Blocked',     status:'blocked' },
  { id:9,  time:'10:11:34 AM', ip:'198.51.100.5',  event:'XSS Attempt',        action:'Dropped Payload',  status:'blocked' },
  { id:10, time:'10:08:19 AM', ip:'10.0.0.42',     event:'Normal Traffic',     action:'Allowed',          status:'safe'    },
  { id:11, time:'10:04:55 AM', ip:'91.108.4.1',    event:'DDoS Fragment',      action:'Auto-Blocked',     status:'blocked' },
  { id:12, time:'10:01:33 AM', ip:'185.220.101.5', event:'Tor Exit Node',      action:'Geo-Blocked',      status:'blocked' },
  { id:13, time:'09:58:10 AM', ip:'192.168.0.100', event:'API Abuse',          action:'Rate Limited',     status:'warning' },
  { id:14, time:'09:55:01 AM', ip:'34.120.80.11',  event:'Normal Traffic',     action:'Allowed',          status:'safe'    },
  { id:15, time:'09:51:44 AM', ip:'66.249.66.1',   event:'Crawler Detected',   action:'CAPTCHA',          status:'warning' },
]

const timeline = [
  { time:'10:45 AM', title:'Attack Detected',    desc:'HTTP Flood originating from multiple IPs detected by AI module.',        color:'#ef4444' },
  { time:'10:45 AM', title:'IP Blocked',          desc:'Auto-blocked 192.168.1.105 based on AI Auto Defense rules.',             color:'#ef4444' },
  { time:'10:46 AM', title:'System Stabilized',  desc:'Traffic normalized. Response times back to optimal levels.',             color:'#22c55e' },
  { time:'10:38 AM', title:'Rate Limit Triggered',desc:'114.12.33.90 exceeded 100 req/min. Throttling applied.',                color:'#f59e0b' },
  { time:'10:00 AM', title:'Rules Updated',       desc:'Global Rate Limit adjusted by admin user.',                             color:'#9ca3af' },
]

const statusStyle = {
  blocked: { bg:'#fee2e2', color:'#dc2626',  label:'Blocked' },
  warning: { bg:'#fef3c7', color:'#d97706',  label:'Warning' },
  safe:    { bg:'#dcfce7', color:'#16a34a',  label:'Safe'    },
}

const PAGE_SIZE = 8

export default function LogsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('24h')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => allLogs.filter(l => {
    const ms = l.ip.includes(search) || l.event.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase())
    const mf = statusFilter === 'all' || l.status === statusFilter
    return ms && mf
  }), [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (v) => { setSearch(v); setPage(1) }
  const handleFilter = (v) => { setStatusFilter(v); setPage(1) }

  const exportCSV = () => {
    const header = 'Timestamp,IP Address,Event Type,Action Taken,Status'
    const rows = filtered.map(l => `${l.time},${l.ip},${l.event},${l.action},${l.status}`)
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'shield-logs.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const counts = { all: allLogs.length, blocked: allLogs.filter(l=>l.status==='blocked').length, warning: allLogs.filter(l=>l.status==='warning').length, safe: allLogs.filter(l=>l.status==='safe').length }

  return (
    <>
      <TopBar title="Logs & Activity" />

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
        {[
          { label: 'Total Events',   value: counts.all,     color: '#0f1623' },
          { label: 'Blocked',        value: counts.blocked, color: '#ef4444' },
          { label: 'Warnings',       value: counts.warning, color: '#f59e0b' },
          { label: 'Safe',           value: counts.safe,    color: '#22c55e' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--border)', padding: '12px 16px', boxShadow: 'var(--shadow-sm)', animation: `fadeInUp 0.3s ease ${i*0.05}s both` }}>
            <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search IP or event..." style={{ width: '100%', padding: '8px 12px 8px 30px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
          {search && <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}><X size={12} /></button>}
        </div>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','All'],['blocked','Blocked'],['warning','Warning'],['safe','Safe']].map(([val, lbl]) => (
            <button key={val} onClick={() => handleFilter(val)} style={{
              padding: '6px 12px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: statusFilter === val ? '#1e293b' : '#fff',
              color: statusFilter === val ? '#fff' : '#6b7280',
              border: '1.5px solid', borderColor: statusFilter === val ? '#1e293b' : '#e5e7eb',
              transition: 'all 0.15s',
            }}>
              {lbl} {val !== 'all' && <span style={{ opacity: 0.7 }}>({counts[val]})</span>}
            </button>
          ))}
        </div>

        {/* Time filter */}
        <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          {[['1h','1h'],['24h','24h'],['7d','7d']].map(([val, lbl]) => (
            <button key={val} onClick={() => setTimeFilter(val)} style={{
              padding: '6px 12px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: timeFilter === val ? '#1e293b' : '#fff',
              color: timeFilter === val ? '#fff' : '#6b7280',
              borderRight: val !== '7d' ? '1px solid #e5e7eb' : 'none',
            }}>{lbl}</button>
          ))}
        </div>

        <button onClick={exportCSV} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border)',
          background: '#fff', color: '#374151', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>
          <Download size={13} /> Export CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 288px', gap: 14, alignItems: 'start' }}>
        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', animation: 'fadeInUp 0.4s ease both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>Security Event Logs</h2>
            <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{filtered.length} events</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '130px 130px 1fr 180px 80px',
            padding: '9px 18px', background: '#f8fafc', borderBottom: '1px solid var(--border)',
            fontSize: 10.5, fontWeight: 800, color: '#9ca3af', letterSpacing: '0.07em',
          }}>
            <span>TIMESTAMP</span><span>IP ADDRESS</span><span>EVENT TYPE</span><span>ACTION TAKEN</span><span>STATUS</span>
          </div>

          {paged.map((log, i) => {
            const st = statusStyle[log.status]
            const isSelected = selected === log.id
            return (
              <div key={log.id} onClick={() => setSelected(isSelected ? null : log.id)} style={{
                display: 'grid', gridTemplateColumns: '130px 130px 1fr 180px 80px',
                padding: '11px 18px', alignItems: 'center',
                borderBottom: i < paged.length - 1 ? '1px solid #f9fafb' : 'none',
                background: isSelected ? '#f0f9ff' : 'transparent',
                cursor: 'pointer', transition: 'background 0.1s',
              }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#fafafa' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 11.5, color: '#6b7280', fontFamily: 'var(--font-mono)' }}>{log.time}</span>
                <span style={{ display: 'inline-block', background: '#f1f5f9', padding: '2px 8px', borderRadius: 5, fontSize: 11.5, fontFamily: 'var(--font-mono)', color: '#374151', fontWeight: 600, width: 'fit-content' }}>{log.ip}</span>
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{log.event}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{log.action}</span>
                <span style={{ display: 'inline-block', background: st.bg, color: st.color, padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, width: 'fit-content' }}>{st.label}</span>
              </div>
            )
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderTop: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Page {page} of {totalPages}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #e5e7eb', background: page === 1 ? '#f9fafb' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid', borderColor: page === p ? '#3b82f6' : '#e5e7eb', background: page === p ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: page === p ? '#2563eb' : '#374151' }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #e5e7eb', background: page === totalPages ? '#f9fafb' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '18px 18px', boxShadow: 'var(--shadow-sm)', animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 18 }}>Activity Timeline</h2>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 10, top: 12, bottom: 12, width: 1, background: '#e5e7eb' }} />
            {timeline.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 18, position: 'relative' }}>
                <div style={{
                  width: 21, height: 21, borderRadius: '50%',
                  border: `2px solid ${item.color}`,
                  background: item.color + '18',
                  flexShrink: 0, zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10.5, color: '#9ca3af', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{item.time}</p>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b', marginBottom: 3 }}>{item.title}</p>
                  <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
