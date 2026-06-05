import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Eye, LayoutDashboard, Monitor, Brain, FileText,
  Car, Settings, BarChart3, Bell, Search, User,
  Wifi, LogOut, Building2, ChevronDown, Lock,
} from 'lucide-react'
import './App.css'

import { logout } from './api/Auth'
import Landing           from './pages/Landing'
import Login             from './pages/Login'
import Dashboard         from './pages/Dashboard'
import Monitoring        from './pages/Monitoring'
import AIAnalysis        from './pages/AIAnalysis'
import EventLog          from './pages/EventLog'
import VehicleManagement from './pages/VehicleManagement'
import SettingsPage      from './pages/Settings'
import Reports           from './pages/Reports'
import MyPage            from './pages/MyPage'
import AdminPage         from './pages/Admin'

// 요금제 순서: Basic < Pro < Enterprise
const TIER_ORDER = { Basic: 0, Pro: 1, Enterprise: 2 }

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: '대시보드',       title: '시스템 현황 대시보드', Page: Dashboard,         minTier: 'Basic'      },
  { icon: Monitor,         label: '실시간 모니터링', title: '실시간 CCTV 모니터링', Page: Monitoring,        minTier: 'Basic'      },
  { icon: Brain,           label: 'AI 영상 분석',   title: 'AI 영상 분석',         Page: AIAnalysis,        minTier: 'Pro'        },
  { icon: FileText,        label: '이벤트 로그',    title: '이벤트 로그',           Page: EventLog,          minTier: 'Basic'      },
  { icon: Car,             label: '차량 통합 관리', title: '차량 통합 관리',        Page: VehicleManagement, minTier: 'Basic'      },
  { icon: Settings,        label: '시스템 설정',    title: '시스템 설정',           Page: SettingsPage,      minTier: 'Pro'        },
  { icon: BarChart3,       label: '통계 리포트',    title: '통계 리포트',           Page: Reports,           minTier: 'Pro'        },
]

export default function App() {
  // view: 'landing' | 'login' | 'app' | 'admin'
  const [view, setView]         = useState('landing')
  const [user, setUser]         = useState(null)
  const [activeNav, setActiveNav] = useState(0)
  const [showMyPage, setShowMyPage] = useState(false)
  const [time, setTime]         = useState(new Date())
  const [search, setSearch]     = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })
  const userMenuRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.isAdmin) {
      setView('admin')
    } else {
      setView('app')
      setActiveNav(0)
      setShowMyPage(false)
    }
  }

  const handleLogout = async () => {
    try { await logout() } catch { /* 서버 오류여도 클라이언트 로그아웃 진행 */ }
    localStorage.removeItem('tokens')
    setUser(null)
    setView('landing')
    setShowUserMenu(false)
    setActiveNav(0)
    setShowMyPage(false)
  }

  const handleNavClick = (i) => {
    const item = NAV_ITEMS[i]
    if (user && TIER_ORDER[user.tier] < TIER_ORDER[item.minTier]) return
    setActiveNav(i)
    setShowMyPage(false)
  }

  const isNavLocked = (i) => !!user && TIER_ORDER[user.tier] < TIER_ORDER[NAV_ITEMS[i]?.minTier || 'Basic']

  // 현재 activeNav가 잠긴 기능이면 대시보드(0)로 폴백
  const effectiveNav = isNavLocked(activeNav) ? 0 : activeNav

  const handleMyPageClick = () => {
    setShowMyPage(true)
    setShowUserMenu(false)
  }

  if (view === 'landing') {
    return <Landing onGoToLogin={() => setView('login')} />
  }

  if (view === 'login') {
    return <Login onLogin={handleLogin} onBack={() => setView('landing')} />
  }

  if (view === 'admin') {
    return <AdminPage user={user} onLogout={handleLogout} />
  }

  // ── 메인 앱 ──
  const fmtDate = time.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
  const fmtTime = time.toLocaleTimeString('ko-KR', { hour12: false })
  const pageTitle = showMyPage ? '마이페이지' : NAV_ITEMS[effectiveNav].title
  const PageComponent = showMyPage ? null : NAV_ITEMS[effectiveNav].Page

  return (
    <div className="app">
      {/* ── 사이드바 ── */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Eye size={22} color="#00d4ff" />
            <div className="logo-ring" />
          </div>
          <div className="logo-text">
            <span className="logo-main">SmartEye</span>
            <span className="logo-sub">CCTV Platform</span>
          </div>
        </div>

        <div className="nav-section-label">메인 메뉴</div>
        <nav className="nav">
          {NAV_ITEMS.map((item, i) => {
            const locked = isNavLocked(i)
            const isActive = !showMyPage && effectiveNav === i
            return (
              <button
                key={i}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(i)}
                title={locked ? `${item.minTier} 플랜 이상 사용 가능` : item.label}
                style={{ opacity: locked ? 0.4 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {locked
                  ? <Lock size={10} color="#334155" style={{ marginLeft: 'auto' }} />
                  : isActive && <div className="nav-indicator" />
                }
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '8px 8px 0', borderTop: '1px solid var(--border)' }}>
          <div className="nav-section-label" style={{ paddingTop: 10 }}>계정</div>
          <button
            className={`nav-item ${showMyPage ? 'active' : ''}`}
            onClick={handleMyPageClick}
          >
            <Building2 size={16} />
            <span>마이페이지</span>
            {showMyPage && <div className="nav-indicator" />}
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="status-indicator" style={{ cursor: 'default' }}>
            <div className="status-dot" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="status-text" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.company}
              </div>
              <div className="status-sub">{user?.tier} 플랜 · {user?.name}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── 메인 영역 ── */}
      <main className="main">
        <header className="header">
          <div className="header-left">
            <div className="page-title">{pageTitle}</div>
            <div className="header-time">
              <span className="date-str">{fmtDate}</span>
              <span className="time-str">{fmtTime}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="search-box">
              <Search size={13} color="#64748b" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="카메라, 번호판 검색…"
              />
            </div>
            <button className="icon-btn notif">
              <Bell size={16} />
              <span className="badge">3</span>
            </button>
            <button className="icon-btn">
              <Wifi size={14} color="#10b981" />
            </button>

            {/* 사용자 메뉴 */}
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                className="user-menu-btn"
                onClick={() => {
                  if (!showUserMenu && userMenuRef.current) {
                    const rect = userMenuRef.current.getBoundingClientRect()
                    setDropdownPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
                  }
                  setShowUserMenu(v => !v)
                }}
              >
                <div className="avatar" style={{ width: 28, height: 28 }}>
                  <User size={13} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                  <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>{user?.name}</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>{user?.role}</span>
                </div>
                <ChevronDown size={12} color="#475569" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showUserMenu && createPortal(
                <div className="user-dropdown" style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right, left: 'auto', zIndex: 9999 }}>
                  <div className="user-dropdown-header">
                    <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{user?.company}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{user?.email}</div>
                  </div>
                  <button className="user-dropdown-item" onClick={handleMyPageClick}>
                    <Building2 size={13} /> 마이페이지
                  </button>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={13} /> 로그아웃
                  </button>
                </div>,
                document.body
              )}
            </div>
          </div>
        </header>

        {showMyPage
          ? <MyPage user={user} />
          : <PageComponent user={user} />
        }
      </main>

      {/* 드롭다운 외부 클릭 닫기 */}
      {showUserMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setShowUserMenu(false)} />
      )}
    </div>
  )
}
