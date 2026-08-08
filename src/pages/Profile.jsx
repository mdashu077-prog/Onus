export default function Profile({ auth }) {
  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-secondary">{auth?.name || 'User Profile'}</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 font-semibold text-secondary">{auth?.email || 'you@example.com'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Role</p>
              <p className="mt-2 font-semibold text-secondary">{auth?.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
