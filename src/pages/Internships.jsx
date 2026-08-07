import { useState } from 'react'
import JobCard from '../components/JobCard'

const internships = [
  { id: 1, title: 'React Internship', company: 'Google', salary: '₹20k-30k/month', description: 'Learn React and build real projects. 3-month paid internship.' },
  { id: 2, title: 'Data Science Internship', company: 'Amazon', salary: '₹25k-40k/month', description: 'Work on data analysis and ML projects with experienced mentors.' },
  { id: 3, title: 'Web Development Internship', company: 'Accenture', salary: '₹15k-25k/month', description: 'Build web applications and gain hands-on experience.' },
]

export default function Internships() {
  function handleApply(job) {
    alert(`Applied to ${job.title} at ${job.company}`)
  }

  return (
    <section className="bg-bg">
      <div className="container-center py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Learning Opportunities</p>
          <h2 className="mt-3 text-3xl font-semibold text-secondary">Internship Programs</h2>
          <p className="mt-2 text-slate-600">Gain real-world experience and earn while you learn with top companies.</p>
        </div>

        <div className="grid gap-4">
          {internships.length === 0 && <p className="text-slate-600">No internships available.</p>}
          {internships.map((j) => (
            <JobCard key={j.id} job={j} onApply={handleApply} />
          ))}
        </div>
      </div>
    </section>
  )
}
