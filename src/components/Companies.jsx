const companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS']

export default function Companies() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="container-center px-3 sm:px-4">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Top Companies</p>
            <h2 className="mt-3 text-2xl font-semibold text-secondary sm:text-3xl">Hiring companies</h2>
          </div>
          <p className="text-sm text-slate-500">Trusted by world-class organizations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {companies.map((company) => (
            <div key={company} className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-secondary shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-3xl bg-primary/10 text-lg font-bold text-primary">{company[0]}</div>
              <p>{company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
