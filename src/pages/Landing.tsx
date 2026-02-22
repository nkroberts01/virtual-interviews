import { Link } from 'react-router-dom'
import { Video, ArrowRight, Zap, Shield, Clock } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-slate-800">ScreenEasy</span>
          <nav className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight max-w-2xl mx-auto">
            Lightweight Virtual Interview Solution
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto">
            Configure interviews, collect video responses, and review candidates—all in one simple flow. No clutter, no branding.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Log in
            </Link>
          </div>
        </section>

        <section className="mt-24 grid sm:grid-cols-3 gap-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-lg bg-slate-100 p-3 w-fit">
              <Zap className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">Lightweight</h3>
            <p className="mt-2 text-sm text-slate-600">
              Focus on interviews. No heavy suites or unnecessary features.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-lg bg-slate-100 p-3 w-fit">
              <Video className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">Video-first</h3>
            <p className="mt-2 text-sm text-slate-600">
              Candidates record answers on their own time. You watch when ready.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-lg bg-slate-100 p-3 w-fit">
              <Shield className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">Unbranded</h3>
            <p className="mt-2 text-sm text-slate-600">
              Your process, your look. No third-party branding on the experience.
            </p>
          </div>
        </section>

        <section className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            Set up an interview in minutes
          </div>
        </section>
      </main>
    </div>
  )
}
