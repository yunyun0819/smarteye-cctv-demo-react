import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, AlertCircle, Loader, Building2, User } from 'lucide-react'
import { login } from '../api/Auth'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ── 기업 계정 (2단계: 이메일+비밀번호 → 사원 번호) ──────────────
const COMPANY_ACCOUNTS = [
  {
    email: 'demo@company.com', password: 'demo1234',
    company: '스마트 물류 주식회사', tier: 'Pro', cameras: 32, cameraUsed: 16,
    employees: [
      { name: '김관리자',  employeeId: 'EMP001', role: '관리자', zones: ['ZONE-A','ZONE-B','ZONE-C','ZONE-D','ZONE-E'] },
      { name: '이경비',    employeeId: 'EMP002', role: '운영자', zones: ['ZONE-A','ZONE-B','ZONE-C'] },
      { name: '박모니터', employeeId: 'EMP003', role: '뷰어',   zones: ['ZONE-A','ZONE-B'] },
    ],
  },
  {
    email: 'admin@factory.kr', password: 'admin123',
    company: '한국 공장 관리', tier: 'Enterprise', cameras: -1, cameraUsed: 48,
    employees: [
      { name: '이공장장', employeeId: 'FAC001', role: '관리자', zones: ['ZONE-A','ZONE-B','ZONE-C','ZONE-D','ZONE-E'] },
      { name: '김운영',   employeeId: 'FAC002', role: '운영자', zones: ['ZONE-A','ZONE-B','ZONE-C','ZONE-D'] },
    ],
  },
]

// ── 개인 계정 (1단계) ─────────────────────────────────────────
const INDIVIDUAL_ACCOUNTS = [
  {
    email: 'test@test.com', password: 'test1234',
    user: { name: '박테스트', company: '개인', email: 'test@test.com', role: '관리자', tier: 'Basic', cameras: 8, cameraUsed: 6, zones: ['ZONE-A','ZONE-B'] },
  },
]

// ── 플랫폼 관리자 계정 ────────────────────────────────────────
const ADMIN_ACCOUNTS = [
  {
    email: 'admin@smarteye.kr', password: 'admin2024',
    user: { name: '총관리자', company: 'SmartEye Inc.', email: 'admin@smarteye.kr', role: '시스템관리자', tier: 'Enterprise', isAdmin: true, adminLevel: '총관리자' },
  },
  {
    email: 'manager@smarteye.kr', password: 'mgr2024',
    user: { name: '김운영관리', company: 'SmartEye Inc.', email: 'manager@smarteye.kr', role: '시스템관리자', tier: 'Enterprise', isAdmin: true, adminLevel: '운영관리자' },
  },
]

const ROLE_BADGE = {
  '관리자': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
  '운영자': { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.25)' },
  '뷰어':   { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
}

export default function Login({ onLogin, onBack }) {
  const [step, setStep]                     = useState(1)
  const [accountType, setAccountType]       = useState('individual') // 'individual' | 'corporate'
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [showPw, setShowPw]                 = useState(false)
  const [employeeId, setEmployeeId]         = useState('')
  const [pendingCompany, setPendingCompany] = useState(null)
  const [error, setError]                   = useState('')
  const [loading, setLoading]               = useState(false)

  // ── Step 1: 이메일 + 비밀번호 ──────────────────────────────
  const handleStep1 = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return }
    setLoading(true)

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))

      // 관리자 계정은 타입 무관하게 허용
      const adminAcc = ADMIN_ACCOUNTS.find(a => a.email === email && a.password === password)
      if (adminAcc) { onLogin(adminAcc.user); setLoading(false); return }

      if (accountType === 'corporate') {
        const companyAcc = COMPANY_ACCOUNTS.find(a => a.email === email && a.password === password)
        if (companyAcc) { setPendingCompany(companyAcc); setStep(2); setLoading(false); return }
        setError('기업 계정 정보가 올바르지 않습니다.')
      } else {
        const indAcc = INDIVIDUAL_ACCOUNTS.find(a => a.email === email && a.password === password)
        if (indAcc) { onLogin(indAcc.user); setLoading(false); return }
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }

      setLoading(false)
      return
    }

    try {
      const res = await login(email, password)
      const { accessToken, refreshToken, user } = res.data.data
      localStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken, user }))
      if (user.isCompany) {
        setPendingCompany({ ...user, email })
        setStep(2)
      } else {
        onLogin(user)
      }
    } catch (err) {
      setError(err.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: 사원 번호 ─────────────────────────────────────
  const handleStep2 = async (e) => {
    e.preventDefault()
    setError('')
    if (!employeeId.trim()) { setError('사원 번호를 입력해주세요.'); return }
    setLoading(true)

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 300))
      const emp = pendingCompany.employees.find(x => x.employeeId === employeeId.trim().toUpperCase())
      if (emp) {
        onLogin({
          name: emp.name,
          employeeId: emp.employeeId,
          role: emp.role,
          company: pendingCompany.company,
          tier: pendingCompany.tier,
          cameras: pendingCompany.cameras,
          cameraUsed: pendingCompany.cameraUsed,
          email: pendingCompany.email,
          isCompany: true,
          zones: emp.zones,
        })
      } else {
        setError('사원 번호가 올바르지 않습니다.')
      }
      setLoading(false)
      return
    }
    setLoading(false)
  }

  const goBackToStep1 = () => { setStep(1); setError(''); setEmployeeId(''); setPendingCompany(null) }

  const fillStep1 = (em, pw, type = 'individual') => {
    setEmail(em)
    setPassword(pw)
    setAccountType(type)
    setError('')
    setStep(1)
    setEmployeeId('')
    setPendingCompany(null)
  }

  const fillStep2 = (id) => { setEmployeeId(id); setError('') }

  // 계정 타입 전환 시 에러 초기화
  const handleTypeChange = (type) => {
    setAccountType(type)
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-grid" />

      <button className="login-back" onClick={onBack}>
        <ArrowLeft size={14} /> 홈으로
      </button>

      <div className="login-card">
        {/* 로고 */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Eye size={26} color="#00d4ff" />
            <div className="logo-ring" />
          </div>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontSize: 24, fontWeight: 700, background: 'linear-gradient(90deg, #00d4ff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SmartEye
            </div>
            <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase' }}>CCTV Platform</div>
          </div>
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <>
            <h2 className="login-title">로그인</h2>
            <p className="login-sub">계정 유형을 선택하고 로그인하세요.</p>

            {/* 개인 / 기업 라디오 버튼 */}
            <div className="login-type-selector">
              <button
                type="button"
                className={`login-type-btn ${accountType === 'individual' ? 'active' : ''}`}
                onClick={() => handleTypeChange('individual')}
              >
                <User size={14} />
                개인
              </button>
              <button
                type="button"
                className={`login-type-btn ${accountType === 'corporate' ? 'active' : ''}`}
                onClick={() => handleTypeChange('corporate')}
              >
                <Building2 size={14} />
                기업
              </button>
            </div>

            {/* 기업 선택 시 안내 배너 */}
            {accountType === 'corporate' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, marginBottom: 8, fontSize: 11, color: '#a78bfa' }}>
                <Building2 size={12} color="#a78bfa" />
                기업 계정은 로그인 후 사원 번호 추가 인증이 필요합니다.
              </div>
            )}

            <form className="login-form" onSubmit={handleStep1}>
              <div className="login-field">
                <label>이메일</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={accountType === 'corporate' ? 'company@example.com' : 'user@example.com'}
                  autoComplete="email" />
              </div>
              <div className="login-field">
                <label>비밀번호</label>
                <div className="login-pw-wrap">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="비밀번호 입력" autoComplete="current-password" />
                  <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {error && <div className="login-error"><AlertCircle size={13} /> {error}</div>}
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? <><Loader size={14} className="spin" /> 확인 중…</> : accountType === 'corporate' ? '다음 (사원 번호 인증)' : '로그인'}
              </button>
            </form>

            {USE_MOCK && (
              <div className="login-demo">
                <div className="login-demo-label">데모 계정으로 빠르게 체험</div>

                {accountType === 'corporate' && COMPANY_ACCOUNTS.map((a, i) => (
                  <button key={i} className="login-demo-btn" onClick={() => fillStep1(a.email, a.password, 'corporate')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Building2 size={12} color="#475569" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11.5, color: '#e2e8f0' }}>{a.company}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{a.email} · 사원번호 2단계</div>
                      </div>
                    </div>
                    <span className={`login-tier-badge tier-${a.tier.toLowerCase()}`}>{a.tier}</span>
                  </button>
                ))}

                {accountType === 'individual' && INDIVIDUAL_ACCOUNTS.map((a, i) => (
                  <button key={i} className="login-demo-btn" onClick={() => fillStep1(a.email, a.password, 'individual')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <User size={12} color="#475569" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11.5, color: '#e2e8f0' }}>개인 계정 · {a.user.name}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{a.email}</div>
                      </div>
                    </div>
                    <span className={`login-tier-badge tier-${a.user.tier.toLowerCase()}`}>{a.user.tier}</span>
                  </button>
                ))}

                <div style={{ borderTop: '1px solid rgba(239,68,68,0.15)', marginTop: 6, paddingTop: 6 }}>
                  {ADMIN_ACCOUNTS.map((a, i) => (
                    <button key={i} className="login-demo-btn" onClick={() => fillStep1(a.email, a.password, 'individual')}
                      style={{ borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.04)' }}>
                      <div>
                        <div style={{ fontSize: 11.5, color: '#fca5a5' }}>Admin · {a.user.name} ({a.user.adminLevel})</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{a.email}</div>
                      </div>
                      <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: 700 }}>ADMIN</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <>
            <button onClick={goBackToStep1}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: 0, marginBottom: 12 }}>
              <ArrowLeft size={13} /> 계정 다시 입력
            </button>

            {/* 기업 정보 배너 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(0,212,255,0.06)', borderRadius: 8, border: '1px solid rgba(0,212,255,0.15)', marginBottom: 20 }}>
              <Building2 size={14} color="#00d4ff" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{pendingCompany?.company}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>{pendingCompany?.tier} 플랜 · 기업 계정</div>
              </div>
            </div>

            <h2 className="login-title">사원 번호 입력</h2>
            <p className="login-sub">소속 기업의 사원 번호를 입력하세요.</p>

            <form className="login-form" onSubmit={handleStep2}>
              <div className="login-field">
                <label>사원 번호</label>
                <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)}
                  placeholder="EMP001" autoFocus
                  style={{ fontFamily: 'Share Tech Mono', letterSpacing: 1.5 }} />
              </div>
              {error && <div className="login-error"><AlertCircle size={13} /> {error}</div>}
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? <><Loader size={14} className="spin" /> 로그인 중…</> : '최종 로그인'}
              </button>
            </form>

            {USE_MOCK && pendingCompany && (
              <div className="login-demo">
                <div className="login-demo-label">데모 사원 선택</div>
                {pendingCompany.employees.map((emp, i) => (
                  <button key={i} className="login-demo-btn" onClick={() => fillStep2(emp.employeeId)}>
                    <div>
                      <div style={{ fontSize: 11.5, color: '#e2e8f0' }}>{emp.name}</div>
                      <div style={{ fontSize: 10, color: '#475569', fontFamily: 'Share Tech Mono', letterSpacing: 1 }}>{emp.employeeId}</div>
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 9px', borderRadius: 20, background: ROLE_BADGE[emp.role]?.bg, color: ROLE_BADGE[emp.role]?.color, border: `1px solid ${ROLE_BADGE[emp.role]?.border}`, fontWeight: 700 }}>
                      {emp.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <div className="login-footer">
          도입 문의: <a href="mailto:contact@smarteye.kr">contact@smarteye.kr</a>
        </div>
      </div>
    </div>
  )
}
