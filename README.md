# Aegis Private Wealth & Trust Bank S.A.
### Institutional Sovereign Ledger — Interactive OWASP Top 10 (2025 Edition) Security Sandbox

> **Classification:** EYES ONLY // RED TEAM TRAINING GROUND  
> **Jurisdiction:** Geneva, Zürich, Vaduz (Est. 1894)  
> **Target Gamerscore:** 1,000 G across 7 Vulnerabilities + 1 Platinum Achievement

---

## 🏛️ Executive Summary

**Aegis Private Wealth** is a frontend-only, gamified web application security exploit sandbox disguised as an ultra-conservative, institutional Swiss private banking portal. 

Security learners, penetration testers, and software engineers explore and exploit **7 interactive OWASP Top 10 (2025 Edition)** vulnerabilities naturally integrated into high-value banking workflows. Every successful exploit triggers an **Xbox-style Achievement Toast** (complete with a pure Web Audio API synthesized chime and Gamerscore badge), updates persistent state (`zustand`), and provides deep post-exploit remediation analysis and production-grade defensive code patterns.

---

## 🎯 OWASP Top 10 (2025) Curriculum Matrix

| ID | OWASP 2025 Code | Achievement Title | Score | Vulnerability Class | Location |
|:---:|:---|:---|:---:|:---|:---|
| **1** | **A01:2025** | *Identity Theft Is Not a Joke* | `150 G` | Broken Access Control (IDOR) | `/vault/client?id=1042` |
| **2** | **A02:2025** | *Dumpster Diver* | `100 G` | Security Misconfiguration | `/robots.txt`, `/.env`, `?debug=true` |
| **3** | **A04:2025** | *Enigma Machine* | `150 G` | Cryptographic Failures | `localStorage` token |
| **4** | **A05:2025** | *Little Bobby Tables* | `200 G` | Injection (SQLi / DOM XSS) | `/ledger-search` & `/transfers` |
| **5** | **A06:2025** | *Infinite Money Glitch* | `150 G` | Insecure Design | `/transfers` |
| **6** | **A07:2025** | *Master of Disguise* | `100 G` | Authentication Failures | `/executive` & `/heritage` |
| **7** | **A10:2025** | *Task Failed Successfully* | `100 G` | Exceptional Conditions (Fail-Open) | `/swift-import` |
| **8** | **PLATINUM** | *Full Stack Menace* | `50 G` | 100% Institutional Compromise | Auto-triggers 2s after #1–#7 |

---

## 🕹️ Interactive Secret Console Manual (`F12`)

A core feature of the Aegis sandbox is the secret interactive console manual embedded into the browser's Developer Tools Console (`F12`):

On startup, an intercepted Red Team ASCII banner is logged with instructions. Global helpers are bound to `window.manual`:

```javascript
// Open DevTools (F12) -> Console tab:

manual.help()              // Displays commands, mission overview, and instructions
manual.missions()          // Lists all 7 OWASP targets and their locked/compromised status
manual.hint(id, tier)      // Progressive hints (Tier 1: Orientation, Tier 2: Tactical, Tier 3: Exploit Path)
manual.status()            // Prints current Gamerscore (e.g. 450 / 1000 G) and clearance
manual.reset()             // Resets sandbox state, clears achievements, and reloads
```

**Convenience Aliases:** You can also simply run `help()` and `hint(id, tier)` directly in the console.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev

# 3. Open browser at:
# http://localhost:5173
```

### Production Build & Preview
```bash
# Build production bundle with TypeScript validation
npm run build

# Preview production build locally
npm run preview
```

---

## 🎨 Design System: "Institutional Swiss Ledger"

Aegis Private Wealth rejects modern SaaS cliches (no purple gradients, no floating glassmorphism blobs, no rounded pill cards). It is built with:
- **Geometry:** Strictly `0px` border radius everywhere (`rounded-none`). Exposed `1px solid` structural grid lines (`#D6D3CD`).
- **Color Palette:**
  - Background Primary: Warm Alabaster Paper (`#F6F5F0`)
  - Surfaces & Ledger: Crisp Ledger Ivory (`#FFFFFF`) & Muted Stone (`#ECEAE2`)
  - Ink: Deep Obsidian (`#111315`) & Slate Archive (`#5A5D64`)
  - Institutional Accent: Alpine Forest Green (`#0A3622`) & Sovereign Brass (`#8C6D3F`)
  - Alert / Breach: Crimson (`#8B1E1E`)
- **Typography:**
  - Headings: Editorial Serif (`Instrument Serif`)
  - Body & UI: Clean Neo-Grotesque (`Inter`)
  - Account Numbers, Balances & Hashes: Tabular Monospace (`JetBrains Mono tabular-nums`)
- **Scarce Reality Glitches:** Rare hex/memory token corruption (`<GlitchText />`) and scanline tears reminding users they are in a simulation.

---

## 🛡️ Architecture & Security Engineering

- **100% Client-Side:** Zero external backend dependencies or WASM bundler failure points. Everything executes in browser React + TypeScript.
- **Code-Based TanStack Routing:** Deterministic, reliable route resolution without code-gen stalls.
- **State Persistence:** `zustand` store persisted to `localStorage` under `aegis_sandbox_state`.
- **Web Audio API Achievement Synthesizer:** Real-time synthesis of the iconic 3-note Xbox chime (`A5 -> E6 -> A6`) using zero external audio assets.
- **Vite SPA Middleware Fallback:** Custom server plugin prevents Vite from blocking `/.env` or `/robots.txt` with default `403` security guards.

---

## 📜 License & Educational Disclaimer
Built exclusively for educational security training, defensive programming demonstrations, and OWASP Top 10 (2025) threat modeling. All corporate names and financial institutions are simulated.
