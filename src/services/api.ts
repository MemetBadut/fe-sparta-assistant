const BASE_URL = import.meta.env.VITE_API_URL ?? ''
const ORIGIN = BASE_URL.replace(/\/api\/?$/, '')

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export async function ensureCsrfCookie(): Promise<void> {
  if (getCookie('XSRF-TOKEN')) return
  await fetch(`${ORIGIN}/sanctum/csrf-cookie`, { credentials: 'include' })
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  await ensureCsrfCookie()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
      ...options.headers,
    },
  })
  if (!res.ok) throw new ApiError(res.status, await res.text())
  return res.status === 204 ? (undefined as T) : res.json()
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
