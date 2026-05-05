const LOGTO_ENDPOINT = 'https://df4in1.logto.app'

export interface AccountUpdate {
  username?: string
  name?: string
  avatar?: string
}

export interface AccountProfileUpdate {
  familyName?: string
  givenName?: string
  middleName?: string
  nickname?: string
  preferredUsername?: string
  profile?: string
  website?: string
  gender?: string
  birthdate?: string
  zoneinfo?: string
  locale?: string
  address?: Record<string, string>
}

export interface CustomDataUpdate {
  [key: string]: unknown
}

async function patch<T extends object>(path: string, accessToken: string, body: T) {
  const response = await fetch(`${LOGTO_ENDPOINT}${path}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `Logto ${path} failed (${response.status}): ${text || response.statusText}`,
    )
  }

  if (response.status === 204) return undefined
  return response.json()
}

export function updateAccount(accessToken: string, updates: AccountUpdate) {
  return patch('/api/my-account', accessToken, updates)
}

export function updateAccountProfile(
  accessToken: string,
  updates: AccountProfileUpdate,
) {
  return patch('/api/my-account/profile', accessToken, updates)
}

export function updateCustomData(accessToken: string, customData: CustomDataUpdate) {
  return patch('/api/my-account/custom-data', accessToken, customData)
}
