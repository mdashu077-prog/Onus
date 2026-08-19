import { useEffect, useState } from 'react'
import { protectedRequest } from '../services/api'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:9090'

export default function Resume() {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  // =====================================================
  // LOAD RESUME INFORMATION
  // =====================================================

  async function loadResume() {
    try {
      setLoading(true)
      setError('')

      const response =
        await protectedRequest(
          '/api/applications/resume',
          {
            method: 'GET',
          }
        )

      setResume(response)

    } catch (err) {
      console.error(
        'Failed to load resume:',
        err
      )

      if (
        err.message ===
        'No resume found'
      ) {
        setResume(null)
      } else {
        setError(
          err.message ||
            'Failed to load resume'
        )
      }

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResume()
  }, [])

  // =====================================================
  // VIEW RESUME
  // =====================================================

  async function handleViewResume() {
    try {
      setError('')

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

        throw new Error(
          text ||
            `Failed to view resume (${response.status})`
        )
      }

      const blob =
        await response.blob()

      const url =
        window.URL.createObjectURL(blob)

      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      )

      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 60000)

    } catch (err) {
      console.error(
        'Failed to view resume:',
        err
      )

      setError(
        err.message ||
          'Failed to view resume'
      )
    }
  }

  // =====================================================
  // DOWNLOAD RESUME
  // =====================================================

  async function handleDownloadResume() {
    try {
      setError('')
      setDownloading(true)

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

        throw new Error(
          text ||
            `Failed to download resume (${response.status})`
        )
      }

      const blob =
        await response.blob()

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = url

      link.download =
        resume?.fileName ||
        'resume.pdf'

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error(
        'Failed to download resume:',
        err
      )

      setError(
        err.message ||
          'Failed to download resume'
      )

    } finally {
      setDownloading(false)
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="bg-bg py-16 min-h-screen">
        <div className="container-center">
          <p className="text-slate-600">
            Loading resume...
          </p>
        </div>
      </section>
    )
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="bg-bg py-14 min-h-screen">

      <div className="container-center max-w-4xl">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-sm uppercase tracking-[0.28em] text-primary">
            Job Seeker
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-secondary">
            Resume
          </h1>

          <p className="mt-2 text-slate-600">
            View and download your uploaded resume.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

          </div>
        )}


        {/* RESUME CARD */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">

          <h2 className="text-xl font-semibold text-secondary">
            Your Resume
          </h2>


          {resume ? (

            <div className="mt-6">

              {/* FILE INFO */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      Resume file
                    </p>

                    <p className="mt-2 font-semibold text-secondary break-all">
                      {resume.fileName ||
                        'resume.pdf'}
                    </p>

                    {resume.contentType && (
                      <p className="mt-1 text-sm text-slate-500">
                        {resume.contentType}
                      </p>
                    )}

                  </div>

                  <div className="text-4xl">
                    📄
                  </div>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={
                    handleViewResume
                  }
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition"
                >
                  View Resume
                </button>


                <button
                  type="button"
                  onClick={
                    handleDownloadResume
                  }
                  disabled={downloading}
                  className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 transition"
                >
                  {downloading
                    ? 'Downloading...'
                    : 'Download Resume'}
                </button>

              </div>

            </div>

          ) : (

            /* NO RESUME */

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

              <div className="text-4xl">
                📄
              </div>

              <p className="mt-4 font-semibold text-secondary">
                No resume found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Upload a resume while applying
                for a job.
              </p>

            </div>

          )}

        </div>

      </div>

    </section>
  )
}