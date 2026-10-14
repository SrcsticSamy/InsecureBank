# PLAN.md — Aegis Private Wealth ("InsecureBank" OWASP 2025 Exploit Sandbox)

## 1. Project Overview & Core Directives
Build **Aegis Private Wealth**, a frontend-only, gamified web application security sandbox disguised as an ultra-formal, institutional Swiss private banking portal.

Users explore and exploit **7 interactive OWASP Top 10 (2025 Edition) vulnerabilities** integrated naturally into the banking interface. Every successful exploit dynamically triggers an **Xbox-style Achievement Toast** (with a Web Audio API synthesized chime + Gamerscore) and persists progress. A secret interactive manual lives inside the browser's Developer Tools Console (`F12`).

### NON-NEGOTIABLE AGENT RULES:
1. **NO PLACEHOLDERS OR STUBS:** Every single route, vulnerability, transaction row, and all 21 console hints MUST be fully implemented. Never write `// TODO` or stubbed functions.
2. **STRICT GIT WORKFLOW:** Initialize a Git repository (`git init`) immediately and make **5 atomic, sensible commits** at the exact milestones defined in Section 9. Do NOT commit everything at once at the end.
3. **ZERO BACKEND / ZERO WASM BUNDLER FAILURES:** Everything runs 100% client-side in React + TypeScript. Follow Section 6 carefully to avoid Vite routing, `localStorage`, and DOM XSS pitfalls.

---

## 2. Tech Stack & Setup Specifications
- **Framework:** React 18+ with Vite and TypeScript (`npm create vite@latest . -- --template react-ts`)
- **Routing:** `@tanstack/react-router` — **USE CODE-BASED ROUTING** (`createRootRoute`, `createRoute`, `createRouter`) in a single `src/router.tsx` or modular route files. Do NOT rely on `@tanstack/router-plugin` file generation, which can stall when the dev server isn't running.
- **State Management:** `zustand` (with `persist` middleware storing sandbox state under `aegis_sandbox_state` in `localStorage`).
- **Styling & UI:** Tailwind CSS + `shadcn/ui` patterns (Radix primitives where needed, `lucide-react` icons, `clsx`, `tailwind-merge`).
- **Fonts:** Load `Instrument Serif` (or `Playfair Display`), `Inter`, and `JetBrains Mono` via Google Fonts in `index.html`.

---

## 3. Design Language: "Institutional Swiss Ledger + Scarce Reality Glitches"

### 3.1 Anti-LLM Design Mandate
- **FORBIDDEN:** Purple/indigo gradients, neon green cyberpunk matrices, `rounded-xl` or `rounded-2xl` cards, glassmorphism, floating blobs, or SaaS marketing hero sections.
- **REQUIRED AESTHETIC:** Cold, ultra-wealthy Swiss private bank (inspired by UBS, Pictet, and Bloomberg terminals).
  - **Geometry:** Strictly `0px` border radius everywhere (`rounded-none`). Exposed `1px solid` structural grid lines (`border-[#D6D3CD]`).
  - **Palette:**
    - Background Primary: Warm Alabaster Paper (`#F6F5F0`)
    - Background Surface / Cards: Crisp Ledger Ivory (`#FFFFFF`) and Muted Stone (`#ECEAE2`)
    - Ink Primary: Deep Obsidian (`#111315`)
    - Ink Secondary: Slate Archive (`#5A5D64`)
    - Institutional Accent: Alpine Forest Green (`#0A3622`) and Sovereign Brass (`#8C6D3F`)
    - Alert / Breach Crimson: (`#8B1E1E`)
  - **Typography:**
    - Headings: Editorial Serif (`font-serif` -> `'Instrument Serif', 'Playfair Display', Georgia, serif`)
    - UI & Labels: Crisp Neo-Grotesque (`font-sans` -> `'Inter', system-ui, sans-serif`)
    - Account Numbers, Currencies, Hashes, Console Views: Tabular Monospace (`font-mono tabular-nums` -> `'JetBrains Mono', monospace`)

### 3.2 Scarce "Reality Glitch" System
The interface must look 99% like a sober financial institution, interrupted by **rare, unsettling micro-glitches** that subtly remind the user they are inside a vulnerable simulation:
1. **`<GlitchText text="..." />` Component (`src/components/GlitchText.tsx`):**
   - Renders normal text most of the time.
   - Uses a randomized timer (every 14–28 seconds per instance) to corrupt 1 or 2 words into hex/memory strings (`0x7F4A_ERR`, `SEGFAULT`, `NULL_PTR`, `[REDACTED]`) with a subtle `2px` CSS red/cyan `text-shadow` split for `160ms` before snapping back to normal.
   - Use sparingly (4–5 places across the entire app: footer regulatory notice, sidebar version tag, heritage motto).
2. **Hover & Exploit Scanline Tear (`.glitch-edge` utility):**
   - On hover of the Aegis crest or whenever an achievement unlocks, trigger a brief `250ms` horizontal CSS clip-path jitter and scanline flicker.

---

## 4. Core Systems Architecture

### 4.1 Global Window Typings & Secret Console Manual (`src/lib/consoleManual.ts`)
Declare `window.manual` on `Window` interface in `src/vite-env.d.ts` so TypeScript compiles cleanly.
On app mount, print a rich, multi-line CSS-styled banner in `console.log` resembling an intercepted Red Team briefing for **AEGIS PRIVATE WEALTH — CORE LEDGER v4.2.0-rc1**.

Expose `window.manual` (and also attach top-level aliases `window.help` and `window.hint` for convenience):
- `manual.help()` — Displays available commands (`manual.missions()`, `manual.hint(id, tier)`, `manual.status()`, `manual.reset()`) and explains how the sandbox works.
- `manual.missions()` — Prints a formatted overview of all 7 OWASP Top 10 (2025) targets, their ID (`1`–`7`), OWASP code, Gamerscore (`G`), and current status (`LOCKED` vs `COMPROMISED`).
- `manual.hint(id: number, tier: 1 | 2 | 3 = 1)` — Prints progressive hints (defined verbatim in Section 7) without ever giving a raw copy-paste spoiler.
- `manual.status()` — Prints current Gamerscore (`e.g., 350 / 1000 G`), unlocked badges, and remaining targets.
- `manual.reset()` — Resets Zustand store, restores `aegis_clearance_token` in `localStorage`, resets vault balances to default, and reloads.

### 4.2 Web Audio API Xbox Achievement Synthesizer (`src/lib/sound.ts`)
Build a zero-dependency sound generator using `window.AudioContext`:
- When an achievement unlocks, synthesize the iconic two-note/three-note bright Xbox achievement chime (e.g., triangle + sine oscillators playing a crisp arpeggiated major chord `A5 -> E6 -> A6` with smooth exponential gain decay over `0.85s`).
- Wrap in a `try/catch` so browser autoplay restrictions never throw an unhandled error.

### 4.3 Xbox Achievement Toast & Drawer (`src/components/AchievementToast.tsx` & `AchievementDrawer.tsx`)
- **The Toast:** Slides in from bottom-center (or top-right), styled as an iconic dark-charcoal/emerald pill with a glowing trophy icon, `"ACHIEVEMENT UNLOCKED"`, Gamerscore badge (`150G`), Achievement Title, and OWASP 2025 category code. Supports queuing if multiple unlock in sequence.
- **The Drawer:** Triggered by clicking the `[🏆 XXX / 1000 G]` indicator in the top institutional header. Lists all 8 achievements:
  - Locked items show the OWASP category, title, points, and a button to run `manual.hint(id, 1)`.
  - Unlocked items reveal a detailed **"Post-Exploit Debrief & Remediation"** box explaining the real-world vulnerability and how to fix it in production code.

---

## 5. Complete OWASP Top 10 (2025) Vulnerability Specifications & Technical Traps to Avoid

| ID | OWASP 2025 Category | Achievement Title | Score | Route / Location |
|---|---|---|---|---|
| `1` | **A01:2025 Broken Access Control** | *Identity Theft Is Not a Joke* | `150 G` | `/vault/client?id=1042` |
| `2` | **A02:2025 Security Misconfiguration** | *Dumpster Diver* | `100 G` | `/robots.txt`, `/.env`, or `?debug=true` |
| `3` | **A04:2025 Cryptographic Failures** | *Enigma Machine* | `150 G` | `localStorage.getItem('aegis_clearance_token')` |
| `4` | **A05:2025 Injection** | *Little Bobby Tables* | `200 G` | `/ledger-search` (SQLi) OR `/transfers` (XSS) |
| `5` | **A06:2025 Insecure Design** | *Infinite Money Glitch* | `150 G` | `/transfers` |
| `6` | **A07:2025 Authentication Failures** | *Master of Disguise* | `100 G` | `/executive` + `/heritage` |
| `7` | **A10:2025 Mishandling of Exceptional Conditions** | *Task Failed Successfully* | `100 G` | `/swift-import` |
| `8` | **PLATINUM COMPLETION** | *Full Stack Menace* | `50 G` | Auto-triggers 2s after #1–#7 are all unlocked |

### Exact Implementation Mechanics (READ CAREFULLY):

#### Exploit #1 — A01:2025 Broken Access Control (`150 G`)
- **Location:** `/vault/client` route, which reads search query parameter `?id=` (defaults to `1042` when clicked from the sidebar).
- **Mock Records:**
  - `id=1042`: **Henrik Vance** (Tier 1 Private Client, Balance: `CHF 420,500.00`, Tax Domicile: Zurich).
  - `id=1043`: **Elena Rostova** (Tier 1 Private Client, Balance: `CHF 1,890,000.00`, Tax Domicile: Geneva).
  - `id=1` (or `id=0001` or `id=0`): **Aldous Sterling — Chairman of the Sovereign Board** (Classification: `EYES ONLY // SOVEREIGN VAULT`, Balance: `CHF 14,800,000,000.00`, Offshore Numbered Accounts revealed).
- **Trigger:** As soon as `/vault/client` renders with `id === '1'` or `id === '0001'` or `id === '0'`, display the Chairman's secret dossier and trigger Achievement #1.

#### Exploit #2 — A02:2025 Security Misconfiguration (`100 G`)
- **TRAP TO AVOID:** Vite's dev server blocks literal requests to `/.env` with a `403 Restricted` security rule before React loads!
- **How to Implement Safely:**
  1. Add a tiny custom Vite plugin in `vite.config.ts` (`configureServer`) that intercepts requests to `/robots.txt` and `/.env` when `Accept: text/html` is present and serves `index.html` (SPA fallback) so TanStack Router handles both URLs cleanly!
  2. In TanStack Router, register routes for `/robots.txt`, `/.env`, AND `/env`.
  3. On `/robots.txt`, render a full-screen raw monospace plaintext view showing:
     ```text
     User-agent: *
     Disallow: /executive
     Disallow: /swift-import
     Disallow: /.env
     Disallow: /api/v1/debug-config
     # Note to DevOps: Do not forget to strip ?debug=true from production builds
     ```
  4. Also check `window.location.search.includes('debug=true')` in the root layout (which opens a floating yellow/red staging diagnostics banner leaking internal secrets).
  5. **Trigger:** Visiting `/robots.txt`, `/.env`, `/env`, or appending `?debug=true` to any URL immediately triggers Achievement #2.

#### Exploit #3 — A04:2025 Cryptographic Failures (`150 G`)
- **TRAP TO AVOID:** `window.addEventListener('storage')` does NOT fire when a user edits `localStorage` in the same tab via DevTools!
- **How to Implement Safely:**
  1. On initial app boot, if `localStorage.getItem('aegis_clearance_token')` is missing, set it to the Base64 encoding of `{"user":"h.vance","role":"CLIENT","clearance":"TIER_1"}`:
     `eyJ1c2VyIjoiaC52YW5jZSIsInJvbGUiOiJDTElFTlQiLCJjbGVhcmFuY2UiOiJUSUVSXzEifQ==`
  2. Run a `setInterval` every `1000ms` in the Root layout (and also provide a `"Re-Sync Clearance Token"` button on the Dashboard and Executive page) that reads `localStorage.getItem('aegis_clearance_token')`, Base64-decodes it (`atob`), and parses the JSON.
  3. **Trigger:** If the decoded JSON has `role` changed to `"ADMIN"` / `"CHAIRMAN"` / `"SOVEREIGN"` OR `clearance` changed to `"TIER_0"` / `"SOVEREIGN"` / `"ADMIN"` (case-insensitive check), elevate the UI badge to `SOVEREIGN CLEARANCE` and trigger Achievement #3.

#### Exploit #4 — A05:2025 Injection (`200 G`)
- **TRAP TO AVOID:** Do not use external `.wasm` files that can fail to load in Vite, and remember React `dangerouslySetInnerHTML` ignores `<script>` tags.
- **How to Implement Safely (Dual Trigger — either SQLi OR XSS unlocks Achievement #4):**
  1. **Path A — SQL Injection on `/ledger-search`:**
     - Display a "Live SQL Query Preview" box below the search input so learners can see their input being concatenated directly into:
       `SELECT id, recipient, amount, classification FROM wire_archive WHERE recipient LIKE '%${userInput}%' AND classification = 'PUBLIC';`
     - Implement a deterministic client-side SQL injection evaluator: if `userInput` contains classic tautologies or comment truncations (`/('|\b)\s*(OR|UNION)\s+/i`, `' OR '1'='1`, `' OR 1=1`, `'--`, `';`), bypass the `classification = 'PUBLIC'` filter, return 4 normal rows PLUS 3 hidden `CLASSIFIED // BLACK_BUDGET` offshore rows (e.g., `Project Stargate Cayman Trust - CHF 85,000,000`), and trigger Achievement #4.
  2. **Path B — DOM XSS on `/transfers` (Wire Remittance Memo):**
     - Monkey-patch `window.alert` on app boot so calling `alert(...)` triggers Achievement #4 and still shows a sleek custom modal or native alert.
     - When rendering submitted Wire Memos in the "Recent Remittance Log", render via `dangerouslySetInnerHTML` AND actively scan the submitted string for `<script>...</script>` or inline event handlers (`onerror=`, `onload=`, `onmouseover=`, `javascript:`). If detected, execute safely/trigger Achievement #4 immediately.

#### Exploit #5 — A06:2025 Insecure Design (`150 G`)
- **Location:** `/transfers` ("External Credit Facility Drawdown & Transfer").
- **Mechanic:** User can transfer funds from their **Private Vault** (`CHF 420,500.00`) to an **External Institution**. The HTML `<input type="number">` intentionally omits `min="0"` (or allows typing `-50000`).
- **Calculation Flaw:** `newVaultBalance = currentVaultBalance - transferAmount`. When `transferAmount` is negative (e.g., `-100000`), subtracting a negative number **adds** `CHF 100,000.00` to the user's Private Vault!
- **Trigger:** Submitting any transfer with `amount < 0` increases the user's vault balance, logs a negative credit ledger entry, and triggers Achievement #5.

#### Exploit #6 — A07:2025 Authentication Failures (`100 G`)
- **TRAP TO AVOID:** React strips `<!-- comments -->` inside JSX.
- **How to Implement Safely:**
  1. On `/executive` ("Sovereign Board Terminal"), show a locked hardware-key override screen with a `"Fallback: Legacy Biographical Verification"` form requiring 3 fields:
     - **Founding Year of Aegis in Geneva:** (`1894`)
     - **First Vault Architect's Surname:** (`Vonnegut` or `Keller` — pick **`Keller`** and make it consistent)
     - **Founder's Alpine Hound Name (Debug Test Key):** (`Bretton`)
  2. On `/heritage` ("Institutional Heritage & Governance"), write a formal historical narrative that mentions Aegis was founded in **1894** in Geneva and designed by chief vault architect **Heinrich Keller**.
  3. On `/heritage` AND `/executive`, use a `useEffect` hook with `document.createComment("LEGACY_AUTH_DEBUG: Do not remove founder hound answer 'Bretton' until hardware YubiKeys arrive for the board")` appended to the page's DOM node, AND also render a subtle expandable `"View Archival Source Metadata"` footnote so learners inspecting the DOM tree in Elements (`F12`) easily spot the real HTML comment.
  4. **Trigger:** Submitting `1894`, `Keller` (case-insensitive), and `Bretton` (case-insensitive) unlocks the Sovereign Board Terminal and triggers Achievement #6.

#### Exploit #7 — A10:2025 Mishandling of Exceptional Conditions (`100 G`)
- **Location:** `/swift-import` ("ISO-20022 / SWIFT Batch Settlement Parser").
- **Mechanic:** Provides a textarea pre-filled with a valid sample JSON batch payload and a `"Load Sample Batch"` button.
- **Fail-Open Exception Flaw:**
  - If the user submits valid JSON, it validates normally and says `"Batch queued for standard Tier-1 manual compliance review (Hold: 48h)."`.
  - If the user corrupts the JSON syntax (e.g., deletes a bracket `{bad_json`, types `NaN`, `null`, or corrupts the schema so `JSON.parse` or property validation throws an exception), the flawed `catch (err)` block **fails open**:
    - It switches the batch status to `EMERGENCY FAIL-OPEN BYPASS: AUTO-APPROVED (ROOT_OVERRIDE)`.
    - It renders a red monospace verbose stack trace leaking `MASTER_SETTLEMENT_KEY=AEGIS_ROOT_99481_X` and `exceptionPolicy: "FAIL_OPEN_ON_PARSE_ERR"`.
    - Immediately triggers Achievement #7.

---

## 6. Complete Progressive Hints Database (`src/lib/hintsData.ts`)
Hardcode all 21 progressive hints (3 tiers × 7 vulnerabilities) so `manual.hint(id, tier)` works out of the box:

1. **ID 1 (A01:2025 Broken Access Control):**
   - *Tier 1:* "Navigate to the Client Dossier page. Look closely at the browser's address bar and how the application knows which client's wealth profile to display."
   - *Tier 2:* "The `/vault/client` route relies on an unverified `?id=` query parameter (Insecure Direct Object Reference). Your client ID is `1042`."
   - *Tier 3:* "Who usually gets the very first ID in a database table? Try changing `?id=1042` in the URL to `?id=1`."
2. **ID 2 (A02:2025 Security Misconfiguration):**
   - *Tier 1:* "Websites often leave behind files meant for search engine crawlers or developers. Have you checked the root domain for standard configuration or crawler files?"
   - *Tier 2:* "Try navigating directly to paths that webmasters use to restrict search engines or store environment variables, or enabling a debug query parameter."
   - *Tier 3:* "Navigate to `/robots.txt` or `/.env` in the app's URL bar, or append `?debug=true` to any route."
3. **ID 3 (A04:2025 Cryptographic Failures):**
   - *Tier 1:* "How does the browser remember your clearance level across refreshes? Open DevTools and inspect the Application / Storage tab."
   - *Tier 2:* "Look at `localStorage` for `aegis_clearance_token`. That string isn't encrypted—it's just encoded using a very common format starting with `eyJ`."
   - *Tier 3:* "Base64-decode `aegis_clearance_token` (`atob()`), change `clearance` from `TIER_1` to `TIER_0` (or `role` to `ADMIN`), Base64-encode it back (`btoa()`), save it to `localStorage`, and click 'Re-Sync Clearance'."
4. **ID 4 (A05:2025 Injection):**
   - *Tier 1:* "User input is trusted too blindly in two places: the Historical Audit Query (`/ledger-search`) and the Wire Remittance Memo (`/transfers`)."
   - *Tier 2:* "On `/ledger-search`, your search term is concatenated directly into a SQL query string. On `/transfers`, wire memos are rendered as raw HTML."
   - *Tier 3:* "Enter `' OR 1=1 --` into the Ledger Search box to dump classified records, OR submit `<img src=x onerror=alert(1)>` in a Wire Transfer memo."
5. **ID 5 (A06:2025 Insecure Design):**
   - *Tier 1:* "Sometimes the code doesn't crash—the business math itself is flawed. Test the Wire & Liquidity Transfer form (`/transfers`)."
   - *Tier 2:* "When you send money to an external account, the bank subtracts the transfer amount from your vault balance. What happens if you subtract a number below zero?"
   - *Tier 3:* "Enter a negative number like `-50000` into the Transfer Amount field on `/transfers` and execute the wire."
6. **ID 6 (A07:2025 Authentication Failures):**
   - *Tier 1:* "The Sovereign Board Portal (`/executive`) has a legacy biographical recovery form. Banks love bragging about their history in public."
   - *Tier 2:* "Read the Institutional Heritage page (`/heritage`) for the founding year and architect's name. For the 3rd question, inspect the actual HTML DOM elements (`F12` -> Elements) for developer comments left behind."
   - *Tier 3:* "The founding year is `1894`, the architect is `Keller`, and inspecting the DOM comments reveals the founder's hound is named `Bretton`."
7. **ID 7 (A10:2025 Mishandling of Exceptional Conditions):**
   - *Tier 1:* "Visit the SWIFT Batch Ingestion terminal (`/swift-import`). It expects clean, well-formed JSON settlement batches. What happens when things go wrong?"
   - *Tier 2:* " poorly designed systems sometimes 'fail open' inside their `catch` blocks when an unexpected parsing error occurs."
   - *Tier 3:* "Break the JSON syntax in the `/swift-import` payload box (for example, type `{CORRUPT_PAYLOAD` or delete half the JSON) and click 'Execute Batch Settlement'."

---

## 7. Step-by-Step Execution & Mandatory 5-Commit Git Plan

Execute this build in **5 sequential phases**. Verify the code compiles at each step and run `git add -A && git commit -m "..."` before moving to the next phase.

### Phase 1: Project Initialization, Institutional Theme & Glitch Engine
1. Scaffold Vite + React + TypeScript project and run `git init`.
2. Install dependencies (`@tanstack/react-router`, `zustand`, `lucide-react`, `clsx`, `tailwind-merge`, `@tailwindcss/vite` or standard Tailwind config).
3. Configure `vite.config.ts` including the SPA middleware fallback for `/.env` and `/robots.txt` so Vite never returns a 403 on those routes.
4. Set up institutional Swiss typography, color tokens, `0px` sharp borders, `<GlitchText />` component, and Web Audio API chime synthesizer (`src/lib/sound.ts`).
5. **COMMIT 1:** `chore: initialize project with swiss banking theme, glitch engine, and audio synth`

### Phase 2: Zustand Sandbox Store, Achievement UI & Console Manual
1. Build `src/store/useSandboxStore.ts` with persistent state for vault balance (`420500`), transaction history, clearance level, unlocked achievements, and active toast queue.
2. Build `src/lib/hintsData.ts` (all 21 hints + remediation debriefs) and `src/lib/consoleManual.ts` (binding `window.manual` and printing the initial styled console banner).
3. Build `<AchievementToast />` and `<AchievementDrawer />`.
4. **COMMIT 2:** `feat: implement zustand achievement engine, xbox toast, and console manual`

### Phase 3: Banking Shell & Exploits A01, A02, A06
1. Create the Root Layout (`src/components/Layout.tsx`) with top institutional utility bar (showing Clearance Badge, Re-Sync Token button, and `[🏆 G]` drawer button), left navigation sidebar, and footer with subtle `<GlitchText />`.
2. Implement `/` (Portfolio Dashboard), `/vault/client` (**A01** `?id=1` IDOR exploit), `/transfers` (**A06** Negative Transfer exploit), and `/robots.txt` + `/.env` + `?debug=true` (**A02** Misconfiguration exploit).
3. **COMMIT 3:** `feat: build banking shell and implement A01, A02, and A06 vulnerabilities`

### Phase 4: Exploits A04, A05, A07, A10 & Platinum Completion
1. Implement `localStorage` `aegis_clearance_token` initializer + `1000ms` polling watcher + manual sync check for **A04** Cryptographic Failures.
2. Implement `/ledger-search` (**A05** SQL Injection with live query preview and classified rows) and Wire Memo XSS detection + `window.alert` hook on `/transfers`.
3. Implement `/heritage` (historical text + real DOM HTML comment injection via `useEffect`) and `/executive` (**A07** biographical auth bypass).
4. Implement `/swift-import` (**A10** fail-open exception handler with verbose stack trace leak).
5. Ensure unlocking all 7 vulnerabilities automatically triggers the 8th Platinum achievement (*Full Stack Menace*) after 2 seconds.
6. **COMMIT 4:** `feat: complete A04, A05, A07, and A10 exploits with platinum completion trigger`

### Phase 5: Production Build Verification & README
1. Run `npm run build` and fix any TypeScript or bundler warnings.
2. Write a clean, well-formatted `README.md` (covering Quick Start, How to Play via `F12` -> `manual.help()`, Architecture, and a Spoiler-Free OWASP Top 10 2025 Curriculum table).
3. **COMMIT 5:** `docs: add comprehensive README and verify production build`