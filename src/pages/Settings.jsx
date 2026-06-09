import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon, Camera, Bell, Users,
  Save, Plus, Trash2, Edit3, ToggleLeft, ToggleRight,
  Shield, X, Brain,
} from 'lucide-react'
import { cameraApi, userApi } from '../api'
import CameraRegisterModal from '../components/CameraRegisterModal'

const ZONES = ['ZONE-A', 'ZONE-B', 'ZONE-C', 'ZONE-D', 'ZONE-E']
const ZONE_COLOR = {
  'ZONE-A': '#00d4ff', 'ZONE-B': '#10b981',
  'ZONE-C': '#f59e0b', 'ZONE-D': '#8b5cf6', 'ZONE-E': '#64748b',
}

const CAMERA_TYPES = [
  {
    id: 'parking',
    label: '주차장 / 진입로',
    icon: '🚗',
    options: [
      { id: 'lpr',             label: '번호판 인식 (LPR)' },
      { id: 'entry_log',       label: '입출차 자동기록' },
      { id: 'regular_vehicle', label: '정기차량 관리' },
      { id: 'blacklist',       label: '블랙리스트 차량 감지' },
      { id: 'illegal_parking', label: '불법주차 감지' },
    ],
  },
  {
    id: 'entrance',
    label: '건물 출입구',
    icon: '🚪',
    options: [
      { id: 'count',        label: '출입자 카운팅' },
      { id: 'face',         label: '안면 인식' },
      { id: 'mask',         label: '마스크 착용 감지' },
      { id: 'intrusion_in', label: '무단 침입 감지' },
    ],
  },
  {
    id: 'indoor',
    label: '실내 매장',
    icon: '🏪',
    options: [
      { id: 'customer_count', label: '고객 카운팅' },
      { id: 'crowd',          label: '혼잡도 분석' },
      { id: 'abnormal',       label: '이상행동 감지' },
      { id: 'fire',           label: '화재/연기 감지' },
    ],
  },
  {
    id: 'outdoor',
    label: '야외 / 경계',
    icon: '🌿',
    options: [
      { id: 'intrusion', label: '침입 감지' },
      { id: 'loitering', label: '배회 감지' },
      { id: 'night',     label: '야간 강화 모드' },
      { id: 'fall',      label: '낙상 감지' },
    ],
  },
]

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: '#0a1628', border: '1px solid #1e2d3d', borderRadius: 8,
  padding: '7px 12px', fontSize: 12, color: '#e2e8f0', outline: 'none', fontFamily: 'inherit',
}

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

// ── 카메라 수정 모달 ───────────────────────────────────────────
function CameraEditModal({ camera, onClose, onSave, user }) {
  const isProPlus = user?.tier === 'Pro' || user?.tier === 'Enterprise'

  // 기존 aiModel 문자열에서 초기 체크 상태를 복원
  const initAiOptions = (typeId) => {
    const typeObj = CAMERA_TYPES.find(t => t.id === typeId)
    if (!typeObj || !camera.aiModel) return {}
    const existingLabels = camera.aiModel.split(' · ').map(s => s.trim())
    return Object.fromEntries(
      typeObj.options.map(o => [o.id, existingLabels.includes(o.label)])
    )
  }

  const [form, setForm] = useState({
    name:       camera.name,
    ip:         camera.ip,
    zone:       camera.zone,
    resolution: camera.resolution,
    fps:        camera.fps,
  })
  const [selectedType, setSelectedType] = useState(camera.cameraType || null)
  const [aiOptions, setAiOptions]       = useState(() => initAiOptions(camera.cameraType))

  const currentTypeObj = CAMERA_TYPES.find(t => t.id === selectedType)

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId)
    setAiOptions(initAiOptions(typeId))
  }

  const toggleAiOption = (optId) =>
    setAiOptions(prev => ({ ...prev, [optId]: !prev[optId] }))

  const buildAiModel = () => {
    if (!currentTypeObj) return '—'
    const labels = currentTypeObj.options
      .filter(o => aiOptions[o.id])
      .map(o => o.label)
    return labels.length > 0 ? labels.join(' · ') : currentTypeObj.label
  }

  const handleSave = () => {
    onSave({ ...camera, ...form, cameraType: selectedType, aiModel: buildAiModel() })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#0f1923', border: '1px solid #1e2d3d', borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, maxHeight: 'calc(100vh - 60px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Edit3 size={15} color="#00d4ff" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>카메라 정보 수정</span>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, lineHeight: 0 }} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* ── 섹션: 기본 정보 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 10, color: '#00d4ff', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>기본 정보</div>

          {[
            { label: '카메라명', key: 'name', placeholder: '정문 입구 01' },
            { label: 'IP 주소',  key: 'ip',   placeholder: '192.168.1.101' },
          ].map(f => (
            <div key={f.key}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{f.label}</div>
              <input style={inputStyle} value={form[f.key]} placeholder={f.placeholder}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}

          {/* 구역 */}
          <div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>설치 구역</div>
            {isProPlus ? (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ZONES.map(z => {
                  const zc = ZONE_COLOR[z]
                  const active = form.zone === z
                  return (
                    <button key={z} onClick={() => setForm(p => ({ ...p, zone: z }))}
                      style={{ padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 11, fontWeight: 600, background: active ? `${zc}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? zc : '#1e2d3d'}`, color: active ? zc : '#475569', transition: 'all 0.15s' }}>
                      {z}
                    </button>
                  )
                })}
              </div>
            ) : (
              <input style={inputStyle} value={form.zone} placeholder="ZONE-A"
                onChange={e => setForm(p => ({ ...p, zone: e.target.value }))} />
            )}
          </div>

          {/* 해상도 + FPS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>해상도</div>
              <select style={inputStyle} value={form.resolution} onChange={e => setForm(p => ({ ...p, resolution: e.target.value }))}>
                {['720p','1080p','4K'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>FPS</div>
              <select style={inputStyle} value={form.fps} onChange={e => setForm(p => ({ ...p, fps: +e.target.value }))}>
                {[0,15,25,30].map(f => <option key={f} value={f}>{f > 0 ? `${f}fps` : '—'}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── 섹션: AI 모델 설정 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 10, color: '#8b5cf6', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>AI 모델 설정</div>

          {/* 1단계: 카메라 용도(유형) 선택 */}
          <div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>카메라 용도 선택</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CAMERA_TYPES.map(t => {
                const active = selectedType === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTypeSelect(t.id)}
                    style={{
                      background: active ? 'rgba(139,92,246,0.1)' : '#0a1628',
                      border: `1px solid ${active ? 'rgba(139,92,246,0.45)' : '#1e2d3d'}`,
                      borderRadius: 10, padding: '10px 12px',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: active ? '#a78bfa' : '#64748b' }}>
                      {t.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2단계: 선택된 용도의 AI 옵션 */}
          {currentTypeObj ? (
            <div style={{ background: '#0a1628', border: '1px solid #1e2d3d', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>{currentTypeObj.icon}</span>
                <span style={{ color: '#a78bfa', fontWeight: 600 }}>{currentTypeObj.label}</span>
                <span style={{ color: '#334155' }}>— AI 옵션 선택 (복수 가능)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {currentTypeObj.options.map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!aiOptions[opt.id]}
                      onChange={() => toggleAiOption(opt.id)}
                      style={{ accentColor: '#8b5cf6', width: 14, height: 14, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12, color: aiOptions[opt.id] ? '#e2e8f0' : '#64748b' }}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: '#334155', background: '#0a1628', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Brain size={12} color="#334155" />
              카메라 용도를 먼저 선택하면 해당 용도에 맞는 AI 모델을 고를 수 있습니다.
            </div>
          )}

          {/* 적용 예정 모델 미리보기 */}
          {currentTypeObj && (
            <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: 8, padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
              <Brain size={11} color="#8b5cf6" style={{ flexShrink: 0 }} />
              {currentTypeObj.options.filter(o => aiOptions[o.id]).length > 0
                ? currentTypeObj.options.filter(o => aiOptions[o.id]).map(o => (
                    <span key={o.id} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                      {o.label}
                    </span>
                  ))
                : <span style={{ fontSize: 11, color: '#334155' }}>옵션을 선택하면 여기에 표시됩니다</span>
              }
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
          <button style={{ background: 'transparent', border: '1px solid #1e2d3d', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 12, color: '#475569' }} onClick={onClose}>취소</button>
          <button style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, padding: '7px 18px', cursor: 'pointer', fontSize: 12, color: '#00d4ff', display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleSave}>
            <Save size={12} /> 저장
          </button>
        </div>
      </div>
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
  const [editingCamera, setEditingCamera] = useState(null)
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

  const handleCameraEdit = (updatedCam) => {
    setCameras(prev => prev.map(c => c.id === updatedCam.id ? updatedCam : c))
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
          user={user}
          onClose={() => setShowRegisterModal(false)}
          onSave={handleCameraRegister}
        />
      )}
      {editingCamera && (
        <CameraEditModal
          camera={editingCamera}
          user={user}
          onClose={() => setEditingCamera(null)}
          onSave={handleCameraEdit}
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
              <div style={{ overflowX: 'auto' }}>
                <table className="vehicle-table">
                  <thead>
                    <tr>
                      <th>카메라명</th><th>IP</th><th>구역</th><th>해상도</th><th>FPS</th>
                      <th>AI 모델</th><th>활성화</th><th>수정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cameras.map(cam => (
                      <tr key={cam.id}>
                        <td style={{ color: '#e2e8f0', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>{cam.name}</td>
                        <td className="mono" style={{ fontSize: 11 }}>{cam.ip}</td>
                        <td>
                          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 12, background: `${ZONE_COLOR[cam.zone] || '#64748b'}15`, border: `1px solid ${ZONE_COLOR[cam.zone] || '#64748b'}30`, color: ZONE_COLOR[cam.zone] || '#64748b', fontWeight: 600 }}>
                            {cam.zone}
                          </span>
                        </td>
                        <td style={{ color: '#94a3b8', fontSize: 11 }}>{cam.resolution}</td>
                        <td style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: cam.fps > 0 ? '#94a3b8' : '#334155' }}>
                          {cam.fps > 0 ? `${cam.fps}fps` : '—'}
                        </td>
                        <td style={{ maxWidth: 200 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {cam.aiModel && cam.aiModel !== '—'
                              ? cam.aiModel.split(' · ').map((m, i) => (
                                  <span key={i} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Brain size={7} /> {m}
                                  </span>
                                ))
                              : <span style={{ color: '#334155', fontSize: 11 }}>—</span>
                            }
                          </div>
                        </td>
                        <td>
                          <Toggle value={camToggles[cam.id] ?? false}
                            onChange={v => setCamToggles(p => ({ ...p, [cam.id]: v }))} />
                        </td>
                        <td>
                          <button className="cam-btn" style={{ width: 28, height: 28 }} onClick={() => setEditingCamera(cam)} title="카메라 수정">
                            <Edit3 size={11} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
