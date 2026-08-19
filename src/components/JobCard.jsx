import { useNavigate } from 'react-router-dom'

export default function JobCard({ job, onApply }) {
  const navigate = useNavigate()

  function handleCardClick() {
    navigate(`/jobs/${job.id}`)
  }

  function handleApplyClick(e) {
    e.stopPropagation()

    if (onApply) {
      onApply(job)
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* JOB INFO */}
        <div className="min-w-0 space-y-2">

          <h3 className="text-xl font-semibold text-secondary">
            {job.title}
          </h3>

          <p className="text-sm font-medium text-primary">
            {job.company}
          </p>

          {job.location && (
            <p className="text-sm text-slate-500">
              📍 {job.location}
            </p>
          )}

          {job.description && (
            <p className="line-clamp-2 text-sm text-slate-600">
              {job.description}
            </p>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* SALARY */}
          {job.salary && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
              {job.salary}
            </span>
          )}

          {/* APPLY BUTTON */}
          <button
            type="button"
            onClick={handleApplyClick}
            className="!bg-blue-600 !px-6 !py-3 !text-sm !font-semibold !text-white rounded-full shadow-sm transition hover:!bg-blue-700"
          >
            Apply Now
          </button>

        </div>

      </div>
    </article>
  )
}