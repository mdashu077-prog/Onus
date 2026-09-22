import { useEffect, useState } from 'react'
import { protectedRequest } from '../services/api'

export default function SavedPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSavedPosts() {
      try {
        setLoading(true)
        const data = await protectedRequest('/api/posts/saved', { method: 'GET' })
        setPosts(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Unable to load saved posts.')
      } finally {
        setLoading(false)
      }
    }

    loadSavedPosts()
  }, [])

  if (loading) {
    return (
      <section className="bg-bg py-16">
        <div className="container-center max-w-4xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Loading saved posts…</div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-bg py-16">
      <div className="container-center max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">Saved Posts</p>
          <h1 className="mt-3 text-3xl font-semibold text-secondary">Your saved posts</h1>

          {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

          <div className="mt-8 space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-600">No saved posts yet.</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-secondary">{post.author?.name || 'User'}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{post.postType || 'TEXT'}</p>
                    </div>
                    <span className="text-xs text-slate-500">{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Recently'}</span>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-slate-700">{post.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
