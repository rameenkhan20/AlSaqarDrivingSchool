# Al Saqar Driving School — Engineering Architecture Blueprint

**Status:** Living document. Any structural change to how layers talk to each other must be reflected here before it's merged.
**Stack:** React Native (Expo SDK 54) · Expo Router (file-based) · TypeScript (strict) · React Context API
**Scope of this document:** system boundaries and contracts only. No feature/business logic is written here.

---

## 1. Purpose

This app currently works because it's small. The moment it grows — auth against a real backend, instructor/settings screens, a second context, offline sync — the "put everything in one context and reach into it from anywhere" style will start producing bugs that are expensive to trace. This document freezes the rules **now**, while the codebase is still small enough to course-correct cheaply.

Every future PR should be checkable against this file. If a change doesn't fit any rule here, that's a signal to update the blueprint deliberately, not to improvise.

---

## 2. Current State — What's Already in the Repo

This section is a factual audit, not a criticism. It's the baseline the rest of the document reacts to.

| Layer | What exists today | Location |
|---|---|---|
| Routing | Expo Router, file-based, two route groups | `app/(auth)/*`, `app/(tabs)/*` |
| Global state | One Context + one "god hook" (`useClassCount`) holding students, scheduling, and class-count logic together | `context/studentClassesContext.tsx` |
| Reusable UI | `BrandName`, `PasswordField`, `InstructorInfo`, `Schedule`, `StudentCard`, `TabBar` | `components/` |
| Local-only hooks | `useDateTimePicker` — pure UI state (which picker step is open), no server/global concerns | `hooks/` |
| Design tokens | Flat color palette, no typography/spacing scale yet | `constants/colors.ts` |
| Data source | Hardcoded in-memory array (`students`) inside the context file itself | `context/studentClassesContext.tsx` |
| Services / API layer | **Does not exist yet.** There is no `services/` folder. | — |
| Shared domain types | **Does not exist.** `StudentList` interface is private to the context file; `StudentCard` and `Schedule` redeclare overlapping prop shapes independently | `context/studentClassesContext.tsx`, `components/StudentCard.tsx`, `components/Schedule.tsx` |
| Validation | None. Flagged as a deferred TODO on the Add Student form | `app/(tabs)/studentList.tsx` |

### 2.1 Violations already present (tracked so they get fixed, not repeated)

These aren't hypothetical — they're in the current tree. Flagging them here means new code shouldn't copy the pattern, and they become the first items on the refactor backlog (§8).

1. **Presentational components importing global context directly.** `components/Schedule.tsx` and `components/StudentCard.tsx` both call `useContext(studentClassContext)` internally. This means neither component can be rendered, reused, or unit-tested without the entire global provider tree present. This is the single biggest structural risk in the current codebase and is addressed in §4.1 / §5.
2. **Dead state mutation.** In `components/Schedule.tsx`, the "Done" button handler does `sessionCompletion = true;` on a destructured prop before calling `onDone(...)`. This mutates a local variable, not the source state — it has no effect and is a symptom of business logic living inside a component's `onPress` instead of in the state layer.
3. **One context, multiple responsibilities.** `studentClassContext` owns student roster CRUD, scheduling, and completion-tracking simultaneously. It works today because the domain is small; it will not survive the addition of Auth, Instructor Profile, or Settings without becoming a bottleneck every screen depends on.
4. **Duplicated shape definitions instead of shared types.** `studentCardProps` (`StudentCard.tsx`) and `scheduleCardProps` (`Schedule.tsx`) both re-declare fields that originate from the same `StudentList` interface. Any change to the student model requires hunting down every duplicate.
5. **No abstraction between "where data comes from" and "how components use it."** The mock array lives directly inside the state layer. When a real API arrives, someone will be tempted to `fetch()` inside the context or, worse, inside a component. §4.4 exists to prevent that.

---

## 3. Layered Architecture — The Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  app/  (Expo Router route files — SCREENS)                  │
│  Thin. Composition only. No business logic, no fetch calls. │
└───────────────────────────┬───────────────────────────────────┘
                             │ uses
┌───────────────────────────▼───────────────────────────────────┐
│  components/  (Presentational UI)                             │
│  Pure. Props in, callbacks out. NEVER imports Context directly│
└───────────────────────────┬───────────────────────────────────┘
                             │ receives data/callbacks from
┌───────────────────────────▼───────────────────────────────────┐
│  hooks/  (Facade hooks + local UI-state hooks)                │
│  Facade hooks are the ONLY sanctioned way to read Context.    │
└───────────────────────────┬───────────────────────────────────┘
                             │ wraps
┌───────────────────────────▼───────────────────────────────────┐
│  context/  (State containers — Provider + reducer/state hook) │
│  Owns state shape + mutation functions. Delegates I/O to      │
│  services. Never imports from components/ or app/.            │
└───────────────────────────┬───────────────────────────────────┘
                             │ calls
┌───────────────────────────▼───────────────────────────────────┐
│  services/  (API / data access — currently missing, see §4.4) │
│  Pure async functions. No React imports at all. No state.     │
└───────────────────────────┬───────────────────────────────────┘
                             │ talks to
                    [ Backend / AsyncStorage / SDK ]
```

**The one rule that matters more than any other:** dependencies point in one direction only, top to bottom. A lower layer must never import from a higher layer.

| From \ To | app/ | components/ | hooks/ | context/ | services/ | types/ |
|---|---|---|---|---|---|---|
| **app/** (screens) | — | ✅ | ✅ | ✅ (via hooks, see 4.1) | ❌ | ✅ |
| **components/** | ❌ | ✅ (composition) | ❌ (local UI hooks only, see 4.2) | ❌ | ❌ | ✅ |
| **hooks/** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **context/** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **services/** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **types/** | ❌ | ❌ | ❌ | ❌ | ❌ | — |

If a file needs to break one of these ❌ cells, that's a design smell to raise, not a quiet workaround.

---

## 4. Layer Contracts

### 4.1 `app/` — Route/Screen Layer

- A screen file's job is **composition and wiring**, nothing else.
- Screens are the only place allowed to call a **facade hook** (`useStudents()`, `useAuth()`, etc. — see 4.3) and pass the resulting data/handlers down as props to `components/`.
- Screens may hold **transient, screen-local UI state** (e.g. `studentList.tsx`'s modal `visible` boolean, form field values before submit). That is UI state, not domain state, and stays local with `useState`.
- Screens must never contain the actual business rule (e.g. "how do we generate a new student ID," "what counts as a valid class count"). That logic belongs in `context/` or `services/`, invoked through the facade hook.
- Navigation calls (`router.push`, `router.replace`) belong in event handlers, never inline in the render body (already an established rule from `signin.tsx` / `completeProfile.tsx` — keep it that way).

### 4.2 `components/` — Presentational Layer

- **Hard rule: no component under `components/` imports `useContext(...Context)` directly, ever.** Not even a "convenience" one-liner. This is the rule that closes violation #1 in §2.1.
- A component's public contract is its **props interface** — full stop. If a component needs data from global state, that data arrives as a prop from its parent screen or a parent component.
- A component's public contract for actions is a **callback prop** (`onDone`, `onSchedule`, `onSave`). The component calls the callback; it never knows *what* that callback does or *where* the result is stored.
- Local, non-shared UI state (e.g. "is this modal open," "which picker step is showing") may use `useState` or a small local hook (like `useDateTimePicker`) directly inside the component. This is *component* state, not *domain* state — it's fine here because nothing outside the component cares about it.
- Consequence for the current code: `Schedule.tsx` and `StudentCard.tsx` should receive `onModifySchedule` / `onSchedule` callbacks as props from their parent screen, instead of importing `studentClassContext` and calling `modifyScheduledClass` / `scheduledDateTime` themselves. (This is a refactor target — see §8 — not something to fix as a side effect of unrelated work.)

### 4.3 `hooks/` — Two Distinct Categories

This folder holds two genuinely different kinds of hooks. Keep them visually/naming distinguishable so nobody confuses one for the other.

**a) Facade hooks (one per domain context)**
A facade hook is the *only* sanctioned entry point into a Context from the rest of the app. It:
- calls `useContext(XContext)`,
- performs the null-check / "no provider" guard **in exactly one place** (currently this guard is copy-pasted into every consuming component — `if (!context) throw new Error('No context')` appears in `index.tsx`, `studentList.tsx`, `Schedule.tsx`, and `StudentCard.tsx`; it should exist once, inside the facade hook),
- returns a typed, narrow surface — not necessarily the entire context value.

```
hooks/useStudents.ts        → wraps studentClassContext, throws if used outside provider
hooks/useAuth.ts            → wraps future AuthContext
hooks/useInstructorProfile.ts → wraps future InstructorContext
```

Only screens (`app/`) call facade hooks. Components never do (see 4.2).

**b) Local UI-state hooks**
Hooks like `useDateTimePicker` that encapsulate *reusable interaction logic* with no ties to global state. These *may* be imported by `components/` directly, because they don't cross the Context boundary — they're just extracted `useState`/`useReducer` logic. Naming convention: keep these verb-free and state-shape-descriptive (`useDateTimePicker`, not `useSchedulingLogic`) so it's obvious at a glance that they're local, not domain, hooks.

### 4.4 `context/` — State Ownership Layer

- One Context = one bounded domain. See §6 for how to split the current single context.
- The pattern already established (`createContext` + a `use{Domain}` internal hook + a `{Domain}ContextProvider` wrapper) is correct and should be kept:
  ```
  const use{Domain} = () => { /* useState/useReducer + action functions */ }
  export const {Domain}Context = createContext<...>(undefined)
  export const {Domain}ContextProvider = ({children}) => { ... }
  ```
- **A context file must never contain hardcoded data or fetch/AsyncStorage calls.** Today, `studentClassesContext.tsx` hardcodes the `students` array in-file. When real data arrives, the context must call a function from `services/`, not embed the data or the I/O call itself:
  ```
  // context owns *when* to fetch and *where the result lives*
  // services/ owns *how* to fetch
  useEffect(() => { studentService.getStudents().then(setStudentList) }, [])
  ```
- Every domain context should eventually track a status alongside its data once real I/O is involved: `{ status: 'idle' | 'loading' | 'error' | 'success', error?: string }`. Not needed while data is synchronous/mocked, but the shape should be planned for now so adding it later isn't a breaking change to every consumer.
- Context action functions (`addNewStudent`, `modifyScheduledClass`, etc.) are the **only** functions allowed to call `setStudentList`/`setState`. No screen or component should ever receive the raw setter.
- ID/key generation (`Math.max(...existingIds) + 1`) is a legitimate client-side stub today, but it is explicitly **temporary**. The moment a real backend exists, ID assignment moves server-side and this logic is deleted, not extended.

### 4.5 `services/` — Data Access Layer (to be created)

This folder doesn't exist yet and needs to before the first network call is written. Rules for when it does:

- **Pure functions only. No React. No hooks. No `useState`.** A service function's signature is `(input) => Promise<output>`. It could be tested with plain Jest and zero React Testing Library.
- One file per domain, mirroring the context split: `services/studentService.ts`, `services/authService.ts`, `services/scheduleService.ts`.
- Services are the **only** layer allowed to know about `fetch`, Axios, Supabase/Firebase SDK calls, or `AsyncStorage`. If a `fetch(` ever shows up inside `context/`, `hooks/`, `components/`, or `app/`, that's an architecture violation regardless of how small or "temporary" it seems.
- Services throw or return typed error shapes; they do not swallow errors silently. The context layer decides how to present an error to the UI.
- Mock implementations (what today's hardcoded array effectively is) should live behind the same function signature the real implementation will use, so swapping mock → real is a one-file change:
  ```
  // services/studentService.ts
  export async function getStudents(): Promise<Student[]> { /* mock today, fetch later */ }
  ```

### 4.6 `types/` — Shared Domain Model (to be created)

- One `types/` folder (or `types/{domain}.ts` files) holding the canonical shape of each domain entity: `Student`, `ScheduledClass`, `Instructor`.
- `components/`, `context/`, and `services/` all import from here — none of them re-declare their own version of "what a student looks like."
- Closes violation #4 in §2.1: `StudentCard`'s and `Schedule`'s prop types should be built from (or reference) the same `Student` type the context uses, not redefine overlapping fields independently.
- Component prop types are still defined locally in the component file (that's correct — a prop type is a component's own contract), but the *domain fields* inside that prop type should reference the shared type rather than re-typing `studentName: string` etc. from scratch in three places.

---

## 5. Design Patterns to Enforce

| Pattern | Where | Why |
|---|---|---|
| **Container/Presentational split** | `app/` (container) vs `components/` (presentational) | Lets `components/` be reused, storybook'd, and unit-tested without a Provider tree. Directly resolves violation #1. |
| **Custom Hook Facade** | One `hooks/use{Domain}.ts` per Context | Centralizes the null-check/guard, gives every consumer a single, typed, narrow entry point instead of raw `useContext` scattered everywhere. |
| **Repository/Service abstraction** | `services/` | Decouples "how components get data" from "where data physically comes from." Swapping mock data for a real API later touches one file, not every screen. |
| **State-Actions-Consumers (Redux-shaped Context)** | `context/` | Already the mental model in use (per prior sessions) — state lives in one place, actions are the only mutation path, consumers read via the facade hook. Keep this shape even before Redux is ever needed. |
| **Compound Provider** | `app/_layout.tsx` | When a second Context is added (Auth), do not nest providers ad hoc in JSX. Introduce a single `<AppProviders>` component in `context/` that composes all providers, and mount *that* once in `_layout.tsx`. |
| **Pure-function validation** | `utils/validators.ts` (to be created) | Form validation (e.g. the deferred Add Student TODO: empty name, non-numeric `totalClasses`) should be pure functions called from the screen before invoking a context action — not embedded in JSX conditionals or inside the context action itself. |

---

## 6. State Management: Splitting the Context

`studentClassContext` currently does three jobs. As Auth, Settings, and richer scheduling land, split along these lines **before** the file becomes unmanageable:

```
context/
  auth/
    AuthContext.tsx        → session, sign-in/out, current instructor identity
  students/
    StudentContext.tsx     → roster CRUD, completedClasses tracking
  schedule/
    ScheduleContext.tsx    → scheduledClasses, date/time assignment, modification
  AppProviders.tsx          → composes the above into one exported provider
```

Rule of thumb for "does this need its own context": *would a screen unrelated to this domain ever need this state?* Instructor Profile doesn't need scheduling internals — that's a signal `ScheduleContext` shouldn't live inside whatever context also serves the profile screen.

Cross-domain reads (e.g. a schedule action needing to know the current instructor) happen by composing facade hooks in the screen (`app/`), not by having one context import another.

---

## 7. Target Folder Structure

```
app/                        # Expo Router screens — thin, composition only
  (auth)/
  (tabs)/
components/                 # Presentational only — props/callbacks in, nothing else
hooks/
  facade/                   # useStudents, useAuth, useSchedule — the only Context entry points
  ui/                       # useDateTimePicker and similar local-state hooks
context/
  students/
  schedule/
  auth/
  AppProviders.tsx
services/                   # Pure async data-access functions, no React
  studentService.ts
  scheduleService.ts
  authService.ts
types/                      # Shared domain models
  student.ts
  schedule.ts
  instructor.ts
utils/                      # Pure helper/validation functions
  validators.ts
constants/
  colors.ts
```

---

## 8. Refactor Backlog (ordered, tied to §2.1)

This is the concrete to-do list this blueprint implies. Not urgent to do in one pass — but any new feature work touching these files should move them toward this state rather than deepen the current shape.

1. Introduce `hooks/useStudents.ts` as the single facade over `studentClassContext`; move the repeated `if (!context) throw new Error(...)` guard into it. Update `index.tsx`, `studentList.tsx` to use the facade.
2. Refactor `StudentCard.tsx` and `Schedule.tsx` to stop importing `studentClassContext` directly — lift `scheduledDateTime` / `modifyScheduledClass` calls up to the parent screen and pass them down as props.
3. Extract `types/student.ts` with the canonical `Student` shape; have `StudentCard`, `Schedule`, and the context all reference it instead of redeclaring fields.
4. Create `services/studentService.ts` with a `getStudents()` mock function; move the hardcoded `students` array out of `context/studentClassesContext.tsx` and have the context call the service.
5. Remove the dead `sessionCompletion = true;` line in `Schedule.tsx`'s "Done" handler (it mutates nothing) once completion logic is properly owned by the context action.
6. Add `utils/validators.ts` and wire it into the Add Student form before removing the "input validation" TODO.

---

## 9. Naming & File Conventions

- Context files: `{Domain}Context.tsx`, exporting `{Domain}Context`, `use{Domain}` (internal), `{Domain}ContextProvider`.
- Facade hooks: `use{Domain}.ts` (singular concern, e.g. `useStudents`, `useSchedule`), always the one importing `useContext`.
- Service files: `{domain}Service.ts`, exporting plain async functions, no default export, named exports only (`getStudents`, `addStudent`, `updateSchedule`).
- Types: singular noun per file matching the domain entity (`student.ts` exports `Student`, not `Students` or `StudentType`).
- Components never suffix `Screen` or `Container` themselves — that distinction is structural (folder = `app/` vs `components/`), not naming.

---

## 10. Definition of Done for New Features (checklist)

Before a PR touching state or data is considered complete:

- [ ] No `components/` file imports `useContext` directly.
- [ ] No `fetch`/AsyncStorage/SDK call exists outside `services/`.
- [ ] New domain state lives in its own Context, not bolted onto an existing unrelated one.
- [ ] A single facade hook exists for any new Context and is the only import path into it.
- [ ] Any new/changed entity shape is reflected in `types/`, not re-declared per-component.
- [ ] Form input validation is a pure function in `utils/`, called from the screen, not inlined in JSX or buried in a context action.
- [ ] No direct state mutation (`array.push`, prop reassignment) — every state change goes through a setter/action function.
