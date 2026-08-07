import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Categories from '../components/Categories'
import Companies from '../components/Companies'
import JobCard from '../components/JobCard'

const featuredJobs = [
  { id: 1, title: 'Frontend Developer', company: 'Google', salary: '₹8-12 LPA', description: 'Build responsive web apps with React.' },
  { id: 2, title: 'Backend Developer', company: 'Microsoft', salary: '₹10-14 LPA', description: 'Develop scalable API services.' },
  { id: 3, title: 'Python Developer', company: 'Amazon', salary: '₹9-13 LPA', description: 'Work on data-driven backend systems.' },
  { id: 4, title: 'UI/UX Designer', company: 'Infosys', salary: '₹5-8 LPA', description: 'Design intuitive user experiences.' },
]

export default function Home() {
  return (
    <div className="bg-bg">
      <Hero />
      <Stats />

      <section className="container-center py-14">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Featured Jobs</p>
            <h2 className="mt-4 text-3xl font-semibold text-secondary">Top opportunities right now</h2>
          </div>
          <Link to="/jobs" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-primary/30 transition hover:bg-blue-700 hover:scale-[1.02]">
            View all jobs
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={() => alert(`Applied to ${job.title}`)} />
          ))}
        </div>
      </section>

      <Categories />
      <Companies />
    </div>
  )
}
