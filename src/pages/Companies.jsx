const companies = [
  { name: 'Google', openings: '45', location: 'Bangalore' },
  { name: 'Microsoft', openings: '32', location: 'Hyderabad' },
  { name: 'Amazon', openings: '58', location: 'Bangalore' },
  { name: 'Infosys', openings: '120', location: 'Pune' },
  { name: 'TCS', openings: '200+', location: 'Bangalore' },
  { name: 'Accenture', openings: '89', location: 'Mumbai' },
]

export default function Companies() {
  return (
    <section className="bg-bg">
      <div className="container-center py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Opportunities</p>
          <h2 className="mt-3 text-3xl font-semibold text-secondary">Top Hiring Companies</h2>
          <p className="mt-2 text-slate-600">Discover job openings from India's leading technology companies.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <div key={company.name} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-lg font-bold text-primary">
                  {company.name[0]}
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {company.openings} jobs
                </span>
              </div>
              <h3 className="text-xl font-semibold text-secondary">{company.name}</h3>
              <p className="mt-2 text-sm text-slate-500">📍 {company.location}</p>
              <button className="mt-4 w-full rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10">
                View Jobs
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
