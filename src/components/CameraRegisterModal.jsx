import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Camera, Wifi, CheckCircle, XCircle,
  Loader, ChevronRight, ChevronLeft, Users, Car, AlertTriangle,
  VolumeX, Maximize2,
} from 'lucide-react'


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
  padding: '8px 12px', fontSize: 12, color: '#e2e8f0', outline: 'none',
  fontFamily: 'inherit',
}

const gradients = [
  'linear-gradient(135deg, #0a1628 0%, #0d2040 50%, #091520 100%)',
  'linear-gradient(135deg, #0a1a14 0%, #0d2a20 50%, #091510 100%)',
  'linear-gradient(135deg, #1a1208 0%, #2a1e0d 50%, #150e05 100%)',
]

function CameraPreview({ camName, location }) {
  const now = new Date().toLocaleTimeString('ko-KR', { hour12: false }).slice(0, 5)
  return (
    <div style={{ marginTop: 4, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(16,185,129,0.3)', position: 'relative' }}>
      <div style={{ position: 'relative', background: gradients[0], aspectRatio: '16/9', overflow: 'hidden' }}>
        {/* 스캔라인 */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none' }} />
        {/* 그리드 */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        {/* 상단 바 */}
        <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: '#e2e8f0', fontWeight: 600, background: 'rgba(0,0,0,0.55)', padding: '2px 8px', borderRadius: 4 }}>{camName || '새 카메라'}</span>
          <span style={{ fontSize: 9, color: '#10b981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 7px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} /> LIVE
          </span>
        </div>

        {/* 중앙 AI 감지 박스 (더미) */}
        <div style={{ position: 'absolute', top: '25%', left: '18%', width: '28%', height: '42%', border: '1px solid rgba(0,212,255,0.6)', borderRadius: 2 }}>
          <div style={{ position: 'absolute', top: -14, left: 0, fontSize: 9, color: '#00d4ff', background: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Users size={7} /> 2명
          </div>
        </div>

        {/* 하단 바 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, color: '#64748b', fontFamily: 'monospace' }}>
            {location || '설치 위치'} · {now}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 3, width: 18, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VolumeX size={8} color="#64748b" />
            </button>
            <button style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 3, width: 18, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Maximize2 size={8} color="#64748b" />
            </button>
          </div>
        </div>
      </div>
      <div style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <CheckCircle size={11} color="#10b981" />
        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 500 }}>카메라 연결 확인됨 — 영상 수신 중</span>
      </div>
    </div>
  )
}

export default function CameraRegisterModal({ onClose, onSave, user }) {
  const [step, setStep]           = useState(1)
  const [form, setForm]           = useState({ name: '', ip: '', location: '', security_level: 1 })
  const [connStatus, setConnStatus] = useState(null) // null | 'testing' | 'ok' | 'fail'
  const [pingMs, setPingMs]       = useState(null)
  const [cameraType, setCameraType] = useState(null)
  const [aiOptions, setAiOptions] = useState({})

  const isProPlus = user?.tier === 'Pro' || user?.tier === 'Enterprise'
  const isCompany = !!user?.isCompany

  const handleTest = () => {
    if (!form.ip.trim()) return
    setConnStatus('testing')
    setPingMs(null)
    setTimeout(() => {
      const valid = /^(\d{1,3}\.){3}\d{1,3}$/.test(form.ip.trim())
      if (valid) {
        setConnStatus('ok')
        setPingMs(Math.floor(Math.random() * 20) + 5)
      } else {
        setConnStatus('fail')
      }
    }, 1400)
  }

  const selectedType = CAMERA_TYPES.find(t => t.id === cameraType)

  const toggleOption = (optId) =>
    setAiOptions(prev => ({ ...prev, [optId]: !prev[optId] }))

  const canGoNext = form.name.trim() && form.ip.trim() && connStatus === 'ok'

  const handleSave = () => {
    onSave({
      name:           form.name.trim(),
      ip:             form.ip.trim(),
      location:       form.location.trim(),
      security_level: isCompany ? form.security_level : null,
      cameraType,
      aiModel:    selectedType
        ? Object.keys(aiOptions).filter(k => aiOptions[k]).map(k => selectedType.options.find(o => o.id === k)?.label).join(' · ') || selectedType.label
        : '—',
      aiOptions:  Object.keys(aiOptions).filter(k => aiOptions[k]),
      status:     'online',
      persons:    0,
      plate:      null,
      alert:      false,
      fps:        30,
      resolution: '1080p',
      color:      '#00d4ff',
    })
    onClose()
  }

  return createPortal(
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)',
          zIndex: 10000,
        }}
      />

      {/* 모달 */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, maxHeight: 'calc(100vh - 60px)', overflowY: 'auto',
        background: '#0f1923',
        border: '1px solid #1e2d3d', borderRadius: 16,
        zIndex: 10001, padding: 28,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={16} color="#00d4ff" />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>카메라 등록</span>
            <span style={{
              fontSize: 10, color: '#475569',
              background: '#0a1628', border: '1px solid #1e2d3d',
              borderRadius: 20, padding: '2px 10px',
            }}>
              STEP {step} / 2
            </span>
            {isProPlus && (
              <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                {user.tier}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, lineHeight: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 스텝 인디케이터 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['연결 설정', 'AI 모델'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: i < 1 ? 'none' : 1 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step > i + 1 ? '#10b981' : step === i + 1 ? '#00d4ff' : '#1e2d3d',
                color: step >= i + 1 ? '#000' : '#475569',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 11, color: step === i + 1 ? '#e2e8f0' : '#475569' }}>{label}</span>
              {i < 1 && (
                <div style={{ flex: 1, height: 1, background: step > 1 ? '#10b981' : '#1e2d3d', margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: 연결 설정 ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 카메라명 */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>카메라명</div>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="예: 주차장 B동 입구 01"
                style={inputStyle}
              />
            </div>

            {/* IP 주소 */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>IP 주소</div>
              <input
                value={form.ip}
                onChange={e => { setForm(p => ({ ...p, ip: e.target.value })); setConnStatus(null) }}
                placeholder="예: 192.168.1.101"
                style={inputStyle}
              />
            </div>

            {/* 설치 위치 */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>설치 위치</div>
              <input
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                placeholder="예: 1층 정문, B1 주차장 입구"
                style={inputStyle}
              />
            </div>

            {/* 보안 레벨 — 기업 계정만 표시 */}
            {isCompany && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>보안 레벨</span>
                  <span style={{ fontSize: 9, color: '#8b5cf6', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, padding: '1px 6px' }}>
                    관리자=3 · 운영자=2 · 뷰어=1
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { level: 1, label: 'Lv.1', desc: '일반',   color: '#10b981' },
                    { level: 2, label: 'Lv.2', desc: '제한',   color: '#f59e0b' },
                    { level: 3, label: 'Lv.3', desc: '고보안', color: '#ef4444' },
                  ].map(({ level, label, desc, color }) => {
                    const active = form.security_level === level
                    return (
                      <button
                        key={level}
                        onClick={() => setForm(p => ({ ...p, security_level: level }))}
                        style={{
                          flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                          background: active ? `${color}15` : '#0a1628',
                          border: `1px solid ${active ? color : '#1e2d3d'}`,
                          color: active ? color : '#475569',
                          fontSize: 11, fontWeight: active ? 700 : 400,
                          transition: 'all 0.15s',
                        }}
                      >
                        <div>{label}</div>
                        <div style={{ fontSize: 9, marginTop: 2 }}>{desc}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 연결 테스트 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleTest}
                disabled={!form.ip.trim() || connStatus === 'testing'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: connStatus === 'ok'
                    ? 'rgba(16,185,129,0.1)'
                    : 'rgba(0,212,255,0.08)',
                  border: `1px solid ${connStatus === 'ok' ? 'rgba(16,185,129,0.35)' : 'rgba(0,212,255,0.2)'}`,
                  borderRadius: 8, padding: '7px 14px',
                  cursor: !form.ip.trim() || connStatus === 'testing' ? 'not-allowed' : 'pointer',
                  fontSize: 12,
                  color: connStatus === 'ok' ? '#10b981' : '#00d4ff',
                  opacity: !form.ip.trim() ? 0.4 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {connStatus === 'testing'
                  ? <><Loader size={12} className="spin" /> 확인 중…</>
                  : <><Wifi size={12} /> IP 연결 테스트</>
                }
              </button>

              {connStatus === 'ok' && (
                <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={13} /> 연결 성공 · {pingMs}ms
                </span>
              )}
              {connStatus === 'fail' && (
                <span style={{ fontSize: 11, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <XCircle size={13} /> 연결 실패 — IP를 확인하세요
                </span>
              )}
            </div>

            {/* 연결 성공 시 카메라 미리보기 */}
            {connStatus === 'ok' && (
              <CameraPreview camName={form.name} location={form.location} />
            )}

            {connStatus !== 'ok' && form.ip.trim() && (
              <div style={{ fontSize: 11, color: '#334155', background: '#0a1628', borderRadius: 8, padding: '8px 12px' }}>
                연결 테스트 후 다음 단계로 진행할 수 있습니다.
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: AI 모델 ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              카메라 유형을 선택하면 적합한 AI 분석 옵션을 고를 수 있습니다.
            </div>

            {/* 유형 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CAMERA_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setCameraType(t.id); setAiOptions({}) }}
                  style={{
                    background: cameraType === t.id ? 'rgba(0,212,255,0.08)' : '#0a1628',
                    border: `1px solid ${cameraType === t.id ? 'rgba(0,212,255,0.4)' : '#1e2d3d'}`,
                    borderRadius: 10, padding: '12px 14px',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{t.icon}</div>
                  <div style={{
                    fontSize: 12, fontWeight: 500,
                    color: cameraType === t.id ? '#00d4ff' : '#94a3b8',
                  }}>
                    {t.label}
                  </div>
                </button>
              ))}
            </div>

            {/* AI 옵션 체크박스 */}
            {selectedType && (
              <div style={{
                background: '#0a1628', border: '1px solid #1e2d3d',
                borderRadius: 10, padding: 14,
              }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, letterSpacing: 0.5 }}>
                  AI 분석 옵션 — 복수 선택 가능
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {selectedType.options.map(opt => (
                    <label
                      key={opt.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={!!aiOptions[opt.id]}
                        onChange={() => toggleOption(opt.id)}
                        style={{ accentColor: '#00d4ff', width: 14, height: 14, flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 12, color: aiOptions[opt.id] ? '#e2e8f0' : '#64748b' }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!cameraType && (
              <div style={{ fontSize: 11, color: '#334155', background: '#0a1628', borderRadius: 8, padding: '8px 12px' }}>
                카메라 유형을 선택해야 등록할 수 있습니다.
              </div>
            )}
          </div>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <button
            onClick={() => step === 1 ? onClose() : setStep(1)}
            style={{
              background: 'none', border: '1px solid #1e2d3d', borderRadius: 8,
              padding: '8px 16px', cursor: 'pointer', fontSize: 12, color: '#64748b',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {step === 1 ? '취소' : <><ChevronLeft size={13} /> 이전</>}
          </button>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!canGoNext}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: canGoNext ? 'rgba(0,212,255,0.12)' : 'rgba(0,212,255,0.04)',
                border: `1px solid ${canGoNext ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.1)'}`,
                borderRadius: 8, padding: '8px 18px',
                cursor: canGoNext ? 'pointer' : 'not-allowed',
                fontSize: 12, color: canGoNext ? '#00d4ff' : '#334155',
                transition: 'all 0.15s',
              }}
            >
              다음 <ChevronRight size={13} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!cameraType}
              style={{
                background: cameraType ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.04)',
                border: `1px solid ${cameraType ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.1)'}`,
                borderRadius: 8, padding: '8px 20px',
                cursor: cameraType ? 'pointer' : 'not-allowed',
                fontSize: 12, color: cameraType ? '#10b981' : '#334155',
                transition: 'all 0.15s',
              }}
            >
              카메라 등록
            </button>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
