import { Briefcase, Building2, Users, ShieldCheck } from 'lucide-react'

const items = [
  { label: 'Jobs', value: '500+', icon: Briefcase },
  { label: 'Companies', value: '100+', icon: Building2 },
  { label: 'Candidates', value: '5000+', icon: Users },
  { label: 'Recruiters', value: '50+', icon: ShieldCheck },
]

export default function Stats() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="container-center px-3 sm:px-4">
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-center shadow-sm sm:p-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary sm:h-14 sm:w-14">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-secondary sm:mt-5 sm:text-3xl">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
