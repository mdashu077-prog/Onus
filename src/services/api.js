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

export async function getMyProfile() {
  return protectedRequest(
    '/api/profile/me',
    {
      method: 'GET',
    }
  )
}

export async function updateMyProfile(payload) {
  return protectedRequest(
    '/api/profile/me',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  )
}

export async function changePassword(payload) {
  return protectedRequest(
    '/api/profile/change-password',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  )
}

export async function getMyReferralStats() {
  return protectedRequest(
    '/api/referrals/me',
    {
      method: 'GET',
    }
  )
}

export async function validateReferralCode(referralCode) {
  return protectedRequest(
    '/api/referrals/validate',
    {
      method: 'POST',
      body: JSON.stringify({ referralCode }),
    }
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

export async function deleteAdminUser(userId) {
  return protectedRequest(
    `/api/admin/users/${userId}`,
    {
      method: 'DELETE',
    }
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

  if (token) {
    headers.Authorization =
      `Bearer ${token}`
  }

  const isJwtExpired = (jwt) => {
    if (!jwt || typeof jwt !== 'string') return true

    try {
      const payload = jwt.split('.')[1]
      if (!payload) return true

      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
      return Number(decoded.exp || 0) * 1000 <= Date.now()
    } catch {
      return true
    }
  }


  // ===================================================
  // CONTENT TYPE
  // ===================================================

  if (isFormData) {

    // FormData ke saath Content-Type manually
    // set nahi karna hai.

    delete headers['Content-Type']

  } else {

    headers['Content-Type'] =
      'application/json'
  }


  // ===================================================
  // REQUEST
  // ===================================================

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


  // ===================================================
  // RESPONSE PARSE
  // ===================================================

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
    if ((response.status === 401 || response.status === 403) && token && isJwtExpired(token)) {
      localStorage.removeItem('onus_token')
      localStorage.removeItem('onus-auth')
      window.dispatchEvent(new CustomEvent('onus:auth-clear'))
    }

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
// GET ALL JOBS
// =====================================================

export async function getJobs(params = {}) {
  const query = new URLSearchParams()

  if (params.category) {
    query.set('category', params.category)
  }

  if (params.type) {
    query.set('type', params.type)
  }

  if (params.search) {
    query.set('search', params.search)
  }

  const url = `${BASE_URL}/api/jobs${query.toString() ? `?${query.toString()}` : ''}`
  const response = await fetch(url)

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


// =====================================================
// RECRUITER - GET MY JOBS
// =====================================================

export async function getMyJobs() {

  const response =
    await protectedRequest(
      '/api/jobs/my',
      {
        method: 'GET',
      }
    )


  if (!Array.isArray(response)) {
    throw new Error(
      'Invalid jobs response'
    )
  }


  return response
}


// =====================================================
// RECRUITER - CREATE JOB
// =====================================================

export async function createJob(job) {

  if (!job) {
    throw new Error(
      'Job data is missing'
    )
  }


  return protectedRequest(
    '/api/jobs',
    {
      method: 'POST',
      body: JSON.stringify(job),
    }
  )
}


// =====================================================
// RECRUITER - UPDATE JOB
// =====================================================

export async function updateJob(
  jobId,
  job
) {

  if (!jobId) {
    throw new Error(
      'Job ID is missing'
    )
  }


  if (!job) {
    throw new Error(
      'Job data is missing'
    )
  }


  return protectedRequest(
    `/api/jobs/${jobId}`,
    {
      method: 'PUT',
      body: JSON.stringify(job),
    }
  )
}


// =====================================================
// RECRUITER - DELETE JOB
// =====================================================

export async function deleteJob(
  jobId
) {

  if (!jobId) {
    throw new Error(
      'Job ID is missing'
    )
  }


  return protectedRequest(
    `/api/jobs/${jobId}`,
    {
      method: 'DELETE',
    }
  )
}

export async function extendJob(jobId, expiresAt) {
  if (!jobId) {
    throw new Error('Job ID is missing')
  }

  return protectedRequest(`/api/jobs/${jobId}/extend`, {
    method: 'POST',
    body: JSON.stringify({ expiresAt }),
  })
}

export async function closeJob(jobId) {
  if (!jobId) {
    throw new Error('Job ID is missing')
  }

  return protectedRequest(`/api/jobs/${jobId}/close`, {
    method: 'POST',
  })
}

export async function reopenJob(jobId, payload = {}) {
  if (!jobId) {
    throw new Error('Job ID is missing')
  }

  return protectedRequest(`/api/jobs/${jobId}/reopen`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}


// =====================================================
// APPLY FOR JOB
// =====================================================

export async function applyForJob(
  jobId,
  formData
) {

  if (!jobId) {
    throw new Error(
      'Job ID is missing'
    )
  }


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