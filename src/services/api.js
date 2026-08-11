const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'

async function apiRequest(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const text = await response.text()

  let data = {}

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Server error (${response.status})`)
  }

  return data
}

export function registerUser(payload) {
  return apiRequest('/api/register', payload)
}

export function loginUser(payload) {
  return apiRequest('/api/login', payload)
}

export async function protectedRequest(path, options = {}) {
  const token = localStorage.getItem('onus_token')

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token}`
          }
        : {}),
      ...options.headers,
    },
  })

  const text = await response.text()

  if (!response.ok) {
    throw new Error(text || `Server error (${response.status})`)
  }

  return text
}

// GET ALL JOBS
export async function getJobs() {
  const response = await fetch(`${BASE_URL}/api/jobs`)

  const text = await response.text()

  let data = []

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error('Invalid server response')
    }
  }

  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }

  return data
}