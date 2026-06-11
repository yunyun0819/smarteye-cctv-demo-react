import { useState, useEffect } from 'react'
import {
  Camera, Users, Car, AlertTriangle, VolumeX, Volume2,
  Maximize2, RotateCcw, ZoomIn, ZoomOut, Move,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  WifiOff, Settings, RefreshCw, Plus, GripVertical, Minus,
} from 'lucide-react'
import { cameraApi } from '../api'
import CameraRegisterModal from '../components/CameraRegisterModal'
import useMonitorStore from '../store/useMonitorStore'

const gradients = [
  'linear-gradient(135deg, #0a1628 0%, #0d2040 50%, #091520 100%)',
  'linear-gradient(135deg, #0a1a14 0%, #0d2a20 50%, #091510 100%)',
  'linear-gradient(135deg, #1a1208 0%, #2a1e0d 50%, #150e05 100%)',
  'linear-gradient(135deg, #12080a 0%, #200d12 50%, #100609 100%)',
  'linear-gradient(135deg, #080a1a 0%, #0d1028 50%, #060812 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)',
  'linear-gradient(135deg, #0d1a20 0%, #0f2a30 50%, #081518 100%)',
  'linear-gradient(135deg, #1a0d20 0%, #2a1030 50%, #150820 100%)',
  'linear-gradient(135deg, #0a1510 0%, #0d2218 50%, #091208 100%)',
]

const GRID_LAYOUTS = [
  { label: '1열', cols: 1, count: 1  },
  { label: '2열', cols: 2, count: 4  },
  { label: '3열', cols: 3, count: 9  },
  { label: '4열', cols: 4, count: 16 },
]

const STATUS_COLOR = { online: '#10b981', offline: '#ef4444', maintenance: '#f59e0b' }
const STATUS_LABEL = { online: '온라인', offline: '오프라인', maintenance: '점검 중' }

// 1=1×1, 2=2×1(와이드), 4=2×2(대형)
const SIZE_CYCLE = { 1: 2, 2: 4, 4: 1 }
const SIZE_LABEL = { 1: '1×1', 2: '2×1', 4: '2×2' }

function CameraFeed({ cam, index, selected, size = 1, onSizeToggle, onClick }) {
  const now = new Date().toLocaleTimeString('ko-KR', { hour12: false }).slice(0, 5)
  return (
    <div
      className={`mon-cam-card ${selected ? 'selected' : ''}`}
      style={{
        animationDelay: `${index * 0.06}s`,
        gridColumn: size >= 2 ? 'span 2' : undefined,
        gridRow: size === 4 ? 'span 2' : undefined,
      }}
      onClick={onClick}
    >
      <div className="cam-feed" style={{ background: gradients[index % gradients.length] }}>
        <div className="scanline" />
        <div className="cam-grid" />
        {cam.status === 'offline' && (
          <div className="cam-offline-overlay">
            <WifiOff size={20} color="#475569" />
            <span>신호 없음</span>
          </div>
        )}
        {cam.status === 'maintenance' && (
          <div className="cam-offline-overlay" style={{ color: '#f59e0b' }}>
            <Settings size={20} color="#f59e0b" />
            <span>점검 중</span>
          </div>
        )}
        <div className="cam-top">
          <span className="cam-name">{cam.name}</span>
          {cam.status === 'online'
            ? <span className="live-badge"><span className="live-dot" /> LIVE</span>
            : <span className="live-badge" style={{ color: STATUS_COLOR[cam.status], background: `${STATUS_COLOR[cam.status]}15`, borderColor: `${STATUS_COLOR[cam.status]}30` }}>
                {STATUS_LABEL[cam.status]}
              </span>
          }
        </div>
        {cam.persons > 0 && cam.status === 'online' && (
          <div className="bbox bbox-person" style={{ top: '25%', left: '15%', width: '28%', height: '40%' }}>
            <div className="bbox-label" style={{ color: '#00d4ff' }}>
              <Users size={8} /> {cam.persons}명
            </div>
          </div>
        )}
        {cam.plate && cam.status === 'online' && (
          <div className="bbox bbox-vehicle" style={{ bottom: '20%', right: '8%', width: '38%', height: '25%' }}>
            <div className="bbox-label" style={{ color: '#f59e0b' }}>
              <Car size={8} /> {cam.plate}
            </div>
          </div>
        )}
        {cam.alert && (
          <div className="cam-alert-overlay">
            <AlertTriangle size={12} /><span>ALERT</span>
          </div>
        )}
        <div className="cam-bar">
          <span className="cam-time">{cam.location || cam.ip} · {now}</span>
          <div className="cam-controls">
            <button
              className="cam-btn"
              title={`화면 크기: ${SIZE_LABEL[size]} → ${SIZE_LABEL[SIZE_CYCLE[size]]}`}
              onClick={e => { e.stopPropagation(); onSizeToggle() }}
              style={{ minWidth: 26, fontSize: 7, fontFamily: 'var(--font-mono)', color: '#64748b', letterSpacing: 0 }}
            >
              {SIZE_LABEL[size]}
            </button>
            <button className="cam-btn"><VolumeX size={10} /></button>
            <button className="cam-btn"><Maximize2 size={10} /></button>
          </div>
        </div>
        {selected && <div className="cam-selected-ring" />}
      </div>
    </div>
  )
}

export default function Monitoring({ user }) {
  const [cameras, setCameras] = useState([])
  const [selectedLayout, setSelectedLayout] = useState(2)
  const [selectedCam, setSelectedCam] = useState(null)
  const [muted, setMuted] = useState(true)
  const [listFilter, setListFilter] = useState('all')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const { monitorOrder, monitorSizes, setMonitorOrder, toggleCamera, setCameraSize, resetConfig } = useMonitorStore()

  const maxLevel = user?.max_security_level ?? 99

  useEffect(() => {
    cameraApi.getAll().then(data => {
      const accessible = data.filter(c => !c.security_level || c.security_level <= maxLevel)
      setCameras(accessible)
      if (!selectedCam) setSelectedCam(accessible[0])
    })
  }, [])

  const layout = GRID_LAYOUTS[selectedLayout]
  const camMap = Object.fromEntries(cameras.map(c => [c.id, c]))

  // 편성 목록: monitorOrder 순서대로 카메라 객체 조회
  const scheduledCams = monitorOrder.map(id => camMap[id]).filter(Boolean)

  // 카메라 목록: 편성되지 않은 카메라, 필터 적용
  const unscheduledCams = cameras.filter(c =>
    (listFilter === 'all' || c.status === listFilter) && !monitorOrder.includes(c.id)
  )

  // 그리드 표시 대상: 편성 목록이 있으면 편성 순서, 없으면 전체 슬라이스
  const displayCams = scheduledCams.length > 0
    ? scheduledCams
    : cameras.slice(0, layout.count)

  // 그리드 행 수 계산 (크기 스팬 고려)
  const totalColSpans = displayCams.reduce((s, c) => s + ((monitorSizes[c.id] || 1) >= 2 ? 2 : 1), 0)
  const rowCount = Math.max(Math.ceil(totalColSpans / layout.cols), 1)

  const handleCameraRegister = (data) => {
    cameraApi.add(data).then(newCam => {
      setCameras(prev => [...prev, newCam])
    })
  }

  // 드래그 앤 드롭 — 편성 목록 순서 변경
  const onDragStart = (e, id) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (e, id) => {
    e.preventDefault()
    if (id !== dragId) setDragOverId(id)
  }
  const onDrop = (e, id) => {
    e.preventDefault()
    if (dragId == null || dragId === id) { setDragId(null); setDragOverId(null); return }
    const order = [...monitorOrder]
    const from = order.indexOf(dragId)
    const to = order.indexOf(id)
    order.splice(from, 1)
    order.splice(to, 0, dragId)
    setMonitorOrder(order)
    setDragId(null)
    setDragOverId(null)
  }
  const onDragEnd = () => { setDragId(null); setDragOverId(null) }

  return (
    <div className="content" style={{ flexDirection: 'row', gap: 14, padding: '16px 18px', overflow: 'hidden' }}>
      {showRegisterModal && (
        <CameraRegisterModal
          user={user}
          onClose={() => setShowRegisterModal(false)}
          onSave={handleCameraRegister}
        />
      )}

      {/* ── 사이드바 ── */}
      <aside className="mon-sidebar" style={{ width: 230, minWidth: 230 }}>

        {/* 편성 목록 */}
        <div className="mon-section">
          <div className="section-header">
            <div className="section-title" style={{ fontSize: 11.5 }}>
              <Camera size={12} color="#00d4ff" />
              <span>편성 목록</span>
              <span className="section-badge">{monitorOrder.length}</span>
            </div>
            {monitorOrder.length > 0 && (
              <button className="text-btn" style={{ fontSize: 10 }} onClick={resetConfig}>초기화</button>
            )}
          </div>

          {monitorOrder.length === 0 ? (
            <div className="mon-empty-hint">
              아래 목록에서 + 버튼으로<br />카메라를 추가하세요
            </div>
          ) : (
            <div className="mon-lineup-list">
              {monitorOrder.map((id, idx) => {
                const cam = camMap[id]
                if (!cam) return null
                const sz = monitorSizes[id] || 1
                return (
                  <div
                    key={id}
                    className={`mon-lineup-item ${dragOverId === id ? 'drag-over' : ''} ${dragId === id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={e => onDragStart(e, id)}
                    onDragOver={e => onDragOver(e, id)}
                    onDrop={e => onDrop(e, id)}
                    onDragEnd={onDragEnd}
                    onClick={() => setSelectedCam(cam)}
                  >
                    <GripVertical size={11} color="#334155" style={{ flexShrink: 0, cursor: 'grab' }} />
                    <span className="mon-order-num">{idx + 1}</span>
                    <div className="mon-cam-dot" style={{ background: STATUS_COLOR[cam.status], flexShrink: 0 }} />
                    <span className="mon-lineup-name">{cam.name}</span>
                    <button
                      className="mon-size-cycle"
                      title="크기 변경"
                      onClick={e => { e.stopPropagation(); setCameraSize(id, SIZE_CYCLE[sz]) }}
                    >
                      {SIZE_LABEL[sz]}
                    </button>
                    <button
                      className="mon-remove-btn"
                      title="편성에서 제거"
                      onClick={e => { e.stopPropagation(); toggleCamera(id) }}
                    >
                      <Minus size={9} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mon-divider" />

        {/* 카메라 목록 */}
        <div className="mon-section" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="section-header">
            <div className="section-title" style={{ fontSize: 11.5 }}>
              <Camera size={12} color="#64748b" />
              <span>카메라 목록</span>
              <span className="section-badge">
                {cameras.filter(c => c.status === 'online').length}/{cameras.length}
              </span>
            </div>
            <button
              className="add-btn"
              style={{ padding: '3px 8px', fontSize: 10, gap: 4 }}
              onClick={() => setShowRegisterModal(true)}
            >
              <Plus size={10} /> 추가
            </button>
          </div>

          <div className="mon-filter-tabs">
            {[['all','전체'],['online','온라인'],['offline','오프라인']].map(([val, lbl]) => (
              <button key={val} className={`mon-filter-btn ${listFilter === val ? 'active' : ''}`}
                onClick={() => setListFilter(val)}>{lbl}</button>
            ))}
          </div>

          <div className="mon-cam-list">
            {unscheduledCams.map(cam => (
              <button
                key={cam.id}
                className={`mon-cam-item ${selectedCam?.id === cam.id ? 'active' : ''}`}
                onClick={() => setSelectedCam(cam)}
              >
                <div className="mon-cam-dot" style={{ background: STATUS_COLOR[cam.status] }} />
                <div className="mon-cam-info">
                  <span className="mon-cam-name">{cam.name}</span>
                  <span className="mon-cam-meta">
                    <span style={{ color: '#64748b' }}>{cam.location || '—'}</span>
                    {' · '}{cam.fps > 0 ? `${cam.fps}fps` : '—'}
                  </span>
                </div>
                {cam.alert && <AlertTriangle size={11} color="#ef4444" style={{ flexShrink: 0 }} />}
                <button
                  className="mon-add-cam-btn"
                  title="편성에 추가"
                  onClick={e => { e.stopPropagation(); toggleCamera(cam.id) }}
                >
                  <Plus size={11} />
                </button>
              </button>
            ))}
            {unscheduledCams.length === 0 && cameras.length > 0 && (
              <div style={{ padding: '12px 8px', textAlign: 'center', color: '#334155', fontSize: 11 }}>
                {listFilter === 'all' ? '모든 카메라가 편성됨' : '해당 카메라 없음'}
              </div>
            )}
          </div>
        </div>

        {/* 선택 카메라 정보 */}
        {selectedCam && (
          <div className="mon-cam-detail">
            <div className="mon-detail-title">카메라 정보</div>
            <div className="mon-detail-row"><span>IP</span><span className="mono">{selectedCam.ip}</span></div>
            <div className="mon-detail-row"><span>해상도</span><span>{selectedCam.resolution}</span></div>
            <div className="mon-detail-row"><span>FPS</span><span>{selectedCam.fps > 0 ? `${selectedCam.fps}fps` : '—'}</span></div>
            <div className="mon-detail-row">
              <span>위치</span>
              <span style={{ color: '#64748b' }}>{selectedCam.location || '—'}</span>
            </div>
            <div className="mon-detail-row"><span>상태</span>
              <span style={{ color: STATUS_COLOR[selectedCam.status] }}>{STATUS_LABEL[selectedCam.status]}</span>
            </div>
          </div>
        )}
      </aside>

      {/* ── 메인 그리드 + PTZ ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>

        {/* 툴바 */}
        <div className="mon-toolbar">
          <div className="section-title">
            <Camera size={14} color="#00d4ff" />
            <span>실시간 모니터링</span>
            {scheduledCams.length > 0 && (
              <span className="section-badge" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#10b981' }}>
                편성 {scheduledCams.length}채널
              </span>
            )}
            <div className="live-indicator" style={{ marginLeft: 4 }}>
              <span className="live-dot sm" /> LIVE
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="add-btn"
              style={{ padding: '5px 12px', fontSize: 11, gap: 5 }}
              onClick={() => setShowRegisterModal(true)}
            >
              <Plus size={11} /> 카메라 추가
            </button>
            <span style={{ fontSize: 11, color: '#475569' }}>열 수</span>
            <div className="grid-controls">
              {GRID_LAYOUTS.map((l, i) => (
                <button key={i} className={`grid-btn ${selectedLayout === i ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(i)}>{l.label}</button>
              ))}
            </div>
            <button className="icon-btn" style={{ width: 28, height: 28 }}>
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* 카메라 그리드 */}
        <div
          className="mon-grid"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${rowCount}, 1fr)`,
            gridAutoRows: '1fr',
            overflowY: 'auto',
          }}
        >
          {displayCams.map((cam, i) => (
            <CameraFeed
              key={cam.id}
              cam={cam}
              index={i}
              selected={selectedCam?.id === cam.id}
              size={monitorSizes[cam.id] || 1}
              onSizeToggle={() => setCameraSize(cam.id, SIZE_CYCLE[monitorSizes[cam.id] || 1])}
              onClick={() => setSelectedCam(cam)}
            />
          ))}
          {displayCams.length === 0 && (
            <div style={{
              gridColumn: `span ${layout.cols}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, color: '#334155',
            }}>
              <Camera size={36} color="#1e293b" />
              <span style={{ fontSize: 13 }}>편성된 카메라가 없습니다</span>
              <span style={{ fontSize: 11 }}>왼쪽 목록에서 + 버튼으로 카메라를 추가하세요</span>
            </div>
          )}
        </div>

        {/* PTZ 컨트롤 */}
        <div className="mon-controls-bar">
          <div className="mon-ptz">
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 6, letterSpacing: 1 }}>PTZ 제어</div>
            <div className="ptz-grid">
              <div />
              <button className="ptz-btn"><ChevronUp size={14} /></button>
              <div />
              <button className="ptz-btn"><ChevronLeft size={14} /></button>
              <button className="ptz-btn home"><Move size={12} /></button>
              <button className="ptz-btn"><ChevronRight size={14} /></button>
              <div />
              <button className="ptz-btn"><ChevronDown size={14} /></button>
              <div />
            </div>
          </div>
          <div className="mon-zoom">
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 6, letterSpacing: 1 }}>줌</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="ptz-btn"><ZoomIn size={14} /></button>
              <button className="ptz-btn"><ZoomOut size={14} /></button>
              <button className="ptz-btn"><RotateCcw size={14} /></button>
            </div>
          </div>
          <div className="mon-audio">
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 6, letterSpacing: 1 }}>오디오</div>
            <button className={`ptz-btn ${!muted ? 'active-btn' : ''}`} onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
          <div className="mon-cam-status-info">
            {selectedCam && (
              <>
                <div style={{ fontSize: 11, color: '#00d4ff', fontWeight: 600 }}>{selectedCam.name}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>
                  {selectedCam.location || '—'}{' · '}{selectedCam.ip}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {selectedCam.persons > 0 && (
                    <span style={{ fontSize: 10, color: '#00d4ff', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Users size={10} /> {selectedCam.persons}명 감지
                    </span>
                  )}
                  {selectedCam.plate && (
                    <span style={{ fontSize: 10, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Car size={10} /> {selectedCam.plate}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
