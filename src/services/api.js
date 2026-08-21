const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:9090'


// =====================================================
// NORMAL API REQUEST
// =====================================================

async function apiRequest(path, body) {
  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  const text = await response.text()

  let data = {}

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = {
        message: text,
      }
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Server error (${response.status})`
    )
  }

  return data
}


// =====================================================
// REGISTER
// =====================================================

export function registerUser(payload) {
  return apiRequest(
    '/api/register',
    payload
  )
}


// =====================================================
// LOGIN
// =====================================================

export function loginUser(payload) {
  return apiRequest(
    '/api/login',
    payload
  )
}


// =====================================================
// PROTECTED REQUEST
// =====================================================

export async function protectedRequest(
  path,
  options = {}
) {
  const token =
    localStorage.getItem('onus_token')

  const isFormData =
    options.body instanceof FormData

  const headers = {
    ...(options.headers || {}),
  }

  // ===================================================
  // JWT TOKEN
  // ===================================================

  if (token) {
    headers.Authorization =
      `Bearer ${token}`
  }

  // ===================================================
  // CONTENT TYPE
  // ===================================================

  if (isFormData) {
    // FormData ke saath Content-Type manually
    // set nahi karna hai.
    //
    // Browser automatically:
    // multipart/form-data; boundary=...
    // set karega.

    delete headers['Content-Type']
  } else {
    headers['Content-Type'] =
      'application/json'
  }

  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  )

  const text =
    await response.text()

  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  // ===================================================
  // ERROR HANDLING
  // ===================================================

  if (!response.ok) {
    let message =
      `Server error (${response.status})`

    if (
      data &&
      typeof data === 'object' &&
      data.message
    ) {
      message = data.message
    } else if (
      typeof data === 'string' &&
      data
    ) {
      message = data
    }

    throw new Error(message)
  }

  return data
}


// =====================================================
// GET JOBS
// =====================================================

export async function getJobs() {
  const response =
    await fetch(
      `${BASE_URL}/api/jobs`
    )

  const text =
    await response.text()

  let data = []

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(
        'Invalid server response'
      )
    }
  }

  if (!response.ok) {
    throw new Error(
      'Failed to fetch jobs'
    )
  }

  return data
}


// =====================================================
// APPLY FOR JOB
// =====================================================

export async function applyForJob(
  jobId,
  formData
) {
  // ===================================================
  // JOB ID CHECK
  // ===================================================

  if (!jobId) {
    throw new Error(
      'Job ID is missing'
    )
  }

  // ===================================================
  // FORMDATA CHECK
  // ===================================================

  if (!(formData instanceof FormData)) {
    throw new Error(
      'Application data must be FormData'
    )
  }

  return protectedRequest(
    `/api/applications/${jobId}`,
    {
      method: 'POST',
      body: formData,
    }
  )
}


// =====================================================
// CHECK APPLICATION STATUS
// =====================================================

export async function checkApplicationStatus(
  jobId
) {
  // ===================================================
  // JOB ID CHECK
  // ===================================================

  if (!jobId) {
    throw new Error(
      'Job ID is missing'
    )
  }

  const response =
    await protectedRequest(
      `/api/applications/check/${jobId}`,
      {
        method: 'GET',
      }
    )

  // ===================================================
  // VALIDATE RESPONSE
  // ===================================================

  if (
    !response ||
    typeof response !== 'object'
  ) {
    throw new Error(
      'Invalid application status response'
    )
  }

  return {
    applied:
      response.applied === true,
  }
}


// =====================================================
// MY APPLICATIONS
// =====================================================

export async function getMyApplications() {
  const response =
    await protectedRequest(
      '/api/applications/my',
      {
        method: 'GET',
      }
    )

  if (!response) {
    return []
  }

  if (Array.isArray(response)) {
    return response
  }

  throw new Error(
    'Invalid applications response'
  )
}


// =====================================================
// GET MY RESUME INFORMATION
// =====================================================
//
// Backend endpoint:
//
// GET /api/applications/resume
//
// Response:
//
// {
//   "fileName": "resume.pdf",
//   "contentType": "application/pdf"
// }
//
// =====================================================

export async function getMyResume() {
  const response =
    await protectedRequest(
      '/api/applications/resume',
      {
        method: 'GET',
      }
    )

  if (
    !response ||
    typeof response !== 'object'
  ) {
    throw new Error(
      'Invalid resume response'
    )
  }

  return response
}


// =====================================================
// VIEW MY RESUME
// =====================================================
//
// Backend endpoint:
//
// GET /api/applications/resume/view
//
// Returns PDF Blob.
//
// =====================================================

export async function viewMyResume() {
  const token =
    localStorage.getItem('onus_token')

  if (!token) {
    throw new Error(
      'Please login again'
    )
  }

  const response =
    await fetch(
      `${BASE_URL}/api/applications/resume/view`,
      {
        method: 'GET',
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )

  if (!response.ok) {
    const text =
      await response.text()

    let message =
      `Failed to view resume (${response.status})`

    if (text) {
      try {
        const data =
          JSON.parse(text)

        message =
          data?.message ||
          message
      } catch {
        message = text
      }
    }

    throw new Error(message)
  }

  return response.blob()
}


// =====================================================
// DOWNLOAD MY RESUME
// =====================================================
//
// Backend endpoint:
//
// GET /api/applications/resume/download
//
// Returns resume Blob.
//
// =====================================================

export async function downloadMyResume() {
  const token =
    localStorage.getItem('onus_token')

  if (!token) {
    throw new Error(
      'Please login again'
    )
  }

  const response =
    await fetch(
      `${BASE_URL}/api/applications/resume/download`,
      {
        method: 'GET',
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )

  if (!response.ok) {
    const text =
      await response.text()

    let message =
      `Failed to download resume (${response.status})`

    if (text) {
      try {
        const data =
          JSON.parse(text)

        message =
          data?.message ||
          message
      } catch {
        message = text
      }
    }

    throw new Error(message)
  }

  return response.blob()
}