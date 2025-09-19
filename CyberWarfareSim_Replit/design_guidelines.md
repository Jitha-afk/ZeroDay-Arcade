# Cyber War Game Simulation - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from cyberpunk/hacker aesthetics seen in games like Cyberpunk 2077, Watch Dogs, and hacker-themed interfaces from movies like The Matrix and Mr. Robot. The design should feel immersive, technical, and authentically "cyber" while maintaining usability for professional training.

## Core Design Elements

### Color Palette
**Dark Mode Primary**: 
- Background: 12 5% 8% (Deep charcoal black)
- Surface: 150 10% 12% (Dark gray-green)
- Accent: 120 100% 50% (Neon green) 
- Warning/Alert: 0 100% 60% (Bright red)
- Secondary: 60 100% 70% (Electric yellow)
- Text Primary: 120 20% 85% (Light green-tinted white)
- Text Secondary: 120 10% 60% (Muted green-gray)

### Typography
- **Primary Font**: 'JetBrains Mono' or 'Fira Code' (monospace terminal feel)
- **Secondary Font**: 'Inter' for longer text blocks
- **Sizes**: Terminal-style consistent sizing with emphasis on readability
- **Special Effects**: Subtle text glow on accent colors, typewriter animations for event notifications

### Layout System
**Spacing**: Use Tailwind units of 2, 4, 6, and 8 for consistent spacing (p-2, m-4, gap-6, h-8)
- Tight spacing for terminal-like density
- Generous spacing around critical action areas

### Component Library

**Core UI Elements**:
- **Buttons**: Dark with neon green borders, subtle glow effects, terminal-style brackets `[ENTER]`
- **Cards**: Dark panels with subtle green borders, slight transparency
- **Inputs**: Terminal-style with green cursor/focus states
- **Progress Bars**: Neon green with pixelated/segmented appearance

**Navigation**:
- Sidebar room navigation with hacker-style icons
- Breadcrumb-style persona indicator
- Floating "room change" notifications

**Chat Interface**:
- Terminal-style chat bubbles with timestamps
- Role-based color coding (subtle variations of green palette)
- Typewriter effect for incoming messages
- Command-line style input with green cursor

**Timeline/Events**:
- Vertical timeline with pulsing dots for active events
- Alert cards with severity-based color coding
- Modal overlays for critical decisions
- Progress indicators with countdown timers

**Data Displays**:
- Dashboard widgets with ASCII-art borders
- Real-time metrics with terminal-style readouts
- Status indicators using block characters and symbols

**Game-Specific Elements**:
- Admin control panel with matrix-style background
- Persona assignment cards with cyber-themed avatars
- Decision tracking scoreboard with leaderboard aesthetics
- Debrief interface with post-game analysis charts

### Visual Treatments
**Effects**:
- Subtle scan lines overlay on main containers
- Pulsing animations on active elements
- Glitch effects (very minimal) on critical alerts
- Soft box shadows with green tint

**Backgrounds**:
- Primary: Deep dark with subtle noise texture
- Gradients: Dark to darker with green undertones (180 100% 5% to 180 100% 2%)
- Code pattern overlays in background (very subtle opacity)

### Images
**Hero Section**: Large background featuring a subtle digital grid pattern or abstract circuit board design in dark green tones
**Icons**: Use Heroicons or custom terminal-style icons
**Avatars**: Cyberpunk-styled role avatars (minimalist, geometric)
**Background Elements**: Subtle matrix-rain effect or floating code snippets (very low opacity)

### Animations
**Minimal but Impactful**:
- Typewriter effect for event notifications
- Smooth slide transitions between rooms
- Pulse animations on urgent alerts
- Fade-in effects for timeline events

### Key Principles
1. **Terminal Authenticity**: Interface should feel like a sophisticated command center
2. **Role Clarity**: Each persona should have clear visual identity within the theme
3. **Urgency Communication**: Critical events should break through the aesthetic with appropriate visual priority
4. **Professional Training**: Despite hacker theme, maintain credibility for corporate training use
5. **Microsoft Integration**: Seamlessly weave Microsoft security solution callouts into the cyber aesthetic

The overall experience should feel like participants are in a high-tech cyber defense command center, with each interaction reinforcing the immersive simulation environment while maintaining excellent usability for the training objectives.