# Al Saqar Driving School — Feature Roadmap

**Status:** Living document. Sequenced against `.agent/architecture-blueprint.md` — every phase below assumes the layer contracts and dependency rules defined there.
**Scope decisions locked in for this version:**
- **Backend platform: Supabase.** The Phase 0 decision is resolved — see §0.
- **Data model strategy: relational, by design.** Every phase below assumes separate Postgres tables for `instructors`, `students`, `scheduled_classes` (and, from Phase 4 onward, `enrollments`/`payments`), related by foreign keys and queried via joins — not nested documents. This is a direct consequence of the Supabase decision and is now a standing architectural assumption, not a per-phase choice to revisit.
- Multi-instructor from day one — the school manages many instructors, not just one.
- Payments/billing is in scope (own phase).

---

## 0. Pre-Phase Decision — ✅ RESOLVED: Supabase

**Decision locked in.** The backend platform is **Supabase**: Postgres for data, Supabase Auth (GoTrue) for authentication, `.channel()` subscriptions for realtime where needed. This section is kept (rather than deleted) as the recorded rationale, since the blueprint's service-layer contract (§4.5) exists precisely so a decision like this stays contained.

| | Firebase (not chosen) | Supabase (chosen) |
|---|---|---|
| Auth | Firebase Auth | Supabase Auth (GoTrue) |
| Data | Firestore (NoSQL, listener-based) | Postgres (SQL, RLS-based) |
| Realtime pattern | `onSnapshot` listeners | `.channel()` subscriptions |
| Fits current data shape (`Student[]` with nested `scheduledClasses: Date[]`) | Natural fit — nested arrays are idiomatic in Firestore | Requires a proper relational schema (separate `scheduled_classes` table) — this was the deciding factor, since Phase 4 payments needs relational joins (student ↔ enrollment ↔ payment) that a nested-document model would fight against |

**Consequence — this is now load-bearing, not optional:** because Supabase is Postgres, the relational data model (separate `instructors`, `students`, `scheduled_classes`, `enrollments`, `payments` tables, joined by foreign keys) is no longer "one option to consider per phase" — it is the assumed shape of the backend from Phase 1 onward. Every subsequent phase in this document has been written (or is being updated) to assume it explicitly, not to leave it implicit.

`services/authService.ts` and `services/studentService.ts` remain the *only* files in the codebase allowed to import the Supabase client SDK (`@supabase/supabase-js`), per the blueprint's service-layer contract (§4.5). No context, hook, component, or screen file imports it directly, regardless of how small the query.

---

## Phase 1 — Foundation Refactor + Auth & Context Wiring

This phase does two things at once deliberately: it's the first time a *second* Context enters the app (Auth, alongside the existing student/schedule state), which is exactly the moment the blueprint's Compound Provider pattern (§5) and facade-hook pattern (§4.3) either get adopted or get skipped and become debt. Do the foundation refactor *as part of* wiring auth, not before or after it as a separate detour.

### 1.1 Foundation refactor (blueprint §8 backlog, pulled forward)
- [ ] Extract `types/student.ts` (shared `Student` shape) — needed now because Phase 2's multi-instructor model adds an `instructorId` field to this type, and it's cheaper to move it into a shared file once than to update three duplicated declarations twice.
- [ ] Create `hooks/facade/useStudents.ts` wrapping the existing student/schedule context; centralize the repeated `if (!context) throw new Error(...)` guard.
- [ ] Stop `StudentCard.tsx` and `Schedule.tsx` from importing context directly — lift the calls up to the parent screen (blueprint §4.2, §8 item 2).
- [ ] Scaffold `services/` folder with `studentService.ts` (mock implementation, real signature — but the signature should already reflect Postgres-shaped queries, e.g. `getStudents(instructorId: string): Promise<Student[]>` backed by a `supabase.from('students').select().eq('instructor_id', instructorId)` call once wired) — no behavior change yet, just the seam.
- [ ] Add a single `services/supabaseClient.ts` exporting one initialized Supabase client instance (via `createClient`). This is the **only** file that constructs the client; every other service file imports the instance from here rather than initializing its own.

### 1.2 Auth
- [ ] `context/auth/AuthContext.tsx` + `use{Domain}` internal hook, following the same `createContext` + logic-hook + `Provider` shape already established for students.
- [ ] `hooks/facade/useAuth.ts` — sign up, sign in, sign out, current session, current instructor profile.
- [ ] `services/authService.ts` — wraps `supabase.auth` (sign up, sign in, sign out, `onAuthStateChange` for session persistence). This is the only file, alongside `services/studentService.ts` and future `services/*Service.ts` files, allowed to import the Supabase client.
- [ ] `context/AppProviders.tsx` — compose `AuthContextProvider` + `StudentContextProvider` (+ future contexts) into one exported component; mount once in `app/_layout.tsx` instead of nesting providers ad hoc.
- [ ] Route protection: unauthenticated users redirected to `(auth)` group; authenticated users redirected out of `(auth)` group. This logic lives in `app/_layout.tsx` (or a small `AuthGate` component it renders), reading from `useAuth()` — not duplicated per-screen.
- [ ] Wire `signin.tsx` / `index.tsx` (sign up) forms to `useAuth()` instead of the current no-op `router.replace` calls.
- [ ] `completeProfile.tsx` becomes the "first-login instructor record creation" step — on submit, it calls a service function that creates the instructor's backend record (name, license number, license type, vehicle number), tied to the authenticated user ID.

### 1.3 Definition of done for Phase 1
- An instructor can sign up, land on `completeProfile`, submit it, and reach the tabs — all backed by real auth state, not a hardcoded `router.replace`.
- Closing and reopening the app keeps the session (session persistence via `supabase.auth`, wrapped by `authService`).
- No component under `components/` imports `AuthContext` or `studentClassContext` directly (blueprint §4.2 rule, now enforced across two contexts instead of one).
- No file outside `services/` imports `@supabase/supabase-js` or `services/supabaseClient.ts` directly.

---

## Phase 2 — Multi-Instructor Data Model

Multi-instructor is the single biggest shape change to the app's data model. Everything currently assumes one instructor's roster; this phase makes "which instructor does this data belong to" an explicit, enforced dimension rather than an implicit one.

### 2.1 Data model (Postgres — relational by standing assumption, see §0)
- [ ] Three separate Postgres tables, related by foreign key, not a nested/embedded shape:
  - `instructors` (`id`, `full_name`, `license_number`, `license_type`, `vehicle_number`, linked 1:1 to a Supabase Auth user via `auth_user_id`)
  - `students` (`id`, `instructor_id` → FK to `instructors.id`, `student_name`, `total_classes`, `completed_classes`)
  - `scheduled_classes` (`id`, `student_id` → FK to `students.id`, `instructor_id` → FK to `instructors.id`, `scheduled_at`, `session_completion`)
- Each student belongs to exactly one instructor's roster (`instructor_id` is required, not nullable) — matches the current real-world model of a driving school. If the client's actual model is "students can be shared/reassigned across instructors," that's a schema decision to confirm before building — flag it, don't assume it (same spirit as the existing open TODO on `studentId` vs. enrollment number).
- [ ] `scheduledClasses` moves from a nested array on the student record to its own `scheduled_classes` table (per above), joined to `students` via `student_id`. This is required for Phase 5's double-booking checks to even be possible, and is a direct consequence of the relational model locked in at §0 — not a Phase 2-specific choice.
- [ ] Row-Level Security (RLS) policies on `students` and `scheduled_classes`: an authenticated instructor may only `select`/`insert`/`update` rows where `instructor_id` matches their own `instructors.id`. This makes the multi-instructor data isolation enforced by Postgres itself, not just by application-level query filters — belt and suspenders for the Phase 2.4 "no instructor can see another's data" requirement.

### 2.2 Context & service changes
- [ ] `services/studentService.ts` queries become instructor-scoped: `getStudents(instructorId)` runs `supabase.from('students').select('*, scheduled_classes(*)').eq('instructor_id', instructorId)` — a relational join, not a flat fetch. The instructor ID comes from `useAuth()`, read at the screen level, passed down — the student context/service layer never reaches into `AuthContext` itself (blueprint rule: one context never imports another; composition happens in `app/`).
- [ ] `InstructorContext` (or fold into `AuthContext` if the "current instructor profile" and "current session" are the same lifecycle — decide based on whether instructor profile data is ever needed *without* an active session, which it shouldn't be).
- [ ] `instructorProfile.tsx` wired to real data — replace the hardcoded "Bilal Khan / Light Vehicle Instructor" with the authenticated instructor's actual record.

### 2.3 Open question to resolve with client (carry forward)
- The existing flagged TODO — whether `studentId` is a real client-assigned enrollment number or just mirrors internal `id` — becomes more urgent here, because multi-instructor means student IDs likely need to be unique *school-wide*, not just within one instructor's mock array. Resolve before finalizing the backend schema in 2.1.
- New question this phase surfaces: is there ever an "admin/owner" role that sees across all instructors, or is every logged-in user strictly scoped to their own roster? This roadmap does **not** assume an admin dashboard exists — see Phase 6.

### 2.4 Definition of done for Phase 2
- Two instructor accounts, signed in separately, see completely disjoint student rosters.
- No student, schedule, or profile query anywhere in the app can accidentally return another instructor's data (this should be true by construction — every service call requires an `instructorId` argument, not by convention).

---

## Phase 3 — Core Feature Completion

This is "finish what the single-instructor version already started," now running on top of real auth and real multi-instructor data instead of mocks. Matches the priority already set: **Schedule tab before Settings tab**, per current project notes.

### 3.1 Schedule tab (priority — explicitly next per existing project notes)
- [ ] Sort students/classes by scheduled date (currently `index.tsx` filters pending classes but doesn't sort).
- [ ] Empty state: "No classes scheduled" when an instructor has zero pending classes — currently there's no explicit empty-state UI, just an empty scroll view.
- [ ] Fix the dead mutation in `Schedule.tsx`'s "Done" handler (`sessionCompletion = true` on a local variable) — completion state should be set through a context action, not a prop reassignment (blueprint §2.1 violation #2).

### 3.2 Student management completion
- [ ] Edit and delete student (currently only create exists).
- [ ] Input validation on the Add/Edit Student form (empty name, non-numeric `totalClasses`) via `utils/validators.ts`, called from the screen before invoking the context action — not inlined in JSX (blueprint §5).
- [ ] Resolve the `studentId` vs. enrollment-number question from Phase 2.3 in the actual form/UI, once the client decision lands.

### 3.3 Settings tab (deferred until auth existed — now unblocked)
- [ ] Edit Profile — wired to update the instructor record via `authService`/`instructorService`.
- [ ] Change Password — wired to the BaaS SDK's password-update call.
- [ ] Notifications toggle — UI can ship now; actual push wiring is Phase 5.
- [ ] Logout — wired to real `signOut()` instead of the current static button.

### 3.4 Definition of done for Phase 3
- Every screen currently showing static/mock UI (`instructorProfile.tsx`'s hardcoded name, the no-op Settings rows) is backed by real state.
- An instructor can fully manage their roster (create/edit/delete) and their own profile without a developer touching the database directly.

---

## Phase 4 — Payments & Billing

New domain, new context, following the exact same shape as everything else (`context/payments/PaymentsContext.tsx`, `hooks/facade/usePayments.ts`, `services/paymentService.ts`).

### 4.1 Data model (extends the relational schema from Phase 2 — same pattern, new tables)
- [ ] `enrollments` table: `id`, `student_id` → FK to `students.id`, `classes_purchased`, `purchased_at` (this likely absorbs/replaces what `totalClasses` currently represents — confirm whether `totalClasses` should become "classes in current paid package" rather than a lifetime total).
- [ ] `payments` table: `id`, `enrollment_id` → FK to `enrollments.id`, `amount`, `method`, `paid_at`. Reaching "amount paid vs. outstanding" for a student is a join across `students → enrollments → payments`, not a denormalized field — this is exactly the join pattern the Supabase decision in §0 was made to support.
- [ ] Decide (open question, don't assume): **manual ledger** (instructor taps "mark as paid," no money actually moves through the app) vs. **integrated payment gateway** (Stripe or similar, money actually processed). Recommendation: ship manual ledger first — it's a fraction of the engineering cost and tells you whether the client even wants in-app payment processing before committing to PCI-adjacent complexity.

### 4.2 Features
- [ ] Payment history view per student (list of past payments, outstanding balance).
- [ ] "Record payment" action from the student detail view.
- [ ] Basic reporting: total collected this month, per instructor (school-wide rollups depend on whether Phase 6's admin role exists — without it, this is "this instructor's own revenue" only).

### 4.3 Definition of done for Phase 4
- An instructor can see, for any student, how much has been paid and how much (if anything) is outstanding, without leaving the app.
- Payment data lives behind `services/paymentService.ts` exactly like every other domain — no payment-specific fetch calls leak into `context/` or `components/`.

---

## Phase 5 — Cross-Cutting Hardening & Edge Cases

Everything in this phase applies *across* the domains already built, rather than adding a new one.

- [ ] **Double-booking prevention** — now that `scheduledClasses` is its own entity (Phase 2), check for time-slot conflicts per instructor before confirming a new schedule.
- [ ] **Async status handling** — every context adopts the `{ status: 'idle'|'loading'|'error'|'success' }` shape flagged as "planned but not yet needed" in the blueprint (§4.4); this is where it actually gets needed, since every screen now depends on real network calls.
- [ ] **Offline/network-failure UI** — loading spinners, retry affordances, and graceful degradation when a request fails.
- [ ] **Empty states audit** — apply the same empty-state treatment planned for Schedule (3.1) to Student List and Payment History.
- [ ] **Push notifications** — class reminders for instructors (and possibly students, if student-facing accounts are ever in scope — currently out of scope, this app is instructor-facing only).
- [ ] **Timezone handling** — confirm whether the school operates across multiple timezones (UAE is single-timezone, so this may be a non-issue — verify rather than assume, since scheduling logic currently uses local device time).
- [ ] **Testing pass** — unit tests for `services/` (pure functions, easiest to test) and facade hooks; this is the payoff of the layered architecture from the blueprint — verify it actually delivers testability, not just claim it does.

---

## Phase 6 — Stretch / Post-MVP (not committed, listed for visibility)

- Admin/Owner dashboard — school-wide view across all instructors' rosters and revenue. Not assumed anywhere above; would require a role system (`instructor` vs `admin`) layered onto `AuthContext`.
- Payment gateway integration (Stripe or similar), if the manual ledger from Phase 4 proves insufficient.
- Multi-branch support, if the school expands beyond one location.
- Student-facing accounts (currently the app is 100% instructor-facing; students/parents have no login).

---

## Resolved Decisions Log

| Decision | Resolved in | Outcome |
|---|---|---|
| Firebase vs. Supabase | §0 | **Supabase.** Postgres + Supabase Auth. Relational data model (separate tables, FK joins) is now a standing assumption across Phases 1–6, not a per-phase choice. |
| Student identification strategy | Phase 2.3 | **Backend auto-generated.** No manual entry, no client-assigned enrollment number. Postgres generates `student_number` (identity column) on insert; UI displays it read-only post-enrollment. |

## Open Questions Log (carried and consolidated across phases)

| Question | Raised in | Blocks |
|---|---|---|
| Is `studentId` a real client enrollment number, distinct from internal `id`? | Phase 2.3 (pre-existing) | Backend schema finalization (`students` table columns), Phase 3.2 form work |
| Can a student be reassigned across instructors, or is the instructor-student link permanent? | Phase 2.1 | Whether `students.instructor_id` is mutable or fixed at insert, and whether that requires an audit/history table |
| Does an admin/owner role exist, or is every account strictly single-instructor-scoped? | Phase 2.3, Phase 4.3 | Whether Phase 6's admin dashboard is ever built; whether Phase 4 reporting needs a school-wide rollup; whether RLS policies need an `admin` bypass role |
| Manual payment ledger or real payment gateway? | Phase 4.1 | Phase 4 engineering scope/cost |

---

## Phase Summary Table

| Phase | Focus | New Context(s) | Depends on |
|---|---|---|---|
| 0 | ✅ **Resolved: Supabase** — relational Postgres model now assumed everywhere below | — | — |
| 1 | Foundation refactor + Auth | `AuthContext` | Phase 0 (resolved — unblocked) |
| 2 | Multi-instructor data model (relational: `instructors`/`students`/`scheduled_classes`, FK + RLS) | (extends existing student context) | Phase 1 |
| 3 | Core feature completion (Schedule, Students, Settings) | — | Phase 2 |
| 4 | Payments & billing (relational: `enrollments`/`payments`, joined to `students`) | `PaymentsContext` | Phase 3 (needs real students/instructors) |
| 5 | Hardening & edge cases | — | Applies to all of the above |
| 6 | Stretch (admin dashboard, gateway, multi-branch) | possibly `RoleContext` | Everything above |
