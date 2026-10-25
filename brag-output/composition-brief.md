# Hyperframes Composition Brief: ProspectIQ

## Objective
Create a short, polished, agency-grade launch video for ProspectIQ showcasing the core intelligence loop: discovery of local businesses, instant website health auditing, and automated generation of prioritized sales pitch opportunities.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 18.0 seconds

## Source Material
- Project root: `d:\Coding material\Projects\ProspectIQ`
- Primary files read: `frontend/src/App.jsx`, `frontend/src/index.css`, `frontend/src/components/Layout.jsx`, `frontend/src/pages/discover.jsx`, `frontend/src/pages/Opportunities.jsx`, `backend/app/main.py`, `backend/app/routes/businesses.py`
- Product name: ProspectIQ
- Tagline / strongest claim: "AI-powered Business Opportunity Intelligence Platform." / "Stop pitching blind. Turn cold outreach into pre-audited client opportunities."
- Key UI or visual moment to recreate:
  - Discovery Search Parameters form with category dropdown & Chicago location
  - Discovered business card for "Aura Boutique & Atelier"
  - Real-time website audit diagnostic scanner
  - Website Score Badge stamp (`42/100` Outdated)
  - Opportunity cards with priority pill badges ("High Priority: Website does not use HTTPS", "Missing meta description", "Images missing alt text")
  - ProspectIQ sidebar & header with the terracotta spark icon (`#c8643e`) and sage indicator (`#79b7a6`)
- Copy that must appear verbatim:
  - "ProspectIQ"
  - "Discover Leads"
  - "Analyze Website"
  - "Website Score: 42/100"
  - "Website does not use HTTPS"
  - "Images missing alt text"
  - "Missing meta description"

## Creative Direction
- Tone preset: polished
- Creative direction: Sleek agency intelligence launch
- Interpretation: Crisp typography, warm editorial palette, confident holds, snappy UI interactions, and seamless transitions. Lets real product intelligence drive the excitement.
- Angle: Cold outreach is broken because agencies pitch generic services blind. ProspectIQ gives agencies the exact flaws and pitch angles before they ever reach out.
- Hook: "Agencies pitch blind." → "ProspectIQ reveals the flaws your clients will pay you to fix."
- Outro / punchline: "ProspectIQ. Discover leads. Audit flaws. Close deals."
- Avoid:
  - Generic SaaS hype language
  - Abstract filler graphics or 3D floating shapes
  - Neon visual redesigns that conflict with ProspectIQ's warm editorial aesthetic

## Visual Identity
- Background: `#f4f1ea` (warm cream canvas)
- Text / Ink: `#17252c` (deep dark slate/ink)
- Border / divider: `#d9d5cc`
- Card background: `#fffdfa`
- Terracotta brand accent: `#c8643e`
- Sage accent: `#79b7a6`
- Display font: `Bricolage Grotesque`, sans-serif
- Body font: `Bricolage Grotesque`, sans-serif
- Visual references from the project: Layout sidebar navigation, dashboard panels, opportunity priority badges, score badge styling.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Scene 1 — The Hook (0.00s–3.50s): Editorial hook "Agencies pitch blind" → "ProspectIQ reveals the flaws your clients will pay you to fix."
2. Scene 2 — Discovery in Action (3.50s–8.00s): Discovery search (Boutique in Chicago, IL) → 3 local business leads populate.
3. Scene 3 — Deep Website Audit (8.00s–13.50s): One-click audit on "Aura Boutique & Atelier" → scan bar → score stamps `42/100` with 4 identified vulnerabilities.
4. Scene 4 — Opportunity Pipeline & Outro (13.50s–18.00s): Vulnerabilities convert into high-priority pitch opportunities → resolves into the ProspectIQ brand outro with terracotta spark.

## Audio
- Audio role: Steady, confident business bed with crisp UI tactile accents
- Audio arc: Opens with warm rhythmic groove, builds during scan diagnostic, lands impact on 42/100 score, concludes with resonant bell chime on logo lock.
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: Bed volume at 0.32, subtle swell into the audit reveal, clean fade under final logo.
- Music cue guidance:
  - Track: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (109.96 BPM)
  - Strong cues: 8.74s (score stamp lock), 13.11s (opportunity cascade), 17.47s (logo lock)
  - Beat-grid windows: 5.34s, 6.00s, 6.56s (cards arriving one by one)
- Audio-reactive treatment: subtle; use music pulse for card glow/shadow breathing.
- Audio-coupled moments:
  - Scene 2: 4.80s search trigger, 5.34s, 6.00s, 6.56s card arrivals
  - Scene 3: 8.20s audit click, 8.74s score stamp impact
  - Scene 4: 13.64s, 14.20s opportunity card pop-ins, 17.47s logo lock chime
- SFX files:
  - `assets/sfx/ui/click1.ogg`
  - `assets/sfx/casino/card-slide-1.ogg`
  - `assets/sfx/interface/click_001.ogg`
  - `assets/sfx/interface/drop_001.ogg`
  - `assets/sfx/impact/impactSoft_medium_001.ogg`
  - `assets/sfx/impact/impactBell_heavy_000.ogg`
- Audio files destination: `brag-output/composition/assets/`

## Hyperframes Instructions
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Total duration: exactly 18.0s (540 frames at 30fps).
- Run `npx hyperframes check` in `brag-output/composition/` and fix any issues until zero errors.
- Ensure all WCAG contrast checks pass.
- Render locally to `brag-output/brag.mp4`.
