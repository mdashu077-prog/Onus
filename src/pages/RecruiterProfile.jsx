import { useNavigate, useParams } from 'react-router-dom'

const recruiterProfiles = {
  google: {
    name: 'Aisha Verma',
    designation: 'Senior Talent Partner',
    company: 'Google',
    openJobs: ['Frontend Developer', 'Product Designer']
  },
  microsoft: {
    name: 'Rohan Sharma',
    designation: 'Engineering Recruiter',
    company: 'Microsoft',
    openJobs: ['Backend Developer', 'Cloud Engineer']
  },
  amazon: {
    name: 'Neha Patil',
    designation: 'HR Specialist',
    company: 'Amazon',
    openJobs: ['Python Developer', 'Operations Analyst']
  },
  infosys: {
    name: 'Karan Singh',
    designation: 'Campus Recruiter',
    company: 'Infosys',
    openJobs: ['UI/UX Designer', 'QA Engineer']
  }
}

export default function RecruiterProfile() {
  const { recruiterSlug } = useParams()
  const navigate = useNavigate()
  const profile = recruiterProfiles[recruiterSlug] || recruiterProfiles.google

  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-5xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm font-semibold text-primary hover:underline">
          ← Back
        </button>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">Recruiter Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-secondary">{profile.name}</h1>
          <p className="mt-2 text-slate-600">{profile.designation}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-secondary">Name</h2>
              <p className="mt-2 text-slate-700">{profile.name}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-secondary">Designation</h2>
              <p className="mt-2 text-slate-700">{profile.designation}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-secondary">Company</h2>
              <p className="mt-2 text-slate-700">{profile.company}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-secondary">Open Jobs</h2>
              <p className="mt-2 text-slate-700">{profile.openJobs.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
