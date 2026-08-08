import { useNavigate, useParams } from 'react-router-dom'

const companyProfiles = {
  google: {
    name: 'Google',
    about: 'Google is a global technology company that builds products to help people access information and connect with others.',
    location: 'Bangalore, India',
    website: 'https://careers.google.com',
    openJobs: ['Frontend Developer', 'Senior Product Designer', 'Data Analyst']
  },
  microsoft: {
    name: 'Microsoft',
    about: 'Microsoft empowers organizations and individuals through cloud, AI, and productivity technologies.',
    location: 'Hyderabad, India',
    website: 'https://careers.microsoft.com',
    openJobs: ['Backend Developer', 'Cloud Engineer', 'Program Manager']
  },
  amazon: {
    name: 'Amazon',
    about: 'Amazon is focused on customer obsession, operational excellence, and continuous innovation.',
    location: 'Pune, India',
    website: 'https://www.amazon.jobs',
    openJobs: ['Python Developer', 'Operations Analyst', 'Software Engineer']
  },
  infosys: {
    name: 'Infosys',
    about: 'Infosys delivers next-generation digital services and consulting to global enterprises.',
    location: 'Mumbai, India',
    website: 'https://www.infosys.com/careers',
    openJobs: ['UI/UX Designer', 'Business Analyst', 'QA Engineer']
  }
}

export default function CompanyProfile() {
  const { companySlug } = useParams()
  const navigate = useNavigate()
  const profile = companyProfiles[companySlug] || companyProfiles.google

  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-5xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm font-semibold text-primary hover:underline">
          ← Back
        </button>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Company Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-secondary">{profile.name}</h1>
            </div>
            <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {profile.openJobs.length} open jobs
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-secondary">About</h2>
              <p className="mt-3 text-slate-700">{profile.about}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary">Location</h2>
              <p className="mt-3 text-slate-700">{profile.location}</p>
              <h2 className="mt-6 text-lg font-semibold text-secondary">Website</h2>
              <a href={profile.website} target="_blank" rel="noreferrer" className="mt-3 inline-block text-primary hover:underline">
                {profile.website}
              </a>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-secondary">Open Jobs</h2>
            <ul className="mt-4 space-y-3">
              {profile.openJobs.map((job) => (
                <li key={job} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                  {job}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
