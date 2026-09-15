import { Briefcase, Building2, ShieldCheck, Users } from 'lucide-react'

const items = [
  { label: 'Jobs', value: '10,000+', icon: Briefcase },
  { label: 'Companies', value: '500+', icon: Building2 },
  { label: 'Candidates', value: '50,000+', icon: Users },
  { label: 'Recruiters', value: '2,500+', icon: ShieldCheck },
]

export default function Stats() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="container-center px-3 sm:px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">Platform stats</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">Career momentum at scale</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="rounded-[26px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-[0_18px_35px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(37,99,235,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{item.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
