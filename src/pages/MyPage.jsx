import { useState, useEffect } from 'react'
import {
  Building2, Camera, Users, Shield, CreditCard,
  Edit3, Save, BarChart3, Activity, TrendingUp,
  Monitor, History, Lock, MapPin,
} from 'lucide-react'
import { cameraApi, userApi } from '../api'

const TIER_CONFIG = {
  Basic:      { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', maxCam: 8 },
  Pro:        { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.3)',   maxCam: 32 },
  Enterprise: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)',  maxCam: Infinity },
}

const ROLE_CONFIG = {
  '관리자': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', desc: '전체 시스템 접근 권한' },
  '운영자': { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)',  border: 'rgba(0,212,255,0.3)',  desc: '지정 구역 카메라 관리' },
  '뷰어':   { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', desc: '읽기 전용 접근' },
}

const PERMISSIONS = {
  '관리자': [
    { label: '카메라 영상 조회', allowed: true },
    { label: '이벤트 로그 조회', allowed: true },
    { label: '카메라 설정 변경', allowed: true },
    { label: 'AI 분석 설정',    allowed: true },
    { label: '사용자 관리',     allowed: true },
    { label: '시스템 설정',     allowed: true },
  ],
  '운영자': [
    { label: '카메라 영상 조회', allowed: true },
    { label: '이벤트 로그 조회', allowed: true },
    { label: '카메라 설정 변경', allowed: true },
    { label: 'AI 분석 설정',    allowed: true },
    { label: '사용자 관리',     allowed: false },
    { label: '시스템 설정',     allowed: false },
  ],
  '뷰어': [
    { label: '카메라 영상 조회', allowed: true },
    { label: '이벤트 로그 조회', allowed: true },
    { label: '카메라 설정 변경', allowed: false },
    { label: 'AI 분석 설정',    allowed: false },
    { label: '사용자 관리',     allowed: false },
    { label: '시스템 설정',     allowed: false },
  ],
}

const LOGIN_HISTORY = [
  { date: '2026-06-05 09:14', browser: 'Chrome 124', os: 'Windows 11', location: '서울 강남구', current: true },
  { date: '2026-06-04 18:30', browser: 'Chrome 124', os: 'Windows 11', location: '서울 강남구' },
  { date: '2026-06-03 08:55', browser: 'Safari 17',  os: 'macOS 14',   location: '서울 강남구' },
  { date: '2026-06-01 14:22', browser: 'Chrome 124', os: 'Windows 11', location: '서울 강남구' },
  { date: '2026-05-30 09:01', browser: 'Edge 124',   os: 'Windows 11', location: '서울 강남구' },
]

function InfoCard({ title, icon: Icon, color, children }) {
  return (
    <section className="cam-section">
      <div className="section-header">
        <div className="section-title">
          <Icon size={14} color={color} /><span>{title}</span>
        </div>
      </div>
      {children}
    </section>
  )
}

function UsageBar({ used, max, color }) {
  const pct = max === Infinity ? 30 : Math.min((used / max) * 100, 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, boxShadow: `0 0 8px ${color}50`, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color, minWidth: 60 }}>
        {used} / {max === Infinity ? '∞' : max}
      </span>
    </div>
  )
}

export default function MyPage({ user }) {
  const [cameras, setCameras]   = useState([])
  const [users, setUsers]       = useState([])
  const [editMode, setEditMode] = useState(false)
  const [companyName, setCompanyName] = useState(user?.company || '')

  const tier     = TIER_CONFIG[user?.tier] || TIER_CONFIG.Basic
  const roleConf = ROLE_CONFIG[user?.role] || ROLE_CONFIG['뷰어']
  const perms    = PERMISSIONS[user?.role] || PERMISSIONS['뷰어']

  useEffect(() => {
    cameraApi.getAll().then(setCameras)
    userApi.getAll().then(setUsers)
  }, [])

  const onlineCnt  = cameras.filter(c => c.status === 'online').length
  const maxCameras = user?.cameras === -1 ? Infinity : (user?.cameras || 8)
  const maxLevel   = user?.max_security_level ?? 99

  return (
    <div className="content">
      {/* 상단 프로필 배너 */}
      <div className="mypage-banner">
        <div className="mypage-banner-bg" />
        <div className="mypage-avatar-wrap">
          <div className="mypage-avatar">
            <Building2 size={28} color="#00d4ff" />
          </div>
          <div>
            {editMode ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="net-input" style={{ width: 240 }} value={companyName}
                  onChange={e => setCompanyName(e.target.value)} />
                <button className="add-btn" onClick={() => setEditMode(false)}><Save size={12} /></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 className="mypage-company">{companyName}</h2>
                <button className="cam-btn" style={{ width: 24, height: 24 }} onClick={() => setEditMode(true)}>
                  <Edit3 size={11} />
                </button>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{user?.name} ({user?.role})</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>·</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, padding: '5px 14px', borderRadius: 20, background: tier.bg, border: `1px solid ${tier.border}`, color: tier.color, fontWeight: 600 }}>
            {user?.tier} 플랜
          </span>
          <span style={{ fontSize: 11, color: '#475569' }}>2026-12-31 만료</span>
        </div>
      </div>

      {/* 사용 현황 KPI */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <Camera size={18} color="#00d4ff" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#00d4ff' }}>{onlineCnt} / {maxCameras === Infinity ? '∞' : maxCameras}</div>
            <div className="kpi-label">카메라 사용 현황</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Users size={18} color="#10b981" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#10b981' }}>{users.length}명</div>
            <div className="kpi-label">등록 사용자</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Activity size={18} color="#8b5cf6" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#8b5cf6' }}>1,247건</div>
            <div className="kpi-label">이번 달 이벤트</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <BarChart3 size={18} color="#f59e0b" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#f59e0b' }}>98.7%</div>
            <div className="kpi-label">시스템 가동률</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* 구독 현황 */}
        <InfoCard title="구독 현황" icon={CreditCard} color="#f59e0b">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: tier.bg, border: `1px solid ${tier.border}`, borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: tier.color, fontFamily: 'Rajdhani' }}>{user?.tier} 플랜</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>2026-12-31 만료</div>
              </div>
              <button className="add-btn" style={{ borderColor: tier.color, color: tier.color, background: tier.bg }}>
                업그레이드
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 6 }}>
                  <span><Camera size={10} /> 카메라 사용량</span>
                  <TrendingUp size={11} color="#10b981" />
                </div>
                <UsageBar used={user?.cameraUsed || 0} max={maxCameras} color="#00d4ff" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>
                  <Users size={10} /> 사용자 계정
                </div>
                <UsageBar
                  used={users.length}
                  max={user?.tier === 'Enterprise' ? Infinity : user?.tier === 'Pro' ? 10 : 3}
                  color="#10b981"
                />
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#334155', textAlign: 'center' }}>
              카메라 추가 구매 문의: contact@smarteye.kr
            </div>
          </div>
        </InfoCard>

        {/* 내 권한 및 보안 레벨 */}
        <InfoCard title="내 권한 및 보안 레벨" icon={Shield} color="#8b5cf6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: roleConf.bg, border: `1px solid ${roleConf.border}`, borderRadius: 8 }}>
              <Shield size={18} color={roleConf.color} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: roleConf.color, fontFamily: 'Rajdhani' }}>{user?.role}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{roleConf.desc}</div>
              </div>
            </div>

            {maxLevel !== 99 && (
              <div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Shield size={10} /> 카메라 접근 보안 레벨
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3].map(lv => {
                    const active = lv <= maxLevel
                    const color = lv === 3 ? '#ef4444' : lv === 2 ? '#f59e0b' : '#10b981'
                    return (
                      <span key={lv} style={{ padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: active ? 700 : 400, background: active ? `${color}15` : 'rgba(255,255,255,0.02)', border: `1px solid ${active ? color : '#1e2d3d'}`, color: active ? color : '#334155' }}>
                        Lv.{lv}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Lock size={10} /> 부여된 권한
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {perms.map(p => (
                  <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.allowed ? '#10b981' : '#334155', flexShrink: 0 }} />
                    <span style={{ color: p.allowed ? '#94a3b8' : '#334155' }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* 최근 로그인 이력 */}
      <InfoCard title="최근 로그인 이력" icon={History} color="#00d4ff">
        <table className="vehicle-table">
          <thead>
            <tr><th>일시</th><th>브라우저</th><th>운영체제</th><th>접속 위치</th><th>상태</th></tr>
          </thead>
          <tbody>
            {LOGIN_HISTORY.map((log, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 11 }}>{log.date}</td>
                <td style={{ fontSize: 11, color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Monitor size={10} color="#475569" /> {log.browser}
                  </span>
                </td>
                <td style={{ fontSize: 11, color: '#94a3b8' }}>{log.os}</td>
                <td style={{ fontSize: 11, color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={10} color="#475569" /> {log.location}
                  </span>
                </td>
                <td>
                  {log.current
                    ? <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 5, color: '#10b981' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />현재 세션
                      </span>
                    : <span style={{ fontSize: 10, color: '#334155' }}>종료됨</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>

      {/* 카메라 현황 요약 */}
      <InfoCard title="연결된 카메라 현황" icon={Camera} color="#00d4ff">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {cameras.slice(0, maxCameras === Infinity ? cameras.length : Math.min(maxCameras, cameras.length)).map(cam => (
            <div key={cam.id} style={{
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${cam.status === 'online' ? 'rgba(16,185,129,0.2)' : cam.status === 'offline' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
              borderRadius: 7,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 500 }}>{cam.name}</span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: cam.status === 'online' ? '#10b981' : cam.status === 'offline' ? '#ef4444' : '#f59e0b' }} />
              </div>
              <div style={{ fontSize: 10, color: '#475569' }}>{cam.location || '—'} · {cam.resolution}</div>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  )
}
