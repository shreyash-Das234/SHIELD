import { useState } from 'react'
import { Plus, X, Search, Trash2, Shield, Zap, Globe, Filter, BarChart2, Brain } from 'lucide-react'
import TopBar from '../components/TopBar'

const ruleIcons = { 'Rate Limit': Zap, 'Geo Block': Globe, 'IP Block': Shield, 'Header Filter': Filter, 'SQL Injection': BarChart2, 'AI Auto Defense': Brain }

const initialRules = [
  { id: 1, name: 'Global Rate Limit',   type: 'Rate Limit',    enabled: true,  description: 'Max 50 req/sec per IP',        severity: 'warning',  timeAdded: '10:45 AM Today',  blockedToday: 1842 },
  { id: 2, name: 'Geo Blocking',        type: 'Geo Block',     enabled: false, description: 'Block CN, RU, KP regions',     severity: 'high',     timeAdded: '08:12 AM Today',  blockedToday: 0 },
  { id: 3, name: 'IP Blacklist',        type: 'IP Block',      enabled: true,  description: 'Auto-add flagged IPs',         severity: 'critical', timeAdded: '06:30 AM Today',  blockedToday: 327 },
  { id: 4, name: 'AI Auto Defense',     type: 'AI Auto Defense',enabled: true, description: 'Auto-block score > 80',        severity: 'high',     timeAdded: '07:15 AM Today',  blockedToday: 215 },
  { id: 5, name: 'SQL Injection Filter',type: 'SQL Injection', enabled: true,  description: 'Detect & drop SQLi payloads', severity: 'critical', timeAdded: 'Yesterday',        blockedToday: 56 },
  { id: 6, name: 'XSS Protection',      type: 'Header Filter', enabled: true,  description: 'Block cross-site scripting',  severity: 'high',     timeAdded: 'Yesterday',        blockedToday: 12 },
]

const severityMeta = {
  critical: { bg: '#fee2e2', color: '#dc2626' },
  high:     { bg: '#fff7ed', color: '#ea580c' },
  warning:  { bg: '#fef3c7', color: '#d97706' },
  low:      { bg: '#f0fdf4', color: '#16a34a' },
}

function Toggle({ enabled, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange() }} style={{
      width: 38, height: 21, borderRadius: 999,
      background: enabled ? '#3b82f6' : '#e2e8f0',
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2.5,
        left: enabled ? 19 : 2.5,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

function AddRuleModal({ onClose, onAdd }) {
  const [ruleType, setRuleType] = useState('IP Block')
  const [ruleName, setRuleName] = useState('')
  const [desc, setDesc] = useState('')
  const [action, setAction] = useState('Block')
  const [severity, setSeverity] = useState('high')
  const [conditions, setConditions] = useState([{ key: 'Requests >', val: '1000' }])

  const addCondition = () => setConditions(c => [...c, { key: '', val: '' }])
  const updateCond = (i, field, v) => setConditions(c => c.map((x, idx) => idx === i ? { ...x, [field]: v } : x))

  const handleSave = () => {
    onAdd({
      id: Date.now(),
      name: ruleName || ruleType,
      type: ruleType,
      enabled: true,
      description: desc || conditions.map(c => `${c.key} ${c.val}`).join(', '),
      severity,
      timeAdded: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' Today',
      blockedToday: 0,
    })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 16, width: 520, padding: '26px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease both', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f1623' }}>Add Firewall Rule</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6 }}>
            <X size={16} />
          </button>
        </div>

        {[
          ['Rule Name', <input key="n" value={ruleName} onChange={e => setRuleName(e.target.value)} placeholder="e.g. Block Asia Pacific" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />],
          ['Rule Type', <select key="t" value={ruleType} onChange={e => setRuleType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', background: '#fff' }}>
            {['IP Block','Rate Limit','Geo Block','Header Filter','SQL Injection','AI Auto Defense'].map(t => <option key={t}>{t}</option>)}
          </select>],
          ['Severity',  <div key="s" style={{ display: 'flex', gap: 8 }}>
            {['low','warning','high','critical'].map(s => (
              <button key={s} onClick={() => setSeverity(s)} style={{
                flex: 1, padding: '7px', borderRadius: 7,
                border: `1.5px solid ${severity === s ? severityMeta[s].color : '#e5e7eb'}`,
                background: severity === s ? severityMeta[s].bg : '#fff',
                color: severity === s ? severityMeta[s].color : '#9ca3af',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
              }}>{s}</button>
            ))}
          </div>],
        ].map(([label, field]) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 7 }}>{label}</label>
            {field}
          </div>
        ))}

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: '#374151' }}>Conditions</label>
            <button onClick={addCondition} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
          </div>
          {conditions.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input value={c.key} onChange={e => updateCond(i, 'key', e.target.value)} placeholder="Field" style={{ flex: 1, padding: '8px 11px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 12.5, fontFamily: 'var(--font-mono)', outline: 'none' }} />
              <input value={c.val} onChange={e => updateCond(i, 'val', e.target.value)} placeholder="Value" style={{ flex: 1, padding: '8px 11px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 12.5, fontFamily: 'var(--font-mono)', outline: 'none' }} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 7 }}>Action Taken</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {['Block','Challenge','Rate Limit'].map(a => (
              <button key={a} onClick={() => setAction(a)} style={{
                padding: '12px', borderRadius: 9,
                border: `1.5px solid ${action === a ? '#3b82f6' : '#e5e7eb'}`,
                background: action === a ? '#eff6ff' : '#fff',
                color: action === a ? '#1d4ed8' : '#374151',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f3f4f6', paddingTop: 18 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save Rule</button>
        </div>
      </div>
    </div>
  )
}

export default function FirewallPage() {
  const [rules, setRules] = useState(initialRules)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterEnabled, setFilterEnabled] = useState('all')

  const toggleRule = (id) => setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
  const deleteRule = (id) => setRules(r => r.filter(rule => rule.id !== id))
  const addRule = (rule) => setRules(r => [rule, ...r])

  const filtered = rules.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
    const matchEnabled = filterEnabled === 'all' || (filterEnabled === 'active' && r.enabled) || (filterEnabled === 'inactive' && !r.enabled)
    return matchSearch && matchEnabled
  })

  const activeCount = rules.filter(r => r.enabled).length
  const totalBlocked = rules.filter(r => r.enabled).reduce((s, r) => s + r.blockedToday, 0)

  return (
    <>
      <TopBar title="Firewall & Rules" />

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Rules',     value: rules.length,            color: '#0f1623' },
          { label: 'Active Rules',    value: activeCount,             color: '#22c55e' },
          { label: 'Blocked Today',   value: totalBlocked.toLocaleString(), color: '#ef4444' },
          { label: 'Critical Rules',  value: rules.filter(r=>r.severity==='critical').length, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--border)', padding: '14px 16px', boxShadow: 'var(--shadow-sm)', animation: `fadeInUp 0.4s ease ${i*0.05}s both` }}>
            <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rules..." style={{ width: '100%', padding: '8px 12px 8px 30px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          {[['all','All'],['active','Active'],['inactive','Inactive']].map(([val, lbl]) => (
            <button key={val} onClick={() => setFilterEnabled(val)} style={{
              padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
              background: filterEnabled === val ? '#1e293b' : '#fff',
              color: filterEnabled === val ? '#fff' : '#6b7280',
              borderRight: val !== 'inactive' ? '1px solid #e5e7eb' : 'none',
              transition: 'all 0.15s',
            }}>{lbl}</button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8, border: 'none',
          background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
        }}>
          <Plus size={14} /> Add Rule
        </button>
      </div>

      {/* Rules table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', animation: 'fadeInUp 0.4s ease 0.2s both' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '42px 2fr 1.5fr 80px 100px 130px 80px 44px',
          padding: '10px 18px', background: '#f8fafc', borderBottom: '1px solid var(--border)',
          fontSize: 10.5, fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em',
        }}>
          <span></span><span>RULE NAME</span><span>DESCRIPTION</span><span>SEVERITY</span>
          <span>STATUS</span><span>TIME ADDED</span><span>BLOCKED</span><span></span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: 13 }}>
            No rules match your search.
          </div>
        ) : filtered.map((rule, i) => {
          const Icon = ruleIcons[rule.type] || Shield
          const sm = severityMeta[rule.severity]
          return (
            <div key={rule.id} style={{
              display: 'grid', gridTemplateColumns: '42px 2fr 1.5fr 80px 100px 130px 80px 44px',
              padding: '13px 18px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #f9fafb' : 'none',
              opacity: rule.enabled ? 1 : 0.55,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: rule.enabled ? '#eff6ff' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} color={rule.enabled ? '#3b82f6' : '#9ca3af'} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{rule.name}</p>
                <p style={{ fontSize: 10.5, color: '#9ca3af' }}>{rule.type}</p>
              </div>
              <span style={{ fontSize: 12, color: '#6b7280' }}>{rule.description}</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: sm.bg, color: sm.color, padding: '2px 8px', borderRadius: 99, width: 'fit-content', textTransform: 'capitalize' }}>{rule.severity}</span>
              <Toggle enabled={rule.enabled} onChange={() => toggleRule(rule.id)} />
              <span style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>{rule.timeAdded}</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: rule.blockedToday > 0 ? '#ef4444' : '#9ca3af' }}>
                {rule.blockedToday.toLocaleString()}
              </span>
              <button onClick={() => deleteRule(rule.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: 4, borderRadius: 6, transition: 'color 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
              >
                <Trash2 size={13} />
              </button>
            </div>
          )
        })}
      </div>

      {showModal && <AddRuleModal onClose={() => setShowModal(false)} onAdd={addRule} />}
    </>
  )
}
