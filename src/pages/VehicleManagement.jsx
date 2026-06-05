import { useState, useEffect } from 'react'
import {
  Car, Search, AlertTriangle, LogIn, LogOut,
  ShieldAlert, Plus, Trash2, Camera,
} from 'lucide-react'
import { vehicleApi } from '../api'

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([])
  const [blacklist, setBlacklist] = useState([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('log')
  const [newPlate, setNewPlate] = useState('')
  const [newReason, setNewReason] = useState('')

  useEffect(() => {
    vehicleApi.getAll().then(setVehicles)
    vehicleApi.getBlacklist().then(setBlacklist)
  }, [])

  const filtered = search
    ? vehicles.filter(v => v.plate.includes(search))
    : vehicles

  const todayEntrance = vehicles.filter(v => v.status === 'entrance').length
  const todayExit     = vehicles.filter(v => v.status === 'exit').length
  const todayAlert    = vehicles.filter(v => v.status === 'alert').length

  const handleAddBlacklist = () => {
    if (!newPlate.trim()) return
    vehicleApi.addToBlacklist({ plate: newPlate.trim(), reason: newReason.trim() || '사유 없음', addedDate: new Date().toISOString().slice(0, 10), addedBy: '관리자' })
      .then(item => {
        setBlacklist(prev => [...prev, item])
        setNewPlate('')
        setNewReason('')
      })
  }

  const handleRemoveBlacklist = (id) => {
    vehicleApi.removeFromBlacklist(id).then(() => {
      setBlacklist(prev => prev.filter(b => b.id !== id))
    })
  }

  return (
    <div className="content">
      {/* KPI */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <LogIn size={18} color="#10b981" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#10b981' }}>{todayEntrance}건</div>
            <div className="kpi-label">금일 입차</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <LogOut size={18} color="#00d4ff" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#00d4ff' }}>{todayExit}건</div>
            <div className="kpi-label">금일 출차</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#ef4444' }}>{todayAlert}건</div>
            <div className="kpi-label">금일 알림</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <ShieldAlert size={18} color="#f59e0b" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#f59e0b' }}>{blacklist.length}건</div>
            <div className="kpi-label">블랙리스트 등록</div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 4 }}>
        {[['log','출입 기록'],['blacklist','블랙리스트 관리']].map(([v, l]) => (
          <button key={v} className={`tab-btn ${tab === v ? 'active' : ''}`} onClick={() => setTab(v)}>{l}</button>
        ))}
      </div>

      {tab === 'log' && (
        <section className="cam-section" style={{ flex: 1 }}>
          <div className="section-header">
            <div className="section-title">
              <Car size={14} color="#f59e0b" />
              <span>차량 출입 기록</span>
              <span className="section-badge">{filtered.length}건</span>
            </div>
            <div className="search-box" style={{ width: 220 }}>
              <Search size={13} color="#64748b" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="번호판 검색…" />
            </div>
          </div>

          <table className="vehicle-table">
            <thead>
              <tr>
                <th>시간</th><th>카메라</th><th>차량 번호</th><th>상태</th><th>블랙리스트</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={i}>
                  <td className="mono">{v.time}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
                      <Camera size={10} color="#475569" />{v.camera}
                    </div>
                  </td>
                  <td className="plate">{v.plate}</td>
                  <td>
                    <span className={`status-badge ${v.status}`}>
                      {v.status === 'entrance' && <><LogIn size={9} /> 입차</>}
                      {v.status === 'exit'     && <><LogOut size={9} /> 출차</>}
                      {v.status === 'alert'    && <><AlertTriangle size={9} /> 알림</>}
                    </span>
                  </td>
                  <td>
                    {v.isBlacklist
                      ? <span style={{ fontSize: 10, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 3 }}><ShieldAlert size={10} /> 등록됨</span>
                      : <span style={{ fontSize: 10, color: '#334155' }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'blacklist' && (
        <section className="cam-section" style={{ flex: 1 }}>
          <div className="section-header">
            <div className="section-title">
              <ShieldAlert size={14} color="#ef4444" />
              <span>블랙리스트 관리</span>
              <span className="section-badge" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)', color: '#ef4444' }}>{blacklist.length}건</span>
            </div>
          </div>

          {/* 추가 폼 */}
          <div className="blacklist-add-form">
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>새 번호판 등록</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div className="search-box" style={{ width: 180 }}>
                <Car size={12} color="#64748b" />
                <input value={newPlate} onChange={e => setNewPlate(e.target.value)}
                  placeholder="번호판 (예: 서울 12 가 3456)" />
              </div>
              <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
                <input value={newReason} onChange={e => setNewReason(e.target.value)}
                  placeholder="등록 사유" />
              </div>
              <button className="add-btn" onClick={handleAddBlacklist}>
                <Plus size={13} /> 등록
              </button>
            </div>
          </div>

          <table className="vehicle-table">
            <thead>
              <tr>
                <th>차량 번호</th><th>등록 사유</th><th>등록일</th><th>등록자</th><th>감지 횟수</th><th>관리</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.map((b) => (
                <tr key={b.id}>
                  <td className="plate" style={{ color: '#ef4444' }}>{b.plate}</td>
                  <td style={{ color: '#94a3b8', fontSize: 12 }}>{b.reason}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{b.addedDate}</td>
                  <td style={{ color: '#94a3b8', fontSize: 12 }}>{b.addedBy}</td>
                  <td>
                    <span style={{ fontFamily: 'Share Tech Mono', fontSize: 12, color: b.hits > 0 ? '#ef4444' : '#475569' }}>
                      {b.hits}회
                    </span>
                  </td>
                  <td>
                    <button className="del-btn" onClick={() => handleRemoveBlacklist(b.id)}>
                      <Trash2 size={12} /> 해제
                    </button>
                  </td>
                </tr>
              ))}
              {blacklist.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#334155', padding: 32 }}>등록된 블랙리스트가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
