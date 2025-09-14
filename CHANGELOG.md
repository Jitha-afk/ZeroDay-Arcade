# Changelog
All notable changes to this project will be documented in this file.

The format loosely follows Keep a Changelog and Semantic Versioning.

## [0.2.0] - Unreleased
### Added
- Unicorn Studio progressive background integration component (`unicorn-background.tsx`)
- Dual marquee testimonial section (`<Testimonials />`) with continuous opposing scroll
- Custom marquee keyframes & utility animation classes in `globals.css`
- Animation & motion guidelines (including GSAP strategy) in `.github/rules.md`
- GSAP dependency for future orchestrated timeline or scroll-based effects

### Changed
- Documentation: expanded implemented features table; reorganized and renumbered sections to include interactive background + testimonials + animation guidelines

### Planned (Not Yet Implemented)
- Reduced-motion fallbacks (pause marquee, skip heavy timelines)
- Scrollspy & active nav accent under anchors
- Pause-on-hover/focus enhancement for marquee rows

### Security
- None

### Removed
- (none)

## [0.1.0] - 2025-09-14
### Added
- Initial project scaffold (Next.js App Router, Tailwind, shadcn components)
- Responsive navbar (logo, centered nav, CTAs, mobile sheet)
- Full-height hero section with interactive background placeholder
- Section component placeholders: Features, Social Proof, Team, Contact
- Theming via next-themes
- Project guidelines (`.github/rules.md`)
- Documentation structure (`docs/`, ADR template)
