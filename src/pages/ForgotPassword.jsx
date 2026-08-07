import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      alert('Password reset link sent to ' + email)
      setSubmitted(false)
    }, 1000)
  }

  return (
    <section className="bg-bg min-h-screen flex items-center py-12">
      <div className="container-center max-w-md">
        <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">Reset Password</h2>
          <p className="text-slate-600 mb-6">Enter your email to receive a password reset link</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold transition hover:bg-blue-700 active:scale-95"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="rounded-lg bg-success/10 border border-success/20 p-4 text-center">
              <p className="text-success font-semibold">✓ Check your email!</p>
              <p className="text-sm text-slate-600 mt-2">Password reset link has been sent to {email}</p>
            </div>
          )}

          <div className="mt-6 text-center space-y-3">
            <p className="text-slate-600">Remember your password?</p>
            <Link to="/login" className="block text-primary hover:text-blue-700 font-semibold transition">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
