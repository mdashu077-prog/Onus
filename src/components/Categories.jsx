const categories = ['React Jobs', 'Java Jobs', 'Python Jobs', 'UI/UX Jobs', 'Internships', 'Remote Jobs']

export default function Categories() {
  return (
    <section className="bg-bg py-14">
      <div className="container-center">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Categories</p>
            <h2 className="mt-3 text-3xl font-semibold text-secondary">Browse by category</h2>
          </div>
          <p className="text-sm text-slate-500">Find relevant job categories instantly.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-lg font-semibold text-secondary">{category}</p>
              <p className="mt-3 text-sm text-slate-500">Explore top openings in {category.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
