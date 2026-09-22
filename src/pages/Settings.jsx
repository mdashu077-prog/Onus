import { useEffect, useState } from 'react'
import { changePassword, getMyProfile, updateMyProfile } from '../services/api'

export default function Settings({ auth, onLogout }) {
  const [profile, setProfile] = useState({
    email: auth?.email || '',
    role: auth?.role || '',
    emailNotifications: true,
    jobAlertsEnabled: true,
    profileVisible: true,
    allowJobSeekerReplies: true,
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [profileMessage, setProfileMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile()
        setProfile({
          email: data.email || auth?.email || '',
          role: data.role || auth?.role || '',
          emailNotifications: data.emailNotifications ?? true,
          jobAlertsEnabled: data.jobAlertsEnabled ?? true,
          profileVisible: data.profileVisible ?? true,
          allowJobSeekerReplies: data.allowJobSeekerReplies ?? true,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [auth])

  async function handleToggle(field, value) {
    const nextValue = !value
    setProfile((current) => ({
      ...current,
      [field]: nextValue,
    }))

    try {
      await updateMyProfile({ [field]: nextValue })
      setProfileMessage('Preferences updated successfully.')
    } catch (err) {
      console.error(err)
      setProfileMessage('Unable to save preference.')
    }
  }

  async function handleReplyToggle() {
    try {
      const nextValue = !profile.allowJobSeekerReplies
      await updateMyProfile({ allowJobSeekerReplies: nextValue })
      setProfile((current) => ({ ...current, allowJobSeekerReplies: nextValue }))
      setProfileMessage('Messaging preference updated successfully.')
    } catch (err) {
      console.error(err)
      setProfileMessage('Unable to save messaging preference.')
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    setSaving(true)

    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.')
      setSaving(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      setSaving(false)
      return
    }

    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      setPasswordSuccess(response.message || 'Password updated successfully.')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      setPasswordError(err.message || 'Unable to change password.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-bg py-16">
        <div className="container-center max-w-5xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Settings</p>
            <p className="mt-4 text-slate-600">Loading account settings…</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-bg py-12 sm:py-16">
      <div className="container-center max-w-5xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold text-secondary">Account settings</h1>

          {profileMessage && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {profileMessage}
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-secondary">Account</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="mt-1 font-semibold text-slate-800">{profile.email || 'you@example.com'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Role</p>
                  <p className="mt-1 font-semibold text-slate-800">{profile.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Profile visibility</p>
                  <button type="button" onClick={() => handleToggle('profileVisible', profile.profileVisible)} className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700">
                    {profile.profileVisible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-secondary">Notifications</h2>
              <div className="mt-4 space-y-3">
                <button type="button" onClick={() => handleToggle('emailNotifications', profile.emailNotifications)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700">
                  <span>Email notifications</span>
                  <span className={`rounded-full px-2 py-1 text-xs ${profile.emailNotifications ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {profile.emailNotifications ? 'On' : 'Off'}
                  </span>
                </button>

                <button type="button" onClick={() => handleToggle('jobAlertsEnabled', profile.jobAlertsEnabled)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700">
                  <span>Job alerts</span>
                  <span className={`rounded-full px-2 py-1 text-xs ${profile.jobAlertsEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {profile.jobAlertsEnabled ? 'On' : 'Off'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {profile.role === 'recruiter' && (
            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold text-secondary">Messaging</h2>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Allow Job Seekers to reply to your messages</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {profile.allowJobSeekerReplies
                      ? 'When enabled, candidates can reply to messages you send them through ONUS.'
                      : 'Candidates cannot reply to your recruiter messages.'}
                  </p>
                </div>
                <button type="button" onClick={handleReplyToggle} className={`rounded-full px-4 py-2 text-sm font-semibold ${profile.allowJobSeekerReplies ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                  {profile.allowJobSeekerReplies ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-secondary">Change password</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} placeholder="Current password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))} placeholder="New password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
              <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))} placeholder="Confirm password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white" />
            </div>

            {passwordError && (
              <p className="mt-4 text-sm font-medium text-red-600">{passwordError}</p>
            )}

            {passwordSuccess && (
              <p className="mt-4 text-sm font-medium text-green-700">{passwordSuccess}</p>
            )}

            <div className="mt-5">
              <button type="submit" disabled={saving} className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-secondary">Session</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={onLogout} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
