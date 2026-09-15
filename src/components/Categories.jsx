import { ArrowUpRight, BriefcaseBusiness, Code2, Cpu, Palette, Search, Sparkles } from 'lucide-react'

const categories = [
  { name: 'Software Development', icon: Code2, count: '120+ roles' },
  { name: 'Data & Analytics', icon: Cpu, count: '64 roles' },
  { name: 'Design', icon: Palette, count: '38 roles' },
  { name: 'Marketing', icon: Sparkles, count: '46 roles' },
  { name: 'Product', icon: BriefcaseBusiness, count: '29 roles' },
  { name: 'Research', icon: Search, count: '21 roles' },
]

export default function Categories() {
  return (
    <section className="bg-[#F8FAFC] py-10 sm:py-14">
      <div className="container-center px-3 sm:px-4">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Categories</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-900">Browse by category</h2>
          </div>
          <p className="text-sm text-slate-600">Explore roles that match your career goals.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map(({ name, icon: Icon, count }) => (
            <div
              key={name}
              className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.03)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_42px_rgba(37,99,235,0.08)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
              </div>

              <p className="mt-5 text-lg font-bold text-slate-900">{name}</p>
              <p className="mt-2 text-sm text-slate-600">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
