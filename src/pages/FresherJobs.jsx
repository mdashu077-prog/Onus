import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import JobCard from '../components/JobCard'

const fresherJobs = [
  { id: 1, title: 'Frontend Developer', company: 'Google', salary: '₹4-6 LPA', location: 'Bengaluru', description: 'Build responsive web apps with React. No experience required.' },
  { id: 2, title: 'Python Developer', company: 'Microsoft', salary: '₹3-5 LPA', location: 'Hyderabad', description: 'Learn Python and build backend systems. Freshers welcome.' },
  { id: 3, title: 'Java Developer', company: 'Amazon', salary: '₹4-6 LPA', location: 'Remote', description: 'Entry-level Java development role with mentorship.' },
]

export default function FresherJobs() {
  const [query, setQuery] = useState('')

  const filteredJobs = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return fresherJobs

    return fresherJobs.filter((job) =>
      [job.title, job.company, job.location, job.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    )
  }, [query])

  return (
    <section className="bg-bg min-h-screen">
      <div className="container-center py-12 sm:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">For Beginners</p>
          <h2 className="mt-3 text-3xl font-semibold text-secondary">Fresher Jobs</h2>
          <p className="mt-2 text-slate-600">Perfect opportunities for freshers and recent graduates. Start your career journey here.</p>
        </div>

        <div className="mb-8 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search fresher jobs by title, company or location..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredJobs.length === 0 && <p className="text-slate-600">No fresher jobs available.</p>}
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
