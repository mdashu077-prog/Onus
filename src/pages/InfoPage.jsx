export default function InfoPage({ title }) {
  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">ONUS</p>
          <h1 className="mt-3 text-3xl font-semibold text-secondary">{title}</h1>
          <p className="mt-4 text-slate-700">This section is ready for the full content for {title.toLowerCase()}.</p>
        </div>
      </div>
    </section>
  )
}
