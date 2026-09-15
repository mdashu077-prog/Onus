import { useState } from 'react'
import { ArrowRight, BriefcaseBusiness, Check, ChevronDown, CircleHelp, Compass, FileText, Mail, MessageCircle, Search, ShieldCheck, Sparkles, Target, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const pageContent = {
  about: {
    label: 'About ONUS',
    title: 'A clearer path from ambition to opportunity.',
    intro: 'ONUS is a professional career platform designed to connect job seekers and recruiters through a simpler, more focused experience.',
  },
  'how-it-works': {
    label: 'How ONUS Works',
    title: 'The right next step, for every career journey.',
    intro: 'ONUS gives job seekers and recruiters a straightforward way to create momentum, discover possibilities, and connect with purpose.',
  },
  'career-guidance': {
    label: 'Career Guidance',
    title: 'Make career decisions with more confidence.',
    intro: 'Small, deliberate steps can turn uncertainty into a practical plan. Use these principles to shape your next move with ONUS.',
  },
  help: {
    label: 'Help Center',
    title: 'Find your way around ONUS.',
    intro: 'Browse simple guidance for accounts, opportunities, applications, recruiting, and everyday platform questions.',
  },
  'resume-tips': {
    label: 'Resume Tips',
    title: 'Make your experience easy to understand.',
    intro: 'A strong resume gives the right details enough room to make an impression. Keep it focused, relevant, and easy to scan.',
  },
  'interview-tips': {
    label: 'Interview Tips',
    title: 'Prepare thoughtfully. Show up confidently.',
    intro: 'Good preparation helps you communicate your experience clearly and make the conversation more useful for everyone involved.',
  },
  faq: {
    label: 'Frequently Asked Questions',
    title: 'Answers to common ONUS questions.',
    intro: 'Explore quick answers about accounts, opportunities, profiles, recruiting, and getting started.',
  },
  contact: {
    label: 'Contact ONUS',
    title: 'We would love to hear from you.',
    intro: 'Whether you have a general question, need career support, or want to share feedback, this is a good place to start.',
  },
}

const steps = {
  seeker: ['Create an ONUS account.', 'Complete your profile.', 'Explore relevant opportunities.', 'Apply for suitable jobs or internships.', 'Track your application journey.'],
  recruiter: ['Create a recruiter account.', 'Complete company information.', 'Post jobs or internships.', 'Review applications.', 'Connect with suitable candidates.'],
}

const faqs = [
  ['What is ONUS?', 'ONUS is a career platform that helps job seekers discover opportunities and helps recruiters connect with suitable candidates.'],
  ['Who can use ONUS?', 'Job seekers, recruiters, and people exploring their next career step can use the platform.'],
  ['Is ONUS for job seekers?', 'Yes. Job seekers can create a profile, explore opportunities, apply, and follow their application journey.'],
  ['Can recruiters post jobs?', 'Yes. Recruiters can create a recruiter account, share opportunities, and review applications.'],
  ['Do I need an account to apply?', 'Yes. You need to create and sign in to a Job Seeker account before using authenticated application features.'],
  ['How do I create a Job Seeker account?', 'Choose Create Account and select the Job Seeker role during registration.'],
  ['How do I create a Recruiter account?', 'Choose Create Account and select the Recruiter role during registration.'],
  ['How do I contact ONUS?', 'Visit the Contact ONUS page. Contact details will be available soon.'],
  ['How do I update my profile?', 'Sign in, open your profile from the authenticated navigation, and update the available details.'],
  ['How do recruiters find candidates?', 'Recruiters can review suitable candidate information through the authenticated recruiter experience.'],
]

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] sm:p-6">
      {Icon && <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></div>}
      <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
    </div>
  )
}

function StepList({ items }) {
  return (
    <ol className="mt-5 space-y-3">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  )
}

export default function InfoPage({ title, pageKey }) {
  const [openFaq, setOpenFaq] = useState(null)
  const content = pageContent[pageKey] || { label: title, title, intro: `Learn more about ${title.toLowerCase()} at ONUS.` }

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-10 sm:py-14">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-100/50 blur-3xl" />
      <div className="container-center relative z-10 px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to ONUS
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">ONUS Career Platform</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-900 sm:text-5xl">{content.label}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{content.intro}</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {pageKey === 'about' && <>
            <SectionCard icon={UsersRound} title="One platform, two sides of opportunity"><p>Job seekers can discover career opportunities and build their professional journey. Recruiters can post opportunities and connect with suitable candidates.</p><p className="mt-4">ONUS focuses on jobs, internships, career opportunities, talent discovery, and better hiring.</p></SectionCard>
            <SectionCard icon={Target} title="Our Mission"><p>Our mission is to make career opportunities easier to discover and help companies connect with the right talent through a simple and professional platform.</p></SectionCard>
          </>}

          {pageKey === 'how-it-works' && <>
            <SectionCard icon={BriefcaseBusiness} title="Job Seeker"><StepList items={steps.seeker} /></SectionCard>
            <SectionCard icon={UsersRound} title="Recruiter"><StepList items={steps.recruiter} /></SectionCard>
          </>}

          {pageKey === 'career-guidance' && <>
            <SectionCard icon={Compass} title="Build your direction"><ul className="space-y-3">{['Choosing the right career path', 'Building professional skills', 'Creating a strong profile', 'Finding relevant opportunities', 'Preparing for interviews', 'Continuous learning', 'Building professional confidence'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul></SectionCard>
            <SectionCard icon={Target} title="Start With Your Goal"><p>Begin by identifying what you want to learn, what type of role you want, which skills you need, and which opportunities match your goals. A clear goal makes your ONUS profile and search more focused.</p></SectionCard>
          </>}

          {pageKey === 'help' && <>
            {[['Account', ['How to create an account', 'How to sign in', 'How to choose Job Seeker or Recruiter'], ShieldCheck], ['Job Seekers', ['How to find opportunities', 'How to apply', 'How to manage applications', 'How to manage resume'], Search], ['Recruiters', ['How to post a job', 'How to manage posted jobs', 'How to review applicants'], UsersRound], ['General', ['Navigation', 'Profile', 'Account settings', 'Messages'], CircleHelp]].map(([heading, items, Icon]) => <SectionCard key={heading} icon={Icon} title={heading}><ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul></SectionCard>)}
          </>}

          {pageKey === 'resume-tips' && <SectionCard icon={FileText} title="A resume that earns attention"><ol className="space-y-3">{['Keep your resume clear', 'Start with a strong summary', 'Highlight relevant skills', 'Add measurable achievements where possible', 'Keep experience easy to scan', 'Avoid unnecessary information', 'Check grammar and formatting', 'Customize your resume for the role'].map((item, index) => <li key={item} className="flex gap-3"><span className="font-bold text-blue-600">{index + 1}.</span>{item}</li>)}</ol><div className="mt-8 rounded-xl bg-blue-50 p-4"><p className="font-semibold text-slate-900">Ready to explore career opportunities?</p><Link to="/register" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Explore ONUS <ArrowRight className="h-4 w-4" /></Link></div></SectionCard>}

          {pageKey === 'interview-tips' && <>
            <SectionCard icon={Sparkles} title="Before the interview"><ul className="space-y-3">{['Research the company', 'Understand the role', 'Review your resume', 'Prepare common questions'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul></SectionCard>
            <SectionCard icon={MessageCircle} title="During the interview"><ul className="space-y-3">{['Communicate clearly', 'Listen carefully', 'Be honest', 'Explain your experience confidently'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul></SectionCard>
            <SectionCard icon={Compass} title="After the interview"><ul className="space-y-3">{['Reflect on your answers', 'Note areas for improvement', 'Continue preparing for future opportunities'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul></SectionCard>
          </>}

          {pageKey === 'faq' && <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)]">{faqs.map(([question, answer], index) => <div key={question} className="border-b border-slate-100 last:border-b-0"><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex min-h-16 w-full items-center justify-between gap-4 px-5 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:px-6">{question}<ChevronDown className={`h-5 w-5 shrink-0 text-blue-600 transition ${openFaq === index ? 'rotate-180' : ''}`} /></button>{openFaq === index && <p className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6">{answer}</p>}</div>)}</div>}

          {pageKey === 'contact' && <>
            <SectionCard icon={Mail} title="How can we help?"><p>Reach out to ONUS about any of these topics:</p><ul className="mt-4 space-y-3">{['General Questions', 'Career Support', 'Recruiter Support', 'Technical Support', 'Feedback'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul></SectionCard>
            <SectionCard icon={CircleHelp} title="Contact details"><p>Contact details will be available soon.</p><p className="mt-4 text-sm text-slate-500">Built &amp; Designed by Ashraf</p></SectionCard>
          </>}

          {!pageContent[pageKey] && <SectionCard icon={CircleHelp} title={title}><p>This public ONUS information page contains guidance for visitors and members of the career platform.</p></SectionCard>}
        </div>
      </div>
    </section>
  )
}
