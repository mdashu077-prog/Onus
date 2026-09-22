import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BriefcaseBusiness, CalendarDays, ImagePlus, MapPin, MessageCircle, Send, UserRound } from 'lucide-react'
import { protectedRequest } from '../services/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'

function initials(name) {
  return (name || 'User').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function Avatar({ user, className = 'h-14 w-14' }) {
  if (user?.profilePhotoUrl) {
    return <img src={user.profilePhotoUrl} alt={user.name || 'Profile'} className={`${className} rounded-full object-cover`} />
  }
  return <div className={`${className} flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700`}>{initials(user?.name)}</div>
}

function OptionalField({ label, value }) {
  if (!value) return null
  return <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{value}</p></div>
}

export default function RecruiterProfile() {
  const { recruiterId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [followingStatus, setFollowingStatus] = useState(false)
  const [owner, setOwner] = useState(false)
  const [tab, setTab] = useState('posts')
  const [networkList, setNetworkList] = useState(null)
  const [postText, setPostText] = useState('')
  const [posting, setPosting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProfile() {
    if (!recruiterId) return
    setLoading(true)
    setError('')
    try {
      const [profileResponse, jobsResponse, followersResponse, followingResponse, status, currentProfile] = await Promise.all([
        fetch(`${BASE_URL}/api/recruiters/${recruiterId}`),
        fetch(`${BASE_URL}/api/recruiters/${recruiterId}/jobs`),
        fetch(`${BASE_URL}/api/recruiters/${recruiterId}/followers`),
        fetch(`${BASE_URL}/api/recruiters/${recruiterId}/following`),
        protectedRequest(`/api/recruiters/${recruiterId}/follow-status`, { method: 'GET' }).catch(() => ({ following: false })),
        protectedRequest('/api/profile/me', { method: 'GET' }).catch(() => null),
      ])
      if (!profileResponse.ok) throw new Error(profileResponse.status === 404 ? 'This recruiter profile is unavailable.' : 'Unable to load recruiter profile.')
      const profileData = await profileResponse.json()
      setProfile(profileData)
      setPosts(Array.isArray(profileData.posts) ? profileData.posts : [])
      setJobs(jobsResponse.ok ? await jobsResponse.json() : [])
      setFollowers(followersResponse.ok ? await followersResponse.json() : [])
      setFollowing(followingResponse.ok ? await followingResponse.json() : [])
      setFollowingStatus(Boolean(status?.following))
      setOwner(Boolean(currentProfile?.id && String(currentProfile.id) === String(profileData.id)))
    } catch (loadError) {
      setError(loadError.message || 'Unable to load recruiter profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProfile() }, [recruiterId])

  async function toggleFollow() {
    if (!localStorage.getItem('onus_token')) {
      navigate('/login', { state: { from: `/recruiters/${recruiterId}` } })
      return
    }
    try {
      setBusy(true)
      await protectedRequest(`/api/recruiters/${recruiterId}/follow`, { method: followingStatus ? 'DELETE' : 'POST' })
      await loadProfile()
    } catch (followError) {
      setError(followError.message || 'Unable to update follow status.')
      setBusy(false)
    }
  }

  async function createPost(event) {
    event.preventDefault()
    if (!postText.trim()) return
    try {
      setPosting(true)
      await protectedRequest('/api/posts', { method: 'POST', body: JSON.stringify({ content: postText.trim(), postType: 'TEXT' }) })
      setPostText('')
      await loadProfile()
      setTab('posts')
    } catch (postError) {
      setError(postError.message || 'Unable to create post.')
    } finally {
      setPosting(false)
    }
  }

  if (loading) return <section className="bg-bg py-12"><div className="container-center max-w-6xl rounded-2xl bg-white p-8 text-slate-600 shadow-sm">Loading recruiter profile...</div></section>
  if (error && !profile) return <section className="bg-bg py-12"><div className="container-center max-w-6xl"><button type="button" onClick={() => navigate(-1)} className="mb-5 text-sm font-semibold text-primary">← Back</button><div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">{error}</div></div></section>
  if (!profile) return null

  const tabs = ['posts', 'about', 'photos', 'jobs']
  const users = networkList === 'followers' ? followers : following
  const stats = [
    { label: 'Followers', value: profile.followersCount ?? followers.length, action: () => setNetworkList('followers') },
    { label: 'Following', value: profile.followingCount ?? following.length, action: () => setNetworkList('following') },
    { label: 'Posts', value: profile.postsCount ?? posts.length, action: () => setTab('posts') },
  ]

  return (
    <section className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="container-center max-w-6xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-primary">← Back</button>
        <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 sm:h-48" />
          <div className="px-5 pb-5 sm:px-8">
            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="rounded-full bg-white p-1.5 shadow-md"><Avatar user={profile} className="h-20 w-20 text-xl sm:h-24 sm:w-24" /></div>
                <div className="pb-1"><h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{profile.name || 'Unnamed recruiter'}</h1>{profile.designation && <p className="mt-1 text-sm text-slate-600">{profile.designation}</p>}{profile.company && <p className="text-sm font-medium text-blue-700">{profile.company}</p>}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {owner ? <button type="button" onClick={() => navigate('/profile')} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Edit Profile</button> : <button type="button" disabled={busy} onClick={toggleFollow} className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${followingStatus ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-60`}>{followingStatus ? 'Following' : 'Follow'}</button>}
                {!owner && <button type="button" onClick={() => navigate('/messages', { state: { recipient: { id: profile.id, name: profile.name, profilePhotoUrl: profile.profilePhotoUrl } } })} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><MessageCircle className="h-4 w-4" /> Message</button>}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-slate-100 py-4">{stats.map((stat) => <button type="button" key={stat.label} onClick={stat.action} className="text-left"><span className="text-lg font-bold text-slate-900">{stat.value}</span><span className="ml-1.5 text-sm text-slate-500">{stat.label}</span></button>)}</div>
            {profile.bio && <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-700">{profile.bio}</p>}
            {(profile.location || profile.headline) && <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">{profile.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{profile.location}</span>}{profile.headline && <span>{profile.headline}</span>}</div>}
          </div>
        </header>
        <nav className="mt-5 flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" aria-label="Recruiter profile sections">{tabs.map((item) => <button type="button" key={item} onClick={() => setTab(item)} className={`min-w-[7rem] flex-1 rounded-lg px-4 py-3 text-sm font-semibold capitalize transition ${tab === item ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{item}</button>)}</nav>
        {error && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}
        <main className="mt-5">
          {tab === 'about' && <section className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold text-slate-900">About</h2><div className="mt-5 grid gap-4"><OptionalField label="Company" value={profile.company} /><OptionalField label="Designation" value={profile.designation} /><OptionalField label="Experience" value={profile.experience} /><OptionalField label="Education" value={profile.education} /><OptionalField label="Skills" value={profile.skills} /><OptionalField label="Website" value={profile.website} /><OptionalField label="LinkedIn" value={profile.linkedin} /></div>{![profile.company, profile.designation, profile.experience, profile.education, profile.skills, profile.website, profile.linkedin].some(Boolean) && <p className="mt-4 text-sm text-slate-500">No additional professional details have been added.</p>}</div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Work & Education</h2>{profile.experience ? <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{profile.experience}</p> : <p className="mt-4 text-sm text-slate-500">No work history has been added.</p>}{profile.education && <p className="mt-5 whitespace-pre-line text-sm leading-6 text-slate-700">{profile.education}</p>}</div></section>}
          {tab === 'posts' && <div className="space-y-5">{owner && <form onSubmit={createPost} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Avatar user={profile} className="h-10 w-10" /><input value={postText} onChange={(event) => setPostText(event.target.value)} placeholder="Share a professional update..." className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" /></div><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setTab('photos')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"><ImagePlus className="h-4 w-4" /> Photo</button><button type="submit" disabled={posting || !postText.trim()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"><Send className="h-4 w-4" />{posting ? 'Posting...' : 'Create Post'}</button></div></form>}{posts.length === 0 ? <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">No professional posts yet.</section> : posts.map((post) => <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Avatar user={profile} className="h-10 w-10" /><div><p className="text-sm font-semibold text-slate-800">{profile.name || 'Unnamed recruiter'}</p><p className="text-xs text-slate-400">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</p></div></div>{post.content && <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{post.content}</p>}{post.mediaUrl && <img src={post.mediaUrl} alt="Recruiter post" className="mt-4 max-h-96 w-full rounded-xl object-cover" />}</article>)}</div>}
          {tab === 'photos' && <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><ImagePlus className="mx-auto h-9 w-9 text-slate-300" /><h2 className="mt-3 text-lg font-bold text-slate-900">Photos</h2><p className="mt-2 text-sm text-slate-500">No profile photos have been uploaded yet.</p>{owner && <p className="mt-1 text-xs text-slate-400">Photo uploads require persistent media storage, which is not configured in this project.</p>}</section>}
          {tab === 'jobs' && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Jobs Posted by {profile.name || 'this recruiter'}</h2><div className="mt-4 space-y-3">{jobs.length === 0 ? <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No jobs posted by this recruiter yet.</p> : jobs.map((job) => <button key={job.id} type="button" onClick={() => navigate(`/jobs/${job.id}`)} className="w-full rounded-xl border border-slate-100 p-4 text-left hover:border-blue-200 hover:bg-blue-50/30"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-slate-900">{job.title}</h3><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">{job.company && <span>{job.company}</span>}{job.location && <span>{job.location}</span>}{job.jobType && <span className="inline-flex items-center gap-1"><BriefcaseBusiness className="h-3.5 w-3.5" />{job.jobType}</span>}{job.createdAt && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(job.createdAt).toLocaleDateString()}</span>}</div></div><span className="text-sm font-semibold text-blue-700">View</span></div>{job.salary && <p className="mt-3 text-sm font-medium text-slate-700">{job.salary}</p>}</button>)}</div></section>}
        </main>
        {networkList && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={() => setNetworkList(null)}><div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">{networkList === 'followers' ? 'Followers' : 'Following'}</h2><button type="button" onClick={() => setNetworkList(null)} className="text-sm font-semibold text-slate-500">Close</button></div><div className="mt-4 space-y-2">{users.length === 0 ? <p className="py-6 text-sm text-slate-500">No users to show.</p> : users.map((user) => <button key={user.id} type="button" onClick={() => navigate(`/users/${user.id}`)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50"><Avatar user={user} /><span><span className="block font-semibold text-slate-800">{user.name || 'Unnamed user'}</span>{user.designation && <span className="block text-sm text-slate-500">{user.designation}</span>}{user.company && <span className="block text-xs text-slate-400">{user.company}</span>}</span><UserRound className="ml-auto h-4 w-4 text-slate-400" /></button>)}</div></div></div>}
      </div>
    </section>
  )
}
