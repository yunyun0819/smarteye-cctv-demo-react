import { useState, useEffect } from 'react'
import { BarChart3, Download, Calendar, TrendingUp, Users, Car, Camera, Activity } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { analysisApi } from '../api'

const PERIODS = ['일간', '주간', '월간']

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(10,16,32,0.95)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 11 }}>
      <div style={{ color: '#64748b', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}{p.name.includes('명') || p.name === '사람' ? '명' : '건'}</div>
      ))}
    </div>
  )
}

export default function Reports() {
  const [period, setPeriod] = useState(0)
  const [personData, setPersonData] = useState([])
  const [vehicleData, setVehicleData] = useState([])
  const [utilization, setUtilization] = useState([])

  useEffect(() => {
    analysisApi.getPersonData().then(setPersonData)
    analysisApi.getVehicleData().then(setVehicleData)
    analysisApi.getUtilization().then(setUtilization)
  }, [])

  const totalPerson  = personData.reduce((s, d) => s + d.value, 0)
  const totalEntrance = vehicleData.reduce((s, d) => s + d.entrance, 0)
  const totalExit     = vehicleData.reduce((s, d) => s + d.exit, 0)
  const peakHour = personData.reduce((max, d) => d.value > max.value ? d : max, { value: 0, time: '—' })

  return (
    <div className="content">
      {/* 기간 선택 + 다운로드 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={14} color="#64748b" />
          <span style={{ fontSize: 11, color: '#64748b' }}>조회 기간</span>
          <div className="grid-controls">
            {PERIODS.map((p, i) => (
              <button key={i} className={`grid-btn ${period === i ? 'active' : ''}`}
                onClick={() => setPeriod(i)}>{p}</button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#475569', fontFamily: 'Share Tech Mono' }}>2026-06-05</span>
        </div>
        <button className="add-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }}>
          <Download size={13} /> 리포트 다운로드
        </button>
      </div>

      {/* 요약 KPI */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <Users size={18} color="#00d4ff" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#00d4ff' }}>{totalPerson}명</div>
            <div className="kpi-label">총 인원 감지</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Car size={18} color="#10b981" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#10b981' }}>{totalEntrance + totalExit}건</div>
            <div className="kpi-label">총 차량 출입</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <TrendingUp size={18} color="#f59e0b" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#f59e0b' }}>{peakHour.time}</div>
            <div className="kpi-label">피크 시간대 ({peakHour.value}명)</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Activity size={18} color="#8b5cf6" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value" style={{ color: '#8b5cf6' }}>98.7%</div>
            <div className="kpi-label">시스템 가동률</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* 인원 추이 */}
        <section className="cam-section">
          <div className="section-header">
            <div className="section-title">
              <Users size={14} color="#00d4ff" />
              <span>시간별 인원 현황</span>
            </div>
            <span className="section-badge">{PERIODS[period]}</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={personData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rptPersonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="사람" stroke="#00d4ff" strokeWidth={2}
                fill="url(#rptPersonGrad)" dot={false}
                activeDot={{ r: 4, fill: '#00d4ff', stroke: '#0a0e1a', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* 차량 입출차 */}
        <section className="cam-section">
          <div className="section-header">
            <div className="section-title">
              <Car size={14} color="#10b981" />
              <span>시간별 차량 입출차</span>
            </div>
            <span className="section-badge green">{PERIODS[period]}</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={vehicleData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="entrance" name="입차" fill="#10b981" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
              <Bar dataKey="exit"     name="출차" fill="#00d4ff" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* 카메라별 활용도 */}
      <section className="cam-section">
        <div className="section-header">
          <div className="section-title">
            <Camera size={14} color="#8b5cf6" />
            <span>카메라별 활용 현황</span>
          </div>
        </div>
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>카메라명</th>
              <th>감지 건수</th>
              <th>가동률</th>
              <th>가동률 그래프</th>
              <th>알림 발생</th>
            </tr>
          </thead>
          <tbody>
            {utilization.map((u, i) => (
              <tr key={i}>
                <td style={{ color: '#e2e8f0', fontSize: 12 }}>{u.name}</td>
                <td style={{ fontFamily: 'Share Tech Mono', color: '#00d4ff', fontSize: 12 }}>{u.detections}건</td>
                <td style={{ fontFamily: 'Share Tech Mono', color: u.uptime > 99 ? '#10b981' : '#f59e0b', fontSize: 12 }}>
                  {u.uptime}%
                </td>
                <td style={{ width: 200 }}>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${u.uptime}%`, height: '100%', background: u.uptime > 99 ? '#10b981' : '#f59e0b', borderRadius: 3 }} />
                  </div>
                </td>
                <td>
                  {u.alerts > 0
                    ? <span style={{ fontSize: 11, color: '#ef4444', fontFamily: 'Share Tech Mono' }}>{u.alerts}건</span>
                    : <span style={{ fontSize: 11, color: '#334155' }}>—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
