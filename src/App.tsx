import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import { Dashboard } from '@/pages/Dashboard'
import { InterviewApplications } from '@/pages/InterviewApplications'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/interviews/:id" element={<InterviewApplications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
