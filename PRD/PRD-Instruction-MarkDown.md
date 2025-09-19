# Cyber War Game Simulation Platform - Functional Requirements

## 1. Product Overview
A **web-based multiplayer cyber war game simulation platform** where corporate teams simulate a real-time breach scenario. Players assume roles (CISO, PR Head, Legal Head, SOC Lead, SOC Analyst, IT Head) with only one live player login; other roles can be AI-driven. The game runs on a **15-minute countdown timer**, with scenarios loaded from **JSON inputs**. It aims to provide immersive crisis decision-making experiences while highlighting **Microsoft Security Stack’s value**.

---

## 2. Objectives
1. Build an **interactive, singleplayer-ready web application** accessible via browser.
2. Enable **admin-controlled session setup** with roles and JSON-based scenario input.
3. Provide **immersive role-based interfaces** with timeline, communication, and team overview functions. Except for the default role which we assign to a layer,all other roles are played by computer.
4. Simulate **real-time decision-making under pressure** with alerts and branching decisions.
5. Track **progress, rewards, and outcomes** across the session.
6. Deliver **post-game debrief reports** that highlight player actions, outcomes, and Microsoft’s security positioning.
7. Provide **engagement features**: animation, tension cues, and dynamic content.
8. Enable **extensibility** for multiple scenarios and AI-driven nondeterministic gameplay (long term ask).

---

#C:\temp\Zero Day Arcade-Cyber WarGame\ZeroDay-Arcade\Design


### 3.4 Advanced Features
- **Multiple Scenarios**
  - Admin can upload multiple JSON files.
  - Players can select scenario before session start.
- **AI-driven Scenarios (Nondeterministic)**
  - Input only scenario context → AI auto-generates:
    - Timeline
    - Decision trees
    - Communications
    - UI themes/animations

---

## 4. Project Plan

### Phase 1: Foundation
- [ ] Define JSON schema for scenarios (events, alerts, comms, decisions).
- [ ] Build Admin console (session creation, role assignment, scenario upload).
- [ ] Implement authentication (role-based login).
- [ ] Core UI: Timer + Navigation Ribbon (Timeline, Comms, Team Overview).

### Phase 2: Game Engine
- [ ] Timeline engine to parse JSON and trigger events.
- [ ] Decision capture and scoring logic.
- [ ] Role-specific comms feed simulation.
- [ ] Sidebar with session info, breach progress, decisions log.

### Phase 3: Immersive Features
- [ ] Animations & alert severity cues.
- [ ] AI-driven teammate interactions.
- [ ] Sound effects/tension escalation.

### Phase 4: Reporting & Extensibility
- [ ] Debriefing engine with performance insights.
- [ ] Microsoft Security Stack mapping.
- [ ] Multi-scenario support.
- [ ] AI-generated nondeterministic scenario builder.

### Phase 5: Testing & Rollout
- [ ] User acceptance testing (CISO, Security OPS).
- [ ] Security & scalability testing.
- [ ] Documentation & training content.
- [ ] Launch & feedback collection.

---

## 5. App Look & Feel

### Layout
- **Top:** Persistent 15-minute timer.
- **Navigation Ribbon:**  
  - Timeline | Communication | Team Overview
- **Left Sidebar:**
  - Session info (Breach name, Timer, Breach progress, Assets affected).
  - Decisions log with score tally.
- **Main Body:**
  - Contextual content (Timeline events, Comms feed, or Team overview grid).
- **Visual Design:**
  - Cybersecurity hacker-style" theme with dark UI.
  - Flashing alerts, glowing tiles, real-time color transitions.
  - Minimal but tense UI with clean role-based segmentation.

---

## 6. Task Breakdown
1. **Admin Dashboard**
   - Login, role assignment, scenario upload.
2. **Player Interface**
   - Timer + Ribbon navigation.
   - Timeline view with JSON event injection.
   - Decision system with predefined radio options.
   - Comms feed with AI/player messages.
   - Team overview with role tiles.
3. **Game Engine**
   - JSON parser for scenario execution.
   - Decision scoring & logging.
   - Asset impact progression.
   - Animation triggers.
4. **Debrief Module**
   - Decision/action timeline.
   - Performance scorecard.
   - MS Security Stack mapping.
   - Export to PDF/HTML.
5. **Advanced Modules**
   - Multi-scenario library.
   - AI-driven nondeterministic generator.
