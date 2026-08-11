import { useState } from 'react'
import JobCard from '../components/JobCard'

const jobList = [
  { id: 1, title: 'Frontend Developer', company: 'Google', salary: '₹8-12 LPA', description: 'Build responsive web apps with React.' },
  { id: 2, title: 'Backend Developer', company: 'Microsoft', salary: '₹10-14 LPA', description: 'Develop scalable API services.' },
  { id: 3, title: 'Python Developer', company: 'Amazon', salary: '₹9-13 LPA', description: 'Work on data-driven backend systems.' },
  { id: 4, title: 'UI/UX Designer', company: 'Infosys', salary: '₹5-8 LPA', description: 'Design intuitive user experiences.' },
]

export default function Jobs() {
  const [jobs] = useState(() => jobList)

  function handleApply(job) {
    alert(`Applied to ${job.title} at ${job.company}`)
  }

  return (
    <section className="bg-bg">
      <div className="container-center py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Available roles</p>
            <h2 className="mt-3 text-3xl font-semibold text-secondary">Latest job openings</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary">
              Full time
            </button>
            <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary">
              Remote
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {jobs.length === 0 && <p className="text-gray-600">No jobs posted yet.</p>}
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} onApply={handleApply} />
          ))}
        </div>
      </div>
    </section>
  )
}
