export const CAMERAS = [
  { id: 1,  name: '정문 입구 01',  location: '1층 정문',    security_level: 1, persons: 12, plate: '경기 33 러 4567', alert: false, color: '#00d4ff', status: 'online',      ip: '192.168.1.101', fps: 30, resolution: '4K',    cameraType: 'entrance', aiModel: '출입자 카운팅 · 안면 인식' },
  { id: 2,  name: '로비 A',        location: '1층 로비',    security_level: 1, persons: 12, plate: null,              alert: false, color: '#10b981', status: 'online',      ip: '192.168.1.102', fps: 30, resolution: '1080p', cameraType: 'indoor',   aiModel: '고객 카운팅 · 혼잡도 분석' },
  { id: 3,  name: '서측 주차장',   location: 'B1 서측',     security_level: 1, persons: 0,  plate: '서울 88 가 1234', alert: true,  color: '#f59e0b', status: 'online',      ip: '192.168.1.103', fps: 25, resolution: '1080p', cameraType: 'parking',  aiModel: 'LPR · 블랙리스트 감지' },
  { id: 4,  name: '후문 출구',     location: '1층 후문',    security_level: 2, persons: 2,  plate: '경기 22 나 9012', alert: false, color: '#8b5cf6', status: 'online',      ip: '192.168.1.104', fps: 30, resolution: '4K',    cameraType: 'entrance', aiModel: '출입자 카운팅 · LPR' },
  { id: 5,  name: '정문 입구 02',  location: '1층 정문',    security_level: 1, persons: 5,  plate: null,              alert: false, color: '#00d4ff', status: 'online',      ip: '192.168.1.105', fps: 30, resolution: '1080p', cameraType: 'entrance', aiModel: '출입자 카운팅' },
  { id: 6,  name: '서버룸',        location: '3층 서버룸',  security_level: 3, persons: 0,  plate: null,              alert: false, color: '#64748b', status: 'offline',     ip: '192.168.1.106', fps: 0,  resolution: '720p',  cameraType: 'indoor',   aiModel: '이상행동 감지 · 야간 모드' },
  { id: 7,  name: '동측 복도',     location: '2층 동측',    security_level: 1, persons: 3,  plate: null,              alert: false, color: '#10b981', status: 'online',      ip: '192.168.1.107', fps: 30, resolution: '1080p', cameraType: 'indoor',   aiModel: '사람 감지 · 이상행동 감지' },
  { id: 8,  name: '지하 주차장 A', location: 'B1 A구역',    security_level: 1, persons: 0,  plate: '서울 11 나 5678', alert: false, color: '#f59e0b', status: 'online',      ip: '192.168.1.108', fps: 25, resolution: '1080p', cameraType: 'parking',  aiModel: 'LPR · 입출차 자동기록' },
  { id: 9,  name: '지하 주차장 B', location: 'B1 B구역',    security_level: 1, persons: 0,  plate: null,              alert: false, color: '#f59e0b', status: 'online',      ip: '192.168.1.109', fps: 25, resolution: '720p',  cameraType: 'parking',  aiModel: 'LPR' },
  { id: 10, name: '비상구 01',     location: '2층 비상구',  security_level: 2, persons: 0,  plate: null,              alert: false, color: '#64748b', status: 'online',      ip: '192.168.1.110', fps: 15, resolution: '720p',  cameraType: 'outdoor',  aiModel: '침입 감지' },
  { id: 11, name: '비상구 02',     location: '3층 비상구',  security_level: 2, persons: 0,  plate: null,              alert: false, color: '#64748b', status: 'online',      ip: '192.168.1.111', fps: 15, resolution: '720p',  cameraType: 'outdoor',  aiModel: '침입 감지' },
  { id: 12, name: '옥상',          location: '옥상',        security_level: 3, persons: 0,  plate: null,              alert: false, color: '#64748b', status: 'maintenance', ip: '192.168.1.112', fps: 0,  resolution: '1080p', cameraType: 'outdoor',  aiModel: '야간 강화 · 침입 감지' },
  { id: 13, name: '1층 홀',        location: '1층 홀',      security_level: 1, persons: 8,  plate: null,              alert: false, color: '#10b981', status: 'online',      ip: '192.168.1.113', fps: 30, resolution: '4K',    cameraType: 'indoor',   aiModel: '고객 카운팅 · 혼잡도 분석' },
  { id: 14, name: '2층 복도',      location: '2층 복도',    security_level: 1, persons: 4,  plate: null,              alert: false, color: '#10b981', status: 'online',      ip: '192.168.1.114', fps: 30, resolution: '1080p', cameraType: 'indoor',   aiModel: '사람 감지' },
  { id: 15, name: '창고 01',       location: '1층 창고',    security_level: 3, persons: 0,  plate: null,              alert: false, color: '#64748b', status: 'offline',     ip: '192.168.1.115', fps: 0,  resolution: '720p',  cameraType: 'indoor',   aiModel: '이상행동 감지' },
  { id: 16, name: '외부 경비초소', location: '외부 경비초소', security_level: 1, persons: 1, plate: null,              alert: false, color: '#00d4ff', status: 'online',      ip: '192.168.1.116', fps: 30, resolution: '1080p', cameraType: 'outdoor',  aiModel: '야간 강화 · 배회 감지' },
]

export const EVENTS = [
  { id: 1,  type: 'person',  color: '#00d4ff', label: '새로운 사람 감지',                camera: '정문 입구 01',  cameraId: 1,  time: '14:31:58', date: '2026-06-05', severity: 'info' },
  { id: 2,  type: 'vehicle', color: '#10b981', label: '차량 입차: 경기 33 러 4567',     camera: '정문 입구 01',  cameraId: 1,  time: '14:31:55', date: '2026-06-05', severity: 'info' },
  { id: 3,  type: 'alert',   color: '#ef4444', label: '블랙리스트 차량: 서울 88 가 1234', camera: '서측 주차장',  cameraId: 3,  time: '14:31:40', date: '2026-06-05', severity: 'danger' },
  { id: 4,  type: 'person',  color: '#00d4ff', label: '사람 감지 (12명)',                camera: '로비 A',        cameraId: 2,  time: '14:31:32', date: '2026-06-05', severity: 'info' },
  { id: 5,  type: 'vehicle', color: '#10b981', label: '차량 출차: 경기 11 마 5678',     camera: '후문 출구',     cameraId: 4,  time: '14:30:55', date: '2026-06-05', severity: 'info' },
  { id: 6,  type: 'alert',   color: '#f59e0b', label: '이상 접근 탐지',                 camera: '서버룸',        cameraId: 6,  time: '14:30:20', date: '2026-06-05', severity: 'warning' },
  { id: 7,  type: 'person',  color: '#00d4ff', label: '인원 증가 감지 (12명)',           camera: '정문 입구 01',  cameraId: 1,  time: '14:29:48', date: '2026-06-05', severity: 'info' },
  { id: 8,  type: 'alert',   color: '#ef4444', label: '야간 무단 침입 감지',             camera: '동측 복도',     cameraId: 7,  time: '14:28:33', date: '2026-06-05', severity: 'danger' },
  { id: 9,  type: 'vehicle', color: '#10b981', label: '차량 입차: 서울 11 나 5678',     camera: '지하 주차장 A', cameraId: 8,  time: '14:27:15', date: '2026-06-05', severity: 'info' },
  { id: 10, type: 'alert',   color: '#f59e0b', label: '장기 체류 인원 감지 (30분)',      camera: '1층 홀',        cameraId: 13, time: '14:25:00', date: '2026-06-05', severity: 'warning' },
  { id: 11, type: 'person',  color: '#00d4ff', label: '사람 감지 (4명)',                 camera: '2층 복도',      cameraId: 14, time: '14:22:10', date: '2026-06-05', severity: 'info' },
  { id: 12, type: 'vehicle', color: '#10b981', label: '차량 출차: 경기 77 다 2211',     camera: '정문 입구 02',  cameraId: 5,  time: '14:20:03', date: '2026-06-05', severity: 'info' },
]

export const VEHICLES = [
  { id: 1,  time: '14:31:55', date: '2026-06-05', camera: '정문 입구 01',  cameraId: 1, plate: '경기 33 러 4567', status: 'entrance', isBlacklist: false },
  { id: 2,  time: '14:31:40', date: '2026-06-05', camera: '서측 주차장',   cameraId: 3, plate: '서울 88 가 1234', status: 'alert',    isBlacklist: true },
  { id: 3,  time: '14:30:55', date: '2026-06-05', camera: '후문 출구',     cameraId: 4, plate: '경기 11 마 5678', status: 'exit',     isBlacklist: false },
  { id: 4,  time: '14:28:12', date: '2026-06-05', camera: '정문 입구 01',  cameraId: 1, plate: '서울 33 가 9876', status: 'entrance', isBlacklist: false },
  { id: 5,  time: '14:25:44', date: '2026-06-05', camera: '서측 주차장',   cameraId: 3, plate: '인천 55 나 3344', status: 'exit',     isBlacklist: false },
  { id: 6,  time: '14:22:10', date: '2026-06-05', camera: '정문 입구 02',  cameraId: 5, plate: '경기 77 다 2211', status: 'entrance', isBlacklist: false },
  { id: 7,  time: '14:20:03', date: '2026-06-05', camera: '후문 출구',     cameraId: 4, plate: '서울 22 바 6677', status: 'exit',     isBlacklist: false },
  { id: 8,  time: '14:18:55', date: '2026-06-05', camera: '지하 주차장 A', cameraId: 8, plate: '서울 11 나 5678', status: 'entrance', isBlacklist: false },
  { id: 9,  time: '14:15:30', date: '2026-06-05', camera: '정문 입구 01',  cameraId: 1, plate: '경기 44 사 3344', status: 'alert',    isBlacklist: true },
  { id: 10, time: '14:12:00', date: '2026-06-05', camera: '서측 주차장',   cameraId: 3, plate: '인천 99 아 7788', status: 'exit',     isBlacklist: false },
]

export const BLACKLIST = [
  { id: 1, plate: '서울 88 가 1234', reason: '무단 침입 이력', addedDate: '2026-05-01', addedBy: '김보안', hits: 3 },
  { id: 2, plate: '경기 44 사 3344', reason: '도난 차량 신고', addedDate: '2026-05-15', addedBy: '이경비', hits: 1 },
  { id: 3, plate: '인천 11 나 9999', reason: '업무 방해',      addedDate: '2026-04-20', addedBy: '김보안', hits: 0 },
]

export const PERSON_DATA = [
  { time: '06시', value: 8  },
  { time: '07시', value: 15 },
  { time: '08시', value: 22 },
  { time: '09시', value: 45 },
  { time: '10시', value: 38 },
  { time: '11시', value: 52 },
  { time: '12시', value: 61 },
  { time: '13시', value: 48 },
  { time: '14시', value: 42 },
  { time: '15시', value: 55 },
  { time: '16시', value: 63 },
  { time: '17시', value: 58 },
  { time: '18시', value: 34 },
]

export const VEHICLE_DATA = [
  { time: '06시', entrance: 5,  exit: 2  },
  { time: '07시', entrance: 18, exit: 3  },
  { time: '08시', entrance: 28, exit: 5  },
  { time: '09시', entrance: 42, exit: 8  },
  { time: '10시', entrance: 18, exit: 22 },
  { time: '11시', entrance: 12, exit: 30 },
  { time: '12시', entrance: 25, exit: 18 },
  { time: '13시', entrance: 20, exit: 25 },
  { time: '14시', entrance: 15, exit: 32 },
  { time: '15시', entrance: 10, exit: 18 },
  { time: '16시', entrance: 8,  exit: 22 },
  { time: '17시', entrance: 5,  exit: 35 },
  { time: '18시', entrance: 3,  exit: 28 },
]

export const AI_DETECTIONS = [
  { id: 1, type: 'person',  camera: '정문 입구 01',  cameraId: 1,  confidence: 97.3, detail: '성인 남성 감지',          time: '14:31:58' },
  { id: 2, type: 'vehicle', camera: '정문 입구 01',  cameraId: 1,  confidence: 99.1, detail: '번호판: 경기 33 러 4567', time: '14:31:55' },
  { id: 3, type: 'anomaly', camera: '서측 주차장',   cameraId: 3,  confidence: 88.7, detail: '블랙리스트 차량 감지',    time: '14:31:40' },
  { id: 4, type: 'person',  camera: '로비 A',        cameraId: 2,  confidence: 95.2, detail: '성인 여성 감지',          time: '14:31:32' },
  { id: 5, type: 'anomaly', camera: '서버룸',         cameraId: 6,  confidence: 78.4, detail: '야간 출입 이상 감지',     time: '14:30:20' },
  { id: 6, type: 'vehicle', camera: '지하 주차장 A', cameraId: 8,  confidence: 96.8, detail: '번호판: 서울 11 나 5678', time: '14:27:15' },
  { id: 7, type: 'person',  camera: '1층 홀',         cameraId: 13, confidence: 92.4, detail: '다수 인원 감지 (8명)',    time: '14:25:00' },
  { id: 8, type: 'anomaly', camera: '동측 복도',     cameraId: 7,  confidence: 83.1, detail: '야간 무단 침입',          time: '14:28:33' },
]

export const USERS = [
  { id: 1, name: '김보안',   role: '관리자',   email: 'admin@smarteye.kr',   lastLogin: '2026-06-05 14:30', status: 'online'  },
  { id: 2, name: '이경비',   role: '운영자',   email: 'ops@smarteye.kr',     lastLogin: '2026-06-05 09:15', status: 'online'  },
  { id: 3, name: '박모니터', role: '모니터링', email: 'monitor@smarteye.kr', lastLogin: '2026-06-04 18:00', status: 'offline' },
]

export const CAMERA_UTILIZATION = [
  { name: '정문 입구 01',  detections: 142, uptime: 99.9, alerts: 2 },
  { name: '로비 A',        detections: 98,  uptime: 99.9, alerts: 0 },
  { name: '서측 주차장',   detections: 87,  uptime: 98.5, alerts: 5 },
  { name: '후문 출구',     detections: 76,  uptime: 99.9, alerts: 1 },
  { name: '정문 입구 02',  detections: 65,  uptime: 99.9, alerts: 0 },
  { name: '지하 주차장 A', detections: 54,  uptime: 97.2, alerts: 1 },
  { name: '1층 홀',         detections: 112, uptime: 99.9, alerts: 0 },
  { name: '2층 복도',      detections: 43,  uptime: 99.9, alerts: 0 },
]
