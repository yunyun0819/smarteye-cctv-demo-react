import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Camera, Wifi, CheckCircle, XCircle,
  Loader, ChevronRight, ChevronLeft,
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

export default function CameraRegisterModal({ onClose, onSave }) {
  const [step, setStep]           = useState(1)
  const [form, setForm]           = useState({ name: '', ip: '', zone: '' })
  const [connStatus, setConnStatus] = useState(null) // null | 'testing' | 'ok' | 'fail'
  const [pingMs, setPingMs]       = useState(null)
  const [cameraType, setCameraType] = useState(null)
  const [aiOptions, setAiOptions] = useState({})

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

  const canGoNext = form.name.trim() && form.ip.trim() && form.zone.trim() && connStatus === 'ok'

  const handleSave = () => {
    onSave({
      name:       form.name.trim(),
      ip:         form.ip.trim(),
      zone:       form.zone.trim(),
      cameraType,
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
        width: 480, background: '#0f1923',
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
            {[
              { label: '카메라명',  key: 'name', placeholder: '예: 주차장 B동 입구 01' },
              { label: 'IP 주소',   key: 'ip',   placeholder: '예: 192.168.1.101' },
              { label: '설치 구역', key: 'zone', placeholder: '예: ZONE-A, 지하 주차장' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>{label}</div>
                <input
                  value={form[key]}
                  onChange={e => {
                    setForm(p => ({ ...p, [key]: e.target.value }))
                    if (key === 'ip') setConnStatus(null)
                  }}
                  placeholder={placeholder}
                  style={inputStyle}
                />
              </div>
            ))}

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
