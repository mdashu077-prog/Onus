import { useState } from 'react'
import JobCard from '../components/JobCard'

const fresherJobs = [
  { id: 1, title: 'Frontend Developer', company: 'Google', salary: '₹4-6 LPA', description: 'Build responsive web apps with React. No experience required.' },
  { id: 2, title: 'Python Developer', company: 'Microsoft', salary: '₹3-5 LPA', description: 'Learn Python and build backend systems. Freshers welcome.' },
  { id: 3, title: 'Java Developer', company: 'Amazon', salary: '₹4-6 LPA', description: 'Entry-level Java development role with mentorship.' },
]

export default function FresherJobs() {
  function handleApply(job) {
    alert(`Applied to ${job.title} at ${job.company}`)
  }

  return (
    <section className="bg-bg">
      <div className="container-center py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">For Beginners</p>
          <h2 className="mt-3 text-3xl font-semibold text-secondary">Fresher Jobs</h2>
          <p className="mt-2 text-slate-600">Perfect opportunities for freshers and recent graduates. Start your career journey here.</p>
        </div>

        <div className="grid gap-4">
          {fresherJobs.length === 0 && <p className="text-slate-600">No fresher jobs available.</p>}
          {fresherJobs.map((j) => (
            <JobCard key={j.id} job={j} onApply={handleApply} />
          ))}
        </div>
      </div>
    </section>
  )
}
