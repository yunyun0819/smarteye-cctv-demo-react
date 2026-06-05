import * as mock from './mock'
import * as real from './real'

const m = import.meta.env.VITE_USE_MOCK === 'true' ? mock : real

export const { cameraApi, eventApi, vehicleApi, analysisApi, userApi } = m
