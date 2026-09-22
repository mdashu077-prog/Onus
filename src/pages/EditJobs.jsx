import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft, BriefcaseBusiness } from 'lucide-react'
import { protectedRequest } from '../services/api'

export default function EditJobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'Full time',
    experienceLevel: 'GENERAL',
    description: '',
  })

  async function loadMyJobs() {
    try {
      setLoading(true)

      const response = await protectedRequest('/api/jobs/my', {
        method: 'GET',
      })

      let data = response

      if (typeof response === 'string') {
        try {
          data = JSON.parse(response)
        } catch {
          data = []
        }
      }

      setJobs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('LOAD MY JOBS ERROR:', error)
      alert(error.message || 'Failed to load your posts')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyJobs()
  }, [])

  function startEdit(job) {
    setEditingJob(job)

    setForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      jobType: job.jobType || 'Full time',
      experienceLevel: job.experienceLevel || 'GENERAL',
      description: job.description || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function cancelEdit() {
    setEditingJob(null)

    setForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      jobType: 'Full time',
      experienceLevel: 'GENERAL',
      description: '',
    })
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleUpdate(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      alert('Please enter job title')
      return
    }

    if (!form.company.trim()) {
      alert('Please enter company name')
      return
    }

    try {
      setSaving(true)

      const jobData = {
        title: form.title,
        company: form.company,
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        experienceLevel: form.experienceLevel || 'GENERAL',
        description: form.description,
      }

      const response = await protectedRequest(
        `/api/jobs/${editingJob.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(jobData),
        }
      )

      let updatedJob = response

      if (typeof response === 'string') {
        try {
          updatedJob = JSON.parse(response)
        } catch {
          updatedJob = null
        }
      }

      if (updatedJob) {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === editingJob.id
              ? updatedJob
              : job
          )
        )
      } else {
        await loadMyJobs()
      }

      alert('Post updated successfully!')

      cancelEdit()
    } catch (error) {
      console.error('UPDATE JOB ERROR:', error)
      alert(error.message || 'Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(jobId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    )

    if (!confirmed) return

    try {
      await protectedRequest(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      setJobs((prev) =>
        prev.filter((job) => job.id !== jobId)
      )

      if (editingJob?.id === jobId) {
        cancelEdit()
      }

      alert('Post deleted successfully!')
    } catch (error) {
      console.error('DELETE JOB ERROR:', error)
      alert(error.message || 'Failed to delete post')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <section className="bg-[#2563EB] px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl">

          <button
            type="button"
            onClick={() => navigate('/employer')}
            className="
              mb-5
              flex
              items-center
              gap-2
              rounded-xl
              bg-white/10
              px-4
              py-2
              text-sm
              font-medium
              transition
              hover:bg-white/20
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-white/15
              "
            >
              <Pencil className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Edit Posts
              </h1>

              <p className="mt-1 text-sm text-white/80">
                Manage and update your posted jobs and internships
              </p>
            </div>

          </div>

        </div>
      </section>


      <main className="mx-auto max-w-6xl px-4 py-8">

        {/* EDIT FORM */}

        {editingJob && (
          <section
            className="
              mb-8
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Post
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the details of your post
                </p>
              </div>

              <button
                type="button"
                onClick={cancelEdit}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-600
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

            </div>


            <form
              onSubmit={handleUpdate}
              className="grid gap-5 md:grid-cols-2"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job / Internship Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                  "
                  placeholder="Enter title"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company
                </label>

                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                  "
                  placeholder="Company name"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                  "
                  placeholder="Delhi / Mumbai / Remote"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Salary
                </label>

                <input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                  "
                  placeholder="₹5 LPA"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                  "
                >
                  <option value="Full time">
                    Full time
                  </option>

                  <option value="Part time">
                    Part time
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>
              </div>


              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="6"
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                  "
                  placeholder="Job description"
                />

              </div>


              <div className="flex gap-3 md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    rounded-xl
                    bg-[#2563EB]
                    px-6
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-6
                    py-3
                    font-semibold
                    text-slate-700
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}


        {/* POSTS */}

        <section>

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                My Posted Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Only your own posts are shown here.
              </p>
            </div>

            <span
              className="
                rounded-full
                bg-blue-50
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-600
              "
            >
              {jobs.length} Posts
            </span>

          </div>


          {loading ? (

            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-10
                text-center
                text-slate-500
              "
            >
              Loading your posts...
            </div>

          ) : jobs.length === 0 ? (

            <div
              className="
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-white
                p-12
                text-center
              "
            >

              <BriefcaseBusiness
                className="
                  mx-auto
                  mb-4
                  h-12
                  w-12
                  text-slate-300
                "
              />

              <h3 className="text-lg font-semibold text-slate-800">
                No posts yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                You have not posted any jobs or internships yet.
              </p>

              <button
                type="button"
                onClick={() => navigate('/employer')}
                className="
                  mt-5
                  rounded-xl
                  bg-[#2563EB]
                  px-5
                  py-3
                  font-semibold
                  text-white
                  hover:bg-blue-700
                "
              >
                Post a Job
              </button>

            </div>

          ) : (

            <div className="grid gap-5">

              {jobs.map((job) => {

                const isInternship =
                  job.jobType?.toLowerCase() === 'internship'

                return (
                  <article
                    key={job.id}
                    className="
                      rounded-3xl
                      border
                      border-slate-200
                      bg-white
                      p-6
                      shadow-sm
                    "
                  >

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">

                        <div className="mb-2 flex flex-wrap items-center gap-2">

                          <span
                            className="
                              rounded-full
                              bg-blue-50
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-blue-600
                            "
                          >
                            {isInternship
                              ? 'INTERNSHIP'
                              : 'JOB'}
                          </span>

                          <span
                            className="
                              rounded-full
                              bg-slate-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-slate-600
                            "
                          >
                            {job.jobType || 'Full time'}
                          </span>

                        </div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {job.title}
                        </h3>

                        <p className="mt-1 font-medium text-slate-600">
                          {job.company}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">

                          {job.location && (
                            <span>
                              📍 {job.location}
                            </span>
                          )}

                          {job.salary && (
                            <span>
                              💰 {job.salary}
                            </span>
                          )}

                        </div>

                      </div>


                      <div className="flex shrink-0 gap-2">

                        <button
                          type="button"
                          onClick={() => startEdit(job)}
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                          "
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>


                        <button
                          type="button"
                          onClick={() => handleDelete(job.id)}
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-red-50
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-red-600
                            hover:bg-red-100
                          "
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                      </div>

                    </div>


                    {job.description && (
                      <p
                        className="
                          mt-5
                          border-t
                          border-slate-100
                          pt-5
                          text-sm
                          leading-6
                          text-slate-600
                        "
                      >
                        {job.description}
                      </p>
                    )}

                  </article>
                )
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}