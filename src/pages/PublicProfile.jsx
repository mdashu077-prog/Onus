import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { protectedRequest } from '../services/api'

export default function PublicProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [profileData, statusData] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'}/api/users/${userId}`).then((response) => response.json()),
          protectedRequest(`/api/users/${userId}/follow-status`, { method: 'GET' }).catch(() => ({ following: false })),
        ])

        setProfile(profileData)
        setPosts(Array.isArray(profileData?.posts) ? profileData.posts : [])
        setFollowing(Boolean(statusData?.following))
      } catch (error) {
        console.error(error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  async function handleFollow() {
    if (!userId) return

    if (!localStorage.getItem('onus_token')) {
      navigate('/login', { state: { from: `/users/${userId}` } })
      return
    }

    try {
      setBusy(true)
      if (following) {
        await protectedRequest(`/api/users/${userId}/follow`, { method: 'DELETE' })
        setFollowing(false)
      } else {
        await protectedRequest(`/api/users/${userId}/follow`, { method: 'POST' })
        setFollowing(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <section className="bg-bg py-16"><div className="container-center max-w-5xl"><div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Loading profile…</div></div></section>
  if (!profile) return <section className="bg-bg py-16"><div className="container-center max-w-5xl"><button onClick={() => navigate(-1)} className="mb-6 text-sm font-semibold text-primary hover:underline">← Back</button><div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Profile not found.</div></div></section>

  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-5xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm font-semibold text-primary hover:underline">← Back</button>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Public Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-secondary">{profile.name || 'User'}</h1>
              <p className="mt-2 text-slate-600">{profile.designation || profile.role || 'Professional'}</p>
              <p className="text-sm text-slate-500">{profile.company || profile.location || 'Location not specified'}</p>
            </div>
            <button type="button" disabled={busy} onClick={handleFollow} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${following ? 'border border-green-600 bg-green-50 text-green-700 hover:bg-green-100' : 'bg-primary text-white hover:bg-blue-600'} ${busy ? 'cursor-not-allowed opacity-70' : ''}`}>
              {busy ? 'Updating...' : following ? '✓ Following' : '+ Follow'}
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Followers</p>
              <p className="mt-2 text-2xl font-bold text-secondary">{profile.followersCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Following</p>
              <p className="mt-2 text-2xl font-bold text-secondary">{profile.followingCount ?? 0}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-secondary">About</h2>
            <p className="mt-2 text-slate-700">{profile.bio || 'Profile bio is not available yet.'}</p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-secondary">Public posts</h2>
            <div className="mt-5 space-y-4">
              {posts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-600">No public posts yet.</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{post.postType || 'TEXT'}</p>
                    <p className="mt-3 whitespace-pre-wrap text-slate-700">{post.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
