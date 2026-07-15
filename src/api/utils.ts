export const API_URL = 'http://localhost:3000'

export type ApiResponse<T> = {
  ok: boolean
  status: number
  data: T | null
  error?: string
}

export async function fetchApi<T = any>(input: RequestInfo, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(input, init)
    const text = await response.text()
    let data: any = null

    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }
    }

    const error = response.ok
      ? undefined
      : data?.error || data?.message || `Request failed with status ${response.status}`

    return {
      ok: response.ok,
      status: response.status,
      data,
      error,
    }
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err?.message || 'Network error',
    }
  }
}
