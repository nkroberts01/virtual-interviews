import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Video, LogOut, ChevronRight, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { InterviewRow } from '@/types/database'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { InterviewConfigModal } from '@/components/InterviewConfigModal'

function DashboardInner() {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState<InterviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
      if (!error) setInterviews(data ?? [])
      setLoading(false)
    }
    load()
  }, [modalOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-slate-800">ScreenEasy</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-900">Configured Interviews</h1>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition"
          >
            <Plus className="w-4 h-4" />
            New Interview
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Loading…
          </div>
        ) : interviews.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Video className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="mt-4 text-slate-600">No interviews yet</p>
            <p className="mt-1 text-sm text-slate-500">Create one to start collecting video responses.</p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" />
              New Interview
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {interviews.map((interview) => (
              <li key={interview.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/interviews/${interview.id}`)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="rounded-lg bg-slate-100 p-2 shrink-0">
                      <Video className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{interview.title}</p>
                      <p className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(interview.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {interview.settings?.questions?.length ?? 0} questions
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <InterviewConfigModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  )
}
