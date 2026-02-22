import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Video, Mail, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { InterviewRow, ApplicationRow } from '@/types/database'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function InterviewApplicationsInner() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [interview, setInterview] = useState<InterviewRow | null>(null)
  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const interviewId = id ?? ''

  useEffect(() => {
    if (!interviewId) {
      setError('Interview not found')
      setLoading(false)
      return
    }
    async function load() {
      const { data: interviewData, error: interviewError } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', interviewId)
        .single()
      if (interviewError || !interviewData) {
        setError(interviewError?.message ?? 'Interview not found')
        setLoading(false)
        return
      }
      setInterview(interviewData as InterviewRow)

      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('interview_id', interviewId)
        .order('created_at', { ascending: false })
      if (!appError) setApplications((appData as ApplicationRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [interviewId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Loading…</div>
      </div>
    )
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4">
        <p className="text-slate-600">{error ?? 'Interview not found'}</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm font-medium text-slate-900 hover:underline"
        >
          ← Back to dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-slate-800 truncate">{interview.title}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Applications</h2>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Mail className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="mt-4 text-slate-600">No applications yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Share this interview link with candidates to collect video submissions.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {applications.map((app) => (
              <li
                key={app.id}
                className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="rounded-lg bg-slate-100 p-2 shrink-0">
                    {app.status === 'completed' ? (
                      <Video className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{app.candidate_email}</p>
                    <p className="text-sm text-slate-500">
                      {app.status === 'completed' ? 'Video submitted' : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      app.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {app.status === 'completed' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {app.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                  {app.video_url && (
                    <a
                      href={app.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      View
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export function InterviewApplications() {
  return (
    <ProtectedRoute>
      <InterviewApplicationsInner />
    </ProtectedRoute>
  )
}
