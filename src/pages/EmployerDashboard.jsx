import { useEffect, useState } from 'react'
import { getJobs, protectedRequest } from '../services/api'

const menuItems = [
  'Dashboard',
  'Post Job',
  'Manage Jobs',
  'Applicants',
  'Company Profile',
]

export default function EmployerDashboard({ auth }) {
  const [posts, setPosts] = useState([])

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full time',
    description: '',
  })

  // Load jobs from backend when dashboard opens/refreshed
  useEffect(() => {
    async function loadJobs() {
      try {
        const jobs = await getJobs()
        setPosts(jobs)
      } catch (error) {
        console.error('Failed to load jobs:', error)
      }
    }

    loadJobs()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const jobData = {
        title: form.title,
        company: form.company,
        location: form.location,
        salary: form.salary,
        jobType: form.type,
        description: form.description,
      }

      const response = await protectedRequest('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      })

      let savedJob = {}

      if (response) {
        try {
          savedJob = JSON.parse(response)
        } catch {
          savedJob = {
            message: response,
          }
        }
      }

      // Add newly saved job to screen
      setPosts((prev) => [...prev, savedJob])

      // Clear form
      setForm({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full time',
        description: '',
      })

      alert('Job posted successfully!')
    } catch (error) {
      console.error('POST JOB ERROR:', error)

      alert(
        error.message ||
          'Failed to post job'
      )
    }
  }

  return (
    <section className="bg-bg py-14">
      <div className="container-center">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT SIDE */}
          <div className="space-y-4">

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary">
                Employer Dashboard
              </p>

              <h1 className="mt-3 text-4xl font-semibold text-secondary">
                Welcome back, {auth?.name || 'recruiter'}!
              </h1>

              <p className="mt-4 max-w-2xl text-slate-600">
                Create a job posting with details, location, salary and
                application instructions.
              </p>
            </div>

            {/* MENU */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-3 sm:grid-cols-2">
                {menuItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* POST JOB FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]"
            >

              <div className="grid gap-4 lg:grid-cols-2">

                {/* JOB TITLE */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Job Title
                  </span>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="Frontend Developer"
                  />
                </label>

                {/* COMPANY */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Company
                  </span>

                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="Acme Co"
                  />
                </label>

              </div>

              <div className="grid gap-4 lg:grid-cols-3">

                {/* LOCATION */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Location
                  </span>

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="Bangalore"
                  />
                </label>

                {/* SALARY */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Salary
                  </span>

                  <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                    placeholder="₹8-12 LPA"
                  />
                </label>

                {/* JOB TYPE */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Job Type
                  </span>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-primary"
                  >
                    <option>Full time</option>
                    <option>Part time</option>
                    <option>Internship</option>
                    <option>Remote</option>
                  </select>
                </label>

              </div>

              {/* DESCRIPTION */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Description
                </span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                  placeholder="Add a short job description..."
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Post Job
              </button>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <aside className="space-y-6">

            {/* TIPS */}
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-semibold text-secondary">
                Job Posting Tips
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Add a clear title and salary range.</li>
                <li>• Specify skills and experience needed.</li>
                <li>• Include location and remote flexibility.</li>
              </ul>
            </div>

            {/* POSTED JOBS */}
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">

              <h3 className="text-xl font-semibold text-secondary">
                Your Posted Jobs
              </h3>

              <div className="mt-4 space-y-4">

                {posts.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No jobs posted yet. Add one to get started.
                  </p>
                ) : (
                  posts.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-secondary">
                        {job.title}
                      </p>

                      <p className="text-sm text-slate-500">
                        {job.company}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.location}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.salary}
                      </p>
                    </div>
                  ))
                )}

              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>
  )
}