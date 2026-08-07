const recruiters = [
  { name: 'HR Manager - Google', company: 'Google', bio: 'Hiring talent for Google Cloud team', rating: '4.9/5' },
  { name: 'Tech Lead - Microsoft', company: 'Microsoft', bio: 'Recruiting engineers for Azure projects', rating: '4.8/5' },
  { name: 'HR Specialist - Amazon', company: 'Amazon', bio: 'Dedicated to building Amazon\'s engineering team', rating: '4.9/5' },
]

export default function Recruiters() {
  return (
    <section className="bg-bg">
      <div className="container-center py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Connect</p>
          <h2 className="mt-3 text-3xl font-semibold text-secondary">Top Recruiters</h2>
          <p className="mt-2 text-slate-600">Meet and connect with leading recruiters from top companies.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recruiters.map((recruiter, idx) => (
            <div key={idx} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {recruiter.name[0]}
                </div>
                <span className="text-sm font-semibold text-yellow-500">⭐ {recruiter.rating}</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary">{recruiter.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{recruiter.company}</p>
              <p className="mt-3 text-sm text-slate-700">{recruiter.bio}</p>
              <button className="mt-4 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
