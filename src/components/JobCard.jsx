import { useNavigate } from 'react-router-dom'

export default function JobCard({ job, onApply }) {
  const navigate = useNavigate()

  function handleCardClick() {
    navigate(`/jobs/${job.id}`)
  }

  return (
    <article onClick={handleCardClick} className="job-card cursor-pointer border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary sm:text-xl">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.company}</p>
          <p className="text-sm text-slate-700">{job.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{job.salary}</span>
          <button onClick={(e) => { e.stopPropagation(); onApply && onApply(job) }} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
            Apply Now
          </button>
        </div>
      </div>
    </article>
  )
}
