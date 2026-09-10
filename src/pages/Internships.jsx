import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import JobCard from '../components/JobCard'

const internships = [
  {
    id: 1,
    title: 'React Internship',
    company: 'Google',
    salary: '₹20k-30k/month',
    location: 'Bengaluru',
    description: 'Learn React and build real projects. 3-month paid internship.',
  },
  {
    id: 2,
    title: 'Data Science Internship',
    company: 'Amazon',
    salary: '₹25k-40k/month',
    location: 'Remote',
    description: 'Work on data analysis and ML projects with experienced mentors.',
  },
  {
    id: 3,
    title: 'Web Development Internship',
    company: 'Accenture',
    salary: '₹15k-25k/month',
    location: 'Mumbai',
    description: 'Build web applications and gain hands-on experience.',
  },
]

export default function Internships() {
  const [query, setQuery] = useState('')

  const filteredInternships = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return internships

    return internships.filter((job) =>
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
          <p className="text-sm uppercase tracking-[0.25em] text-primary">
            Learning Opportunities
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-secondary">
            Internship Programs
          </h2>

          <p className="mt-2 text-slate-600">
            Gain real-world experience and earn while you learn with top companies.
          </p>
        </div>

        <div className="mb-8 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search internships by title, company or location..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredInternships.length === 0 && (
            <p className="text-slate-600">No internships available.</p>
          )}

          {filteredInternships.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}