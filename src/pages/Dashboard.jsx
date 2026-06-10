import { useState, useEffect } from 'react'
import {
  Camera, Users, Car, AlertTriangle, BarChart3,
  Activity, TrendingUp, TrendingDown, VolumeX, Maximize2,
  ChevronRight, LogIn, LogOut, Shield,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { cameraApi, eventApi, vehicleApi, analysisApi } from '../api'

const gradients = [
  'linear-gradient(135deg, #0a1628 0%, #0d2040 50%, #091520 100%)',
  'linear-gradient(135deg, #0a1a14 0%, #0d2a20 50%, #091510 100%)',
  'linear-gradient(135deg, #1a1208 0%, #2a1e0d 50%, #150e05 100%)',
  'linear-gradient(135deg, #12080a 0%, #200d12 50%, #100609 100%)',
  'linear-gradient(135deg, #080a1a 0%, #0d1028 50%, #060812 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)',
]


function CameraFeed({ cam, index }) {
  return (
    <div className="cam-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="cam-feed" style={{ background: gradients[index % gradients.length] }}>
        <div className="scanline" />
        <div className="cam-grid" />
        <div className="cam-top">
          <span className="cam-name">{cam.name}</span>
          <span className="live-badge"><span className="live-dot" /> LIVE</span>
        </div>
        {cam.persons > 0 && (
          <div className="bbox bbox-person" style={{ top: '25%', left: '15%', width: '30%', height: '45%' }}>
            <div className="bbox-label" style={{ color: cam.color }}>
              <Users size={8} /> {cam.persons}명
            </div>
          </div>
        )}
        {cam.plate && (
          <div className="bbox bbox-vehicle" style={{ bottom: '18%', right: '8%', width: '42%', height: '28%' }}>
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
          <span className="cam-time">
            {cam.location || '—'} · {new Date().toLocaleTimeString('ko-KR', { hour12: false }).slice(0, 5)}
          </span>
          <div className="cam-controls">
            <button className="cam-btn"><VolumeX size={10} /></button>
            <button className="cam-btn"><Maximize2 size={10} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, value, label, color, trend }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={18} color={color} />
      </div>
      <div className="kpi-body">
        <div className="kpi-value" style={{ color }}>{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
      {trend !== undefined && (
        <div className="kpi-trend" style={{ color: trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#64748b' }}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : null}
          <span>{trend !== 0 ? `${Math.abs(trend)}%` : '—'}</span>
        </div>
      )}
    </div>
  )
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(10,16,32,0.95)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
      <div style={{ color: '#64748b' }}>{label}</div>
      <div style={{ color: '#00d4ff', fontFamily: 'Share Tech Mono' }}>{payload[0].value}명</div>
    </div>
  )
}

const LAYOUTS = [
  { label: '2×3', cols: 3, count: 6  },
  { label: '3×3', cols: 3, count: 9  },
  { label: '4×4', cols: 4, count: 16 },
]

export default function Dashboard({ user }) {
  const [cameras, setCameras] = useState([])
  const [events, setEvents] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [personData, setPersonData] = useState([])
  const [newEvents, setNewEvents] = useState([])
  const [layoutIdx, setLayoutIdx] = useState(0)

  // 개인/관리자는 전체(99), 기업 사원은 max_security_level 기준으로 접근 제한
  const maxLevel = user?.max_security_level ?? 99

  useEffect(() => {
    cameraApi.getAll().then(setCameras)
    eventApi.getAll().then(setEvents)
    vehicleApi.getAll().then(setVehicles)
    analysisApi.getPersonData().then(setPersonData)
  }, [])

  useEffect(() => {
    const types = [
      { color: '#00d4ff', label: '움직임 감지',   camera: '로비 A' },
      { color: '#10b981', label: '차량 진입',     camera: '정문 입구 01' },
      { color: '#f59e0b', label: '순찰 구역 확인', camera: '서버룸' },
    ]
    const interval = setInterval(() => {
      const t = types[Math.floor(Math.random() * types.length)]
      setNewEvents(prev => [{ ...t, id: Date.now(), time: new Date().toLocaleTimeString('ko-KR', { hour12: false }) }, ...prev].slice(0, 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // 보안 레벨 기준 접근 가능 카메라 필터링
  const accessibleCameras = cameras
    .filter(c => !c.security_level || c.security_level <= maxLevel)
    .sort((a, b) => a.name.localeCompare(b.name))

  const layout = LAYOUTS[layoutIdx]
  const displayCameras = accessibleCameras.slice(0, layout.count)
  const onlineCnt = accessibleCameras.filter(c => c.status === 'online').length
  const totalPersons = accessibleCameras.reduce((s, c) => s + (c.persons || 0), 0)
  const alertVehicles = vehicles.filter(v => v.isBlacklist).length
  const feedList = [...newEvents, ...events].slice(0, 10)

  return (
    <div className="content">
      <div className="kpi-row">
        <KpiCard icon={Camera}        value={`${onlineCnt} / ${accessibleCameras.length}`} label="활성 카메라"      color="#00d4ff" trend={0} />
        <KpiCard icon={Users}         value={`${totalPersons}명`}                           label="실시간 인원"      color="#10b981" trend={12} />
        <KpiCard icon={Car}           value="218건"                                         label="금일 차량 입출차"  color="#f59e0b" trend={5} />
        <KpiCard icon={AlertTriangle} value={`${alertVehicles}건`}                          label="번호판 인식 알림"  color="#ef4444" trend={-2} />
      </div>

      <div className="mid-row">
        <section className="cam-section">
          <div className="section-header">
            <div className="section-title">
              <Camera size={14} color="#00d4ff" />
              <span>실시간 CCTV 모니터링</span>
              <span className="section-badge">
                {displayCameras.length} / {accessibleCameras.length} 채널
              </span>
            </div>
            <div className="grid-controls">
              {LAYOUTS.map((l, i) => (
                <button
                  key={l.label}
                  className={`grid-btn ${layoutIdx === i ? 'active' : ''}`}
                  onClick={() => setLayoutIdx(i)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="cam-grid-layout" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
            {displayCameras.map((cam, i) => <CameraFeed key={cam.id} cam={cam} index={i} />)}
          </div>
        </section>

        <aside className="feed-panel">
          <div className="section-header">
            <div className="section-title">
              <Activity size={14} color="#10b981" />
              <span>실시간 활동 피드</span>
            </div>
            <div className="live-indicator"><span className="live-dot sm" /> LIVE</div>
          </div>
          <div className="feed-list">
            {feedList.map((ev, i) => (
              <div key={ev.id ?? i} className="feed-item" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="feed-icon" style={{ background: `${ev.color}15`, border: `1px solid ${ev.color}30` }}>
                  {ev.type === 'vehicle' ? <Car size={12} color={ev.color} />
                    : ev.type === 'alert'   ? <AlertTriangle size={12} color={ev.color} />
                    : ev.type === 'shield'  ? <Shield size={12} color={ev.color} />
                    : <Users size={12} color={ev.color} />}
                </div>
                <div className="feed-body">
                  <div className="feed-label">{ev.label}</div>
                  <div className="feed-meta">
                    <Camera size={9} color="#64748b" /><span>{ev.camera}</span>
                  </div>
                </div>
                <span className="feed-time">{ev.time}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="bottom-row">
        <section className="chart-section">
          <div className="section-header">
            <div className="section-title">
              <BarChart3 size={14} color="#8b5cf6" />
              <span>현장 인원 추이</span>
            </div>
            <span className="section-badge green">오늘</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={personData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="personGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2}
                  fill="url(#personGrad)" dot={false}
                  activeDot={{ r: 4, fill: '#00d4ff', stroke: '#0a0e1a', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="table-section">
          <div className="section-header">
            <div className="section-title">
              <Car size={14} color="#f59e0b" />
              <span>최근 차량 출입 기록</span>
            </div>
            <button className="text-btn">전체 보기 <ChevronRight size={11} /></button>
          </div>
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>시간</th><th>카메라</th><th>차량 번호</th><th>상태</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.slice(0, 5).map((v, i) => (
                <tr key={i}>
                  <td className="mono">{v.time}</td>
                  <td>{v.camera}</td>
                  <td className="plate">{v.plate}</td>
                  <td>
                    <span className={`status-badge ${v.status}`}>
                      {v.status === 'entrance' && <><LogIn size={9} /> 입차</>}
                      {v.status === 'exit'     && <><LogOut size={9} /> 출차</>}
                      {v.status === 'alert'    && <><AlertTriangle size={9} /> 알림</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
