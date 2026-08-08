export default function Settings({ auth }) {
  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold text-secondary">Preferences for {auth?.name || 'your account'}</h1>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Email notifications enabled</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Profile visibility set to public</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Preferred job alerts active</div>
          </div>
        </div>
      </div>
    </section>
  )
}
