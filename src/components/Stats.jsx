import { Briefcase, Building2, Users, ShieldCheck } from 'lucide-react'

const items = [
  { label: 'Jobs', value: '500+', icon: Briefcase },
  { label: 'Companies', value: '100+', icon: Building2 },
  { label: 'Candidates', value: '5000+', icon: Users },
  { label: 'Recruiters', value: '50+', icon: ShieldCheck },
]

export default function Stats() {
  return (
    <section className="bg-white py-12">
      <div className="container-center">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-3xl font-semibold text-secondary">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
