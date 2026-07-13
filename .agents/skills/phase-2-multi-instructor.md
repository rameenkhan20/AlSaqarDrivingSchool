---
name: phase-2-multi-instructor
description: Execution guide for Phase 2 of the Al Saqar Driving School roadmap — the multi-instructor relational data model (instructors, students, scheduled_classes tables with foreign keys and RLS) and scoping every student/schedule query by instructorId. Use this skill when implementing Roadmap Phase 2.1 or 2.2. Requires Phase 1 (AuthContext, useAuth, services/supabaseClient.ts) to already exist.
---

# Phase 2 — Multi-Instructor Data Model

## Objective

Make "which instructor does this data belong to" an explicit, database-enforced dimension. Everything up to this point in the roadmap assumed a single instructor's mock roster; this phase replaces that assumption with a real relational schema and instructor-scoped queries.

This skill assumes `.agent/skills/phase-1-foundation-auth.md` has already been executed — specifically, that `AuthContext`, `useAuth`, and `services/supabaseClient.ts` already exist. Do not attempt schema or query work in this skill without those in place; `instructorId` scoping depends on a working session.

## Precondition checklist

- [ ] `services/supabaseClient.ts` exists and exports one Supabase client instance.
- [ ] `useAuth()` returns a usable session/user identity that can be joined to an `instructors` row.
- [ ] Roadmap §0 / Resolved Decisions Log confirms Supabase + relational Postgres model — this skill will not make sense against any other backend choice.

---

## Task 1 — Design and create the Postgres schema

This is a database-design task, executed via Supabase's SQL editor or migration tooling — not application code. Three tables, related by foreign key, matching the shape locked into the roadmap's §2.1.

### `instructors`

```sql
create table instructors (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  license_number text,
  license_type text,
  vehicle_number text,
  created_at timestamptz not null default now()
);
```

- `auth_user_id` is the 1:1 link to the Supabase Auth user created during sign-up. `unique` enforces one instructor row per auth user.
- This row is created during the `completeProfile` submit flow stubbed out in Phase 1, Task 7.

### `students`

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references instructors(id) on delete cascade,
  student_name text not null,
  total_classes int not null default 0,
  completed_classes int not null default 0,
  created_at timestamptz not null default now()
);
```

- `instructor_id` is **not nullable** — every student belongs to exactly one instructor's roster. This is a deliberate schema decision per the roadmap's open question (§2.3): if the client's real-world model turns out to allow reassignment/sharing across instructors, that requires a migration, not a workaround — flag it rather than working around a `not null` constraint with nulls.
- **Resolved 2026-07-13:** `studentId` is not client-assigned. Add `student_number` as a database-generated identity column:
```sql
  student_number int generated always as identity
```
  Read-only in the UI — never accept it as form input. `id` (uuid) remains the internal PK/FK target; `student_number` is purely the human-facing display number.

### `scheduled_classes`

```sql
create table scheduled_classes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  instructor_id uuid not null references instructors(id) on delete cascade,
  scheduled_at timestamptz not null,
  session_completion boolean not null default false,
  created_at timestamptz not null default now()
);
```

- Carries both `student_id` and `instructor_id` (rather than relying on a join through `students` alone) so RLS policies (Task 2) and double-booking queries (Roadmap Phase 5) can filter directly on `instructor_id` without an extra join on every query.
- Replaces the current in-memory `scheduledClasses: Date[]` array nested on the student record. This table is the single source of truth for scheduling going forward.

**Done when:** all three tables exist in the Supabase project, with foreign keys verified (attempt an insert with a bogus `instructor_id` and confirm it's rejected).

---

## Task 2 — Row-Level Security (RLS) policies

**Why this matters:** application-level filtering (`WHERE instructor_id = ?`) is necessary but not sufficient — a bug in a service function shouldn't be the only thing standing between one instructor and another instructor's roster. RLS makes the database itself refuse the wrong query.

Steps:
1. Enable RLS on `students` and `scheduled_classes`:
   ```sql
   alter table students enable row level security;
   alter table scheduled_classes enable row level security;
   ```
2. Add a policy so an authenticated instructor can only read/write rows where `instructor_id` matches their own `instructors.id` (resolved via `auth_user_id = auth.uid()`):
   ```sql
   create policy "Instructors manage their own students"
     on students
     for all
     using (
       instructor_id in (
         select id from instructors where auth_user_id = auth.uid()
       )
     )
     with check (
       instructor_id in (
         select id from instructors where auth_user_id = auth.uid()
       )
     );
   ```
3. Add the equivalent policy on `scheduled_classes`.
4. Add a policy on `instructors` itself so an instructor can only read/update their own row:
   ```sql
   create policy "Instructors manage their own profile"
     on instructors
     for all
     using (auth_user_id = auth.uid())
     with check (auth_user_id = auth.uid());
   ```
5. **Do not** design an `admin`-bypass policy in this phase. The roadmap explicitly does not assume an admin role exists yet (Phase 6, stretch) — adding a bypass policy now would be building ahead of a confirmed requirement. If/when an admin role is confirmed, that's a new policy added deliberately, not a default left open "just in case."

**Done when:** signed in as Instructor A, a query against `students` returns zero rows belonging to Instructor B, even with a hand-crafted query that omits the `instructor_id` filter — RLS should refuse it regardless of what the application code does.

---

## Task 3 — Scope `services/studentService.ts` queries by `instructorId`

Steps:
1. Update the `getStudents` signature from Phase 1 (which accepted but ignored `instructorId`) to actually filter:
   ```
   getStudents(instructorId: string): Promise<Student[]>
   // executes: supabase.from('students').select('*, scheduled_classes(*)').eq('instructor_id', instructorId)
   ```
   The nested `scheduled_classes(*)` is a relational join — Supabase's query builder resolves the foreign key automatically once the tables are related as in Task 1.
2. Add `addStudent(instructorId: string, data: Pick<Student, 'studentName' | 'totalClasses'>): Promise<Student>` — an `insert` scoped to the given `instructorId`, matching the roadmap's Phase 3.2 "create student" requirement.
3. Add stubs (bodies can come in Phase 3) for `updateStudent` and `deleteStudent`, both scoped by student `id` *and* re-validated against `instructor_id` in the query itself — never trust that a student ID passed in from the UI actually belongs to the calling instructor; let the RLS policy from Task 2 be the enforcement backstop, but don't rely on it as the *only* check if it's cheap to filter explicitly too.
4. Add `addScheduledClass(instructorId: string, studentId: string, scheduledAt: Date): Promise<ScheduledClass>` and `updateScheduledClass(...)`, replacing the current context functions (`scheduledDateTime`, `modifyScheduledClass`) that mutate a nested array in local state — these become real Postgres writes.
5. Update `context/studentClassesContext.tsx`'s action functions (`addNewStudent`, `scheduledDateTime`, `modifyScheduledClass`, `classCountIncrement`) to call these service functions and refresh/merge local state from the result, instead of computing everything client-side against the old mock array. The `instructorId` value passed into every service call comes from `useAuth()`, read at the point the context provider is composed in `app/` — the student context itself must not import `AuthContext` (blueprint rule: contexts don't import other contexts; composition happens in `app/` or `AppProviders`).

**Done when:** every exported function in `studentService.ts` requires an `instructorId` parameter, and none of them can be called (by type signature) without one.

---

## Task 4 — Wire the instructor profile to real data

Steps:
1. Create `services/instructorService.ts` (or extend `authService.ts` if the instructor profile is considered part of the auth/session lifecycle — decide based on whether instructor profile data is ever needed without an active session, which it shouldn't be, per the roadmap's Phase 2.2 note).
2. Expose `getInstructorProfile(authUserId: string): Promise<Instructor>` and `updateInstructorProfile(instructorId: string, data: Partial<Instructor>): Promise<Instructor>`.
3. Update `app/(tabs)/instructorProfile.tsx` to source its displayed name/license/vehicle fields from this service (via whatever facade hook exposes it — `useAuth()` if folded in, or a new `useInstructor()` facade if kept separate) instead of the current hardcoded "Bilal Khan / Light Vehicle Instructor" JSX.

---

## Phase 2 Definition of Done (verification checklist)

- [ ] `instructors`, `students`, `scheduled_classes` exist as separate Postgres tables with foreign keys, not nested/embedded structures.
- [ ] RLS is enabled and enforced on all three tables — verified by attempting cross-instructor access and confirming it's refused at the database level, not just filtered out by application code.
- [ ] Every function in `studentService.ts` takes `instructorId` as a required parameter.
- [ ] Two instructor accounts, signed in separately, see completely disjoint student rosters and schedules.
- [ ] `instructorProfile.tsx` displays real, per-instructor data — no hardcoded name/license strings remain.
- [ ] The open question about `studentId` vs. an internal `id` is either resolved (and reflected as a real `enrollment_number` column) or explicitly still logged as open in the roadmap — not silently decided one way in the schema without updating the roadmap's Open Questions Log.
