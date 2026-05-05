import type { ApiResponse, HttpMethod } from '../types/api'
import { BACKEND_BASE_URL } from '../utils/env'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

let currentUserSub: string | null = null

export function setCurrentUserSub(sub: string | null) {
  currentUserSub = sub
}

export function getCurrentUserSub(): string | null {
  return currentUserSub
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export async function httpRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers, signal } = options
  const defaultHeaders: Record<string, string> = {}
  if (body !== undefined) defaultHeaders['Content-Type'] = 'application/json'
  if (currentUserSub) defaultHeaders['x-user-sub'] = currentUserSub

  const response = await fetch(`${BACKEND_BASE_URL}${normalizePath(path)}`, {
    method,
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string> | undefined),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data = (await response.json()) as T

  return {
    data,
    status: response.status,
  }
}
