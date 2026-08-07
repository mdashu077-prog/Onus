const companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS']

export default function Companies() {
  return (
    <section className="bg-white py-14">
      <div className="container-center">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Top Companies</p>
            <h2 className="mt-3 text-3xl font-semibold text-secondary">Hiring companies</h2>
          </div>
          <p className="text-sm text-slate-500">Trusted by world-class organizations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {companies.map((company) => (
            <div key={company} className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center font-semibold text-secondary shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-4 h-12 w-12 rounded-3xl bg-primary/10 text-primary grid place-items-center text-lg font-bold">{company[0]}</div>
              <p>{company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
