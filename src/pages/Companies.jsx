import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

const companies = [
  { slug: 'google', name: 'Google', openings: '45', location: 'Bangalore' },
  { slug: 'microsoft', name: 'Microsoft', openings: '32', location: 'Hyderabad' },
  { slug: 'amazon', name: 'Amazon', openings: '58', location: 'Bangalore' },
  { slug: 'infosys', name: 'Infosys', openings: '120', location: 'Pune' },
  { slug: 'tcs', name: 'TCS', openings: '200+', location: 'Bangalore' },
  { slug: 'accenture', name: 'Accenture', openings: '89', location: 'Mumbai' },
]

export default function Companies() {
  const [query, setQuery] = useState('')

  const filteredCompanies = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return companies

    return companies.filter((company) =>
      [company.name, company.location, company.openings]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    )
  }, [query])

  return (
    <section className="bg-bg min-h-screen">
      <div className="container-center py-12 sm:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Opportunities</p>
          <h2 className="mt-3 text-3xl font-semibold text-secondary">Top Hiring Companies</h2>
          <p className="mt-2 text-slate-600">Discover job openings from India's leading technology companies.</p>
        </div>

        <div className="mb-8 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search companies or locations..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCompanies.map((company) => (
            <div key={company.name} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-lg font-bold text-primary">
                  {company.name[0]}
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {company.openings} jobs
                </span>
              </div>
              <Link to={`/companies/${company.slug}`} className="block">
                <h3 className="text-xl font-semibold text-secondary">{company.name}</h3>
              </Link>
              <p className="mt-2 text-sm text-slate-500">📍 {company.location}</p>
              <Link to={`/companies/${company.slug}`} className="mt-4 block w-full rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary/10">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
