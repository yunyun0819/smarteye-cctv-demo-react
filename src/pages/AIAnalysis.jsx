import { useState, useEffect } from 'react'
import {
  Brain, Users, Car, AlertTriangle, Camera,
  TrendingUp, Activity, Zap, Eye,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { analysisApi } from '../api'

const typeConfig = {
  person:  { label: '사람',   color: '#00d4ff', Icon: Users },
  vehicle: { label: '차량',   color: '#10b981', Icon: Car   },
  anomaly: { label: '이상행동', color: '#ef4444', Icon: AlertTriangle },
}

function ConfidenceBar({ value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, boxShadow: `0 0 6px ${color}60` }} />
      </div>
      <span style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color, minWidth: 42 }}>{value.toFixed(1)}%</span>
    </div>
  )
}

const PIE_COLORS = ['#00d4ff', '#10b981', '#ef4444']

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(10,16,32,0.95)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 11 }}>
      <div style={{ color: '#64748b' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}건</div>
      ))}
    </div>
  )
}

export default function AIAnalysis() {
  const [detections, setDetections] = useState([])
  const [personData, setPersonData] = useState([])
  const [vehicleData, setVehicleData] = useState([])

  useEffect(() => {
    analysisApi.getDetections().then(setDetections)
    analysisApi.getPersonData().then(setPersonData)
    analysisApi.getVehicleData().then(setVehicleData)
  }, [])

  const persons  = detections.filter(d => d.type === 'person').length
  const vehicles = detections.filter(d => d.type === 'vehicle').length
  const anomalies = detections.filter(d => d.type === 'anomaly').length
  const avgConf = detections.length
    ? (detections.reduce((s, d) => s + d.confidence, 0) / detections.length).toFixed(1)
    : 0

  const pieData = [
    { name: '사람',    value: persons  },
    { name: '차량',    value: vehicles },
    { name: '이상행동', value: anomalies },
  ]

  const barData = personData.map((p, i) => ({
    time: p.time,
    사람: p.value,
    차량: vehicleData[i]?.entrance ?? 0,
  }))

  return (
    <div className="content">
      {/* KPI */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Brain size={18} color="#8b5cf6" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#8b5cf6' }}>{detections.length}건</div>
            <div className="kpi-label">금일 총 감지</div>
          </div>
          <div className="kpi-trend" style={{ color: '#10b981' }}><TrendingUp size={12} /><span>8%</span></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <Users size={18} color="#00d4ff" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#00d4ff' }}>{persons}건</div>
            <div className="kpi-label">사람 감지</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Car size={18} color="#10b981" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#10b981' }}>{vehicles}건</div>
            <div className="kpi-label">차량 감지</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#ef4444' }}>{anomalies}건</div>
            <div className="kpi-label">이상 감지</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
        {/* 시간별 감지 현황 차트 */}
        <section className="cam-section">
          <div className="section-header">
            <div className="section-title">
              <Activity size={14} color="#8b5cf6" />
              <span>시간별 감지 현황</span>
            </div>
            <span className="section-badge">오늘</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="사람" fill="#00d4ff" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
              <Bar dataKey="차량" fill="#10b981" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* 감지 비율 */}
        <section className="cam-section" style={{ alignItems: 'center' }}>
          <div className="section-header" style={{ width: '100%' }}>
            <div className="section-title">
              <Eye size={14} color="#8b5cf6" />
              <span>감지 유형 비율</span>
            </div>
          </div>
          <PieChart width={220} height={160}>
            <Pie data={pieData} cx={110} cy={75} innerRadius={45} outerRadius={70}
              paddingAngle={3} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v}건`, n]} />
          </PieChart>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i] }} />
                  <span style={{ color: '#94a3b8' }}>{d.name}</span>
                </div>
                <span style={{ color: PIE_COLORS[i], fontFamily: 'Share Tech Mono' }}>{d.value}건</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 실시간 감지 목록 */}
      <section className="cam-section">
        <div className="section-header">
          <div className="section-title">
            <Zap size={14} color="#f59e0b" />
            <span>최근 AI 감지 결과</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#475569' }}>평균 신뢰도</span>
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 12, color: '#8b5cf6' }}>{avgConf}%</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 헤더 */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 180px', gap: 8, padding: '4px 10px', fontSize: 10, color: '#475569', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
            <span>유형</span><span>카메라</span><span>감지 내용</span><span>신뢰도</span>
          </div>
          {detections.map((d, i) => {
            const cfg = typeConfig[d.type]
            return (
              <div key={d.id} className="ai-detection-row" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className={`det-badge det-${d.type}`}>
                  <cfg.Icon size={10} /> {cfg.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <Camera size={10} color="#475569" />
                  <span style={{ color: '#94a3b8' }}>{d.camera}</span>
                </div>
                <span style={{ fontSize: 12, color: '#e2e8f0' }}>{d.detail}</span>
                <ConfidenceBar value={d.confidence} color={cfg.color} />
                <span style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#475569', textAlign: 'right' }}>{d.time}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
