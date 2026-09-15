const companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS']

export default function Companies() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="container-center px-3 sm:px-4">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Top Companies</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-900">Hiring companies</h2>
          </div>
          <p className="text-sm text-slate-600">Trusted by organizations building modern teams.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {companies.map((company) => (
            <div
              key={company}
              className="group rounded-[26px] border border-slate-200 bg-slate-50 p-5 text-center shadow-[0_16px_30px_rgba(15,23,42,0.02)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_40px_rgba(37,99,235,0.08)]"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-700 ring-1 ring-blue-100">
                {company[0]}
              </div>
              <p className="text-base font-semibold text-slate-800">{company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
