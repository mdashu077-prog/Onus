import { useNavigate } from 'react-router-dom'

export default function JobCard({ job, onApply }) {
  const navigate = useNavigate()

  const recruiterName = job?.recruiter?.name || job?.recruiterEmail || 'Recruiter'
  const status = (() => {
    if (job?.status === 'CLOSED') return 'CLOSED'
    if (job?.status === 'EXPIRED') return 'EXPIRED'
    if (job?.permanent === true || !job?.expiresAt) return 'ACTIVE'
    if (new Date(job.expiresAt).getTime() < Date.now()) return 'EXPIRED'
    return 'ACTIVE'
  })()
  const isActive = status === 'ACTIVE'

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
        <div className="min-w-0 space-y-2">
          <h3 className="text-xl font-semibold text-secondary">{job.title}</h3>
          <p className="text-sm font-medium text-primary">{job.company}</p>

          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Posted by:</span> {recruiterName}
          </p>

          {job.location && (
            <p className="text-sm text-slate-500">📍 {job.location}</p>
          )}

          {job.jobType && (
            <p className="text-sm text-slate-500">💼 {job.jobType}</p>
          )}

          {job.salary && (
            <p className="text-sm text-slate-500">💰 {job.salary}</p>
          )}

          {job.createdAt && (
            <p className="text-xs text-slate-500">
              Posted {new Date(job.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}

          {!job?.permanent && job?.expiresAt && (
            <p className="text-xs text-slate-500">
              Valid until {new Date(job.expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}

          {status !== 'ACTIVE' && (
            <p className="text-sm font-semibold text-amber-700">
              {status === 'EXPIRED' ? '⚠ Vacancy Expired' : '⛔ Job Closed'}
            </p>
          )}

          {job.description && (
            <p className="line-clamp-2 text-sm text-slate-600">{job.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {job.salary && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
              {job.salary}
            </span>
          )}

          {isActive ? (
            <button
              type="button"
              onClick={handleApplyClick}
              className="!bg-blue-600 !px-6 !py-3 !text-sm !font-semibold !text-white rounded-full shadow-sm transition hover:!bg-blue-700"
            >
              Apply Now
            </button>
          ) : (
            <button
              type="button"
              className="cursor-default rounded-full border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-500"
            >
              {status === 'EXPIRED' ? 'Apply unavailable' : 'Closed'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}