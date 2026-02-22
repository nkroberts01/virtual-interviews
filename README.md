# ScreenEasy

Lightweight, unbranded virtual interview SaaS: configure interviews, collect video responses, review candidates.

## Stack

- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS, Lucide React, React Router
- **Backend:** Supabase (Auth, PostgreSQL, Storage)

For strict Supabase typings, generate types from your project:  
`npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts`

## File structure

```
interviews/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── .env.example
├── README.md
├── supabase/
│   └── schema.sql          # Run in Supabase SQL Editor
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── lib/
    │   └── supabase.ts     # Supabase client (typed)
    ├── types/
    │   └── database.ts     # DB types for interviews & applications
    ├── components/
    │   ├── ProtectedRoute.tsx
    │   └── InterviewConfigModal.tsx
    └── pages/
        ├── Landing.tsx
        ├── Login.tsx
        ├── SignUp.tsx
        ├── Dashboard.tsx
        └── InterviewApplications.tsx
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In **SQL Editor**, run `supabase/schema.sql` to create `interviews` and `applications` (and RLS).
   - Optional: create a Storage bucket (e.g. `interview-videos`) for video files.
   - In **Project Settings → API**: copy Project URL and anon key.

3. **Environment**
   ```bash
   cp .env.example .env
   ```
   Set:
   - `VITE_SUPABASE_URL` = your project URL  
   - `VITE_SUPABASE_ANON_KEY` = your anon key  

4. **Run**
   ```bash
   npm run dev
   ```

## Features

- **Landing:** Hero and value props.
- **Auth:** Login / Sign up via Supabase Auth.
- **Dashboard (protected):** List of configured interviews (title, date, status); “New Interview” opens a modal.
- **Interview config modal:** Title, dynamic question list (add/remove), “Allow retakes” toggle, max attempts.
- **Application view:** Per-interview list of candidates with video submission status (pending/completed).

## Database (from schema.sql)

- **interviews:** `id`, `creator_id`, `title`, `settings` (jsonb: questions, allowRetakes, maxAttempts), `created_at`
- **applications:** `id`, `interview_id`, `candidate_email`, `video_url`, `status` (pending | completed), `created_at`

RLS ensures users only manage their own interviews and the applications for those interviews.
