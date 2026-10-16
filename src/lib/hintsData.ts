export interface HintTiers {
  tier1: string
  tier2: string
  tier3: string
}

export interface RemediationDebrief {
  vulnTitle: string
  owaspReference: string
  mechanismExplanation: string
  remediationCode: string
  remediationSummary: string
}

export const HINTS_DATABASE: Record<number, HintTiers> = {
  1: {
    tier1: "Navigate to the Client Dossier page. Look closely at the browser's address bar and how the application knows which client's wealth profile to display.",
    tier2: "The `/vault/client` route relies on an unverified `?id=` query parameter (Insecure Direct Object Reference). Your client ID is `1042`.",
    tier3: "Who usually gets the very first ID in a database table? Try changing `?id=1042` in the URL to `?id=1`.",
  },
  2: {
    tier1: "Websites often leave behind files meant for search engine crawlers or developers. Have you checked the root domain for standard configuration or crawler files?",
    tier2: "Try navigating directly to paths that webmasters use to restrict search engines or store environment variables, or enabling a debug query parameter.",
    tier3: "Navigate to `/robots.txt` or `/.env` in the app's URL bar, or append `?debug=true` to any route.",
  },
  3: {
    tier1: "How does the browser remember your clearance level across refreshes? Open DevTools and inspect the Application / Storage tab.",
    tier2: "Look at `localStorage` for `aegis_clearance_token`. That string isn't encrypted—it's just encoded using a very common format starting with `eyJ`.",
    tier3: "Base64-decode `aegis_clearance_token` (`atob()`), change `clearance` from `TIER_1` to `TIER_0` (or `role` to `ADMIN`), Base64-encode it back (`btoa()`), save it to `localStorage`, and click 'Re-Sync Clearance'.",
  },
  4: {
    tier1: "User input is trusted too blindly in two places: the Historical Audit Query (`/ledger-search`) and the Wire Remittance Memo (`/transfers`).",
    tier2: "On `/ledger-search`, your search term is concatenated directly into a SQL query string. On `/transfers`, wire memos are rendered as raw HTML.",
    tier3: "Enter `' OR 1=1 --` into the Ledger Search box to dump classified records, OR submit `<img src=x onerror=alert(1)>` in a Wire Transfer memo.",
  },
  5: {
    tier1: "Sometimes the code doesn't crash—the business math itself is flawed. Test the Wire & Liquidity Transfer form (`/transfers`).",
    tier2: "When you send money to an external account, the bank subtracts the transfer amount from your vault balance. What happens if you subtract a number below zero?",
    tier3: "Enter a negative number like `-50000` into the Transfer Amount field on `/transfers` and execute the wire.",
  },
  6: {
    tier1: "The Sovereign Board Portal (`/executive`) has a legacy biographical recovery form. Banks love bragging about their history in public.",
    tier2: "Read the Institutional Heritage page (`/heritage`) for the founding year and architect's name. For the 3rd question, inspect the actual HTML DOM elements (`F12` -> Elements) for developer comments left behind.",
    tier3: "The founding year is `1894`, the architect is `Keller`, and inspecting the DOM comments reveals the founder's hound is named `Bretton`.",
  },
  7: {
    tier1: "Visit the SWIFT Batch Ingestion terminal (`/swift-import`). It expects clean, well-formed JSON settlement batches. What happens when things go wrong?",
    tier2: " poorly designed systems sometimes 'fail open' inside their `catch` blocks when an unexpected parsing error occurs.",
    tier3: "Break the JSON syntax in the `/swift-import` payload box (for example, type `{CORRUPT_PAYLOAD` or delete half the JSON) and click 'Execute Batch Settlement'.",
  },
  9: {
    tier1: "Navigate to `/heist`. The 50M Sovereign Vault requires chaining 4 flaws: leaked master key, forged clearance token, Chairman vault PIN, and negative wire logic.",
    tier2: "Key 1 is leaked in `/.env` or `/swift-import` (`AEGIS_ROOT_99481_X`). For Stage 2, forge `aegis_clearance_token` with `role: SOVEREIGN`. For Stage 3, inspect Chairman's vault `#1` for the Gotthard PIN.",
    tier3: "Enter `AEGIS_ROOT_99481_X` for Stage 1, set token `{ user: 'a.sterling', role: 'SOVEREIGN', clearance: 'TIER_0' }` for Stage 2, enter PIN `GOTTHARD-GOLD-1894` for Stage 3, then authorize the 50,000,000 CHF wire.",
  },
}

export const REMEDIATIONS: Record<number, RemediationDebrief> = {
  1: {
    vulnTitle: 'Insecure Direct Object Reference (IDOR)',
    owaspReference: 'OWASP A01:2025 – Broken Access Control',
    mechanismExplanation:
      'The application trusts user-supplied query parameter `?id=` directly without verifying if the authenticated session owns or has permission to read the requested account dossier.',
    remediationCode: `// Secure Pattern: Enforce server-side tenancy checking
app.get('/api/vault/client', authMiddleware, async (req, res) => {
  const sessionUser = req.user; // from verified cryptographic session
  const requestedId = req.query.id;
  
  if (!sessionUser.canAccess(requestedId)) {
    return res.status(403).json({ error: 'Forbidden: Insufficient vault clearance' });
  }
  return res.json(await db.getClients(requestedId));
});`,
    remediationSummary:
      'Never allow client-side identifiers to bypass server-side authorization boundaries. Enforce multi-tenant access control policies at every data access layer.',
  },
  2: {
    vulnTitle: 'Exposure of Sensitive Configuration & Diagnostic Files',
    owaspReference: 'OWASP A02:2025 – Security Misconfiguration',
    mechanismExplanation:
      'Production servers accidentally exposed development debug flags (?debug=true), disallow listings revealing confidential endpoints in /robots.txt, and raw configuration files.',
    remediationCode: `# NGINX block to reject sensitive paths:
location ~ ^/(\.env|\.git|robots\.txt\.bak) {
    deny all;
    return 404;
}

# Ensure production bundlers strip debug utilities:
if (process.env.NODE_ENV === 'production' && req.query.debug) {
    delete req.query.debug;
}`,
    remediationSummary:
      'Ensure web server routing drops hidden/env files, disable diagnostic interfaces in production, and never rely on robots.txt for security through obscurity.',
  },
  3: {
    vulnTitle: 'Client-Side Tamperable Cryptographic Tokens',
    owaspReference: 'OWASP A04:2025 – Cryptographic Failures',
    mechanismExplanation:
      'Clearance state and roles were serialized as unauthenticated Base64 in localStorage. Base64 is merely an encoding scheme, not encryption or a tamper-proof signature.',
    remediationCode: `// Secure Pattern: Cryptographically signed JWT with HttpOnly cookies
const token = jwt.sign(
  { sub: user.id, role: user.role, clearance: user.clearance },
  process.env.JWT_SECRET_KEY, // Strong asymmetric key (RS256 or Ed25519)
  { expiresIn: '15m' }
);
res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });`,
    remediationSummary:
      'Use digitally signed tokens (e.g., Ed25519/HMAC-SHA256) stored in HttpOnly cookies to prevent client tampering and XSS extraction.',
  },
  4: {
    vulnTitle: 'SQL Injection & Untrusted HTML Rendering',
    owaspReference: 'OWASP A05:2025 – Injection',
    mechanismExplanation:
      'User strings were concatenated directly into SQL queries without parameterized binding, and wire memos were rendered as unescaped innerHTML in the DOM.',
    remediationCode: `// 1. Parameterized SQL queries:
const query = 'SELECT * FROM wire_archive WHERE recipient ILIKE $1 AND classification = $2';
const results = await db.query(query, ['%' + searchInput + '%', 'PUBLIC']);

// 2. Safe DOM rendering:
const memoCell = document.createElement('span');
memoCell.textContent = wireMemo; // Never innerHTML or unescaped strings!`,
    remediationSummary:
      'Always utilize parameterized statements/prepared queries for database operations and context-aware HTML entity encoding or textContent in frontends.',
  },
  5: {
    vulnTitle: 'Flawed Business Logic & Missing Invariant Validation',
    owaspReference: 'OWASP A06:2025 – Insecure Design',
    mechanismExplanation:
      'The application assumed transfer amounts would always be positive. When subtracting a negative number, basic arithmetic logic inverted the transaction into an unauthorized balance credit.',
    remediationCode: `// Invariant Validation at domain boundaries
function executeTransfer(vault, recipient, amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new ValidationError('Invalid amount');
  }
  if (amount <= 0) {
    throw new BusinessRuleViolation('Transfer amount must be strictly greater than 0.00');
  }
  if (vault.balance < amount) {
    throw new InsufficientFundsError();
  }
  vault.balance -= amount;
}`,
    remediationSummary:
      'Enforce strict domain invariants at system boundaries: validate that monetary values are positive non-zero numbers before executing ledger debits.',
  },
  6: {
    vulnTitle: 'Knowledge-Based Authentication & Source Comment Leaks',
    owaspReference: 'OWASP A07:2025 – Authentication Failures',
    mechanismExplanation:
      'The executive portal relied on easily discoverable biographical trivia as a fallback credential, combined with developer debug comments left behind in the DOM tree.',
    remediationCode: `// Multi-Factor Authentication enforcement:
async function verifyExecutiveAccess(user, hardwareChallengeSignature) {
  // Rely on FIDO2/WebAuthn hardware tokens rather than static biographical questions
  const isValid = await fido2Server.verifyAssertion(user.credentialId, hardwareChallengeSignature);
  if (!isValid) throw new AuthenticationError('Hardware token challenge failed');
}

// Build pipeline: Ensure HTML/JS minifiers strip all developer comments in production.`,
    remediationSummary:
      'Eliminate knowledge-based security questions, enforce FIDO2/WebAuthn MFA for sensitive roles, and strip all source code comments during compilation.',
  },
  7: {
    vulnTitle: 'Fail-Open Exception Handling in Critical Pipelines',
    owaspReference: 'OWASP A10:2025 – Mishandling of Exceptional Conditions',
    mechanismExplanation:
      'When the SWIFT parser encountered a malformed JSON payload, the catch block assumed an emergency fail-safe state that auto-approved settlements and leaked system stack traces.',
    remediationCode: `try {
  const batch = validateAndParseSwiftBatch(payload);
  return processSettlement(batch);
} catch (err) {
  // Secure: Fail-Closed Default
  logger.error('SWIFT ingestion error', { errorId: uuid(), safeMessage: err.message });
  // Reject transaction immediately; never auto-approve on unexpected exception
  return res.status(400).json({
    status: 'REJECTED',
    error: 'Malformed settlement payload. Transaction declined for compliance audit.'
  });
}`,
    remediationSummary:
      'Default to fail-closed security posture across all exception boundaries. Never approve transactions or leak verbose stack traces when parsing crashes.',
  },
  8: {
    vulnTitle: 'Full Institutional Compromise (Platinum)',
    owaspReference: 'OWASP Top 10 (2025) Comprehensive Mastery',
    mechanismExplanation:
      'All 7 interactive attack surfaces were successfully penetrated, illustrating defense-in-depth principles across authentication, authorization, business logic, cryptography, and input handling.',
    remediationCode: `// Defense in Depth Architecture:
// 1. Zero Trust Network Architecture & Least Privilege Access Control
// 2. Cryptographic Session Attestation (FIDO2 + Signed JWT)
// 3. Strict Domain Schema Validation (Zod / TypeBox)
// 4. Secure Fail-Closed Error Boundaries
// 5. Automated Static & Dynamic Application Security Testing (SAST/DAST) in CI/CD`,
    remediationSummary:
      'Modern financial systems require defense-in-depth: combining rigorous input validation, least privilege, robust cryptography, and fail-closed state machines.',
  },
  9: {
    vulnTitle: 'The Sovereign Heist — Attack Chain & Multi-Vector Exploitation',
    owaspReference: 'MITRE ATT&CK & OWASP Top 10 Multi-Stage Chaining',
    mechanismExplanation:
      'Attackers rarely exploit isolated bugs in a vacuum. By chaining information disclosure (.env leak), broken authentication (unencrypted token forgery), broken access control (IDOR on executive vault), and business logic manipulation (fail-open batch & negative fees), the entire reserve liquidity pool was compromised.',
    remediationCode: `// Multi-Vector Defense Pipeline:
// 1. Secret Management: Store keys in HashiCorp Vault or AWS KMS (never in .env or error traces).
// 2. Cryptographic Sessions: Sign tokens with asymmetric keys (RS256 / Ed25519) in httpOnly cookies.
// 3. Multi-Tenant Authorization: Object-level authorization policy (PEP / PDP) on all dossier lookups.
// 4. Strict Financial Invariants: Invariant assertions: assert(transferAmount > 0 && balance >= transferAmount).
// 5. Automated Fraud Detection: Dual-control approval (maker-checker rule) for any settlement > CHF 1,000,000.`,
    remediationSummary:
      'Mitigate attack chains by breaking intermediary links: protect internal secrets, sign session claims cryptographically, enforce object-level authorization, and mandate multi-party authorization for high-value wires.',
  },
}
