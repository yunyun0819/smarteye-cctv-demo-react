import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon, Camera, Bell, Users,
  Save, Plus, Trash2, Edit3, ToggleLeft, ToggleRight,
  Shield,
} from 'lucide-react'
import { cameraApi, userApi } from '../api'
import CameraRegisterModal from '../components/CameraRegisterModal'

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
      {value
        ? <ToggleRight size={28} color="#10b981" />
        : <ToggleLeft  size={28} color="#334155" />
      }
    </button>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="setting-row">
      <div>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{desc}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function Settings({ user }) {
  const [tab, setTab] = useState('camera')
  const [cameras, setCameras] = useState([])
  const [users, setUsers] = useState([])
  const [saved, setSaved] = useState(false)
  const [editingUserRole, setEditingUserRole] = useState(null)

  const isCompanyAdmin = user?.role === '관리자' && user?.isCompany

  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [camToggles, setCamToggles] = useState({})
  const [alertSettings, setAlertSettings] = useState({
    personAlert:  true,
    vehicleAlert: true,
    blacklist:    true,
    nightMode:    false,
    emailNotify:  false,
    threshold:    80,
  })
  useEffect(() => {
    cameraApi.getAll().then(data => {
      setCameras(data)
      setCamToggles(Object.fromEntries(data.map(c => [c.id, c.status === 'online'])))
    })
    userApi.getAll().then(setUsers)
  }, [])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCameraRegister = (data) => {
    cameraApi.add(data).then(newCam => {
      setCameras(prev => [...prev, newCam])
      setCamToggles(prev => ({ ...prev, [newCam.id]: true }))
    })
  }

  const tabs = [
    { key: 'camera', label: '카메라 설정', Icon: Camera },
    { key: 'alert',  label: '알림 설정',   Icon: Bell   },
    { key: 'user',   label: '사용자 관리',  Icon: Users  },
  ]

  return (
    <div className="content">
      {showRegisterModal && (
        <CameraRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSave={handleCameraRegister}
        />
      )}
      <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
        {/* 탭 사이드 */}
        <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map(t => (
            <button key={t.key}
              className={`nav-item ${tab === t.key ? 'active' : ''}`}
              style={{ justifyContent: 'flex-start', borderRadius: 10 }}
              onClick={() => setTab(t.key)}>
              <t.Icon size={15} />
              <span>{t.label}</span>
              {tab === t.key && <div className="nav-indicator" />}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          {tab === 'camera' && (
            <section className="cam-section">
              <div className="section-header">
                <div className="section-title"><Camera size={14} color="#00d4ff" /><span>카메라 설정</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="section-badge">{cameras.filter(c => camToggles[c.id]).length}/{cameras.length} 활성</span>
                  <button className="add-btn" onClick={() => setShowRegisterModal(true)}>
                    <Plus size={12} /> 카메라 추가
                  </button>
                </div>
              </div>
              <table className="vehicle-table">
                <thead>
                  <tr><th>카메라명</th><th>IP</th><th>구역</th><th>해상도</th><th>FPS</th><th>활성화</th></tr>
                </thead>
                <tbody>
                  {cameras.map(cam => (
                    <tr key={cam.id}>
                      <td style={{ color: '#e2e8f0', fontWeight: 500, fontSize: 12 }}>{cam.name}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{cam.ip}</td>
                      <td><span className="section-badge" style={{ fontSize: 10 }}>{cam.zone}</span></td>
                      <td style={{ color: '#94a3b8', fontSize: 11 }}>{cam.resolution}</td>
                      <td style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: cam.fps > 0 ? '#94a3b8' : '#334155' }}>
                        {cam.fps > 0 ? `${cam.fps}fps` : '—'}
                      </td>
                      <td>
                        <Toggle value={camToggles[cam.id] ?? false}
                          onChange={v => setCamToggles(p => ({ ...p, [cam.id]: v }))} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {tab === 'alert' && (
            <section className="cam-section">
              <div className="section-header">
                <div className="section-title"><Bell size={14} color="#f59e0b" /><span>알림 설정</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <SettingRow label="사람 감지 알림" desc="사람이 감지되면 알림을 보냅니다">
                  <Toggle value={alertSettings.personAlert} onChange={v => setAlertSettings(p => ({ ...p, personAlert: v }))} />
                </SettingRow>
                <SettingRow label="차량 감지 알림" desc="차량 입출차 시 알림을 보냅니다">
                  <Toggle value={alertSettings.vehicleAlert} onChange={v => setAlertSettings(p => ({ ...p, vehicleAlert: v }))} />
                </SettingRow>
                <SettingRow label="블랙리스트 차량 알림" desc="등록된 번호판 감지 시 즉시 알림">
                  <Toggle value={alertSettings.blacklist} onChange={v => setAlertSettings(p => ({ ...p, blacklist: v }))} />
                </SettingRow>
                <SettingRow label="야간 모드" desc="야간(22시~06시) 강화 감지 활성화">
                  <Toggle value={alertSettings.nightMode} onChange={v => setAlertSettings(p => ({ ...p, nightMode: v }))} />
                </SettingRow>
                <SettingRow label="이메일 알림" desc="위험 이벤트 발생 시 이메일 발송">
                  <Toggle value={alertSettings.emailNotify} onChange={v => setAlertSettings(p => ({ ...p, emailNotify: v }))} />
                </SettingRow>
                <div className="setting-row">
                  <div>
                    <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>AI 신뢰도 임계값</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>이 값 이상일 때만 알림 발생</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="range" min={50} max={99} value={alertSettings.threshold}
                      onChange={e => setAlertSettings(p => ({ ...p, threshold: +e.target.value }))}
                      style={{ width: 120, accentColor: '#00d4ff' }} />
                    <span style={{ fontFamily: 'Share Tech Mono', color: '#00d4ff', fontSize: 14, minWidth: 36 }}>
                      {alertSettings.threshold}%
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === 'user' && (
            <section className="cam-section">
              <div className="section-header">
                <div className="section-title"><Users size={14} color="#8b5cf6" /><span>사용자 관리</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isCompanyAdmin && (
                    <span style={{ fontSize: 10, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Shield size={10} /> 역할 변경 가능
                    </span>
                  )}
                  <button className="add-btn"><Plus size={12} /> 사용자 추가</button>
                </div>
              </div>
              <table className="vehicle-table">
                <thead>
                  <tr><th>이름</th><th>이메일</th><th>역할</th><th>마지막 로그인</th><th>상태</th><th>관리</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: '#e2e8f0', fontWeight: 500, fontSize: 12 }}>{u.name}</td>
                      <td style={{ color: '#94a3b8', fontSize: 11 }}>{u.email}</td>
                      <td>
                        {isCompanyAdmin && editingUserRole === u.id ? (
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {['관리자', '운영자', '뷰어'].map(r => (
                              <button key={r}
                                style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, cursor: 'pointer', border: '1px solid', borderColor: u.role === r ? (r === '관리자' ? 'rgba(139,92,246,0.4)' : 'rgba(0,212,255,0.3)') : 'rgba(255,255,255,0.1)', background: u.role === r ? (r === '관리자' ? 'rgba(139,92,246,0.15)' : 'rgba(0,212,255,0.1)') : 'transparent', color: u.role === r ? (r === '관리자' ? '#8b5cf6' : '#00d4ff') : '#475569' }}
                                onClick={() => { setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: r } : x)); setEditingUserRole(null) }}>
                                {r}
                              </button>
                            ))}
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155', padding: '0 4px', fontSize: 12 }} onClick={() => setEditingUserRole(null)}>✕</button>
                          </div>
                        ) : (
                          <span className="det-badge"
                            style={{ background: u.role === '관리자' ? 'rgba(139,92,246,0.15)' : 'rgba(0,212,255,0.1)', border: u.role === '관리자' ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(0,212,255,0.2)', color: u.role === '관리자' ? '#8b5cf6' : '#00d4ff', cursor: isCompanyAdmin ? 'pointer' : 'default' }}
                            onClick={() => isCompanyAdmin && setEditingUserRole(u.id)}
                            title={isCompanyAdmin ? '클릭하여 역할 변경' : undefined}>
                            <Shield size={9} /> {u.role}
                          </span>
                        )}
                      </td>
                      <td className="mono" style={{ fontSize: 10 }}>{u.lastLogin}</td>
                      <td>
                        <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4,
                          color: u.status === 'online' ? '#10b981' : '#475569' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: u.status === 'online' ? '#10b981' : '#475569' }} />
                          {u.status === 'online' ? '온라인' : '오프라인'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="cam-btn" style={{ width: 26, height: 26 }}><Edit3 size={11} /></button>
                          <button className="del-btn" style={{ padding: '3px 8px' }}><Trash2 size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* 저장 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="add-btn" style={{ padding: '8px 20px', gap: 8 }} onClick={handleSave}>
              <Save size={13} />
              {saved ? '저장되었습니다!' : '설정 저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
