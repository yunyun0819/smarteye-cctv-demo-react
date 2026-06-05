import {
  CAMERAS, EVENTS, VEHICLES, BLACKLIST,
  PERSON_DATA, VEHICLE_DATA, AI_DETECTIONS,
  USERS, CAMERA_UTILIZATION,
} from '../data/mockData'

export const cameraApi = {
  getAll:  ()     => Promise.resolve([...CAMERAS]),
  getById: (id)   => Promise.resolve(CAMERAS.find(c => c.id === id) ?? null),
  add:     (data) => {
    const newCam = { ...data, id: Math.max(...CAMERAS.map(c => c.id)) + 1 }
    CAMERAS.push(newCam)
    return Promise.resolve(newCam)
  },
}

export const eventApi = {
  getAll:        ()         => Promise.resolve(EVENTS),
  getByCamera:   (cameraId) => Promise.resolve(EVENTS.filter(e => e.cameraId === cameraId)),
  getBySeverity: (severity) => Promise.resolve(EVENTS.filter(e => e.severity === severity)),
}

export const vehicleApi = {
  getAll:              ()     => Promise.resolve(VEHICLES),
  getBlacklist:        ()     => Promise.resolve(BLACKLIST),
  addToBlacklist:      (data) => Promise.resolve({ ...data, id: Date.now(), hits: 0 }),
  removeFromBlacklist: (id)   => Promise.resolve({ success: true }),
  searchByPlate:       (q)    => Promise.resolve(VEHICLES.filter(v => v.plate.includes(q))),
}

export const analysisApi = {
  getDetections:  () => Promise.resolve(AI_DETECTIONS),
  getPersonData:  () => Promise.resolve(PERSON_DATA),
  getVehicleData: () => Promise.resolve(VEHICLE_DATA),
  getUtilization: () => Promise.resolve(CAMERA_UTILIZATION),
}

export const userApi = {
  getAll: () => Promise.resolve(USERS),
}
