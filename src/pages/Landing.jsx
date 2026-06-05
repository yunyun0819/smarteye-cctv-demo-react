import { useState } from 'react'
import {
  Eye, Brain, Monitor, Car, FileText, BarChart3, Shield,
  CheckCircle, ArrowRight, Zap, Users, Camera,
  Building2, ChevronRight, Star, Play,
} from 'lucide-react'

const FEATURES = [
  { icon: Brain,    color: '#8b5cf6', title: 'AI 영상 분석',       desc: '딥러닝 기반 실시간 객체 감지. 사람·차량·이상행동을 99%+ 정확도로 자동 인식합니다.' },
  { icon: Monitor,  color: '#00d4ff', title: '실시간 모니터링',     desc: '최대 64채널 동시 스트리밍. 어디서든 웹 브라우저로 현장을 실시간 확인합니다.' },
  { icon: Car,      color: '#f59e0b', title: '차량 번호판 인식',    desc: '차량 입출차 자동 기록과 블랙리스트 번호판 즉시 알림. 주차장 관리도 자동화됩니다.' },
  { icon: FileText, color: '#10b981', title: '이벤트 로그 관리',    desc: '모든 감지 이벤트를 시계열로 기록·검색·내보내기. 증거 자료로 즉시 활용 가능합니다.' },
  { icon: BarChart3,color: '#ef4444', title: '통계 리포트',         desc: '일·주·월 단위 인원 현황, 차량 통계, 카메라 가동률을 자동으로 리포트합니다.' },
  { icon: Shield,   color: '#00d4ff', title: '보안 알림',           desc: '설정한 조건에서 즉각 알림 발송. 야간 침입·장기 체류·블랙리스트 차량을 놓치지 않습니다.' },
]

const PLANS = [
  {
    name: 'Basic',
    price: '99,000',
    color: '#64748b',
    cameras: '최대 8대',
    users: '최대 3명',
    features: ['실시간 모니터링', '이벤트 로그', '차량 번호판 인식', '이메일 알림'],
  },
  {
    name: 'Pro',
    price: '249,000',
    color: '#00d4ff',
    cameras: '최대 32대',
    users: '최대 10명',
    popular: true,
    features: ['Basic 모든 기능', 'AI 영상 분석', '통계 리포트', '블랙리스트 관리', 'API 연동'],
  },
  {
    name: 'Enterprise',
    price: '문의',
    color: '#8b5cf6',
    cameras: '무제한',
    users: '무제한',
    features: ['Pro 모든 기능', '전용 서버 구축', '맞춤형 AI 모델', '24/7 기술 지원', 'SLA 99.9%'],
  },
]

const STEPS = [
  { num: '01', title: '계정 생성',       desc: '회사 정보를 입력하고 즉시 계정을 생성합니다. 별도 설치 없이 브라우저만으로 시작 가능합니다.' },
  { num: '02', title: '카메라 연결',     desc: 'RTSP/ONVIF 지원 카메라를 IP 주소만 입력하면 자동 연결됩니다. 기존 카메라를 그대로 사용하세요.' },
  { num: '03', title: '즉시 운영 시작', desc: 'AI 분석이 자동 활성화됩니다. 대시보드에서 모든 현장을 한눈에 관제하세요.' },
]

export default function Landing({ onLogin, onGoToLogin }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="landing">
      {/* ── 네비게이션 ── */}
      <nav className="lnd-nav">
        <div className="lnd-nav-inner">
          <div className="lnd-logo">
            <div className="lnd-logo-icon">
              <Eye size={20} color="#00d4ff" />
            </div>
            <span className="lnd-logo-text">SmartEye</span>
          </div>
          <div className="lnd-nav-links">
            <a href="#features" className="lnd-nav-link">기능 소개</a>
            <a href="#how"      className="lnd-nav-link">도입 방법</a>
            <a href="#pricing"  className="lnd-nav-link">요금제</a>
          </div>
          <button className="lnd-login-btn" onClick={onGoToLogin}>
            로그인 <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── 히어로 ── */}
      <section className="lnd-hero">
        <div className="lnd-hero-bg" />
        <div className="lnd-hero-grid" />
        <div className="lnd-hero-content">
          <div className="lnd-hero-badge">
            <Zap size={11} /> AI 기반 차세대 CCTV 플랫폼
          </div>
          <h1 className="lnd-hero-title">
            스마트한 현장 관제,<br />
            <span className="lnd-hero-accent">SmartEye</span>로 시작하세요
          </h1>
          <p className="lnd-hero-desc">
            로그인만으로 바로 사용하는 클라우드 CCTV 관제 솔루션.<br />
            AI 영상 분석·실시간 모니터링·차량 번호판 인식을 하나의 플랫폼에서.
          </p>
          <div className="lnd-hero-btns">
            <button className="lnd-cta-primary" onClick={onGoToLogin}>
              무료 체험 시작 <ArrowRight size={15} />
            </button>
            <button className="lnd-cta-secondary">
              <Play size={13} /> 데모 영상 보기
            </button>
          </div>
        </div>

        {/* 미리보기 CCTV 그리드 */}
        <div className="lnd-preview">
          <div className="lnd-preview-bar">
            <div style={{ display: 'flex', gap: 5 }}>
              <div className="lnd-dot red" /><div className="lnd-dot yellow" /><div className="lnd-dot green" />
            </div>
            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'Share Tech Mono' }}>SmartEye — 실시간 대시보드</span>
          </div>
          <div className="lnd-preview-grid">
            {[
              { name: '정문 입구 01', color: '#00d4ff', person: true  },
              { name: '로비 A',       color: '#10b981', person: true  },
              { name: '서측 주차장', color: '#f59e0b', alert: true   },
              { name: '후문 출구',   color: '#8b5cf6', person: false },
            ].map((cam, i) => (
              <div key={i} className="lnd-cam-thumb"
                style={{ background: `linear-gradient(135deg, #0a1628, #${i % 2 === 0 ? '0d2040' : '0d2820'})` }}>
                <div className="lnd-cam-scanline" />
                <div className="lnd-cam-tbar">
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>{cam.name}</span>
                  <span style={{ fontSize: 8, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444', animation: 'live-blink 1s infinite' }} />LIVE
                  </span>
                </div>
                {cam.person && (
                  <div style={{ position: 'absolute', top: '25%', left: '20%', width: '30%', height: '40%', border: '1px solid rgba(0,212,255,0.6)', borderRadius: 2 }}>
                    <div style={{ position: 'absolute', top: -10, left: 0, fontSize: 6, color: '#00d4ff', background: 'rgba(0,0,0,0.6)', padding: '1px 3px', whiteSpace: 'nowrap' }}>
                      <Users size={5} /> 감지
                    </div>
                  </div>
                )}
                {cam.alert && (
                  <div style={{ position: 'absolute', bottom: 12, left: 4, fontSize: 7, color: '#ef4444', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 3, padding: '1px 4px', animation: 'live-blink 0.8s infinite' }}>
                    ALERT
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3px 5px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', fontSize: 7, color: '#475569', fontFamily: 'Share Tech Mono' }}>
                  {cam.color === '#f59e0b' ? '경기 33 러 4567' : `CAM-0${i + 1}`}
                </div>
              </div>
            ))}
          </div>
          {/* 하단 통계 바 */}
          <div className="lnd-preview-stats">
            {[
              { label: '활성 카메라', value: '14 / 16', color: '#00d4ff' },
              { label: '실시간 인원', value: '42명',    color: '#10b981' },
              { label: 'AI 감지',    value: '8건',     color: '#8b5cf6' },
              { label: '알림',       value: '3건',     color: '#ef4444' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color, fontFamily: 'Rajdhani' }}>{s.value}</div>
                <div style={{ fontSize: 9, color: '#475569' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 주요 지표 ── */}
      <section className="lnd-stats">
        {[
          { value: '500+',  label: '도입 기업',      icon: Building2 },
          { value: '64채널', label: '동시 스트리밍', icon: Camera   },
          { value: '99.9%', label: '시스템 가동률',  icon: Shield   },
          { value: '98.7%', label: 'AI 감지 정확도', icon: Brain    },
        ].map((s, i) => (
          <div key={i} className="lnd-stat-card">
            <s.icon size={22} color="#00d4ff" style={{ marginBottom: 8 }} />
            <div className="lnd-stat-value">{s.value}</div>
            <div className="lnd-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── 기능 소개 ── */}
      <section className="lnd-section" id="features">
        <div className="lnd-section-inner">
          <div className="lnd-section-header">
            <div className="lnd-tag">주요 기능</div>
            <h2 className="lnd-section-title">하나의 플랫폼으로 모든 것을</h2>
            <p className="lnd-section-desc">복잡한 설치 없이 로그인만으로 엔터프라이즈급 CCTV 관제 시스템을 사용할 수 있습니다.</p>
          </div>
          <div className="lnd-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="lnd-feature-card">
                <div className="lnd-feature-icon" style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 className="lnd-feature-title">{f.title}</h3>
                <p className="lnd-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 도입 방법 ── */}
      <section className="lnd-section lnd-section-dark" id="how">
        <div className="lnd-section-inner">
          <div className="lnd-section-header">
            <div className="lnd-tag">도입 방법</div>
            <h2 className="lnd-section-title">3단계로 즉시 시작</h2>
            <p className="lnd-section-desc">복잡한 설치 과정 없이 몇 분 만에 운영을 시작할 수 있습니다.</p>
          </div>
          <div className="lnd-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="lnd-step">
                <div className="lnd-step-num">{s.num}</div>
                <div className="lnd-step-line" style={{ display: i < STEPS.length - 1 ? 'block' : 'none' }} />
                <h3 className="lnd-step-title">{s.title}</h3>
                <p className="lnd-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 요금제 ── */}
      <section className="lnd-section" id="pricing">
        <div className="lnd-section-inner">
          <div className="lnd-section-header">
            <div className="lnd-tag">요금제</div>
            <h2 className="lnd-section-title">합리적인 가격으로 시작하세요</h2>
            <p className="lnd-section-desc">규모에 맞는 플랜을 선택하고, 언제든 업그레이드할 수 있습니다.</p>
          </div>
          <div className="lnd-plans">
            {PLANS.map((p, i) => (
              <div key={i} className={`lnd-plan-card ${p.popular ? 'popular' : ''}`}
                style={{ borderColor: p.popular ? p.color : undefined }}>
                {p.popular && <div className="lnd-popular-badge">인기</div>}
                <div className="lnd-plan-name" style={{ color: p.color }}>{p.name}</div>
                <div className="lnd-plan-price">
                  {p.price !== '문의' && <span className="lnd-plan-currency">₩</span>}
                  <span>{p.price}</span>
                  {p.price !== '문의' && <span className="lnd-plan-period">/월</span>}
                </div>
                <div className="lnd-plan-meta">
                  <span><Camera size={12} /> {p.cameras}</span>
                  <span><Users size={12} /> {p.users}</span>
                </div>
                <ul className="lnd-plan-features">
                  {p.features.map((f, j) => (
                    <li key={j}><CheckCircle size={13} color={p.color} />{f}</li>
                  ))}
                </ul>
                <button className="lnd-plan-btn" style={{ background: p.popular ? p.color : 'transparent', borderColor: p.color, color: p.popular ? '#000' : p.color }}
                  onClick={onGoToLogin}>
                  {p.price === '문의' ? '도입 문의하기' : '무료 체험 시작'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 배너 ── */}
      <section className="lnd-cta-section">
        <div className="lnd-cta-bg" />
        <div className="lnd-cta-content">
          <h2 className="lnd-cta-title">지금 바로 시작하세요</h2>
          <p className="lnd-cta-desc">14일 무료 체험 · 신용카드 불필요 · 언제든 해지 가능</p>
          <button className="lnd-cta-primary" style={{ fontSize: 15, padding: '12px 32px' }} onClick={onGoToLogin}>
            무료 체험 시작 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="lnd-footer">
        <div className="lnd-footer-inner">
          <div className="lnd-footer-logo">
            <Eye size={18} color="#00d4ff" />
            <span>SmartEye</span>
          </div>
          <div className="lnd-footer-links">
            <a href="#">서비스 소개</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">이용약관</a>
            <a href="#">도입 문의</a>
          </div>
          <div className="lnd-footer-copy">© 2026 SmartEye. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
