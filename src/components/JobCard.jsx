export default function JobCard({ job, onApply }) {
  return (
    <article className="job-card border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-secondary">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.company}</p>
          <p className="text-sm text-slate-700">{job.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{job.salary}</span>
          <button onClick={() => onApply && onApply(job)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
            Apply Now
          </button>
        </div>
      </div>
    </article>
  )
}
