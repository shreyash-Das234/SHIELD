import { useState } from 'react'
import { Shield, Brain, Bell, Plug, CheckCircle, AlertCircle, Copy } from 'lucide-react'
import TopBar from '../components/TopBar'

function Toggle({ enabled, onChange, size = 'md' }) {
  const w = size === 'sm' ? 36 : 44
  const h = size === 'sm' ? 20 : 24
  const knob = size === 'sm' ? 14 : 18
  return (
    <div onClick={onChange} style={{
      width: w, height: h, borderRadius: 999,
      background: enabled ? '#22c55e' : '#d1d5db',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: (h - knob) / 2,
        left: enabled ? w - knob - (h - knob) / 2 : (h - knob) / 2,
        width: knob, height: knob, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </div>
  )
}

function SectionCard({ icon: Icon, title, desc, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '22px 24px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: '#f8fafc', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color="#64748b" />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f1623' }}>{title}</p>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{desc}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function SettingRow({ label, desc, children, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      paddingBottom: last ? 0 : 18, marginBottom: last ? 0 : 18,
      borderBottom: last ? 'none' : '1px solid var(--border-light)',
      gap: 20,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{desc}</p>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

const tabs = [
  { id: 'general',     label: 'General',     icon: Shield },
  { id: 'ai',          label: 'AI Settings', icon: Brain },
  { id: 'alerts',      label: 'Alerts',      icon: Bell },
  { id: 'integration', label: 'Integration', icon: Plug },
]

const integrations = [
  { id: 'slack',     name: 'Slack',          desc: 'Send alerts to Slack channels',    status: 'connected', color: '#4a154b', initials: 'SL' },
  { id: 'pagerduty', name: 'PagerDuty',      desc: 'On-call incident escalation',       status: 'disconnected', color: '#06AC38', initials: 'PD' },
  { id: 'splunk',    name: 'Splunk',          desc: 'Forward logs to Splunk SIEM',       status: 'disconnected', color: '#ef4444', initials: 'SP' },
  { id: 'webhook',   name: 'Custom Webhook', desc: 'POST events to your endpoint',      status: 'connected', color: '#7c3aed', initials: 'WH' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('general')
  const [protection, setProtection] = useState(true)
  const [sensitivity, setSensitivity] = useState('Medium')
  const [logsEnabled, setLogsEnabled] = useState(true)
  const [autoBlock, setAutoBlock] = useState(true)
  const [threshold, setThreshold] = useState(72)
  const [modelExplain, setModelExplain] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(false)
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const [integStates, setIntegStates] = useState({ slack: true, pagerduty: false, splunk: false, webhook: true })

  const copyKey = () => {
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  const toggleInteg = (id) => setIntegStates(s => ({ ...s, [id]: !s[id] }))

  return (
    <>
      <TopBar title="Settings" subtitle="Simple controls for protection, alerts, and integrations." />

      {/* Recommended banner */}
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #bfdbfe',
        padding: '14px 20px', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)',
        animation: 'fadeInUp 0.4s ease both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={18} color="#2563eb" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Recommended setup</p>
            <p style={{ fontSize: 12, color: '#6b7280' }}>Medium sensitivity with auto-block keeps false alarms low while staying protected.</p>
          </div>
        </div>
        <button style={{
          padding: '7px 16px', borderRadius: 8, border: '1.5px solid #bfdbfe',
          background: '#fff', color: '#1d4ed8', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>Review defaults</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 14, animation: 'fadeInUp 0.4s ease 0.08s both' }}>
        {/* Tab list */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '8px', height: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: 'none',
              background: tab === id ? '#eff6ff' : 'transparent',
              color: tab === id ? '#1d4ed8' : '#6b7280',
              fontSize: 13, fontWeight: tab === id ? 700 : 500,
              cursor: 'pointer', textAlign: 'left', marginBottom: 2,
              transition: 'all 0.15s',
              borderLeft: tab === id ? '2px solid #3b82f6' : '2px solid transparent',
            }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div key={tab} style={{ animation: 'fadeInUp 0.2s ease both' }}>
          {tab === 'general' && (
            <>
              <SectionCard icon={Shield} title="General Settings" desc="Core protection controls designed for non-technical users.">
                <SettingRow label="Enable Protection" desc="Turn on live defense for suspicious traffic and automated protection rules.">
                  <Toggle enabled={protection} onChange={() => setProtection(v => !v)} />
                </SettingRow>
                <SettingRow label="Sensitivity Level" desc="Choose how aggressively the system should react to unusual behavior.">
                  <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                    {['Low','Medium','High'].map(l => (
                      <button key={l} onClick={() => setSensitivity(l)} style={{
                        padding: '6px 16px', border: 'none',
                        background: sensitivity === l ? '#1e293b' : '#fff',
                        color: sensitivity === l ? '#fff' : '#6b7280',
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                        borderRight: l !== 'High' ? '1px solid #e5e7eb' : 'none',
                        transition: 'all 0.15s',
                      }}>{l}</button>
                    ))}
                  </div>
                </SettingRow>
                <SettingRow label="Detailed Logging" desc="Keep a full record of all requests, including allowed traffic." last>
                  <Toggle enabled={logsEnabled} onChange={() => setLogsEnabled(v => !v)} />
                </SettingRow>
              </SectionCard>

              <SectionCard icon={Brain} title="Quick AI Controls" desc="Fast access to the most important AI settings.">
                <SettingRow label="Auto-block on Anomaly" desc="Block traffic immediately when the anomaly score crosses the threshold." last>
                  <Toggle enabled={autoBlock} onChange={() => setAutoBlock(v => !v)} />
                </SettingRow>
              </SectionCard>
            </>
          )}

          {tab === 'ai' && (
            <>
              <SectionCard icon={Brain} title="AI Settings" desc="Tune how the detection model scores anomalies and takes action.">
                <SettingRow label="Detection Threshold" desc="Higher values reduce false alarms. Lower values catch more edge cases.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="range" min={0} max={100} value={threshold}
                      onChange={e => setThreshold(Number(e.target.value))}
                      style={{ width: 160, accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#1e293b', minWidth: 48, textAlign: 'right' }}>
                      {threshold} / 100
                    </span>
                  </div>
                </SettingRow>
                <SettingRow label="Auto-block" desc="Immediately block traffic when the anomaly score crosses the threshold.">
                  <Toggle enabled={autoBlock} onChange={() => setAutoBlock(v => !v)} />
                </SettingRow>
                <SettingRow label="Explainable AI Mode" desc="Include human-readable reasoning in detection logs and reports." last>
                  <Toggle enabled={modelExplain} onChange={() => setModelExplain(v => !v)} />
                </SettingRow>
              </SectionCard>

              {/* Threshold indicator */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f1623', marginBottom: 12 }}>Current Configuration Preview</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Threshold', value: `${threshold}`, unit: '/ 100', color: threshold > 80 ? '#ef4444' : threshold > 60 ? '#f59e0b' : '#22c55e' },
                    { label: 'Auto-block', value: autoBlock ? 'ON' : 'OFF', color: autoBlock ? '#22c55e' : '#9ca3af' },
                    { label: 'Sensitivity', value: sensitivity, color: sensitivity === 'High' ? '#ef4444' : sensitivity === 'Medium' ? '#f59e0b' : '#22c55e' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 9, padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                      <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: item.color }}>
                        {item.value}
                        {item.unit && <span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>{item.unit}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'alerts' && (
            <>
              <SectionCard icon={Bell} title="Alert Settings" desc="Configure how and where security alerts are delivered.">
                <SettingRow label="Email Alerts" desc="Send critical attack notifications to admin@shield.io">
                  <Toggle enabled={emailAlerts} onChange={() => setEmailAlerts(v => !v)} />
                </SettingRow>
                <SettingRow label="Slack Notifications" desc="Post real-time alerts to your #security-alerts channel.">
                  <Toggle enabled={slackAlerts} onChange={() => setSlackAlerts(v => !v)} />
                </SettingRow>
                <SettingRow label="Critical Events Only" desc="Suppress warnings — only send alerts for critical attacks." last>
                  <Toggle enabled={criticalOnly} onChange={() => setCriticalOnly(v => !v)} />
                </SettingRow>
              </SectionCard>

              <SectionCard icon={Bell} title="Alert Thresholds" desc="Choose which event types trigger a notification.">
                {[
                  { label: 'DDoS / HTTP Flood',  default: true  },
                  { label: 'SQL Injection',        default: true  },
                  { label: 'Brute Force Login',   default: true  },
                  { label: 'Geo-blocked Access',  default: false },
                  { label: 'High Traffic Spike',  default: true  },
                  { label: 'Suspicious Headers',  default: false },
                ].map((item, i, arr) => {
                  const [on, setOn] = useState(item.default)
                  return (
                    <SettingRow key={item.label} label={item.label} desc="" last={i === arr.length - 1}>
                      <Toggle enabled={on} onChange={() => setOn(v => !v)} size="sm" />
                    </SettingRow>
                  )
                })}
              </SectionCard>
            </>
          )}

          {tab === 'integration' && (
            <>
              {/* API Key */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 4 }}>API Key</p>
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>Use this key to authenticate SHIELD with external services.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{
                    flex: 1, background: '#f8fafc', borderRadius: 8, border: '1.5px solid #e5e7eb',
                    padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 12.5,
                    color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    shd_live_xK9mP2qR7nT4wB6vL1cH3jF8yD5uA0eN
                  </div>
                  <button onClick={copyKey} style={{
                    padding: '9px 16px', borderRadius: 8, border: '1.5px solid var(--border)',
                    background: apiKeyCopied ? '#dcfce7' : '#fff',
                    color: apiKeyCopied ? '#16a34a' : '#374151',
                    fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}>
                    {apiKeyCopied ? <CheckCircle size={13} /> : <Copy size={13} />}
                    {apiKeyCopied ? 'Copied!' : 'Copy Key'}
                  </button>
                </div>
              </div>

              {/* Integrations */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 4 }}>Connected Services</p>
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 18 }}>Connect SHIELD with your existing security and alerting stack.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {integrations.map((integ, i) => {
                    const connected = integStates[integ.id]
                    return (
                      <div key={integ.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 0',
                        borderBottom: i < integrations.length - 1 ? '1px solid var(--border-light)' : 'none',
                      }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 9,
                          background: integ.color, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-mono)', flexShrink: 0,
                        }}>{integ.initials}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{integ.name}</p>
                          <p style={{ fontSize: 12, color: '#9ca3af' }}>{integ.desc}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700,
                            color: connected ? '#16a34a' : '#9ca3af',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            {connected
                              ? <><CheckCircle size={12} /> Connected</>
                              : <><AlertCircle size={12} /> Not connected</>
                            }
                          </span>
                          <button onClick={() => toggleInteg(integ.id)} style={{
                            padding: '6px 14px', borderRadius: 7,
                            border: `1.5px solid ${connected ? '#fecaca' : '#bfdbfe'}`,
                            background: connected ? '#fef2f2' : '#eff6ff',
                            color: connected ? '#dc2626' : '#1d4ed8',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}>
                            {connected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Webhook config */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px', marginTop: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f1623', marginBottom: 4 }}>Webhook Configuration</p>
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>Events will be POSTed to this URL as JSON payloads.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    defaultValue="https://hooks.example.com/shield/events"
                    style={{
                      flex: 1, padding: '9px 14px', borderRadius: 8,
                      border: '1.5px solid #e5e7eb', fontSize: 13,
                      fontFamily: 'var(--font-mono)', color: '#374151',
                    }}
                  />
                  <button style={{
                    padding: '9px 16px', borderRadius: 8, border: 'none',
                    background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>Save</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
