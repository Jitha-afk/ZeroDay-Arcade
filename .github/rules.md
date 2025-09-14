# ZeroDay Arcade – Project Guidelines

## 1. Overview
ZeroDay Arcade is a fluid, responsive landing experience for a cybersecurity war game simulator. The site showcases scenarios, features, leagues, team, and contact sections while establishing a high-impact hero surface reserved for an upcoming interactive background (unicorn.studio integration).

## 2. Tech Stack
- **Framework:** Next.js (App Router) v15
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom utility composition (`cn` helper) + shadcn/ui primitives
- **UI Primitives:** Radix UI (via shadcn generated components: button, sheet, tabs, navigation menu, card)
- **Theming:** `next-themes` (dark/light support via `ThemeProvider`)
- **Package Manager:** npm (pnpm optional but not yet initialized with lockfile at root)

## 3. Design Principles
- **Fluid First:** Max content width currently `1400px` with consistent horizontal padding (`px-4 sm:px-6 lg:px-8`). Avoid fixed pixel layout blocks.
- **Progressive Enhancement:** Interactive background placeholder included with a reserved absolutely positioned layer, non-blocking if uninitialized.
- **Accessible Interaction:** All interactive elements should remain keyboard navigable; prefer semantic elements and `aria-*` as needed.
- **Contrast & Hierarchy:** Primary brand accent applied sparingly (CTAs, emphasized headline line, active nav states).
- **Scalability:** Components written in a way that can accept future props without structural rewrites.

## 4. Current Implemented Features (Baseline)
| Feature | Status | Notes |
|---------|--------|-------|
| Responsive Navbar | ✅ | Desktop center nav, mobile sheet menu, CTAs right side |
| Hero Section | ✅ | Full viewport height, bottom-left anchored typography, background placeholder |
| Section Components (Features, Social Proof, Team, Contact) | ✅ | Included in page composition (content not yet domain-specific) |
| Theme Provider | ✅ | Present in `layout.tsx` |
| Base Typography & Layout Rhythm | ✅ | Using Tailwind defaults + container logic |
| Placeholder for Interactive Background | ✅ | Element: `#unicorn-background-dev` absolute layer |

## 5. Pending / Backlog Ideas
- Smooth scroll & scrollspy for nav (IntersectionObserver)
- Active nav highlight underline / animated accent
- Replace placeholder IDs with actual section anchor structure (#scenarios, #features, #leagues, #team, #contact)
- Unicorn.studio embed integration (mount inside `#unicorn-background-dev`)
- SEO metadata enhancements (Open Graph, structured data)
- Add analytics & event instrumentation for CTA buttons
- Lighthouse performance tuning (preload fonts, adjust critical CSS)
- Dark mode art direction adjustments for background layer
- Add motion primitives (subtle entrance transitions)

## 6. Section & ID Convention
Planned anchors (ensure components expose matching `id` attributes when implemented):
```
#hero
#scenarios
#features
#leagues
#team
#contact
```
Keep IDs lowercase, hyphenless where possible (prefer simple tokens). Match nav array in `site-header.tsx`.

## 7. Component Guidelines
- **Location:** Reusable UI primitives under `components/ui/`; domain or composite sections under `components/` root.
- **Naming:** PascalCase for component files unless they are shadcn generated (current convention is kebab-case or lowercase—maintain repository consistency).
- **Props:** Keep minimal; avoid premature abstraction. Extend later with discriminated unions if variants emerge.
- **State Handling:** Keep local where possible. Defer global state until a concrete cross-component concern appears.
- **Accessibility:** Always supply `aria-label` or `sr-only` text for icon-only buttons (e.g., hamburger menu trigger already handled).

## 8. Styling & Layout
- **Spacing Scale:** Use Tailwind spacing; prefer vertical rhythm of multiples of 4.
- **Max Width:** Use explicit `max-w-[1400px]` for primary container. Avoid arbitrary width divergence unless justified.
- **Color Tokens:** Depend on Tailwind theme + shadcn tokens (`bg-background`, `text-muted-foreground`, `text-primary`). Avoid hardcoding hex values.
- **Responsive Strategy:** Mobile-first; progressively enable `md:` or `lg:` breakpoints for layout adjustments.
- **Z-Index Layers:** Navbar sits at `z-40`. Interactive background reserved behind content at `-z-10`.

## 9. Navbar Specification
- **Structure:** Logo (left) / Nav (center) / CTAs (right)
- **Links:** Defined in `navItems` array in `site-header.tsx`
- **Mobile:** Sheet-driven slide-in; taps close on navigation.
- **Buttons:** `Login` (secondary), `Join Up` (primary). Maintain order and variant semantics.
- **Future:** Implement active state detection via scrollspy vs. current `pathname` which suits full-page vs. anchor navigation.

## 10. Hero Section Specification
- **Viewport:** `min-h-screen` ensures full height.
- **Anchoring:** Flex container with bottom alignment; inner wrapper padded (`pb-24 md:pb-32`).
- **Headline:** Two-line split with brand emphasis on second line using `text-primary`.
- **CTA:** Single primary button: "Try It Out"; extend later with secondary options if funnel branches emerge.
- **Background Placeholder:** `#unicorn-background-dev` for unicorn.studio injection; must remain absolutely positioned and non-obstructive.

## 11. Theming
- Uses `next-themes`. When adding new surface colors ensure contrast compliance (WCAG AA). Consider adding a theme switcher component later if user-facing.

## 12. Performance Considerations
- Avoid blocking external scripts in hero; lazy mount heavy visualizations.
- When integrating unicorn.studio: defer load until `requestIdleCallback` or post-interaction; provide low-cost fallback gradient (already present).
- Consider preloading brand font subset if custom typography added.

## 13. Accessibility Checklist (Incremental)
- [ ] Landmarks (`<header>`, `<main>`, `<footer>` future)
- [ ] Skip link (todo)
- [x] Meaningful button labels
- [ ] Focus ring design audit
- [ ] Color contrast validation for primary brand color against background

## 14. Contribution Workflow
1. **Branching:** Use feature branches: `feat/<short-topic>` or `chore/` / `fix/` as needed.
2. **Commits:** Conventional style recommended: `feat: add scrollspy nav`.
3. **PR Review:** Ensure build passes locally via `npm run build`.
4. **Testing:** Visual QA in both light/dark themes + mobile viewport (≤ 640px) + large desktop (≥ 1440px).
5. **Merging:** Squash or rebase; keep main deployable.

## 15. Future Automation Ideas
- Add GitHub Action for Lighthouse CI (performance + accessibility budgets).
- Add visual regression (Chromatic or Playwright screenshots) once design stabilizes.
- Auto label PRs based on commit scopes.

## 16. Documentation Requirements
- Update relevant documentation in `docs/` when modifying or introducing notable features.
- Keep `README.md` aligned with new capabilities or breaking changes.
- Maintain changelog entries in `CHANGELOG.md` for any user-visible addition, change, or fix.
- Cross-reference ADR numbers in PR descriptions when architectural decisions are implemented.

## 17. Architecture Decision Records (ADRs)
- Location: `docs/adr/`
- Use incremental numbering: `0001-title.md`.
- Create an ADR for:
  - Major dependency additions/removals
  - Architectural pattern shifts (state management strategy, rendering model changes, etc.)
  - New integration patterns (analytics provider, background engine, auth provider)
  - Security-relevant decisions
- Template: `docs/adr/template.md`
- Status lifecycle: `Proposed → Accepted / Rejected → (optionally) Superseded`.

## 18. Code Style & Patterns
- Prefer functional, composable React components; avoid inheritance.
- Keep components small; extract sub-elements when JSX exceeds ~80 lines.
- Error handling centralization in `lib/errors.ts` using typed factories.
- Avoid ambient mutation; prefer pure helpers in `lib/`.
- If future API client generation is added (OpenAPI), place generated artifacts under `src/generated` (folder not yet present) and never manually edit generated code.
- Use repository-style wrappers for external data sources if/when added.
  
### Tailwind Usage
- Compose with meaningful utility groupings; do not prematurely abstract into bespoke class names.
- Use design tokens (e.g., `text-primary`, `bg-background`) instead of hex literals to preserve theme compatibility.

### Error Pattern
```ts
import { Errors, isAppError } from '@/lib/errors';

try {
  // ...
} catch (err) {
  if (isAppError(err)) {
    // handle typed case
  }
}
```

## 19. Testing Standards
### Pyramid (Future State)
Unit > Integration > E2E (keep E2E lean & meaningful)

### Current Scope
- E2E smoke tests implemented with Playwright (`tests/e2e/home.spec.ts`).
- Focus: hero visibility, navbar structure (links + CTAs), mobile menu behavior.

### Playwright Usage
- Config: `playwright.config.ts` (starts Next.js dev server automatically).
- Run all: `npm run test:e2e`
- UI mode: `npm run test:e2e:ui`
- Report viewing: `npm run test:e2e:report`
- Artifacts: traces & videos on first retry / failure (see config).

### Writing Tests
Prefer role-based selectors: `getByRole('button', { name: /join up/i })` for resilience.
Avoid reliance on brittle DOM structure; add `data-testid` only if semantics insufficient.

### Future Additions
- Accessibility assertions via axe (custom helper) per page.
- Visual regression opt-in (Playwright screenshot diff or Chromatic alternative).
- Scroll-driven section activation tests once anchors & scrollspy implemented.

### Pending Layers
- Unit tests: add once business logic modules are introduced.
- Integration tests: add when API endpoints or server actions introduced.
- Performance budgets: potential Lighthouse CI separate from Playwright.

## 20. Security Considerations
- No user auth implemented yet—CTA buttons are placeholders.
- Sanitize & validate any future form inputs server-side.
- Review and pin third-party scripts; prefer lazy loading non-critical integrations.
- Consider adding Content Security Policy (CSP) once external embeds (unicorn.studio) are integrated.

## 21. Embedding Interactive Background (Planned)
```tsx
// Example future mount pattern
useEffect(() => {
  const mountEl = document.getElementById('unicorn-background-dev');
  if (!mountEl) return;
  // lazy import / injection here
}, []);
```
Ensure layering does not capture pointer events unless required.

## 22. Release Notes (Initial)
- v0.1.0: Baseline navbar + hero + structural components scaffolded, design system primitives in place.

## 23. GitHub Pages Deployment (Static Export)
This landing site is intended for hosting on GitHub Pages using `next export` (configured via `output: 'export'` in `next.config.mjs`).

### Constraints & Considerations
- No server-side rendering or API Routes (anything dynamic must run entirely client-side).
- Assets must resolve correctly under a repository-scoped `basePath` (e.g., `/ZeroDay-Arcade`).
- `assetPrefix` & `basePath` are computed automatically in CI using `GITHUB_REPOSITORY`; ensure forks adjust as needed.
- Images are set to `unoptimized: true` to avoid relying on Next.js image optimizer (not available in static export).

### Environment Variables
- `BASE_PATH` may override computed base path if deploying under a custom path.
- Avoid secrets: static export exposes any inlined env vars.

### Linking & Routing
- Use relative `href` anchors (e.g., `#features`) for intra-page navigation; do not rely on dynamic route segments.
- Avoid usage of `next/image` advanced optimization features (already unoptimized) and dynamic imports that rely on Node-only modules.

### Adding New Assets
- Place static assets under `public/` (consider creating if needed) to ensure inclusion in export output.
- Reference via root-relative path respecting `basePath`: when using `<img src="/images/foo.png" />` it becomes `${basePath}/images/foo.png` post-export.

### CI/CD Workflow
- Ensure GitHub Action runs `npm run build` then publishes the `out/` directory to `gh-pages` branch (current action should mirror this—update if repo name changes).
- Clear old artifacts to avoid stale asset caching (set proper cache headers if using a CDN layer later).

### Feature Planning Under Static Constraints
- For future interactive background or dynamic scenario lists: fetch from public JSON or a static generated file; avoid runtime server fetches.
- Consider static JSON manifest versioning (`public/data/scenarios.json`) with cache-busting via filename hash if needed.

### Common Pitfalls
- Forgetting to adjust absolute URLs when moving between local (`/`) and Pages (`/RepoName/`). Use `next/config` runtime config or relative links.
- Adding runtime-only Node APIs (will break in static output). Keep client bundles browser-safe.
- Attempting to add form handlers or auth flows without a backend—use external SaaS endpoints if required.

### Validation Checklist
- [ ] Local export: `npm run build && npx serve out` renders correctly.
- [ ] All internal links work with `basePath` set.
- [ ] No 404s for fonts, images, or JS chunks in browser network panel.
---
Maintainers should keep this file updated when structural, layout, navigation, or architectural changes occur. Add new sections as the platform moves beyond landing functionality.
