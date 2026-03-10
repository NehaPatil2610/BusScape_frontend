const fallbackBackendUrl = 'http://localhost:3000'
const configuredBackendUrl = import.meta.env.VITE_BACKEND_BASE_URL

export const BACKEND_BASE_URL = (
  configuredBackendUrl && configuredBackendUrl.trim().length > 0
    ? configuredBackendUrl
    : fallbackBackendUrl
).replace(/\/+$/, '')
