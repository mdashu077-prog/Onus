import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, ImagePlus, MapPin, Share2, UserRound } from 'lucide-react'
import { getMyProfile, protectedRequest, updateMyProfile } from '../services/api'

const emptyProfile = {
  name: '',
  email: '',
  role: '',
  phone: '',
  location: '',
  city: '',
  state: '',
  headline: '',
  bio: '',
  skills: '',
  experience: '',
  education: '',
  companyName: '',
  designation: '',
  website: '',
  linkedin: '',
  profilePhotoUrl: '',
  coverPhotoUrl: '',
}

export default function Profile({ auth }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(emptyProfile)
  const [socialData, setSocialData] = useState({ followersCount: 0, followingCount: 0, posts: [], jobs: [], followers: [], following: [] })
  const [stories, setStories] = useState([])
  const [storyText, setStoryText] = useState('')
  const [showStoryComposer, setShowStoryComposer] = useState(false)
  const [storySaving, setStorySaving] = useState(false)
  const [networkList, setNetworkList] = useState(null)
  const [shareMessage, setShareMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const data = await getMyProfile()
        setProfile({
          ...emptyProfile,
          ...data,
          email: data.email || auth?.email || '',
          role: data.role || auth?.role || '',
          name: data.name || auth?.name || '',
        })

        const [publicProfile, followers, following, storiesResponse] = await Promise.all([
          protectedRequest(`/api/users/${data.id}`, { method: 'GET' }),
          protectedRequest(`/api/users/${data.id}/followers`, { method: 'GET' }),
          protectedRequest(`/api/users/${data.id}/following`, { method: 'GET' }),
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'}/api/stories/user/${data.id}`),
        ])
        setSocialData({
          followersCount: publicProfile?.followersCount ?? 0,
          followingCount: publicProfile?.followingCount ?? 0,
          posts: Array.isArray(publicProfile?.posts) ? publicProfile.posts : [],
          jobs: Array.isArray(publicProfile?.jobs) ? publicProfile.jobs : [],
          followers: Array.isArray(followers) ? followers : [],
          following: Array.isArray(following) ? following : [],
        })
        setStories(storiesResponse.ok ? await storiesResponse.json() : [])
      } catch (err) {
        setError(err.message || 'Unable to load profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [auth])

  function handleChange(event) {
    const { name, value } = event.target
    setProfile((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function shareProfile() {
    const profileUrl = `${window.location.origin}/users/${profile.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.name || 'ONUS Profile', url: profileUrl })
      } else {
        await navigator.clipboard.writeText(profileUrl)
        setShareMessage('Profile link copied.')
      }
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') setShareMessage('Unable to share profile.')
    }
  }

  async function createStory(event) {
    event.preventDefault()
    if (!storyText.trim()) return
    try {
      setStorySaving(true)
      const createdStory = await protectedRequest('/api/stories', {
        method: 'POST',
        body: JSON.stringify({ content: storyText.trim() }),
      })
      setStories((current) => [createdStory, ...current])
      setStoryText('')
      setShowStoryComposer(false)
    } catch (storyError) {
      setError(storyError.message || 'Unable to create story.')
    } finally {
      setStorySaving(false)
    }
  }

  const profilePosts = socialData.posts
  const profileJobs = socialData.jobs
  const networkUsers = networkList === 'followers' ? socialData.followers : socialData.following

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const payload = {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        city: profile.city,
        state: profile.state,
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        companyName: profile.companyName,
        designation: profile.designation,
        website: profile.website,
        linkedin: profile.linkedin,
        profilePhotoUrl: profile.profilePhotoUrl,
        coverPhotoUrl: profile.coverPhotoUrl,
      }

      await updateMyProfile(payload)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Unable to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-bg py-16">
        <div className="container-center max-w-5xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Profile</p>
            <p className="mt-4 text-slate-600">Loading profile details…</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-bg py-12 sm:py-16">
      <div className="container-center max-w-5xl">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <div className="h-32 bg-cover bg-center sm:h-44" style={profile.coverPhotoUrl ? { backgroundImage: `url(${profile.coverPhotoUrl})` } : undefined}>
            {!profile.coverPhotoUrl && <div className="h-full bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700" />}
          </div>
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="rounded-full bg-white p-1.5 shadow-md">
                  {profile.profilePhotoUrl ? (
                    <img src={profile.profilePhotoUrl} alt={profile.name || 'Profile'} className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 sm:h-24 sm:w-24">{(profile.name || 'U').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</div>
                  )}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{profile.name || 'My Profile'}</h1>
                  {profile.headline || profile.designation ? <p className="mt-1 text-sm text-slate-600">{profile.headline || profile.designation}</p> : null}
                  {profile.companyName && <p className="text-sm font-medium text-blue-700">{profile.companyName}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => document.getElementById('profile-editor')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Edit Profile</button>
                <button type="button" onClick={() => setShowStoryComposer(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ImagePlus className="h-4 w-4" /> Add Story</button>
                <button type="button" onClick={shareProfile} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Share2 className="h-4 w-4" /> Share</button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-slate-100 py-4">
              <button type="button" onClick={() => setNetworkList('followers')} className="text-left"><strong className="text-lg text-slate-900">{socialData.followersCount}</strong><span className="ml-1.5 text-sm text-slate-500">Followers</span></button>
              <button type="button" onClick={() => setNetworkList('following')} className="text-left"><strong className="text-lg text-slate-900">{socialData.followingCount}</strong><span className="ml-1.5 text-sm text-slate-500">Following</span></button>
              <span className="text-left"><strong className="text-lg text-slate-900">{profilePosts.length}</strong><span className="ml-1.5 text-sm text-slate-500">Posts</span></span>
              {profile.role === 'recruiter' && <span className="text-left"><strong className="text-lg text-slate-900">{profileJobs.length}</strong><span className="ml-1.5 text-sm text-slate-500">Jobs</span></span>}
            </div>

            {(profile.location || profile.bio) && <div className="mt-4 space-y-2">{profile.location && <p className="inline-flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4" />{profile.location}</p>}{profile.bio && <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-700">{profile.bio}</p>}</div>}
          </div>
        </section>

        {shareMessage && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">{shareMessage}</div>}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">About</h2>
          <p className="mt-1 text-sm text-slate-500">Professional details entered on this profile</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ['Company', profile.companyName],
              ['Designation', profile.designation],
              ['Location', profile.location],
              ['Experience', profile.experience],
              ['Education', profile.education],
              ['Skills', profile.skills],
              ['Website', profile.website],
              ['LinkedIn', profile.linkedin],
            ].map(([label, value]) => value ? <div key={label}><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{value}</p></div> : null)}
          </div>
          {![profile.companyName, profile.designation, profile.location, profile.experience, profile.education, profile.skills, profile.website, profile.linkedin, profile.bio].some(Boolean) && <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No additional profile details have been entered yet.</p>}
          {profile.bio && <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">About / Bio</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{profile.bio}</p></div>}
        </section>

        {networkList && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={() => setNetworkList(null)}><div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">{networkList === 'followers' ? 'Followers' : 'Following'}</h2><button type="button" onClick={() => setNetworkList(null)} className="text-sm font-semibold text-slate-500">Close</button></div><div className="mt-4 space-y-2">{networkUsers.length === 0 ? <p className="py-6 text-sm text-slate-500">No users to show.</p> : networkUsers.map((user) => <button key={user.id} type="button" onClick={() => navigate(`/users/${user.id}`)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{(user.name || 'U').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</div><span><strong className="block text-sm text-slate-800">{user.name || 'Unnamed user'}</strong>{user.designation && <span className="block text-xs text-slate-500">{user.designation}</span>}{user.company && <span className="block text-xs text-slate-400">{user.company}</span>}</span><UserRound className="ml-auto h-4 w-4 text-slate-400" /></button>)}</div></div></div>}

        {showStoryComposer && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={() => setShowStoryComposer(false)}><form onSubmit={createStory} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><h2 className="text-lg font-bold text-slate-900">Add Story</h2><p className="mt-1 text-sm text-slate-500">Share a short professional update. Stories expire after 24 hours.</p><textarea value={storyText} onChange={(event) => setStoryText(event.target.value)} rows={5} maxLength={2000} placeholder="Write your story..." className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" /><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setShowStoryComposer(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={storySaving || !storyText.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300">{storySaving ? 'Publishing...' : 'Publish Story'}</button></div></form></div>}

        <div id="profile-editor" className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-secondary">{profile.name || 'My Profile'}</h1>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              {profile.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Full Name</span>
                <input name="name" value={profile.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Email</span>
                <input value={profile.email} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Phone</span>
                <input name="phone" value={profile.phone || ''} onChange={handleChange} placeholder="+91 98765 43210" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Role</span>
                <input value={profile.role ? (profile.role === 'recruiter' ? 'Recruiter' : 'Job Seeker') : ''} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Location</span>
                <input name="location" value={profile.location || ''} onChange={handleChange} placeholder="Mumbai, India" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">City</span>
                <input name="city" value={profile.city || ''} onChange={handleChange} placeholder="Mumbai" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">State</span>
                <input name="state" value={profile.state || ''} onChange={handleChange} placeholder="Maharashtra" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Headline</span>
                <input name="headline" value={profile.headline || ''} onChange={handleChange} placeholder="Product designer with 4 years of experience" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600">Bio</span>
              <textarea name="bio" rows={4} value={profile.bio || ''} onChange={handleChange} placeholder="Tell recruiters a bit about yourself." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Skills</span>
                <input name="skills" value={profile.skills || ''} onChange={handleChange} placeholder="Java, React, Product Design" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Experience</span>
                <input name="experience" value={profile.experience || ''} onChange={handleChange} placeholder="4 years" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Education</span>
                <input name="education" value={profile.education || ''} onChange={handleChange} placeholder="B.Tech / MBA" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Company Name</span>
                <input name="companyName" value={profile.companyName || ''} onChange={handleChange} placeholder="ONUS Labs" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Designation</span>
                <input name="designation" value={profile.designation || ''} onChange={handleChange} placeholder="Senior Product Manager" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Website</span>
                <input name="website" value={profile.website || ''} onChange={handleChange} placeholder="https://example.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-600">LinkedIn</span>
                <input name="linkedin" value={profile.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/your-profile" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-600">Profile photo URL</span>
                <input name="profilePhotoUrl" value={profile.profilePhotoUrl || ''} onChange={handleChange} placeholder="https://..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-600">Cover photo URL</span>
                <input name="coverPhotoUrl" value={profile.coverPhotoUrl || ''} onChange={handleChange} placeholder="https://..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={saving} className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

