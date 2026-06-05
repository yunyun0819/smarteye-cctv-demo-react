import { useState, useEffect } from 'react'
import {
  Camera, Users, Car, AlertTriangle, VolumeX, Volume2,
  Maximize2, RotateCcw, ZoomIn, ZoomOut, Move,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Wifi, WifiOff, Settings, RefreshCw, Plus,
} from 'lucide-react'
import { cameraApi } from '../api'
import CameraRegisterModal from '../components/CameraRegisterModal'

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
  { label: '1×1', cols: 1, count: 1  },
  { label: '2×2', cols: 2, count: 4  },
  { label: '2×3', cols: 3, count: 6  },
  { label: '3×3', cols: 3, count: 9  },
  { label: '4×4', cols: 4, count: 16 },
]

const statusColor = { online: '#10b981', offline: '#ef4444', maintenance: '#f59e0b' }
const statusLabel = { online: '온라인', offline: '오프라인', maintenance: '점검 중' }

function CameraFeed({ cam, index, selected, onClick }) {
  const now = new Date().toLocaleTimeString('ko-KR', { hour12: false }).slice(0, 5)
  return (
    <div
      className={`mon-cam-card ${selected ? 'selected' : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
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
            : <span className="live-badge" style={{ color: statusColor[cam.status], background: `${statusColor[cam.status]}15`, borderColor: `${statusColor[cam.status]}30` }}>
                {statusLabel[cam.status]}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="cam-time">{cam.zone} · {now}</span>
          </div>
          <div className="cam-controls">
            <button className="cam-btn"><VolumeX size={10} /></button>
            <button className="cam-btn"><Maximize2 size={10} /></button>
          </div>
        </div>
        {selected && <div className="cam-selected-ring" />}
      </div>
    </div>
  )
}

export default function Monitoring() {
  const [cameras, setCameras] = useState([])
  const [selectedLayout, setSelectedLayout] = useState(2)
  const [selectedCam, setSelectedCam] = useState(null)
  const [muted, setMuted] = useState(true)
  const [listFilter, setListFilter] = useState('all')
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  useEffect(() => {
    cameraApi.getAll().then(data => {
      setCameras(data)
      setSelectedCam(data[0])
    })
  }, [])

  const layout = GRID_LAYOUTS[selectedLayout]
  const displayCams = cameras.slice(0, layout.count)
  const emptySlots = Math.max(0, layout.count - displayCams.length)

  const handleCameraRegister = (data) => {
    cameraApi.add(data).then(newCam => {
      setCameras(prev => [...prev, newCam])
      setSelectedCam(newCam)
    })
  }

  const filteredList = listFilter === 'all'
    ? cameras
    : cameras.filter(c => c.status === listFilter)

  return (
    <div className="content" style={{ flexDirection: 'row', gap: 14, padding: '16px 18px', overflow: 'hidden' }}>
      {showRegisterModal && (
        <CameraRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSave={handleCameraRegister}
        />
      )}
      {/* 카메라 목록 사이드 */}
      <aside className="mon-sidebar">
        <div className="section-header" style={{ marginBottom: 10 }}>
          <div className="section-title">
            <Camera size={14} color="#00d4ff" />
            <span>카메라 목록</span>
          </div>
          <span className="section-badge">{cameras.filter(c => c.status === 'online').length}/{cameras.length}</span>
        </div>

        <div className="mon-filter-tabs">
          {[['all','전체'],['online','온라인'],['offline','오프라인']].map(([val, lbl]) => (
            <button key={val} className={`mon-filter-btn ${listFilter === val ? 'active' : ''}`}
              onClick={() => setListFilter(val)}>{lbl}</button>
          ))}
        </div>

        <div className="mon-cam-list">
          {filteredList.map(cam => (
            <button
              key={cam.id}
              className={`mon-cam-item ${selectedCam?.id === cam.id ? 'active' : ''}`}
              onClick={() => setSelectedCam(cam)}
            >
              <div className="mon-cam-dot" style={{ background: statusColor[cam.status] }} />
              <div className="mon-cam-info">
                <span className="mon-cam-name">{cam.name}</span>
                <span className="mon-cam-meta">{cam.zone} · {cam.fps > 0 ? `${cam.fps}fps` : '—'}</span>
              </div>
              {cam.alert && <AlertTriangle size={12} color="#ef4444" />}
              {cam.persons > 0 && (
                <span className="mon-person-badge">{cam.persons}</span>
              )}
            </button>
          ))}
        </div>

        {/* 선택된 카메라 정보 */}
        {selectedCam && (
          <div className="mon-cam-detail">
            <div className="mon-detail-title">카메라 정보</div>
            <div className="mon-detail-row"><span>IP</span><span className="mono">{selectedCam.ip}</span></div>
            <div className="mon-detail-row"><span>해상도</span><span>{selectedCam.resolution}</span></div>
            <div className="mon-detail-row"><span>FPS</span><span>{selectedCam.fps > 0 ? `${selectedCam.fps}fps` : '—'}</span></div>
            <div className="mon-detail-row"><span>상태</span>
              <span style={{ color: statusColor[selectedCam.status] }}>{statusLabel[selectedCam.status]}</span>
            </div>
          </div>
        )}
      </aside>

      {/* 메인 그리드 + PTZ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        {/* 레이아웃 선택 */}
        <div className="mon-toolbar">
          <div className="section-title">
            <Camera size={14} color="#00d4ff" />
            <span>실시간 모니터링</span>
            <div className="live-indicator" style={{ marginLeft: 4 }}>
              <span className="live-dot sm" /> LIVE
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#475569' }}>레이아웃</span>
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
        <div className="mon-grid" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
          {displayCams.map((cam, i) => (
            <CameraFeed key={cam.id} cam={cam} index={i}
              selected={selectedCam?.id === cam.id}
              onClick={() => setSelectedCam(cam)} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={() => setShowRegisterModal(true)}
              style={{
                background: 'rgba(0,212,255,0.03)',
                border: '1px dashed rgba(0,212,255,0.15)',
                borderRadius: 10, cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, color: '#334155',
                transition: 'all 0.2s', minHeight: 80,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'
                e.currentTarget.style.background = 'rgba(0,212,255,0.06)'
                e.currentTarget.style.color = '#00d4ff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'
                e.currentTarget.style.background = 'rgba(0,212,255,0.03)'
                e.currentTarget.style.color = '#334155'
              }}
            >
              <Plus size={20} />
              <span style={{ fontSize: 11 }}>카메라 추가</span>
            </button>
          ))}
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
                <div style={{ fontSize: 10, color: '#475569' }}>{selectedCam.zone} · {selectedCam.ip}</div>
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
