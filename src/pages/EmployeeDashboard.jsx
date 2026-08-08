const menuItems = ['Dashboard', 'My Applications', 'Saved Jobs', 'Resume', 'Profile']

export default function EmployeeDashboard({ auth }) {
  return (
    <section className="bg-bg py-14">
      <div className="container-center">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Job Seeker Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-secondary">Welcome back, {auth?.name || 'there'}!</h1>
            <div className="mt-6 space-y-3">
              {menuItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-semibold text-secondary">Your activity</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-primary/10 p-4">
                  <p className="text-sm text-slate-500">Applications</p>
                  <p className="mt-2 text-2xl font-semibold text-secondary">12</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-4">
                  <p className="text-sm text-slate-500">Saved Jobs</p>
                  <p className="mt-2 text-2xl font-semibold text-secondary">7</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-4">
                  <p className="text-sm text-slate-500">Resume Views</p>
                  <p className="mt-2 text-2xl font-semibold text-secondary">24</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-semibold text-secondary">Recommended for you</h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Frontend Developer at Google</div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Product Designer at Microsoft</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
