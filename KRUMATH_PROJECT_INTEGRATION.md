# KruMath Independent Project Integration Specification

## Purpose

This document is the shared integration contract for any independent project that will become part of `krumath.com`.

It applies to any project type, including:

- Games
- Simulations
- Learning tools
- Practice applications
- Editors
- Utilities
- Interactive experiences
- Experiments
- Other standalone web applications

Both sides should read this document:

1. The AI/developer working on the **independent project repository**
2. The AI/developer working on the **KruMath main repository**

The goal is that both sides understand the complete end-to-end architecture, responsibilities, authentication flow, navigation, deployment, security, and verification without requiring a separate handoff document.

---

# 1. Target Architecture

Every independent project should follow this general architecture:

```text
Independent GitHub Repository
        │
        ▼
Independent Cloudflare Worker
        │
        ▼
https://krumath.com/<project-slug>
        │
        ├── Shared KruMath Supabase
        │       ├── Authentication
        │       └── Approved project data
        │
        └── KruMath Main Application
                ├── /home
                ├── /sign-in
                ├── /pricing
                └── shared account/session
```

The important principle is:

**Independent project code and deployment, shared KruMath domain and shared KruMath Supabase/authentication.**

Do not create a separate Supabase project or authentication system for each project unless explicitly required.

---

# 2. Responsibilities

## A. Independent Project Repository

The independent project AI/developer is responsible for:

- Project source code
- Project-specific UI
- Project functionality
- Project routing/base path
- KruMath authentication integration
- Shared Supabase client integration
- Project-level database access, if required
- Home button
- Account/profile button
- Sign-in/sign-out behavior inside the project
- Project-specific environment variables
- Cloudflare Worker configuration
- Production build
- Deployment documentation
- Project-side testing

The independent project must remain in its own GitHub repository.

Do not edit the KruMath monorepo unless explicitly requested.

---

## B. KruMath Main Repository

The KruMath AI/developer is responsible for:

- Existing KruMath authentication infrastructure
- `/sign-in`
- `returnUrl` handling
- Shared authentication cookies/session
- Global logout behavior
- Existing Supabase configuration
- KruMath `/home`
- Optional project entry/link on `/home`
- Any required global middleware/auth changes
- Platform-level security and session behavior

The KruMath main repository should not absorb the independent project's source code.

---

# 3. Production URL

Each project receives a unique path:

```text
https://krumath.com/<project-slug>
```

Examples:

```text
https://krumath.com/face-match-memorization
https://krumath.com/mean-share-and-balance
https://krumath.com/example-tool
```

The slug must be:

- Unique
- Lowercase
- Kebab-case
- Stable after production release

If the project has internal routes, they remain under the project path:

```text
/<project-slug>
/<project-slug>/about
/<project-slug>/settings
/<project-slug>/practice
```

The project must work correctly when mounted under this path rather than assuming it owns `/`.

---

# 4. Cloudflare Architecture

Each independent project may have its own Cloudflare Worker.

Example:

```text
KruMath Main Worker
├── /
├── /home
├── /sign-in
├── /auth/*
└── other main-site routes

Project Worker A
└── /project-a/*

Project Worker B
└── /project-b/*

Project Worker C
└── /project-c/*
```

Cloudflare routes each project path to its corresponding Worker:

```text
krumath.com/<project-slug>* → <project-worker>
```

The project Worker must not replace the main KruMath Worker.

The route must be specific enough that the correct Worker receives the project request.

After deployment, verify that the rest of `krumath.com` continues to work normally.

---

# 5. Shared Supabase

All projects should use the existing KruMath Supabase project.

The architecture is:

```text
KruMath Main App ─────┐
Project A ────────────┤
Project B ────────────┼──→ Same KruMath Supabase
Project C ────────────┘
```

This means:

- Same Supabase project
- Same Supabase Auth
- Same KruMath user accounts
- Same authenticated session
- Same platform identity

Use the environment variables appropriate for the project's framework.

Examples:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

or:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Use the actual naming convention required by the project.

Never commit secrets.

Never expose the Supabase `service_role` key in browser/client code.

---

# 6. Authentication Contract

The independent project must reuse KruMath's existing Supabase Auth.

Do not create:

- A separate login page
- Separate user accounts
- Separate authentication providers
- Separate Supabase Auth
- Separate session storage

The project should recognize the same KruMath account that the user uses on `krumath.com`.

---

# 7. Who Is Considered Authenticated

For a project requiring authentication, the user is authenticated only when:

```text
Valid Supabase user/session
AND
user.is_anonymous !== true
```

Treat these as unauthenticated:

```text
No session
Anonymous session
Expired session
Invalid session
```

Anonymous Supabase sessions must not pass a protected-project gate.

---

# 8. Authentication Gate

The project must explicitly choose one of these models.

## Hard Gate

The whole project requires authentication.

```text
User opens project
        │
        ├── Valid non-anonymous session
        │       ↓
        │    Project
        │
        └── No/anonymous/invalid session
                ↓
        /sign-in?returnUrl=/<project-slug>
```

Use this for projects that should not be usable by public users.

## Soft Gate

The project can load publicly, but protected functionality requires authentication.

Example:

```text
Public user
    ↓
Project loads
    ↓
Protected action
    ↓
Sign-in
```

The chosen model must be documented for each project.

---

# 9. Sign-In and Return URL

When authentication is required, redirect to:

```text
/sign-in?returnUrl=/<project-slug>
```

For internal project routes:

```text
/sign-in?returnUrl=/project-slug/some-route
```

The parameter name must be exactly:

```text
returnUrl
```

Do not use different names such as:

```text
returnTo
redirect
redirectUrl
next
```

unless the KruMath sign-in implementation is explicitly changed to support them.

## KruMath main app requirement

The KruMath `/sign-in` page must:

1. Read `returnUrl`.
2. Validate it before redirecting.
3. Accept only safe same-origin paths.
4. Reject external URLs.
5. Reject protocol-relative URLs such as `//example.com`.
6. Reject malformed/unsafe paths.
7. After successful login, return the user to the requested project route.
8. Fall back to the normal KruMath destination when no valid `returnUrl` exists.

The goal is to prevent open redirects.

Example:

```text
Valid:
/face-match-memorization
/face-match-memorization/people

Invalid:
https://example.com
//example.com
/\example.com
javascript:...
```

---

# 10. Shared Session Cookies

The independent project may need to read the existing KruMath session server-side.

Production authentication cookies must be available to the project path.

The session cookie should use the platform's existing KruMath settings, including a root path:

```text
path=/
```

Where cross-subdomain sharing is required, the existing KruMath strategy may use:

```text
domain=.krumath.com
path=/
sameSite=lax
secure=true
```

Do not blindly replace existing KruMath cookie behavior. Inspect the current implementation and preserve compatible settings.

If the cookie is restricted to another path, the independent project may not be able to read the session server-side.

---

# 11. Logout Synchronization

Authentication must work in both directions.

## Logout from KruMath

When the user signs out from the main KruMath application:

```text
KruMath logout
      ↓
Shared Supabase session invalidated
      ↓
Project session no longer valid
      ↓
Protected project requires sign-in
```

The project must not continue treating the user as authenticated using a stale session.

## Logout from the Project

When the user chooses Logout from the project's account menu:

```text
Project logout
      ↓
Shared Supabase signOut()
      ↓
KruMath session also becomes signed out
```

The project must use the shared Supabase session rather than creating a project-only logout system.

---

# 12. Project Header / Navigation

Every integrated project should provide a suitable project-level navigation area.

The exact visual design can adapt to the project, but it should normally contain:

## Home

A Home icon/button should be placed in a suitable, visible location.

Clicking it must navigate to:

```text
https://krumath.com/home
```

On the same production origin, a relative `/home` link is also acceptable.

The Home control must not interfere with the project's core functionality.

## Account / Profile

A profile/account button should appear at the top-right or another clearly appropriate location.

### When signed in

Show an account/profile control that allows the user to:

- View basic account information where appropriate
- Log out

### When signed out

Show:

```text
Sign In
```

or an equivalent account control.

Clicking it should use the KruMath sign-in flow.

Do not build a separate login form inside the project.

---

# 13. Optional Project Navigation

Where appropriate, projects may also include:

```text
GitHub
Donate or បរិច្ចាគ
Settings
About
```

Common KruMath destinations:

```text
Home:
https://krumath.com/home

បរិច្ចាគ or Donate:
https://krumath.com/pricing
```

The GitHub button should point to the actual project's GitHub repository.

Only add controls that make sense for the project.

Do not overcrowd the interface.

---

# 14. Project UI Independence

The project may have its own visual design.

KruMath integration should be:

- Minimal
- Responsive
- Clear
- Consistent
- Non-blocking
- Accessible

Do not unnecessarily redesign the independent project just to integrate it with KruMath.

The project should remain recognizable as its original application while clearly functioning as part of KruMath.

---

# 15. Database and RLS

If the project needs database functionality, use the existing KruMath Supabase database.

Prefer project-specific tables where appropriate.

All user-specific data must be protected by Row Level Security.

Typical ownership logic should follow the authenticated user:

```text
auth.uid()
```

Do not allow one user to read or modify another user's private data.

Do not give the project broad access to unrelated KruMath tables.

If the project does not need database functionality, do not add unnecessary database tables or APIs.

---

# 16. Security Requirements

Both sides must preserve these rules:

- Never expose `service_role`.
- Never commit secrets.
- Never trust a client-only authentication check for sensitive server/data operations.
- Protect database access with RLS.
- Validate `returnUrl`.
- Reject anonymous users when authentication is required.
- Do not create duplicate authentication systems.
- Do not trust user-provided IDs without authorization checks.
- Do not expose private data from other KruMath projects.
- Do not create open redirects.
- Do not weaken the existing KruMath authentication system for one project.

---

# 17. Project-Specific Routing

The independent project must correctly handle its base path.

For example:

```text
/project-slug/
```

Assets should resolve under the correct project path.

Avoid:

```text
/assets/app.js
```

when the actual deployment requires:

```text
/project-slug/assets/app.js
```

The correct implementation depends on the framework.

Examples may include:

```text
Vite → base: "/project-slug/"
Next.js → basePath where appropriate
Nitro → baseURL where appropriate
React Router → correct basename
Other frameworks → equivalent base-path configuration
```

Do not apply a framework-specific solution without first inspecting the project.

---

# 18. Local Development

Production authentication and localhost development are different environments.

Do not weaken production authentication merely to make local development convenient.

If shared production cookies cannot be used locally, use an appropriate development strategy.

Document:

```text
npm install
npm run dev
```

or the project's actual commands.

Document required environment variables in:

```text
.env.example
```

Never put real secrets in `.env.example`.

---

# 19. End-to-End Implementation Process

## Phase A — Independent Project

The project AI/developer should:

1. Inspect the entire repository.
2. Understand its framework and architecture.
3. Choose a unique project slug.
4. Configure the project to work under `/<project-slug>`.
5. Integrate the existing KruMath Supabase project.
6. Implement the required authentication gate.
7. Implement `returnUrl` behavior.
8. Implement session handling.
9. Implement logout.
10. Add the Home button.
11. Add the account/profile button.
12. Add optional GitHub/Pricing links where appropriate.
13. Configure Cloudflare deployment.
14. Test the project.
15. Document the exact Cloudflare route and required environment variables.

Do not modify the KruMath main repository during this phase unless explicitly requested.

---

## Phase B — Cloudflare

Deploy the independent Worker.

Configure:

```text
krumath.com/<project-slug>* → <project-worker>
```

Verify:

- Project URL works.
- Main KruMath routes still work.
- Project assets load.
- Direct project routes work.
- Refresh works.
- Authentication works.
- Logout works.

---

## Phase C — KruMath Main Repository

The KruMath AI/developer should:

1. Verify the existing `/sign-in` implementation.
2. Add/confirm safe `returnUrl` handling.
3. Confirm authentication cookies use the correct root path.
4. Confirm shared Supabase session behavior.
5. Confirm global logout invalidates the shared session.
6. Verify anonymous sessions are not treated as full authentication.
7. Optionally add the project to `/home`.
8. Do not modify the independent project source code.

The project should already be deployed before adding its permanent home-page entry.

---

# 20. Handoff Contract

The independent project AI must provide the KruMath AI with:

```text
Project name:
Project slug:
GitHub repository:
Cloudflare Worker name:
Production URL:
Authentication model: Hard / Soft
Supabase project: Existing KruMath Supabase
Required environment variables:
Required database tables/policies:
Any required KruMath main-app changes:
Cloudflare route:
Verification status:
Known limitations:
```

Example:

```text
Project name: Face Match Memorization
Project slug: face-match-memorization
GitHub: <repository>
Worker: <worker-name>
URL: https://krumath.com/face-match-memorization
Auth: Hard gate
Supabase: Existing KruMath project
Route: krumath.com/face-match-memorization*
```

This information is the handoff between the two repositories.

---

# 21. What the Independent Project AI Must NOT Change

Unless explicitly requested:

```text
[ ] KruMath monorepo
[ ] KruMath global middleware
[ ] KruMath sign-in UI
[ ] KruMath global authentication provider
[ ] Firebase phone authentication
[ ] Unrelated Supabase RLS policies
[ ] Unrelated KruMath routes
[ ] learn.krumath.com
[ ] Other independent projects
```

---

# 22. What the KruMath AI Must NOT Change

Unless explicitly requested:

```text
[ ] Independent project source code
[ ] Independent project's internal architecture
[ ] Independent project's design
[ ] Independent project's calculations/content
[ ] Independent project's Git history
[ ] Independent project's Cloudflare Worker code
```

The KruMath side should provide platform-level support rather than absorbing the project into the monorepo.

---

# 23. Complete Verification Matrix

Before considering the integration complete, test all relevant scenarios.

### Access

```text
[ ] Logged-in user can open the project
[ ] Logged-out user is handled correctly
[ ] Anonymous user is handled correctly
[ ] Expired session is handled correctly
```

### Sign-In

```text
[ ] Project redirects to /sign-in
[ ] returnUrl parameter is exactly correct
[ ] Valid returnUrl is preserved
[ ] Login returns to the exact requested project route
[ ] Invalid/external returnUrl is rejected
```

### Session

```text
[ ] Refresh preserves login
[ ] Session refresh works
[ ] Shared Supabase session works
[ ] Server-side session works where required
[ ] No stale authenticated state remains
```

### Logout

```text
[ ] Project logout signs out of shared KruMath account
[ ] KruMath logout invalidates project access
[ ] Reopening protected project after logout requires sign-in
```

### Navigation

```text
[ ] Home button → /home
[ ] Profile button is visible and usable
[ ] Signed-in profile menu provides logout
[ ] Signed-out profile control provides sign-in
[ ] Optional Pricing/GitHub links work
```

### Deployment

```text
[ ] Independent GitHub repository
[ ] Independent Cloudflare Worker
[ ] Correct Cloudflare route
[ ] Correct project base path
[ ] Assets load
[ ] Internal routes work
[ ] Direct URLs work
[ ] Refresh works
[ ] Main KruMath site still works
```

### Security

```text
[ ] No service_role key in client
[ ] No committed secrets
[ ] returnUrl is validated
[ ] Anonymous users cannot bypass protected access
[ ] RLS protects private data
[ ] Cross-user data access is prevented
```

### Responsive UI

```text
[ ] Desktop
[ ] Tablet
[ ] Mobile
[ ] Home button remains usable
[ ] Account/profile button remains usable
[ ] Authentication states are clear
```

---

# 24. Common Mistakes

| Mistake | Result |
|---|---|
| Creating a separate Supabase project | Separate authentication/users and unnecessary infrastructure |
| Creating a separate login system | Breaks shared KruMath identity |
| Using Firebase Auth for the project session | Breaks the shared Supabase session model |
| Exposing `service_role` | Serious security risk |
| Forgetting the project base path | Broken assets and routing |
| Using `/assets/...` without considering the project path | Missing assets |
| Allowing anonymous users through a hard gate | Unauthorized access |
| Not validating `returnUrl` | Open redirect vulnerability |
| Redirecting every successful login to `/home` | User loses their original destination |
| Cookie path is not `/` | Project may not see the shared session server-side |
| Project logout only clears local state | KruMath may remain signed in |
| KruMath logout does not invalidate shared session | Project may appear authenticated |
| Adding the home link before deployment | Broken/dead link |
| Overlapping Cloudflare routes | Requests may reach the wrong Worker |
| Editing both repositories for the same feature without coordination | Conflicting implementations |
| Rewriting the independent project unnecessarily | Regression risk |
| Adding database access without RLS | Potential data exposure |
| Putting the project under `learn.krumath.com` by default | Wrong product surface |

---

# 25. Final Definition of Done

An independent project is considered integrated when:

```text
[ ] Own GitHub repository
[ ] Own Cloudflare Worker
[ ] Accessible at krumath.com/<project-slug>
[ ] Uses existing KruMath Supabase
[ ] Uses existing KruMath authentication
[ ] Authentication behavior documented
[ ] Hard/soft gate implemented correctly
[ ] Anonymous-user behavior correct
[ ] returnUrl works safely
[ ] Session cookies work across the project path
[ ] Logout is synchronized
[ ] Home button → krumath.com/home
[ ] Account/profile button implemented
[ ] Sign-in shown when appropriate
[ ] Logout available when signed in
[ ] Optional project navigation works
[ ] Project works on mobile and desktop
[ ] Database access uses proper RLS where needed
[ ] No secrets exposed
[ ] Cloudflare route verified
[ ] Main KruMath site remains functional
[ ] KruMath /home entry added after production verification
[ ] Both repositories remain independent
```

---

# 26. Final Architecture Principle

The long-term model is:

```text
                           GitHub
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        Project A         Project B         Project C
          Repo              Repo              Repo
             │                │                │
             ▼                ▼                ▼
        Worker A          Worker B          Worker C
             │                │                │
             └────────────────┼────────────────┘
                              │
                              ▼
                       krumath.com
                              │
              ┌───────────────┼───────────────┐
              │               │               │
          /project-a      /project-b      /project-c
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
                    KruMath Supabase
                              │
                    Shared Authentication
                              │
                    Shared KruMath Account
```

The core rule is:

**Separate project code. Separate deployment. Same KruMath domain. Same KruMath Supabase. Same KruMath identity.**

The two AIs should treat this document as the shared contract and coordinate through the documented handoff information rather than creating separate integration assumptions.
