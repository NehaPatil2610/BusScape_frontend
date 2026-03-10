import type { ApiResponse, HttpMethod } from '../types/api'
import { BACKEND_BASE_URL } from '../utils/env'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export async function httpRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers, signal } = options
  const defaultHeaders: HeadersInit =
    body === undefined ? {} : { 'Content-Type': 'application/json' }

  const response = await fetch(`${BACKEND_BASE_URL}${normalizePath(path)}`, {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
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
