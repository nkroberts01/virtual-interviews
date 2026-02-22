import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { InterviewSettings, InterviewInsert } from '@/types/database'

interface InterviewConfigModalProps {
  open: boolean
  onClose: () => void
}

const defaultSettings: InterviewSettings = {
  questions: [''],
  allowRetakes: false,
  maxAttempts: 1,
}

export function InterviewConfigModal({ open, onClose }: InterviewConfigModalProps) {
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<string[]>([''])
  const [allowRetakes, setAllowRetakes] = useState(false)
  const [maxAttempts, setMaxAttempts] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setTitle('')
    setQuestions([''])
    setAllowRetakes(defaultSettings.allowRetakes)
    setMaxAttempts(defaultSettings.maxAttempts)
    setError(null)
  }

  function addQuestion() {
    setQuestions((q) => [...q, ''])
  }

  function removeQuestion(i: number) {
    setQuestions((q) => q.filter((_, idx) => idx !== i))
  }

  function updateQuestion(i: number, value: string) {
    setQuestions((q) => {
      const next = [...q]
      next[i] = value
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not signed in.')
      setSaving(false)
      return
    }
    const filteredQuestions = questions.filter((q) => q.trim() !== '')
    const settings: InterviewSettings = {
      questions: filteredQuestions.length ? filteredQuestions : [''],
      allowRetakes,
      maxAttempts: allowRetakes ? maxAttempts : 1,
    }
    const row: InterviewInsert = {
      creator_id: user.id,
      title: title.trim() || 'Untitled Interview',
      settings,
    }
    const { error: err } = await supabase.from('interviews').insert(row as never)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    reset()
    onClose()
  }

  function handleClose() {
    reset()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={handleClose} aria-hidden />
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">New Interview</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="interview-title" className="block text-sm font-medium text-slate-700">
              Interview Title
            </label>
            <input
              id="interview-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="e.g. Frontend Engineer – Video Screen"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Questions</label>
              <button
                type="button"
                onClick={addQuestion}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-2">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => updateQuestion(i, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    placeholder={`Question ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(i)}
                    disabled={questions.length <= 1}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Remove question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="allow-retakes"
              type="checkbox"
              checked={allowRetakes}
              onChange={(e) => setAllowRetakes(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <label htmlFor="allow-retakes" className="text-sm font-medium text-slate-700">
              Allow retakes
            </label>
          </div>

          {allowRetakes && (
            <div>
              <label htmlFor="max-attempts" className="block text-sm font-medium text-slate-700">
                Number of allowed attempts
              </label>
              <input
                id="max-attempts"
                type="number"
                min={1}
                max={10}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="mt-1 w-24 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Create Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
