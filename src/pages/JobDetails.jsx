import { useNavigate, useParams } from 'react-router-dom'

const jobs = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    company: 'Google',
    companyDetails: 'Google is a global technology leader focused on building products that help people access information and connect.',
    salary: '₹8-12 LPA',
    skills: ['React', 'JavaScript', 'Tailwind CSS'],
    experience: '2+ years',
    description: 'Build polished and responsive user interfaces for Google Cloud products with a strong focus on performance and accessibility.'
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    company: 'Microsoft',
    companyDetails: 'Microsoft empowers every person and every organization on the planet to achieve more through trusted cloud services.',
    salary: '₹10-14 LPA',
    skills: ['Node.js', 'APIs', 'MongoDB'],
    experience: '3+ years',
    description: 'Design and ship scalable backend services for enterprise applications and internal developer tools.'
  },
  {
    id: 'python-developer',
    title: 'Python Developer',
    company: 'Amazon',
    companyDetails: 'Amazon is committed to being Earth’s most customer-centric company through innovation and delivery excellence.',
    salary: '₹9-13 LPA',
    skills: ['Python', 'Django', 'AWS'],
    experience: '2+ years',
    description: 'Work across data pipelines and intelligent automation initiatives that support Amazon’s growing logistics platform.'
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    company: 'Infosys',
    companyDetails: 'Infosys helps enterprises navigate digital transformation with human-centered design and engineering excellence.',
    salary: '₹5-8 LPA',
    skills: ['Figma', 'Design Systems', 'User Research'],
    experience: '1+ years',
    description: 'Create intuitive experiences for enterprise products and support design workshops across the product team.'
  }
]

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const job = jobs.find((item) => item.id === jobId) || jobs[0]

  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-5xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm font-semibold text-primary hover:underline">
          ← Back to jobs
        </button>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Job Details</p>
            <h1 className="mt-4 text-3xl font-semibold text-secondary">{job.title}</h1>
            <p className="mt-2 text-lg text-slate-600">{job.company}</p>
            <p className="mt-5 text-slate-700">{job.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Salary</p>
                <p className="mt-1 font-semibold text-secondary">{job.salary}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Skills Required</p>
                <p className="mt-1 font-semibold text-secondary">{job.skills.join(', ')}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Experience</p>
                <p className="mt-1 font-semibold text-secondary">{job.experience}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                Apply Now
              </button>
              <button className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10">
                Save Job
              </button>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-secondary">Company Details</h2>
            <p className="mt-4 text-slate-700">{job.companyDetails}</p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-secondary">Company:</span> {job.company}</p>
              <p><span className="font-semibold text-secondary">Location:</span> Bangalore, India</p>
              <p><span className="font-semibold text-secondary">Hiring Type:</span> Full-time</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
