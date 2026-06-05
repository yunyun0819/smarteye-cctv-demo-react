import { useState, useEffect } from 'react'
import { FileText, Users, Car, AlertTriangle, Shield, Filter, Download, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { eventApi } from '../api'

const TYPE_CONFIG = {
  person:  { label: '사람',   color: '#00d4ff', Icon: Users         },
  vehicle: { label: '차량',   color: '#10b981', Icon: Car           },
  alert:   { label: '알림',   color: '#ef4444', Icon: AlertTriangle },
  shield:  { label: '보안',   color: '#f59e0b', Icon: Shield        },
}
const SEVERITY_CONFIG = {
  info:    { label: '정보',  color: '#00d4ff', bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.25)'  },
  warning: { label: '주의',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  danger:  { label: '위험',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)'  },
}

const PAGE_SIZE = 8

export default function EventLog() {
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [cameraFilter, setCameraFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)

  useEffect(() => { eventApi.getAll().then(d => { setEvents(d); setFiltered(d) }) }, [])

  useEffect(() => {
    let result = events
    if (typeFilter !== 'all')     result = result.filter(e => e.type === typeFilter)
    if (severityFilter !== 'all') result = result.filter(e => e.severity === severityFilter)
    if (cameraFilter !== 'all')   result = result.filter(e => e.camera === cameraFilter)
    setFiltered(result)
    setPage(0)
  }, [typeFilter, severityFilter, cameraFilter, events])

  const cameras = [...new Set(events.map(e => e.camera))]
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="content">
      {/* 필터 바 */}
      <div className="log-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={13} color="#64748b" />
          <span style={{ fontSize: 11, color: '#64748b' }}>필터</span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 10, color: '#475569', alignSelf: 'center' }}>유형</span>
          {[['all','전체'],['person','사람'],['vehicle','차량'],['alert','알림']].map(([v, l]) => (
            <button key={v} className={`log-filter-chip ${typeFilter === v ? 'active' : ''}`}
              onClick={() => setTypeFilter(v)}>{l}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 10, color: '#475569', alignSelf: 'center' }}>심각도</span>
          {[['all','전체'],['info','정보'],['warning','주의'],['danger','위험']].map(([v, l]) => (
            <button key={v} className={`log-filter-chip ${severityFilter === v ? 'active' : ''}`}
              onClick={() => setSeverityFilter(v)}>{l}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 10, color: '#475569', alignSelf: 'center' }}>카메라</span>
          <select className="log-select" value={cameraFilter} onChange={e => setCameraFilter(e.target.value)}>
            <option value="all">전체</option>
            {cameras.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button className="log-export-btn">
          <Download size={12} /> 내보내기
        </button>
      </div>

      {/* 카운트 */}
      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => {
          const cnt = filtered.filter(e => e.severity === key).length
          return (
            <div key={key} className="kpi-card" style={{ flex: 1, padding: '10px 14px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={14} color={cfg.color} />
              </div>
              <div className="kpi-body">
                <div style={{ fontSize: 18, fontWeight: 700, color: cfg.color, fontFamily: 'Rajdhani' }}>{cnt}건</div>
                <div className="kpi-label">{cfg.label}</div>
              </div>
            </div>
          )
        })}
        <div className="kpi-card" style={{ flex: 1, padding: '10px 14px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={14} color="#8b5cf6" />
          </div>
          <div className="kpi-body">
            <div style={{ fontSize: 18, fontWeight: 700, color: '#8b5cf6', fontFamily: 'Rajdhani' }}>{filtered.length}건</div>
            <div className="kpi-label">필터 결과</div>
          </div>
        </div>
      </div>

      {/* 이벤트 테이블 */}
      <section className="cam-section" style={{ flex: 1 }}>
        <div className="section-header">
          <div className="section-title">
            <FileText size={14} color="#8b5cf6" />
            <span>이벤트 로그</span>
            <span className="section-badge">{filtered.length}건</span>
          </div>
        </div>

        <table className="vehicle-table" style={{ fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ width: 70 }}>시간</th>
              <th style={{ width: 70 }}>유형</th>
              <th>이벤트 내용</th>
              <th style={{ width: 130 }}>카메라</th>
              <th style={{ width: 70 }}>심각도</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((ev, i) => {
              const tc = TYPE_CONFIG[ev.type] || TYPE_CONFIG.alert
              const sc = SEVERITY_CONFIG[ev.severity]
              return (
                <tr key={ev.id} className="log-row" style={{ cursor: 'pointer', background: selected?.id === ev.id ? 'rgba(0,212,255,0.04)' : '' }}
                  onClick={() => setSelected(selected?.id === ev.id ? null : ev)}>
                  <td className="mono" style={{ fontSize: 11 }}>{ev.time}</td>
                  <td>
                    <span className="det-badge" style={{ background: `${tc.color}15`, border: `1px solid ${tc.color}30`, color: tc.color }}>
                      <tc.Icon size={9} /> {tc.label}
                    </span>
                  </td>
                  <td style={{ color: '#e2e8f0' }}>{ev.label}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 11 }}>
                      <Camera size={10} color="#475569" />{ev.camera}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                      {sc.label}
                    </span>
                  </td>
                </tr>
              )
            })}
            {pageData.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#334155', padding: 32 }}>조건에 맞는 이벤트가 없습니다.</td></tr>
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#475569' }}>
            {filtered.length > 0 ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} / ${filtered.length}건` : ''}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="ptz-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`grid-btn ${page === i ? 'active' : ''}`}
                onClick={() => setPage(i)} style={{ minWidth: 28 }}>{i + 1}</button>
            ))}
            <button className="ptz-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
