import { api } from './Http'

export const cameraApi = {
  getAll:  ()     => api.get('/api/cameras').then(r => r.data),
  getById: (id)   => api.get(`/api/cameras/${id}`).then(r => r.data),
  add:     (data) => api.post('/api/cameras', data).then(r => r.data),
}

export const eventApi = {
  getAll:        ()         => api.get('/api/events').then(r => r.data),
  getByCamera:   (cameraId) => api.get('/api/events', { params: { cameraId } }).then(r => r.data),
  getBySeverity: (severity) => api.get('/api/events', { params: { severity } }).then(r => r.data),
}

export const vehicleApi = {
  getAll:              ()     => api.get('/api/vehicles').then(r => r.data),
  getBlacklist:        ()     => api.get('/api/vehicles/blacklist').then(r => r.data),
  addToBlacklist:      (data) => api.post('/api/vehicles/blacklist', data).then(r => r.data),
  removeFromBlacklist: (id)   => api.delete(`/api/vehicles/blacklist/${id}`).then(r => r.data),
  searchByPlate:       (q)    => api.get('/api/vehicles', { params: { plate: q } }).then(r => r.data),
}

export const analysisApi = {
  getDetections:  () => api.get('/api/analysis/detections').then(r => r.data),
  getPersonData:  () => api.get('/api/analysis/persons').then(r => r.data),
  getVehicleData: () => api.get('/api/analysis/vehicles').then(r => r.data),
  getUtilization: () => api.get('/api/analysis/utilization').then(r => r.data),
}

export const userApi = {
  getAll: () => api.get('/api/users').then(r => r.data),
}
