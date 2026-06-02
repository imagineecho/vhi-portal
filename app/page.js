'use client'
import { useState, useEffect, useRef } from 'react'

const styles = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#f0f2f5;}
  .portal{display:grid;grid-template-columns:180px 1fr;min-height:100vh;font-size:13px;}
  .sidebar{background:#fff;border-right:0.5px solid #e0e0e0;padding:16px 0;display:flex;flex-direction:column;gap:2px;position:fixed;top:0;left:0;height:100vh;width:180px;z-index:10;}
  .sidebar-logo{padding:0 16px 16px;border-bottom:0.5px solid #e0e0e0;margin-bottom:8px;}
  .logo-box{border:2px solid #3B8BD4;border-radius:6px;padding:6px 10px;display:flex;align-items:center;gap:6px;}
  .logo-box span{font-size:11px;font-weight:600;color:#3B8BD4;letter-spacing:0.5px;}
  .logo-sub{font-size:10px;color:#888;margin-top:4px;text-align:center;}
  .nav-item{display:flex;align-items:center;gap:8px;padding:8px 16px;color:#666;cursor:pointer;font-size:12px;transition:background 0.15s;}
  .nav-item:hover{background:#f5f7fa;color:#333;}
  .nav-item.active{background:#E6F1FB;color:#185FA5;font-weight:500;}
  .nav-item i{font-size:15px;}
  .main{margin-left:180px;display:flex;flex-direction:column;}
  .topbar{background:#fff;border-bottom:0.5px solid #e0e0e0;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:9;}
  .topbar-patient{font-size:13px;color:#666;}
  .topbar-patient strong{color:#222;}
  .village-logo{font-size:15px;font-weight:500;color:#222;}
  .content{padding:16px 20px;display:grid;grid-template-columns:1fr 280px;gap:14px;}
  .left-col{display:flex;flex-direction:column;gap:14px;}
  .card{background:#fff;border-radius:10px;border:0.5px solid #e0e0e0;padding:14px;}
  .section-title{font-size:12px;font-weight:500;margin-bottom:10px;color:#222;}
  .patient-name-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
  .score-row{display:flex;align-items:center;gap:14px;}
  .patient-info h2{font-size:22px;font-weight:500;line-height:1.2;}
  .score-ring{position:relative;display:flex;flex-direction:column;align-items:center;}
  .score-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
  .score-center .num{font-size:20px;font-weight:500;color:#222;}
  .score-center .lbl{font-size:9px;color:#888;line-height:1.3;}
  .score-arrow{font-size:20px;color:#E24B4A;}
  .vhi-badge{display:flex;flex-direction:column;align-items:center;}
  .vhi-badge .vhi-label{font-size:10px;color:#888;}
  .vhi-badge .vhi-num{font-size:28px;font-weight:500;color:#E24B4A;}
  .vhi-badge .vhi-tag{font-size:10px;color:#888;}
  .diag-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .diag-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;border:0.5px solid #e0e0e0;background:#f8f9fa;}
  .diag-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .diag-icon.green{background:#1D9E75;color:#fff;}
  .diag-icon.dark{background:#3d3d3a;color:#fff;}
  .diag-icon.red{background:#E24B4A;color:#fff;}
  .diag-icon.gray{background:#888;color:#fff;}
  .diag-text strong{font-size:11px;font-weight:500;display:block;}
  .diag-text span{font-size:11px;color:#666;}
  .diag-text .severe{color:#E24B4A;font-weight:500;}
  .meds-table{width:100%;border-collapse:collapse;}
  .meds-table th{font-size:11px;color:#888;font-weight:400;padding:4px 8px;text-align:left;border-bottom:0.5px solid #e0e0e0;}
  .meds-table td{font-size:12px;padding:6px 8px;border-bottom:0.5px solid #e0e0e0;}
  .dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:4px;}
  .dot.yellow{background:#EF9F27;}
  .dot.red{background:#E24B4A;}
  .dot.green{background:#639922;}
  .cmr-btn{font-size:10px;padding:3px 8px;border:0.5px solid #ccc;border-radius:4px;background:#fce8e8;color:#A32D2D;cursor:pointer;white-space:nowrap;}
  .heatmap-row{display:flex;align-items:center;gap:10px;padding:4px 0;cursor:pointer;}
  .heatmap-row:hover{opacity:0.8;}
  .heatmap-name{font-size:12px;min-width:80px;}
  .heatmap-bar-wrap{flex:1;}
  .heatmap-bar{height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;color:#fff;}
  .heatmap-action{font-size:11px;color:#666;min-width:140px;}
  .right-col{display:flex;flex-direction:column;gap:14px;}
  .suggested-list{display:flex;flex-direction:column;gap:8px;}
  .suggested-item{display:flex;align-items:center;gap:10px;}
  .sug-icon{width:32px;height:32px;border-radius:6px;background:#f5f7fa;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .sug-text{flex:1;font-size:12px;font-weight:500;}
  .order-btn{font-size:11px;padding:4px 12px;background:#639922;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:500;}
  .order-btn:hover{background:#3B6D11;}
  .order-btn:disabled{background:#f5f7fa;color:#888;border:0.5px solid #ccc;cursor:default;}
  .critical-header{font-size:11px;font-weight:500;color:#E24B4A;margin-bottom:8px;}
  .critical-header span{display:block;font-size:10px;color:#666;font-weight:400;}
  .gap-item{display:flex;align-items:flex-start;gap:10px;padding:8px;border-radius:8px;border:0.5px solid #e0e0e0;margin-bottom:6px;}
  .gap-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .gap-icon.red-bg{background:#E24B4A;color:#fff;}
  .gap-icon.gray-bg{background:#f5f7fa;}
  .gap-text strong{font-size:12px;font-weight:500;display:block;}
  .gap-text span{font-size:11px;color:#666;}
  .gap-text .miss{color:#E24B4A;}
  .ai-panel{background:#fff;border:0.5px solid #e0e0e0;border-radius:10px;padding:14px;}
  .ai-messages{max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;margin-bottom:8px;}
  .ai-msg{padding:8px 10px;border-radius:8px;font-size:12px;line-height:1.5;}
  .ai-msg.user{background:#E6F1FB;color:#042C53;align-self:flex-end;max-width:85%;}
  .ai-msg.ai{background:#f5f7fa;color:#222;align-self:flex-start;max-width:100%;}
  .ai-msg.loading{color:#888;font-style:italic;}
  .ai-input-wrap{display:flex;gap:6px;}
  .ai-input{flex:1;border:0.5px solid #ccc;border-radius:6px;padding:7px 10px;font-size:12px;font-family:inherit;outline:none;}
  .ai-input:focus{border-color:#378ADD;}
  .ai-send{background:#185FA5;color:#fff;border:none;border-radius:6px;padding:7px 12px;cursor:pointer;font-size:14px;}
  .ai-send:hover{background:#0C447C;}
  .live-badge{font-size:10px;padding:2px 7px;border-radius:10px;background:#eaf3de;color:#3B6D11;font-weight:500;display:inline-flex;align-items:center;gap:4px;}
  .demo-badge{font-size:10px;padding:2px 7px;border-radius:10px;background:#E6F1FB;color:#185FA5;font-weight:500;}
  .pulse{width:6px;height:6px;border-radius:50%;background:#639922;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
`

const diagIcon = (status) => {
  if (status === 'critical') return 'red'
  if (status === 'normal') return 'green'
  return 'gray'
}

const diagIconName = (name) => {
  if (name?.toLowerCase().includes('echo')) return 'ti-heart'
  if (name?.toLowerCase().includes('abpm')) return 'ti-device-heart-monitor'
  if (name?.toLowerCase().includes('zio') || name?.toLowerCase().includes('patch')) return 'ti-activity'
  return 'ti-stethoscope'
}

export default function Portal() {
  const [patients, setPatients] = useState([])
  const [activePatient, setActivePatient] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Ready to answer questions about this patient. Try: "Why is the VHI score high?" or "What\'s the urgency on the PAD finding?"' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderedItems, setOrderedItems] = useState({})
  const [cmrSent, setCmrSent] = useState({})
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetch('/api/patients')
      .then(r => r.json())
      .then(data => {
        setPatients(data.patients || [])
        setActivePatient(data.patients?.[0] || null)
        setIsLive(data.source === 'live')
      })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildContext = (p) => {
    if (!p) return ''
    return `Patient: ${p.fullName}, Age: ${p.age}.
VHI Score: ${p.vhi_score} (Vascular Health Index).
Diagnostics: ${p.diagnostics?.map(d => `${d.name}: ${d.result}`).join(', ')}.
Medications: ${p.medications?.map(m => `${m.name} (${m.status_label})`).join(', ')}.
Critical gaps: ${p.critical_gaps?.map(g => `${g.name}: ${g.detail}`).join(', ')}.
Suggested actions: ${p.suggested_actions?.map(a => a.name).join(', ')}.
Vulnerability rank: ${p.vulnerability_rank}/100.`
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const q = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, patientContext: buildContext(activePatient) })
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'ai', text: data.reply || 'Unable to get response.' }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  const p = activePatient

  return (
    <>
      <style>{styles}</style>
      <div className="portal">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-box">
              <i className="ti ti-activity-heartbeat" style={{fontSize:16,color:'#3B8BD4'}}></i>
              <span>IMAGINE ECHO</span>
            </div>
            <div className="logo-sub">Vascular Intelligence Portal</div>
          </div>
          {[
            ['ti-layout-dashboard','Dashboard',true],
            ['ti-users','Patient List',false],
            ['ti-report-medical','Diagnostics Reports',false],
            ['ti-heart-rate-monitor','ACO Shared Savings',false],
            ['ti-coins','Shared Savings',false],
            ['ti-map-2','Population Heat Map',false],
          ].map(([icon,label,active]) => (
            <div key={label} className={`nav-item${active?' active':''}`}>
              <i className={`ti ${icon}`}></i> {label}
            </div>
          ))}
        </div>

        <div className="main">
          <div className="topbar">
            <div className="topbar-patient">
              <strong>Patient Name:</strong> {p?.fullName || 'Loading...'}
              {isLive
                ? <span className="live-badge" style={{marginLeft:8}}><span className="pulse"></span>Live Healthie</span>
                : <span className="demo-badge" style={{marginLeft:8}}>Demo Data</span>
              }
            </div>
            <div className="village-logo">Village Doctor</div>
            <div style={{fontSize:12,color:'#666'}}>Dr. Weiss</div>
          </div>

          <div className="content">
            <div className="left-col">
              {/* Patient Score */}
              <div className="card">
                <div className="patient-name-row">
                  <h3>{p?.name}</h3>
                  <span style={{fontSize:12,fontWeight:500,color:'#666'}}>Vulnerability Score</span>
                </div>
                <div className="score-row">
                  <div className="patient-info"><h2>Patient<br/>{p?.age}</h2></div>
                  <div className="score-ring">
                    <svg width="90" height="90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#f0f2f5" strokeWidth="8"/>
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#E24B4A" strokeWidth="8"
                        strokeDasharray="170 56" strokeDashoffset="27" strokeLinecap="round"/>
                    </svg>
                    <div className="score-center">
                      <div className="num">{p?.vhi_score}</div>
                      <div className="lbl">YEARS OLD<br/>(Actual: {p?.age})</div>
                    </div>
                  </div>
                  <div className="score-arrow">→</div>
                  <div className="vhi-badge">
                    <span className="vhi-label">VHI</span>
                    <span className="vhi-num">{p?.vhi_score}</span>
                    <span className="vhi-tag">VHI (Vascular Health Index)</span>
                  </div>
                </div>
              </div>

              {/* Diagnostics */}
              {p?.diagnostics?.length > 0 && (
                <div className="card">
                  <div className="section-title">Diagnostics Performed</div>
                  <div className="diag-grid">
                    {p.diagnostics.map((d, i) => (
                      <div key={i} className="diag-item">
                        <div className={`diag-icon ${diagIcon(d.status)}`}>
                          <i className={`ti ${diagIconName(d.name)}`}></i>
                        </div>
                        <div className="diag-text">
                          <strong>{d.name}</strong>
                          <span className={d.status === 'critical' ? 'severe' : ''}>{d.result}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {p?.medications?.length > 0 && (
                <div className="card">
                  <div className="section-title">Medications</div>
                  <table className="meds-table">
                    <thead><tr><th></th><th>Fill History</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      {p.medications.map((m, i) => (
                        <tr key={i}>
                          <td>{m.name}</td>
                          <td style={{color: m.status !== 'good' ? '#E24B4A' : '#222'}}>{m.fill_date}</td>
                          <td>
                            <span className={`dot ${m.status === 'gap' ? 'yellow' : m.status === 'no_fill' ? 'red' : 'green'}`}></span>
                            {m.status_label}
                          </td>
                          <td>
                            {m.status !== 'good' && (
                              <button className="cmr-btn"
                                style={cmrSent[i] ? {background:'#eaf3de',color:'#3B6D11'} : {}}
                                onClick={() => setCmrSent(s => ({...s,[i]:true}))}>
                                {cmrSent[i] ? 'Sent ✓' : 'Request Pharmacist CMR'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Population Heat Map */}
              <div className="card">
                <div style={{display:'grid',gridTemplateColumns:'1fr 120px 1fr',gap:8,alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:11,color:'#888'}}>Population Heat Map</span>
                  <span style={{fontSize:11,color:'#888',textAlign:'center'}}>Vulnerability Score (1-100)</span>
                  <span style={{fontSize:11,color:'#888'}}>Suggested Action</span>
                </div>
                {patients.map((pt, i) => {
                  const color = pt.vulnerability_rank >= 91 ? '#E24B4A' : pt.vulnerability_rank >= 89 ? '#EF9F27' : '#F0997B'
                  return (
                    <div key={i} className="heatmap-row" onClick={() => setActivePatient(pt)}>
                      <div className="heatmap-name" style={{fontWeight: pt.id === p?.id ? 600 : 400}}>{pt.name}</div>
                      <div className="heatmap-bar-wrap">
                        <div className="heatmap-bar" style={{background:color,width:`${pt.vulnerability_rank}%`}}>{pt.vulnerability_rank}</div>
                      </div>
                      <div className="heatmap-action">{pt.suggested_action}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="right-col">
              {/* Suggested Actions */}
              <div className="card">
                <div className="section-title">Suggested Action</div>
                <div className="suggested-list">
                  {p?.suggested_actions?.map((a, i) => (
                    <div key={i} className="suggested-item">
                      <div className="sug-icon">
                        <i className={`ti ${a.type === 'referral' ? 'ti-heart-rate-monitor' : a.type === 'lab' ? 'ti-test-pipe' : 'ti-moon'}`} style={{color:'#185FA5'}}></i>
                      </div>
                      <div className="sug-text">{a.name}</div>
                      <button className="order-btn" disabled={!!orderedItems[i]}
                        onClick={() => setOrderedItems(o => ({...o,[i]:true}))}>
                        {orderedItems[i] ? 'Ordered ✓' : 'Order'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Gaps */}
              {p?.critical_gaps?.length > 0 && (
                <div className="card">
                  <div className="critical-header">CRITICAL GAP DETECTED:
                    <span>{p.critical_gap_summary}</span>
                  </div>
                  {p.critical_gaps.map((g, i) => (
                    <div key={i} className="gap-item">
                      <div className={`gap-icon ${g.severity === 'critical' ? 'red-bg' : 'gray-bg'}`}>
                        <i className={`ti ${g.severity === 'critical' ? 'ti-stethoscope' : i === 1 ? 'ti-test-pipe' : 'ti-zzz'}`}
                          style={g.severity !== 'critical' ? {color:'#888'} : {}}></i>
                      </div>
                      <div className="gap-text">
                        <strong>{g.name}</strong>
                        <span className={g.severity === 'critical' ? 'miss' : ''}>{g.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Assistant */}
              <div className="ai-panel">
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                  <i className="ti ti-robot" style={{fontSize:15,color:'#185FA5'}}></i>
                  <span style={{fontSize:12,fontWeight:500}}>AI Clinical Assistant</span>
                </div>
                <div className="ai-messages">
                  {messages.map((m, i) => (
                    <div key={i} className={`ai-msg ${m.role}`}
                      dangerouslySetInnerHTML={{__html: m.text.replace(/\n/g,'<br/>')}}/>
                  ))}
                  {loading && <div className="ai-msg loading">Analyzing...</div>}
                  <div ref={messagesEndRef}/>
                </div>
                <div className="ai-input-wrap">
                  <input className="ai-input" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about this patient..."/>
                  <button className="ai-send" onClick={sendMessage}>
                    <i className="ti ti-send"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
