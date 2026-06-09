import { useState, useEffect } from 'react'
import {
  Shield, Users, Key, Activity, Clock,
  Search, Plus, Trash2, LogOut, Lock, Unlock,
  CheckCircle, XCircle, AlertTriangle,
  Monitor, MapPin, ChevronDown, Save, X,
  UserPlus, ShieldAlert, Mail, Building2,
} from 'lucide-react'

// ── Mock Data ──────────────────────────────────────────────────
const ZONES = ['ZONE-A', 'ZONE-B', 'ZONE-C', 'ZONE-D', 'ZONE-E']

const INIT_USERS = [
  { id: 1, name: '김관리자',  email: 'demo@company.com',     role: '관리자', tier: 'Pro',        status: 'online',  lastLogin: '2026-06-05 14:30', joinDate: '2025-01-15', zones: ['ZONE-A','ZONE-B','ZONE-C','ZONE-D','ZONE-E'], failedLogins: 0, locked: false, company: '스마트 물류 주식회사' },
  { id: 2, name: '이공장장',  email: 'admin@factory.kr',     role: '관리자', tier: 'Enterprise', status: 'online',  lastLogin: '2026-06-05 11:45', joinDate: '2024-12-01', zones: ['ZONE-A','ZONE-B','ZONE-C','ZONE-D','ZONE-E'], failedLogins: 0, locked: false, company: '한국 공장 관리' },
  { id: 3, name: '박테스트',  email: 'test@test.com',        role: '운영자', tier: 'Basic',      status: 'offline', lastLogin: '2026-06-03 16:20', joinDate: '2026-01-10', zones: ['ZONE-A','ZONE-B'],                        failedLogins: 0, locked: false, company: '개인' },
  { id: 4, name: '최보안',    email: 'security@smarteye.kr', role: '운영자', tier: 'Pro',        status: 'offline', lastLogin: '2026-05-28 10:30', joinDate: '2025-08-01', zones: ['ZONE-C','ZONE-D'],                        failedLogins: 0, locked: false, company: 'SmartEye' },
  { id: 5, name: '정경비',    email: 'guard@smarteye.kr',    role: '뷰어',   tier: 'Basic',      status: 'offline', lastLogin: '2026-05-20 08:15', joinDate: '2025-11-30', zones: ['ZONE-A'],                                 failedLogins: 3, locked: true,  company: 'SmartEye' },
  { id: 6, name: '이경비',    email: 'ops@smarteye.kr',      role: '운영자', tier: 'Pro',        status: 'online',  lastLogin: '2026-06-05 09:15', joinDate: '2025-03-22', zones: ['ZONE-A','ZONE-B','ZONE-C'],               failedLogins: 0, locked: false, company: '스마트 물류 주식회사' },
  { id: 7, name: '박모니터',  email: 'monitor@smarteye.kr',  role: '뷰어',   tier: 'Pro',        status: 'offline', lastLogin: '2026-06-04 18:00', joinDate: '2025-06-10', zones: ['ZONE-A','ZONE-B'],                        failedLogins: 1, locked: false, company: '스마트 물류 주식회사' },
]

const LOGIN_HISTORY_DATA = [
  { id: 1,  user: '김관리자',  date: '2026-06-05 14:30', browser: 'Chrome 124',  os: 'Windows 11', ip: '211.234.123.45', location: '서울 강남구', result: 'success'    },
  { id: 2,  user: '이경비',    date: '2026-06-05 09:15', browser: 'Chrome 124',  os: 'Windows 11', ip: '211.234.123.67', location: '서울 강남구', result: 'success'    },
  { id: 3,  user: '이공장장',  date: '2026-06-05 11:45', browser: 'Firefox 126', os: 'macOS 14',   ip: '203.45.67.89',  location: '경기 수원시', result: 'success'    },
  { id: 4,  user: '정경비',    date: '2026-06-05 03:22', browser: 'Chrome 124',  os: 'Android 14', ip: '58.122.45.88',  location: '인천 남동구', result: 'suspicious' },
  { id: 5,  user: '정경비',    date: '2026-06-05 03:21', browser: 'Chrome 124',  os: 'Android 14', ip: '58.122.45.88',  location: '인천 남동구', result: 'failed'     },
  { id: 6,  user: '정경비',    date: '2026-06-05 03:20', browser: 'Chrome 124',  os: 'Android 14', ip: '58.122.45.88',  location: '인천 남동구', result: 'failed'     },
  { id: 7,  user: '박모니터',  date: '2026-06-04 18:00', browser: 'Safari 17',   os: 'macOS 14',   ip: '175.212.34.56', location: '서울 서초구', result: 'success'    },
  { id: 8,  user: '박테스트',  date: '2026-06-03 16:20', browser: 'Edge 124',    os: 'Windows 11', ip: '218.148.90.12', location: '부산 해운대', result: 'success'    },
  { id: 9,  user: '최보안',    date: '2026-05-28 10:30', browser: 'Chrome 124',  os: 'Windows 11', ip: '211.234.99.88', location: '서울 강남구', result: 'success'    },
  { id: 10, user: '김관리자',  date: '2026-06-04 08:22', browser: 'Chrome 124',  os: 'Windows 11', ip: '211.234.123.45', location: '서울 강남구', result: 'success'   },
  { id: 11, user: '이경비',    date: '2026-06-04 07:55', browser: 'Chrome 124',  os: 'Windows 11', ip: '211.234.123.67', location: '서울 강남구', result: 'success'   },
  { id: 12, user: '박테스트',  date: '2026-06-02 12:10', browser: 'Edge 124',    os: 'Windows 11', ip: '218.148.90.12', location: '부산 해운대', result: 'failed'     },
]

const INIT_AUDIT = [
  { id: 1, time: '2026-06-05 14:31', by: '시스템',     type: 'LOCK',   target: '정경비',  detail: '로그인 실패 3회 초과 — 계정 자동 잠금 + 이메일 발송' },
  { id: 2, time: '2026-06-05 11:00', by: '시스템관리자', type: 'UPDATE', target: '박모니터', detail: '역할 변경: 관리자 → 뷰어' },
  { id: 3, time: '2026-06-05 09:05', by: '시스템관리자', type: 'CREATE', target: '이공장장', detail: '신규 계정 생성 (Enterprise · 관리자)' },
  { id: 4, time: '2026-06-04 17:30', by: '김관리자',  type: 'UPDATE', target: '최보안',  detail: '접근 구역 변경: ZONE-C, ZONE-D 추가' },
  { id: 5, time: '2026-06-04 15:00', by: '시스템관리자', type: 'DELETE', target: '구계정001', detail: '만료 계정 삭제 (180일 미접속)' },
  { id: 6, time: '2026-06-03 10:20', by: '시스템관리자', type: 'UPDATE', target: '시스템', detail: '세션 타임아웃 60분 → 30분 변경' },
  { id: 7, time: '2026-06-02 09:00', by: '시스템관리자', type: 'CREATE', target: '박테스트', detail: '신규 계정 생성 (Basic · 운영자)' },
  { id: 8, time: '2026-06-01 16:45', by: '이경비',    type: 'UPDATE', target: '정경비',  detail: '비밀번호 초기화 요청 처리' },
]

const INIT_SESSIONS = [
  { id: 1, user: '김관리자',  email: 'demo@company.com',    loginTime: '2026-06-05 14:30', browser: 'Chrome 124',  os: 'Windows 11', ip: '211.234.123.45', location: '서울 강남구' },
  { id: 2, user: '이경비',    email: 'ops@smarteye.kr',     loginTime: '2026-06-05 09:15', browser: 'Chrome 124',  os: 'Windows 11', ip: '211.234.123.67', location: '서울 강남구' },
  { id: 3, user: '이공장장',  email: 'admin@factory.kr',    loginTime: '2026-06-05 11:45', browser: 'Firefox 126', os: 'macOS 14',   ip: '203.45.67.89',  location: '경기 수원시' },
]

// ── 관리자 계정 ────────────────────────────────────────────────
const INIT_ADMINS = [
  { id: 1, name: '총관리자',   email: 'admin@smarteye.kr',   adminLevel: '총관리자',  lastLogin: '2026-06-05 14:30', status: 'online'  },
  { id: 2, name: '김운영관리', email: 'manager@smarteye.kr', adminLevel: '운영관리자', lastLogin: '2026-06-04 09:15', status: 'offline' },
]

// ── 회사별 로그인 설정 초기값 ──────────────────────────────────
const INIT_COMPANY_LOGIN_OPTIONS = [
  { name: '스마트 물류 주식회사', requireEmployeeId: true,  ipRestriction: false },
  { name: '한국 공장 관리',      requireEmployeeId: true,  ipRestriction: true  },
  { name: 'SmartEye',            requireEmployeeId: false, ipRestriction: true  },
]

// ── 사이드바 그룹 정의 ─────────────────────────────────────────
const SIDEBAR_GROUPS = [
  {
    key: 'user-mgmt', label: '사용자 관리', Icon: Users,
    items: [
      { key: 'users',    label: '사용자 목록',     Icon: Users   },
      { key: 'sessions', label: '실시간 접속 현황', Icon: Monitor },
    ],
  },
  {
    key: 'log-mgmt', label: '로그 관리', Icon: Activity,
    items: [
      { key: 'history', label: '로그인 이력', Icon: Clock    },
      { key: 'audit',   label: '감사 로그',   Icon: Activity },
    ],
  },
  {
    key: 'settings-mgmt', label: '설정 관리', Icon: Shield,
    items: [
      { key: 'perms',    label: '권한 부여',  Icon: Key    },
      { key: 'security', label: '보안 설정',  Icon: Shield },
    ],
  },
]

const ADMIN_LEVEL_CFG = {
  '총관리자':  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
  '운영관리자': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  '조회관리자': { color: '#64748b', bg: 'rgba(100,116,139,0.1)',  border: 'rgba(100,116,139,0.2)' },
}

const TAB_ACCESS = {
  '총관리자':  ['users', 'perms', 'history', 'audit', 'sessions', 'security', 'admins'],
  '운영관리자': ['users', 'perms', 'history', 'audit', 'sessions'],
  '조회관리자': ['history', 'audit'],
}

const INIT_SECURITY = {
  minPasswordLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecial: false,
  passwordExpireDays: 90,
  sessionTimeoutMinutes: 30,
  maxFailedLogins: 5,
  ipWhitelist: ['211.234.0.0/16', '203.45.0.0/16'],
}

// ── Config ─────────────────────────────────────────────────────
const PERM_ROWS = ['카메라 영상 조회', '이벤트 로그 조회', '카메라 설정 변경', 'AI 분석 설정', '사용자 관리', '시스템 설정', 'AI 영상 분석']
const PERM_COLS = ['관리자', '운영자', '뷰어']
const PERM_DEFAULT = {
  '관리자': [true,  true,  true,  true,  true,  true,  true ],
  '운영자': [true,  true,  true,  true,  false, false, true ],
  '뷰어':   [true,  true,  false, false, false, false, false],
}

const ROLE_CFG = {
  '관리자': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
  '운영자': { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.25)' },
  '뷰어':   { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
}

const TIER_CFG = {
  'Enterprise': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'Pro':        { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)'   },
  'Basic':      { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
}

const RESULT_CFG = {
  success:    { color: '#10b981', label: '성공' },
  failed:     { color: '#ef4444', label: '실패' },
  suspicious: { color: '#f59e0b', label: '의심' },
}

const AUDIT_TYPE_CFG = {
  CREATE: { color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  UPDATE: { color: '#00d4ff', bg: 'rgba(0,212,255,0.08)'  },
  DELETE: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  LOCK:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
}

// ── Helper Functions ───────────────────────────────────────────
function nowStr() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ── Helper Components ──────────────────────────────────────────
function Th({ children }) {
  return (
    <th style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, color: '#475569', fontWeight: 700, borderBottom: '1px solid #1e2d3d', letterSpacing: 0.8, textTransform: 'uppercase', background: 'rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>
      {children}
    </th>
  )
}

function Td({ children, style }) {
  return (
    <td style={{ padding: '8px 10px', fontSize: 12, borderBottom: '1px solid #0f1923', ...style }}>
      {children}
    </td>
  )
}

function RoleBadge({ role }) {
  const c = ROLE_CFG[role] || ROLE_CFG['뷰어']
  return (
    <span style={{ fontSize: 10, padding: '2px 9px', borderRadius: 20, background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {role}
    </span>
  )
}

function TierBadge({ tier }) {
  const c = TIER_CFG[tier] || TIER_CFG['Basic']
  return (
    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: c.bg, color: c.color, fontWeight: 500 }}>
      {tier}
    </span>
  )
}

function Card({ title, icon: Icon, iconColor = '#00d4ff', children, action }) {
  return (
    <div style={{ background: '#0f1923', border: '1px solid #1e2d3d', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Icon size={14} color={iconColor} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap' }}>{title}</span>
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      {children}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
export default function Admin({ user, onLogout }) {
  const adminLevel   = user?.adminLevel || '조회관리자'
  const allowedTabs  = TAB_ACCESS[adminLevel] || TAB_ACCESS['조회관리자']

  const [tab, setTab]           = useState(allowedTabs[0])
  const [users, setUsers]       = useState(INIT_USERS)
  const [sessions, setSessions] = useState(INIT_SESSIONS)
  const [auditLog, setAuditLog] = useState(INIT_AUDIT)
  const [security, setSecurity] = useState(INIT_SECURITY)
  const [perms, setPerms]       = useState(PERM_DEFAULT)
  const [pendingPerms, setPendingPerms] = useState(PERM_DEFAULT)
  const [permsChanged, setPermsChanged] = useState(false)
  const [newIp, setNewIp]       = useState('')
  const [admins, setAdmins]     = useState(INIT_ADMINS)
  const [companyLoginOptions, setCompanyLoginOptions] = useState(INIT_COMPANY_LOGIN_OPTIONS)

  // Accordion sidebar
  const [openGroups, setOpenGroups] = useState(() => {
    const group = SIDEBAR_GROUPS.find(g => g.items.some(i => i.key === allowedTabs[0]))
    return group ? [group.key] : ['user-mgmt']
  })

  // Email notification toast
  const [emailNotif, setEmailNotif] = useState(null)

  // Users tab
  const [userSearch, setUserSearch]         = useState('')
  const [roleFilter, setRoleFilter]         = useState('전체')
  const [companyFilter, setCompanyFilter]   = useState('전체')
  const [showAddUser, setShowAddUser]       = useState(false)
  const [newUser, setNewUser]               = useState({ name: '', email: '', role: '뷰어', tier: 'Basic', zones: [], company: '개인' })
  const [editingRole, setEditingRole]       = useState(null)
  const [confirmDelete, setConfirmDelete]   = useState(null)

  // Admins tab
  const [editingAdminLevel, setEditingAdminLevel] = useState(null)

  // Login history tab
  const [historyFilter, setHistoryFilter] = useState('전체')

  // Auto-expand group when tab changes
  useEffect(() => {
    const group = SIDEBAR_GROUPS.find(g => g.items.some(i => i.key === tab))
    if (group && !openGroups.includes(group.key)) {
      setOpenGroups(prev => [...prev, group.key])
    }
  }, [tab])

  // Computed
  const lockedCount   = users.filter(u => u.locked).length
  const inactiveCount = users.filter(u => {
    const diff = (new Date('2026-06-05') - new Date(u.lastLogin.replace(' ', 'T'))) / 86400000
    return diff > 7
  }).length

  const uniqueCompanies = ['전체', ...new Set(users.map(u => u.company))]

  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase()
    const matchQ = !q || u.name.includes(q) || u.email.toLowerCase().includes(q)
    const matchR = roleFilter === '전체' || u.role === roleFilter
    const matchC = companyFilter === '전체' || u.company === companyFilter
    return matchQ && matchR && matchC
  })

  const filteredHistory = historyFilter === '전체'
    ? LOGIN_HISTORY_DATA
    : LOGIN_HISTORY_DATA.filter(h => h.user === historyFilter)

  // Handlers
  const pushAudit = (type, target, detail) =>
    setAuditLog(prev => [{ id: Date.now(), time: nowStr(), by: '시스템관리자', type, target, detail }, ...prev])

  const toggleGroup = (key) =>
    setOpenGroups(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const toggleLock = (id) => {
    const u = users.find(x => x.id === id)
    const willLock = !u?.locked
    setUsers(prev => prev.map(x => x.id === id ? { ...x, locked: !x.locked, failedLogins: 0 } : x))
    if (willLock) {
      pushAudit('LOCK', u?.name, `계정 잠금 처리`)
      pushAudit('UPDATE', u?.name, `잠금 안내 이메일 자동 발송 → ${u?.email}`)
      setEmailNotif({ name: u?.name, email: u?.email })
      setTimeout(() => setEmailNotif(null), 4500)
    } else {
      pushAudit('UPDATE', u?.name, '계정 잠금 해제')
    }
  }

  const changeRole = (id, newRole) => {
    const u = users.find(x => x.id === id)
    setUsers(prev => prev.map(x => x.id === id ? { ...x, role: newRole } : x))
    pushAudit('UPDATE', u?.name, `역할 변경: ${u?.role} → ${newRole}`)
    setEditingRole(null)
  }

  const deleteUser = (id) => {
    const u = users.find(x => x.id === id)
    setUsers(prev => prev.filter(x => x.id !== id))
    pushAudit('DELETE', u?.name, '계정 삭제')
    setConfirmDelete(null)
  }

  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return
    const created = { ...newUser, id: Date.now(), status: 'offline', lastLogin: '—', joinDate: '2026-06-05', failedLogins: 0, locked: false }
    setUsers(prev => [...prev, created])
    pushAudit('CREATE', newUser.name, `신규 계정 생성 (${newUser.tier} · ${newUser.role} · ${newUser.company})`)
    setNewUser({ name: '', email: '', role: '뷰어', tier: 'Basic', zones: [], company: '개인' })
    setShowAddUser(false)
  }

  const forceLogout = (id) => {
    const s = sessions.find(x => x.id === id)
    setSessions(prev => prev.filter(x => x.id !== id))
    pushAudit('UPDATE', s?.user, '강제 로그아웃')
  }

  const forceLogoutAll = () => {
    setSessions([])
    pushAudit('UPDATE', '전체', '전체 강제 로그아웃')
  }

  const togglePerm = (role, idx) => {
    setPendingPerms(prev => ({ ...prev, [role]: prev[role].map((v, i) => i === idx ? !v : v) }))
    setPermsChanged(true)
  }

  const applyPerms = () => {
    setPerms(pendingPerms)
    setPermsChanged(false)
    pushAudit('UPDATE', '권한 설정', '역할별 권한 변경 사항 DB 적용 완료')
  }

  const resetPendingPerms = () => {
    setPendingPerms(perms)
    setPermsChanged(false)
  }

  const changeAdminLevel = (id, newLevel) => {
    const a = admins.find(x => x.id === id)
    setAdmins(prev => prev.map(x => x.id === id ? { ...x, adminLevel: newLevel } : x))
    pushAudit('UPDATE', a?.name, `관리자 등급 변경: ${a?.adminLevel} → ${newLevel}`)
    setEditingAdminLevel(null)
  }

  const toggleCompanyOpt = (name, key) => {
    setCompanyLoginOptions(prev => prev.map(c => c.name === name ? { ...c, [key]: !c[key] } : c))
    pushAudit('UPDATE', name, `로그인 설정 변경: ${key === 'requireEmployeeId' ? '사원번호 인증' : 'IP 접근 제한'} 토글`)
  }

  // Styles
  const S = {
    page:     { height: '100vh', overflow: 'hidden', background: '#060e1a', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', color: '#e2e8f0' },
    header:   { padding: '0 20px', height: 56, background: '#0a1628', borderBottom: '1px solid #1e2d3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, minWidth: 0 },
    body:     { display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' },
    sidebar:  { width: 220, minWidth: 180, background: '#0a1628', borderRight: '1px solid #1e2d3d', display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: 1, flexShrink: 0, overflowY: 'auto' },
    main:     { flex: 1, minWidth: 0, padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 },
    table:    { width: '100%', borderCollapse: 'collapse' },
    input:    { background: '#060e1a', border: '1px solid #1e2d3d', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: '#e2e8f0', outline: 'none', fontFamily: 'inherit' },
    btn:      { background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#00d4ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
    redBtn:   { background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
    iconBtn:  { background: 'rgba(255,255,255,0.04)', border: '1px solid #1e2d3d', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    kpiGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10 },
    overlay:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
    modal:    { background: '#0f1923', border: '1px solid #1e2d3d', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, maxHeight: 'calc(100vh - 60px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 },
  }

  const KPI = [
    { label: '전체 사용자',  value: users.length,        color: '#00d4ff', Icon: Users    },
    { label: '활성 세션',    value: `${sessions.length}명`, color: '#10b981', Icon: Activity },
    { label: '잠금 계정',    value: `${lockedCount}개`,  color: '#ef4444', Icon: Lock     },
    { label: '7일 미접속',  value: `${inactiveCount}명`, color: '#f59e0b', Icon: Clock    },
  ]

  // 허용된 탭만 포함된 그룹 목록
  const visibleGroups = SIDEBAR_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(item => allowedTabs.includes(item.key)),
  })).filter(g => g.items.length > 0)

  return (
    <div style={S.page}>

      {/* ── 헤더 ── */}
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={16} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', fontFamily: 'Rajdhani', letterSpacing: 0.5 }}>SmartEye Admin Panel</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 10, color: '#334155', letterSpacing: 1.5, textTransform: 'uppercase' }}>{user?.name || 'Administrator'}</div>
              <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 20, background: ADMIN_LEVEL_CFG[adminLevel]?.bg, border: `1px solid ${ADMIN_LEVEL_CFG[adminLevel]?.border}`, color: ADMIN_LEVEL_CFG[adminLevel]?.color, fontWeight: 700, letterSpacing: 0.5 }}>{adminLevel}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#334155', fontFamily: 'Share Tech Mono', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <span>{new Date().toLocaleDateString('ko-KR')}</span>
            <span style={{ color: '#1e3a5f' }}>{new Date().toLocaleTimeString('ko-KR', { hour12: false })}</span>
          </div>
          <button style={S.redBtn} onClick={onLogout}>
            <LogOut size={12} /> 로그아웃
          </button>
        </div>
      </header>

      {/* ── 바디 ── */}
      <div style={S.body}>

        {/* ── 아코디언 사이드바 ── */}
        <aside style={S.sidebar}>
          <div style={{ fontSize: 9, color: '#1e3a5f', letterSpacing: 1.5, padding: '2px 8px 10px', textTransform: 'uppercase', fontWeight: 700 }}>관리 메뉴</div>

          {visibleGroups.map(group => {
            const isOpen = openGroups.includes(group.key)
            const hasActive = group.items.some(i => i.key === tab)
            return (
              <div key={group.key} style={{ marginBottom: 2 }}>
                {/* 그룹 헤더 */}
                <button
                  onClick={() => toggleGroup(group.key)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '8px 10px', borderRadius: 8,
                    background: hasActive ? 'rgba(239,68,68,0.05)' : 'transparent',
                    border: '1px solid transparent',
                    color: hasActive ? '#dc2626' : '#475569',
                    cursor: 'pointer', fontSize: 10.5, fontWeight: 700,
                    letterSpacing: 0.7, textTransform: 'uppercase', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <group.Icon size={12} />
                    {group.label}
                  </div>
                  <ChevronDown
                    size={11}
                    color={hasActive ? '#dc2626' : '#334155'}
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                  />
                </button>

                {/* 서브 메뉴 */}
                {isOpen && (
                  <div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2, marginBottom: 4 }}>
                    {group.items.map(item => (
                      <button
                        key={item.key}
                        onClick={() => setTab(item.key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 10px', borderRadius: 7,
                          border: tab === item.key ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent',
                          background: tab === item.key ? 'rgba(239,68,68,0.07)' : 'transparent',
                          color: tab === item.key ? '#ef4444' : '#64748b',
                          cursor: 'pointer', fontSize: 12,
                          fontWeight: tab === item.key ? 600 : 400,
                          transition: 'all 0.15s', textAlign: 'left',
                        }}
                      >
                        <item.Icon size={12} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* 관리자 계정 (독립 메뉴) */}
          {allowedTabs.includes('admins') && (
            <>
              <div style={{ height: 1, background: 'rgba(239,68,68,0.15)', margin: '8px 2px' }} />
              <button
                onClick={() => setTab('admins')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 8,
                  border: tab === 'admins' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(239,68,68,0.12)',
                  background: tab === 'admins' ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.03)',
                  color: tab === 'admins' ? '#ef4444' : '#7f1d1d',
                  cursor: 'pointer', fontSize: 12, fontWeight: tab === 'admins' ? 600 : 400,
                  transition: 'all 0.15s', textAlign: 'left', width: '100%',
                }}
              >
                <ShieldAlert size={13} />
                관리자 계정
              </button>
            </>
          )}
        </aside>

        {/* ── 메인 ── */}
        <main style={S.main}>

          {/* KPI */}
          <div style={S.kpiGrid}>
            {KPI.map(k => (
              <div key={k.label} style={{ background: '#0f1923', border: '1px solid #1e2d3d', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${k.color}18`, border: `1px solid ${k.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <k.Icon size={15} color={k.color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: k.color, fontFamily: 'Rajdhani', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ════ 탭: 사용자 목록 ════ */}
          {tab === 'users' && (
            <Card title="사용자 목록" icon={Users}
              action={
                <button style={S.btn} onClick={() => setShowAddUser(true)}>
                  <UserPlus size={12} /> 사용자 추가
                </button>
              }
            >
              {/* 검색 + 역할 필터 */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                  <Search size={12} color="#475569" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input style={{ ...S.input, width: '100%', paddingLeft: 30, boxSizing: 'border-box' }}
                    placeholder="이름, 이메일 검색…"
                    value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['전체', '관리자', '운영자', '뷰어'].map(r => (
                    <button key={r}
                      style={{ ...S.btn, background: roleFilter === r ? 'rgba(0,212,255,0.14)' : 'rgba(255,255,255,0.03)', borderColor: roleFilter === r ? 'rgba(0,212,255,0.4)' : '#1e2d3d', color: roleFilter === r ? '#00d4ff' : '#475569', padding: '6px 12px' }}
                      onClick={() => setRoleFilter(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 회사 필터 */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 4 }}>
                  <Building2 size={11} color="#475569" />
                  <span style={{ fontSize: 11, color: '#475569' }}>회사:</span>
                </div>
                {uniqueCompanies.map(c => (
                  <button key={c}
                    style={{
                      ...S.btn,
                      background: companyFilter === c ? 'rgba(139,92,246,0.14)' : 'rgba(255,255,255,0.03)',
                      borderColor: companyFilter === c ? 'rgba(139,92,246,0.4)' : '#1e2d3d',
                      color: companyFilter === c ? '#8b5cf6' : '#475569',
                      padding: '5px 10px', fontSize: 11,
                    }}
                    onClick={() => setCompanyFilter(c)}>
                    {c === '전체' ? '전체 회사' : c}
                  </button>
                ))}
              </div>

              {/* 테이블 */}
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <Th>#</Th><Th>이름</Th><Th>이메일</Th><Th>회사</Th><Th>역할</Th><Th>플랜</Th>
                      <Th>상태</Th><Th>마지막 로그인</Th><Th>접근 구역</Th><Th>잠금</Th><Th>관리</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ background: u.locked ? 'rgba(239,68,68,0.03)' : 'transparent', transition: 'background 0.15s' }}>
                        <Td style={{ color: '#334155', fontFamily: 'Share Tech Mono', fontSize: 11 }}>{u.id}</Td>
                        <Td style={{ color: '#e2e8f0', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {u.locked && <Lock size={10} color="#ef4444" />}
                            {u.name}
                          </div>
                        </Td>
                        <Td style={{ color: '#64748b', fontSize: 11 }}>{u.email}</Td>
                        <Td>
                          <span style={{ fontSize: 11, color: u.company === '개인' ? '#64748b' : '#8b5cf6', display: 'flex', alignItems: 'center', gap: 4 }}>
                            {u.company !== '개인' && <Building2 size={10} color="#8b5cf6" />}
                            {u.company}
                          </span>
                        </Td>
                        <Td>
                          {editingRole === u.id ? (
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              {['관리자', '운영자', '뷰어'].map(r => (
                                <button key={r}
                                  style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, cursor: 'pointer', background: u.role === r ? ROLE_CFG[r].bg : 'transparent', border: `1px solid ${u.role === r ? ROLE_CFG[r].border : '#1e2d3d'}`, color: u.role === r ? ROLE_CFG[r].color : '#475569' }}
                                  onClick={() => changeRole(u.id, r)}>{r}</button>
                              ))}
                              <button style={S.iconBtn} onClick={() => setEditingRole(null)}><X size={11} color="#475569" /></button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }} onClick={() => setEditingRole(u.id)} title="클릭하여 역할 변경">
                              <RoleBadge role={u.role} />
                              <ChevronDown size={10} color="#334155" />
                            </div>
                          )}
                        </Td>
                        <Td><TierBadge tier={u.tier} /></Td>
                        <Td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: u.status === 'online' ? '#10b981' : '#334155' }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: u.status === 'online' ? '#10b981' : '#334155' }} />
                            {u.status === 'online' ? '온라인' : '오프라인'}
                          </div>
                        </Td>
                        <Td style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#475569', whiteSpace: 'nowrap' }}>{u.lastLogin}</Td>
                        <Td>
                          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            {u.zones.map(z => (
                              <span key={z} style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: '#00d4ff' }}>{z}</span>
                            ))}
                          </div>
                        </Td>
                        <Td>
                          <button style={{ ...S.iconBtn, borderColor: u.locked ? 'rgba(239,68,68,0.3)' : '#1e2d3d' }} onClick={() => toggleLock(u.id)} title={u.locked ? '잠금 해제' : '계정 잠금'}>
                            {u.locked ? <Unlock size={11} color="#ef4444" /> : <Lock size={11} color="#475569" />}
                          </button>
                        </Td>
                        <Td>
                          {confirmDelete === u.id ? (
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 10, color: '#ef4444' }}>삭제?</span>
                              <button style={{ ...S.redBtn, padding: '3px 8px', fontSize: 10 }} onClick={() => deleteUser(u.id)}>확인</button>
                              <button style={{ ...S.iconBtn }} onClick={() => setConfirmDelete(null)}><X size={11} color="#475569" /></button>
                            </div>
                          ) : (
                            <button style={S.iconBtn} title="삭제" onClick={() => setConfirmDelete(u.id)}>
                              <Trash2 size={11} color="#ef4444" />
                            </button>
                          )}
                        </Td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={11} style={{ padding: '24px', textAlign: 'center', color: '#334155', fontSize: 12 }}>검색 결과가 없습니다.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── 사용자 추가 모달 ── */}
          {showAddUser && (
            <div style={S.overlay}>
              <div style={S.modal}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserPlus size={14} color="#00d4ff" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>신규 사용자 추가</span>
                  </div>
                  <button style={S.iconBtn} onClick={() => setShowAddUser(false)}><X size={13} color="#475569" /></button>
                </div>
                {[{ label: '이름', key: 'name', placeholder: '홍길동' }, { label: '이메일', key: 'email', placeholder: 'user@company.com' }, { label: '회사', key: 'company', placeholder: '회사명 또는 개인' }].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 5 }}>{f.label}</div>
                    <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }}
                      placeholder={f.placeholder} value={newUser[f.key]}
                      onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[{ label: '역할', key: 'role', opts: ['관리자','운영자','뷰어'] }, { label: '플랜', key: 'tier', opts: ['Basic','Pro','Enterprise'] }].map(f => (
                    <div key={f.key}>
                      <div style={{ fontSize: 11, color: '#475569', marginBottom: 5 }}>{f.label}</div>
                      <select style={{ ...S.input, width: '100%' }} value={newUser[f.key]} onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))}>
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>접근 구역</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {ZONES.map(z => (
                      <button key={z}
                        style={{ fontSize: 10, padding: '4px 12px', borderRadius: 20, cursor: 'pointer', background: newUser.zones.includes(z) ? 'rgba(0,212,255,0.14)' : 'rgba(255,255,255,0.03)', border: `1px solid ${newUser.zones.includes(z) ? 'rgba(0,212,255,0.4)' : '#1e2d3d'}`, color: newUser.zones.includes(z) ? '#00d4ff' : '#475569' }}
                        onClick={() => setNewUser(p => ({ ...p, zones: p.zones.includes(z) ? p.zones.filter(x => x !== z) : [...p.zones, z] }))}>
                        {z}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                  <button style={{ ...S.btn, background: 'transparent', borderColor: '#1e2d3d', color: '#475569' }} onClick={() => setShowAddUser(false)}>취소</button>
                  <button style={S.btn} onClick={addUser}><Save size={12} /> 추가</button>
                </div>
              </div>
            </div>
          )}

          {/* ════ 탭: 권한 부여 ════ */}
          {tab === 'perms' && (
            <>
              <Card title="역할별 권한 설정" icon={Key} iconColor="#8b5cf6"
                action={
                  <div style={{ display: 'flex', gap: 8 }}>
                    {permsChanged && (
                      <button style={{ ...S.btn, background: 'transparent', borderColor: '#1e2d3d', color: '#475569', fontSize: 11 }} onClick={resetPendingPerms}>
                        <X size={11} /> 되돌리기
                      </button>
                    )}
                    <button
                      style={{ ...S.btn, background: permsChanged ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', borderColor: permsChanged ? 'rgba(16,185,129,0.4)' : '#1e2d3d', color: permsChanged ? '#10b981' : '#334155', cursor: permsChanged ? 'pointer' : 'default' }}
                      onClick={applyPerms}
                      disabled={!permsChanged}
                    >
                      <Save size={12} /> 적용
                    </button>
                  </div>
                }
              >
                {permsChanged && (
                  <div style={{ fontSize: 11, color: '#f59e0b', padding: '6px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 7, border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={12} color="#f59e0b" />
                    변경 사항이 있습니다. [적용] 버튼을 눌러야 DB에 반영됩니다.
                  </div>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <Th>기능 / 역할</Th>
                        {PERM_COLS.map(role => <Th key={role}><RoleBadge role={role} /></Th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {PERM_ROWS.map((row, i) => (
                        <tr key={row}>
                          <Td style={{ color: '#94a3b8', fontWeight: 500 }}>{row}</Td>
                          {PERM_COLS.map(role => (
                            <Td key={role}>
                              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }} onClick={() => togglePerm(role, i)} title="클릭하여 토글">
                                {pendingPerms[role][i]
                                  ? <CheckCircle size={17} color="#10b981" />
                                  : <XCircle size={17} color="#1e2d3d" />
                                }
                              </button>
                            </Td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11, color: '#1e3a5f', textAlign: 'right' }}>※ 클릭하여 토글 후 [적용] 버튼을 눌러야 DB에 반영됩니다.</div>
              </Card>

              <Card title="사용자별 접근 구역" icon={MapPin} iconColor="#10b981">
                <div style={{ overflowX: 'auto' }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <Th>사용자</Th><Th>역할</Th>
                        {ZONES.map(z => <Th key={z}>{z}</Th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <Td style={{ color: '#e2e8f0', fontWeight: 500 }}>{u.name}</Td>
                          <Td><RoleBadge role={u.role} /></Td>
                          {ZONES.map(z => (
                            <Td key={z}>
                              {u.zones.includes(z)
                                ? <CheckCircle size={14} color="#10b981" />
                                : <div style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #1e2d3d', background: '#060e1a' }} />
                              }
                            </Td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {/* ════ 탭: 로그인 이력 ════ */}
          {tab === 'history' && (
            <Card title="전체 로그인 이력" icon={Clock}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#475569' }}>사용자:</span>
                  <select style={S.input} value={historyFilter} onChange={e => setHistoryFilter(e.target.value)}>
                    <option>전체</option>
                    {[...new Set(LOGIN_HISTORY_DATA.map(h => h.user))].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 11 }}>
                  {Object.entries(RESULT_CFG).map(([k, v]) => (
                    <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#475569' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: v.color }} />
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr><Th>사용자</Th><Th>일시</Th><Th>브라우저</Th><Th>OS</Th><Th>IP</Th><Th>위치</Th><Th>결과</Th></tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map(h => {
                      const rc = RESULT_CFG[h.result]
                      return (
                        <tr key={h.id} style={{ background: h.result === 'suspicious' ? 'rgba(245,158,11,0.04)' : h.result === 'failed' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                          <Td style={{ color: '#e2e8f0', fontWeight: 500 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {h.result === 'suspicious' && <AlertTriangle size={11} color="#f59e0b" />}
                              {h.user}
                            </div>
                          </Td>
                          <Td style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#64748b', whiteSpace: 'nowrap' }}>{h.date}</Td>
                          <Td style={{ fontSize: 11, color: '#64748b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Monitor size={10} color="#334155" />{h.browser}
                            </div>
                          </Td>
                          <Td style={{ fontSize: 11, color: '#64748b' }}>{h.os}</Td>
                          <Td style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#475569' }}>{h.ip}</Td>
                          <Td style={{ fontSize: 11, color: '#64748b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MapPin size={10} color="#334155" />{h.location}
                            </div>
                          </Td>
                          <Td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: rc.color }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: rc.color }} />{rc.label}
                            </div>
                          </Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ════ 탭: 감사 로그 ════ */}
          {tab === 'audit' && (
            <Card title="감사 로그 (Audit Log)" icon={Activity} iconColor="#f59e0b">
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr><Th>시간</Th><Th>수행자</Th><Th>타입</Th><Th>대상</Th><Th>내용</Th></tr>
                  </thead>
                  <tbody>
                    {auditLog.map(log => {
                      const tc = AUDIT_TYPE_CFG[log.type] || AUDIT_TYPE_CFG.UPDATE
                      return (
                        <tr key={log.id}>
                          <Td style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#475569', whiteSpace: 'nowrap' }}>{log.time}</Td>
                          <Td style={{ color: '#94a3b8', fontWeight: 500 }}>{log.by}</Td>
                          <Td>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: tc.bg, color: tc.color, fontWeight: 700, letterSpacing: 0.5 }}>{log.type}</span>
                          </Td>
                          <Td style={{ color: '#e2e8f0', fontWeight: 500 }}>{log.target}</Td>
                          <Td style={{ color: '#64748b' }}>{log.detail}</Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ════ 탭: 실시간 접속 현황 ════ */}
          {tab === 'sessions' && (
            <Card title="실시간 접속 현황" icon={Monitor} iconColor="#10b981"
              action={
                sessions.length > 0 && (
                  <button style={S.redBtn} onClick={forceLogoutAll}>
                    <LogOut size={12} /> 전체 강제 로그아웃
                  </button>
                )
              }
            >
              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: '#334155', fontSize: 13 }}>현재 활성 세션이 없습니다.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={S.table}>
                    <thead>
                      <tr><Th>사용자</Th><Th>접속 시간</Th><Th>브라우저</Th><Th>OS</Th><Th>IP</Th><Th>위치</Th><Th>강제 종료</Th></tr>
                    </thead>
                    <tbody>
                      {sessions.map(s => (
                        <tr key={s.id}>
                          <Td style={{ color: '#e2e8f0', fontWeight: 600 }}>
                            <div>
                              <div>{s.user}</div>
                              <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{s.email}</div>
                            </div>
                          </Td>
                          <Td style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#475569', whiteSpace: 'nowrap' }}>{s.loginTime}</Td>
                          <Td style={{ fontSize: 11, color: '#64748b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Monitor size={10} color="#334155" />{s.browser}
                            </div>
                          </Td>
                          <Td style={{ fontSize: 11, color: '#64748b' }}>{s.os}</Td>
                          <Td style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#475569' }}>{s.ip}</Td>
                          <Td style={{ fontSize: 11, color: '#64748b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MapPin size={10} color="#334155" />{s.location}
                            </div>
                          </Td>
                          <Td>
                            <button style={{ ...S.redBtn, padding: '4px 12px', fontSize: 11 }} onClick={() => forceLogout(s.id)}>
                              <LogOut size={11} /> 종료
                            </button>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* ════ 탭: 보안 설정 ════ */}
          {tab === 'security' && (
            <>
              <Card title="비밀번호 정책" icon={Key} iconColor="#8b5cf6">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e2d3d' }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>최소 비밀번호 길이</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>현재: {security.minPasswordLength}자</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input type="range" min={6} max={20} value={security.minPasswordLength}
                        onChange={e => setSecurity(p => ({ ...p, minPasswordLength: +e.target.value }))}
                        style={{ width: 120, accentColor: '#8b5cf6' }} />
                      <span style={{ fontFamily: 'Share Tech Mono', color: '#8b5cf6', fontSize: 15, minWidth: 26 }}>{security.minPasswordLength}</span>
                    </div>
                  </div>
                  {[
                    { key: 'requireUppercase', label: '대문자 포함 필수',   desc: '최소 1개 대문자 필요' },
                    { key: 'requireNumber',    label: '숫자 포함 필수',     desc: '최소 1개 숫자 필요' },
                    { key: 'requireSpecial',   label: '특수문자 포함 필수', desc: '!, @, # 등 특수문자 필요' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e2d3d' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>{label}</div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{desc}</div>
                      </div>
                      <button onClick={() => setSecurity(p => ({ ...p, [key]: !p[key] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {security[key] ? <CheckCircle size={23} color="#10b981" /> : <XCircle size={23} color="#1e2d3d" />}
                      </button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>비밀번호 만료 주기</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>현재: {security.passwordExpireDays}일마다 변경</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input type="range" min={30} max={365} step={30} value={security.passwordExpireDays}
                        onChange={e => setSecurity(p => ({ ...p, passwordExpireDays: +e.target.value }))}
                        style={{ width: 120, accentColor: '#8b5cf6' }} />
                      <span style={{ fontFamily: 'Share Tech Mono', color: '#8b5cf6', fontSize: 13, minWidth: 40 }}>{security.passwordExpireDays}일</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <Card title="세션 & 로그인 설정" icon={Clock}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>세션 타임아웃</span>
                        <span style={{ fontFamily: 'Share Tech Mono', color: '#00d4ff' }}>{security.sessionTimeoutMinutes}분</span>
                      </div>
                      <input type="range" min={10} max={120} step={10} value={security.sessionTimeoutMinutes}
                        onChange={e => setSecurity(p => ({ ...p, sessionTimeoutMinutes: +e.target.value }))}
                        style={{ width: '100%', accentColor: '#00d4ff' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>로그인 실패 잠금 횟수</span>
                        <span style={{ fontFamily: 'Share Tech Mono', color: '#ef4444' }}>{security.maxFailedLogins}회</span>
                      </div>
                      <input type="range" min={3} max={10} value={security.maxFailedLogins}
                        onChange={e => setSecurity(p => ({ ...p, maxFailedLogins: +e.target.value }))}
                        style={{ width: '100%', accentColor: '#ef4444' }} />
                    </div>
                  </div>
                </Card>

                <Card title="IP 화이트리스트" icon={Shield} iconColor="#f59e0b">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {security.ipWhitelist.map((ip, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 6, border: '1px solid #1e2d3d' }}>
                        <span style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: '#94a3b8' }}>{ip}</span>
                        <button style={S.iconBtn} onClick={() => setSecurity(p => ({ ...p, ipWhitelist: p.ipWhitelist.filter((_, j) => j !== i) }))}>
                          <X size={11} color="#ef4444" />
                        </button>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <input style={{ ...S.input, flex: 1 }} placeholder="192.168.1.0/24" value={newIp}
                        onChange={e => setNewIp(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && newIp.trim() && (setSecurity(p => ({ ...p, ipWhitelist: [...p.ipWhitelist, newIp.trim()] })), setNewIp(''))} />
                      <button style={S.btn}
                        onClick={() => { if (newIp.trim()) { setSecurity(p => ({ ...p, ipWhitelist: [...p.ipWhitelist, newIp.trim()] })); setNewIp('') } }}>
                        <Plus size={12} /> 추가
                      </button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 회사별 로그인 옵션 */}
              <Card title="회사별 로그인 설정" icon={Building2} iconColor="#00d4ff">
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>
                  각 기업 계정의 로그인 인증 방식을 개별 설정합니다.
                </div>
                {companyLoginOptions.map(co => (
                  <div key={co.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e2d3d' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Building2 size={12} color="#8b5cf6" />
                      <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>{co.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 11, color: '#475569' }}>사원번호 인증</span>
                        <button onClick={() => toggleCompanyOpt(co.name, 'requireEmployeeId')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          {co.requireEmployeeId ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#1e2d3d" />}
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 11, color: '#475569' }}>IP 접근 제한</span>
                        <button onClick={() => toggleCompanyOpt(co.name, 'ipRestriction')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          {co.ipRestriction ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#1e2d3d" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* ════ 탭: 관리자 계정 관리 (총관리자 전용) ════ */}
          {tab === 'admins' && (
            <Card title="관리자 계정 관리" icon={ShieldAlert} iconColor="#ef4444">
              <div style={{ fontSize: 11, color: '#475569', padding: '6px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.15)', marginBottom: 4 }}>
                총관리자 전용 메뉴입니다. 관리자 계정의 등급을 조정할 수 있습니다.
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr><Th>이름</Th><Th>이메일</Th><Th>등급</Th><Th>마지막 로그인</Th><Th>상태</Th></tr>
                  </thead>
                  <tbody>
                    {admins.map(a => (
                      <tr key={a.id}>
                        <Td style={{ color: '#e2e8f0', fontWeight: 600 }}>{a.name}</Td>
                        <Td style={{ color: '#64748b', fontSize: 11 }}>{a.email}</Td>
                        <Td>
                          {editingAdminLevel === a.id ? (
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              {Object.keys(ADMIN_LEVEL_CFG).map(lvl => (
                                <button key={lvl}
                                  style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, cursor: 'pointer', background: a.adminLevel === lvl ? ADMIN_LEVEL_CFG[lvl].bg : 'transparent', border: `1px solid ${a.adminLevel === lvl ? ADMIN_LEVEL_CFG[lvl].border : '#1e2d3d'}`, color: a.adminLevel === lvl ? ADMIN_LEVEL_CFG[lvl].color : '#475569' }}
                                  onClick={() => changeAdminLevel(a.id, lvl)}>{lvl}</button>
                              ))}
                              <button style={S.iconBtn} onClick={() => setEditingAdminLevel(null)}><X size={11} color="#475569" /></button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: user?.name !== a.name ? 'pointer' : 'default' }}
                              onClick={() => user?.name !== a.name && setEditingAdminLevel(a.id)}
                              title={user?.name !== a.name ? '클릭하여 등급 변경' : '본인 등급은 변경 불가'}>
                              <span style={{ fontSize: 10, padding: '2px 9px', borderRadius: 20, background: ADMIN_LEVEL_CFG[a.adminLevel]?.bg, border: `1px solid ${ADMIN_LEVEL_CFG[a.adminLevel]?.border}`, color: ADMIN_LEVEL_CFG[a.adminLevel]?.color, fontWeight: 700 }}>{a.adminLevel}</span>
                              {user?.name !== a.name && <ChevronDown size={10} color="#334155" />}
                            </div>
                          )}
                        </Td>
                        <Td style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#475569', whiteSpace: 'nowrap' }}>{a.lastLogin}</Td>
                        <Td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: a.status === 'online' ? '#10b981' : '#334155' }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.status === 'online' ? '#10b981' : '#334155' }} />
                            {a.status === 'online' ? '온라인' : '오프라인'}
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </main>
      </div>

      {/* ── 이메일 발송 토스트 ── */}
      {emailNotif && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#0f1923', border: '1px solid rgba(16,185,129,0.35)',
          borderRadius: 12, padding: '14px 18px', zIndex: 99999,
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          animation: 'fadeToastIn 0.3s ease',
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={15} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600, marginBottom: 3 }}>이메일 자동 발송 완료</div>
            <div style={{ fontSize: 11, color: '#475569' }}>{emailNotif.name} · 계정 잠금 알림</div>
            <div style={{ fontSize: 10, color: '#334155', fontFamily: 'Share Tech Mono', marginTop: 1 }}>{emailNotif.email}</div>
          </div>
        </div>
      )}
    </div>
  )
}
