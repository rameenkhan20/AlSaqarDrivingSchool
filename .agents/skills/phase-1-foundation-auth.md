---
name: phase-1-foundation-auth
description: Execution guide for Phase 1 of the Al Saqar Driving School roadmap — the foundation refactor (shared types, facade hook) plus Supabase-backed Auth wiring (AuthContext, authService, route protection). Use this skill when implementing any task under Roadmap Phase 1.1 or 1.2. Do not use for Phase 2+ (multi-instructor schema) or Phase 3 (core feature UI) work — separate skills cover those.
---

# Phase 1 — Foundation Refactor + Auth & Context Wiring

## Objective

Close the two prerequisites that everything else in the roadmap depends on:
1. The blueprint-mandated foundation cleanup (shared types, one facade hook, no direct context imports from `components/`) — pulled forward from the blueprint's backlog specifically because Phase 1 is the first time a *second* Context enters the app, which is the cheapest moment to enforce these patterns.
2. Real authentication, backed by Supabase, replacing the current no-op `router.replace` calls in the sign-in/sign-up screens.

This skill assumes `.agent/architecture-blueprint.md` and `.agent/feature-roadmap.md` are already in the repo and treats their rules as binding, not optional guidance.

## Preconditions (verify before starting)

- [ ] Roadmap §0 confirms Supabase is the locked-in backend. If it doesn't, stop — do not proceed with Supabase-specific steps against an unconfirmed decision.
- [ ] A Supabase project exists with its URL and anon key available (as environment variables — never hardcoded in source).
- [ ] `@supabase/supabase-js` is installed as a dependency.

## Guardrail — read this before writing anything

> **Presentational components under `components/` must never import a Context directly — not `AuthContext`, not `studentClassContext`, not any future context.** This is the single rule this entire phase exists to enforce for real. If a step below appears to require a component to reach into a Context to get something done, the fix is to lift that call up to the parent screen (`app/`) and pass it down as a prop — not to add the import.

This guardrail supersedes convenience. It applies retroactively to `StudentCard.tsx` and `Schedule.tsx` (see Task 2 below) and prospectively to every component touched in this phase or later.

---

## Task 1 — Extract `types/student.ts`

**Why now:** Phase 2 adds an `instructorId` field to the student shape. Doing this extraction now means that field gets added in one place later, not three.

Steps:
1. Create `types/student.ts`.
2. Move the `StudentList` interface currently declared inline in `context/studentClassesContext.tsx` into this file, renamed to `Student` (the domain noun, not a collection noun — per blueprint naming convention §9).
3. Export `Student` as a named export. No default export.
4. In `context/studentClassesContext.tsx`, replace the inline `StudentList` interface with an import of `Student` from `types/student.ts`. Update every local usage (`students: Student[]`, the context value's typed shape, etc.).
5. In `components/StudentCard.tsx`, replace the manually-declared `studentCardProps` fields that mirror student data with a reference to `Student` (e.g. `Pick<Student, 'studentId' | 'studentName' | 'totalClasses' | 'completedClasses' | 'scheduledClasses'>` or a direct `student: Student` prop, whichever keeps the component's prop surface honest about what it actually needs — see the component-prop-surface note below).
6. Repeat for `components/Schedule.tsx`'s `scheduleCardProps`.
7. Do **not** add `instructorId` to `Student` yet — that's Phase 2's job. Keep this task scoped to deduplication only.

**Component-prop-surface note:** prefer the narrowest prop type a component actually needs (`Pick<Student, ...>`) over accepting the entire `Student` object when the component only reads a few fields. This keeps the presentational layer's contract honest and makes it obvious at a glance what a component depends on.

**Done when:** grep for `interface Student` (or similarly named interfaces) across `context/`, `components/` returns exactly one hit, in `types/student.ts`.

---

## Task 2 — Create the `useStudents` facade hook

**Why now:** every component under `components/` currently repeats `const context = useContext(studentClassContext); if (!context) throw new Error('No context');`. That guard belongs in exactly one place, and this is also the pattern Phase 1's Auth work needs to mirror for `useAuth`.

Steps:
1. Create `hooks/facade/useStudents.ts`.
2. Inside it: call `useContext(studentClassContext)`, perform the null/no-provider guard once, and return the typed context value (or a narrowed subset of it, if some consumers don't need the full surface).
3. Update every current direct consumer of `studentClassContext` to call `useStudents()` instead of `useContext(studentClassContext)` directly:
   - `app/(tabs)/index.tsx`
   - `app/(tabs)/studentList.tsx`
   - `components/Schedule.tsx` — **and simultaneously apply the guardrail above**: remove the `useContext` call from this component entirely. `modifyScheduledClass` should arrive as a prop (e.g. `onModifySchedule`) from whichever screen renders `Schedule`, which itself gets it from `useStudents()`.
   - `components/StudentCard.tsx` — same treatment for `scheduledDateTime`, arriving as an `onSchedule` prop instead of a direct context call.
4. Confirm no file outside `hooks/facade/useStudents.ts` contains the literal string `useContext(studentClassContext)`.

**Done when:** `components/Schedule.tsx` and `components/StudentCard.tsx` import zero context-related modules; both receive every piece of data and every callback as props.

---

## Task 3 — Scaffold the Supabase client seam

**Why now:** every Supabase-touching file from this point forward (`authService.ts` now, `studentService.ts`/`paymentService.ts` later) needs one shared, already-initialized client instance rather than each file constructing its own.

Steps:
1. Create `services/supabaseClient.ts`.
2. Initialize exactly one client via `createClient(supabaseUrl, supabaseAnonKey)`, reading the URL/key from environment variables (e.g. Expo's `process.env.EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — confirm the project's actual env-var convention before wiring this).
3. Export the client instance as the module's single named export.
4. This file is the *only* place `createClient` is called anywhere in the codebase.

**Done when:** grep for `createClient(` across the repo returns exactly one hit.

---

## Task 4 — Scaffold `services/studentService.ts` (mock-shaped, real signature)

**Why now:** the seam should exist before Phase 2 needs to fill it in with real Postgres queries — this task changes nothing behaviorally, it just relocates the mock array behind a function boundary shaped the way the real implementation will be.

Steps:
1. Create `services/studentService.ts`.
2. Define (but don't yet wire to Supabase) a function signature: `getStudents(instructorId: string): Promise<Student[]>`. For now, it can resolve the existing hardcoded mock array — the `instructorId` parameter is accepted but not yet used to filter, since multi-instructor scoping is Phase 2's job.
3. Update `context/studentClassesContext.tsx`'s `useClassCount` hook to call `studentService.getStudents(...)` (via `useEffect` on mount) instead of importing the hardcoded array directly, and to hold the result in state.
4. This file does **not** import `services/supabaseClient.ts` yet in this phase — that wiring happens in Phase 2 once the `students` table exists. Keep the seam decoupled from the real query until the schema is there to query against.

**Done when:** `context/studentClassesContext.tsx` contains no hardcoded student data — it fetches from `studentService` on mount.

---

## Task 5 — Build `AuthContext.tsx`

Steps:
1. Create `context/auth/AuthContext.tsx`.
2. Follow the exact shape already established by `studentClassesContext.tsx`:
   - An internal `use{Domain}` hook (e.g. `useAuthState`) holding `session`, `user`/`instructor profile`, and loading/error status, plus action functions (`signUp`, `signIn`, `signOut`).
   - `export const AuthContext = createContext<... | undefined>(undefined)`.
   - `export const AuthContextProvider = ({ children }) => { ... }` wrapping children with `AuthContext.Provider`.
3. Inside `useAuthState`, subscribe to session changes via the auth service (Task 6) rather than calling the Supabase SDK directly from the context file — the context orchestrates *when* to call and *where the result lives*; it does not know *how* the call is made.
4. Track a status field alongside session state (`'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'`) — this is the first real use of the async-status shape the blueprint flagged as "not yet needed" (blueprint §4.4); it's needed now because auth is genuinely asynchronous.

---

## Task 6 — Build `services/authService.ts`

Steps:
1. Create `services/authService.ts`.
2. Import the shared client from `services/supabaseClient.ts` — no other import of the Supabase SDK itself.
3. Expose named async functions wrapping `supabase.auth`:
   - `signUp(email, password)`
   - `signIn(email, password)`
   - `signOut()`
   - `getSession()` (for initial app-load session check)
   - `onAuthStateChange(callback)` (thin wrapper around Supabase's listener, for `AuthContext` to subscribe to)
4. Each function returns a typed result or throws a typed error — do not swallow errors here; `AuthContext` decides how to surface them to the UI.
5. This file, `services/studentService.ts`, and `services/supabaseClient.ts` are now the complete list of files permitted to reference the Supabase client, directly or indirectly.

---

## Task 7 — Compose providers and wire route protection

Steps:
1. Create `context/AppProviders.tsx` exporting a single component that nests `AuthContextProvider` around `StudentClassContextProvider` (order matters only if one depends on the other being mounted first — confirm neither does before assuming a specific order is safe).
2. In `app/_layout.tsx`, replace the current direct `<StudentClassContextProvider>` wrap with `<AppProviders>`.
3. Add a `hooks/facade/useAuth.ts` mirroring `useStudents.ts` — the single sanctioned entry point into `AuthContext`.
4. Add route-protection logic (in `app/_layout.tsx` or a small gate component it renders): read `useAuth()`'s session/status; redirect unauthenticated users into `(auth)`, and authenticated users out of it. Do not duplicate this check inside individual screens.
5. Wire `app/(auth)/signin.tsx` and `app/(auth)/index.tsx` (sign up) to call `useAuth().signIn` / `useAuth().signUp` instead of the current bare `router.replace(...)` calls.
6. Update `app/(auth)/completeProfile.tsx` so its submit handler calls a service function that creates the instructor's backend record, tied to the authenticated user's ID (full function/table design for this belongs to Phase 2 — for Phase 1, it's acceptable for this to call a stubbed function that will be filled in once the `instructors` table exists).

---

## Phase 1 Definition of Done (verification checklist)

- [ ] `types/student.ts` is the single source of truth for the `Student` shape.
- [ ] No file outside `hooks/facade/useStudents.ts` calls `useContext(studentClassContext)`.
- [ ] No file outside `hooks/facade/useAuth.ts` calls `useContext(AuthContext)`.
- [ ] `components/Schedule.tsx` and `components/StudentCard.tsx` import zero context modules — all data/callbacks arrive as props.
- [ ] No file outside `services/` imports `@supabase/supabase-js`.
- [ ] Exactly one call to `createClient(` in the entire repo.
- [ ] An instructor can sign up, land on `completeProfile`, submit it, and reach the tabs, with the session persisting across app restarts.
- [ ] `app/_layout.tsx` mounts one `<AppProviders>`, not multiple nested provider tags.
