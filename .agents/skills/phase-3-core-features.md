---
name: phase-3-core-features
description: Execution guide for Phase 3 of the Al Saqar Driving School roadmap — finishing the Schedule tab (sorting, empty states), completing student management (edit/delete, pure-function input validation), and wiring the Settings/profile screens to real mutations. Use this skill when implementing Roadmap Phase 3.1, 3.2, or 3.3. Requires Phase 1 and Phase 2 (Auth + relational multi-instructor schema) to already be in place.
---

# Phase 3 — Core Feature Completion

## Objective

Finish the features the single-instructor prototype already started, now running on real auth and a real multi-instructor Postgres backend instead of mocks. Priority order within this phase matches the roadmap and the project's own prior notes: **Schedule tab work comes before Settings tab work.**

This skill assumes `.agent/skills/phase-1-foundation-auth.md` and `.agent/skills/phase-2-multi-instructor.md` have already been executed — specifically, that `studentService.ts` functions are already instructor-scoped and backed by real Postgres tables. Do not attempt UI polish against the old mock array; if `getStudents`/`addScheduledClass`/etc. aren't yet real, that's a Phase 1/2 gap to close first, not something to work around here.

---

## Task 1 — Schedule tab: sorting

**Current state:** `app/(tabs)/index.tsx` filters `pendingClasses` (students with at least one scheduled class and not yet completed) but never sorts them — they render in whatever order the underlying array returns them in.

Steps:
1. After filtering `pendingClasses`, sort the result by each entry's earliest/next `scheduledClasses` timestamp, ascending (soonest class first).
2. Because `scheduled_classes` is now its own table (Phase 2), confirm whether the service layer already returns classes pre-sorted (e.g. via `.order('scheduled_at')` in the Supabase query) versus needing a client-side sort. **Prefer sorting at the query level** (`services/studentService.ts` / whatever service now owns scheduled-class retrieval) over sorting in the screen — this keeps the screen a pure rendering/composition layer per the blueprint's `app/` contract, and avoids every consumer of the data needing to remember to re-sort it.
3. If multiple classes are scheduled for the same student, decide (and document in a comment, not just in behavior) whether the screen shows only the *next* class per student or a flattened list where a student can appear more than once. Match whatever the current UI copy/design implies — don't silently pick one.

**Done when:** rendering the Schedule tab with several out-of-order scheduled classes shows them soonest-first, and the sort is verifiably happening in the service query rather than being accidentally correct due to insertion order.

---

## Task 2 — Schedule tab: empty state

**Current state:** if `pendingClasses` is empty, `index.tsx`'s `ScrollView` renders with nothing inside it — no message, no illustration, just blank space below the instructor info card.

Steps:
1. Add an explicit empty-state branch: when the sorted/filtered list has zero entries, render a dedicated message (e.g. "No classes scheduled" plus a short supporting line) instead of an empty scroll container.
2. This is a presentational concern — the empty-state UI belongs in a small component (or inline in the screen if trivial) that receives `hasClasses: boolean` (or just checks `pendingClasses.length === 0`) as a prop/derived value. It does not need its own context or service call.
3. Note this pattern for reuse: Taskheading in the roadmap (Phase 5) calls for the same empty-state treatment on Student List and Payment History later — build this first empty state in a way that's easy to copy (consistent visual treatment, not a one-off), even though building a shared `<EmptyState />` component is optional for this phase and not required to call Task 2 done.

**Done when:** an instructor with zero scheduled classes sees an explicit, intentional empty state — not a blank screen that looks broken.

---

## Task 3 — Fix the dead mutation in `Schedule.tsx`

**Current state:** the "Done" button's `onPress` handler does:
```
sessionCompletion = true;
onDone(id, studentId);
```
`sessionCompletion` is a destructured prop — reassigning it has no effect on anything; the actual completion flag lives in state managed elsewhere. This line should be deleted, not "fixed" to work differently, because completion state must be set through a context/service action, never through a prop reassignment.

Steps:
1. Remove the `sessionCompletion = true;` line entirely from the `onPress` handler.
2. Confirm `onDone(id, studentId)` (already present) is sufficient on its own — i.e., that the actual completion-marking logic lives in the context action it calls into (`classCountIncrement` or its Phase 2 real-data successor), and that this context action is what should be updating `session_completion` in the `scheduled_classes` table.
3. If tracing this reveals the completion flag isn't actually being persisted correctly end-to-end (a real possibility, since this line was silently doing nothing before), that's now a bug to fix in the context/service layer — not by adding a new prop mutation.

**Done when:** the component contains no direct prop reassignment, and marking a class "Done" correctly updates `session_completion` in the backend, verified by re-fetching after the action.

---

## Task 4 — Student management: edit and delete

**Current state:** only create (`addNewStudent`) exists in the student list screen.

Steps:
1. Add `updateStudent` and `deleteStudent` calls (already stubbed as service functions in Phase 2, Task 3) wired into `app/(tabs)/studentList.tsx`.
2. UI pattern: reuse the existing bottom-sheet-style `Modal` already present for "New Student" — either extend it to handle an edit mode (pre-filled fields, different submit action) or add a second modal instance. Prefer extending the existing modal with a mode flag over duplicating the whole modal markup, to avoid the two forms drifting out of sync.
3. Delete should have a confirmation step (a simple "Are you sure?" `Alert` is sufficient — this doesn't need a custom modal) before calling `deleteStudent`, since it's a destructive, non-undoable action against real data now (unlike the mock-array era where nothing was actually persisted).
4. After a successful edit or delete, refresh the local student list state from the service response (or the source-of-truth re-fetch) rather than hand-patching local array state — keep the context's state genuinely in sync with the backend rather than assuming an optimistic local update is always correct.

**Done when:** an instructor can create, edit, and delete a student from the Student List screen, with changes persisting across app restarts.

---

## Task 5 — Input validation as a pure utility function

**Current state:** the Add Student form has no validation — an empty name or non-numeric `totalClasses` can currently be submitted.

Steps:
1. Create `utils/validators.ts`.
2. Write pure, side-effect-free validation functions — no React, no state, no imports from `context/` or `services/`. Each function takes raw input and returns a result shape, e.g.:
   ```
   validateStudentName(name: string): { valid: boolean; error?: string }
   validateTotalClasses(value: string): { valid: boolean; error?: string }
   ```
   (Exact return shape is a design choice for whoever implements this — the constraint that matters is purity and testability, not a specific interface.)
3. In `app/(tabs)/studentList.tsx`'s submit handler (both create and, from Task 4, edit), call these validators **before** invoking the corresponding context action. If validation fails, set local screen state to show the error message inline near the relevant field — do not let an invalid value reach `addNewStudent`/`updateStudent` at all.
4. Do **not** inline this logic as ad hoc conditionals inside the JSX or inside the context action itself — the blueprint's rule (§5) is explicit that validation is a separate, pure, testable layer, distinct from both the UI and the state-mutation layer.
5. Because these are pure functions with no framework dependency, this is also the first concrete opportunity in the roadmap to write real unit tests (a Roadmap Phase 5 goal, "Testing pass") — consider adding a `utils/validators.test.ts` alongside this work even though the formal testing phase is later; validators are the cheapest, highest-value place to start.

**Done when:** submitting an empty name or a non-numeric `totalClasses` value shows an inline error and does not create/update a student record; `utils/validators.ts` has zero imports from React or any app-specific state module.

---

## Task 6 — Settings tab: wire real mutations

**Current state:** `app/(tabs)/instructorProfile.tsx` (rendered as the "Settings" tab) has static rows for Edit Profile, Change Password, Notifications, and a Logout button with no `onPress` handler at all.

Steps:
1. **Edit Profile:** wire the "Edit Profile" row to a form (new screen or modal — match whatever navigation pattern the rest of the app uses for forms, e.g. the pattern in `completeProfile.tsx`) that calls `updateInstructorProfile` (from Phase 2, Task 4) on submit. Apply the same pure-validation pattern from Task 5 to this form's fields before submitting.
2. **Change Password:** wire to the auth service's password-update call (a new function to add to `services/authService.ts` if it doesn't already exist — e.g. `updatePassword(newPassword: string)` wrapping the Supabase SDK's equivalent call). This still respects the rule that only `services/` files touch the Supabase client directly.
3. **Notifications:** the toggle UI can ship now with local state only (per the roadmap, actual push-notification wiring is Phase 5) — but make sure the toggle's persisted value (if any) goes through a real service call rather than being purely cosmetic, if the intent is for the preference to survive app restarts. If it's meant to be a placeholder with no persistence yet, that should be an explicit, visible decision (e.g. a comment noting it's UI-only pending Phase 5), not something to leave ambiguous.
4. **Logout:** wire the button's `onPress` to `useAuth().signOut()`. Confirm this correctly triggers the route-protection logic from Phase 1 (Task 7) to redirect back into the `(auth)` group — don't add a manual `router.replace` here; let the existing session-state-driven redirect handle it.

**Done when:** every row under Settings performs a real action against real state — no static UI without a wired handler remains on this screen.

---

## Phase 3 Definition of Done (verification checklist)

- [ ] Schedule tab shows classes sorted soonest-first, and displays an explicit empty state when there are none.
- [ ] `Schedule.tsx` contains no prop-reassignment mutation; marking a class "Done" correctly persists to the backend.
- [ ] Student List supports create, edit, and delete, all persisting across app restarts.
- [ ] `utils/validators.ts` exists, is framework-free, and is called from the screen before every student-form submission (create and edit).
- [ ] Every row on the Settings/Instructor Profile screen — Edit Profile, Change Password, Notifications, Logout — performs a real, wired action; none remain static/no-op.
- [ ] No new validation or business logic was added directly inside JSX or inside a context action during this phase — it lives in `utils/` or the service/context layers per the blueprint's contracts.
