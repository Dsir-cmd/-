# Codex Worklog

## 2026-06-25 - Section Reveal Motion

- Goal: add a site-level section-enter motion so content surfaces upward when the user navigates or scrolls into major tabs such as Profile and Works.
- Change: added an IntersectionObserver-based reveal system that keeps content visible by default, then applies upward fade/blur/scale motion only after the page is ready.
- Applied reveal choreography to the Profile masthead, portrait, profile panel, career paths, Works masthead, Works cards, and Works preview panel with staggered delays.
- Reveal reset: changed the reveal trigger from one-time element observation to section-scoped observation, so leaving Profile or Works resets their child reveal states and returning to the section replays the upward entrance motion.
- Motion safety: preserved reduced-motion behavior and kept hover transforms on Works cards compatible with the reveal transform.
- Capture workflow: extended the section capture wait after scroll so screenshots are taken after the reveal motion settles instead of mid-animation.
- Verification: `pnpm run lint` and `pnpm run build` both pass; refreshed `docs/codex/works-reveal-screenshot.png` for visual QA.

## 2026-06-24 - Profile Section and Capture Workflow

- Goal: fix Profile page issues identified after the first local preview and make the navigation visible across the whole site.
- Hero rail motion refinement: aligned the photography rail cards to a single baseline and added position-aware fade/scale behavior so cards subtly grow as they enter the viewport and shrink/fade as they leave.
- Profile changes: moved the primary navigation to the top-level page shell so it remains fixed outside the Hero section; removed the duplicate Hero-local navigation markup.
- Profile structure refinement: tightened the spacing before and between the two career timelines, and moved the `#works` anchor onto a real Works placeholder so internship and campus timelines remain clearly inside the Profile section.
- Works skeleton: replaced the Works placeholder with a clickable low-fidelity `SELECTED WORKS` layout, including six mixed-size wireframe cards and a reusable detail modal shell ready for future project content.
- Works layout refinement: replaced the auto-filled card spans with explicit grid areas so the six work cards follow the approved wireframe structure, then compressed the row heights so the module reads more coherently in the first viewport.
- Works interaction refinement: made the right-side preview panel respond to hover/focus on the six cards, while click opens the detail modal shell, clarifying the relationship between card browsing and detailed case viewing.
- Visual changes: replaced the temporary clipboard screenshot with a web-optimized image generated from `F:\作品材料\摄影作品\_DSC0014(2).JPG`, reduced the Profile headline scale, tightened the portrait/content proportions, removed the visible portrait caption/signature overlay, and softened Profile cards.
- Capture workflow: Chrome/Edge `--screenshot` returned success without writing a file in this environment. Added `docs/codex/capture-section.cjs`, which captures through the DevTools protocol and saves screenshots through Node instead. Verified it writes `docs/codex/profile-screenshot.png`.
- Profile image refinement: switched the portrait asset to a new web-optimized file generated from `F:\作品材料\摄影作品\_DSC0014.jpg`, removed the portrait caption markup, and gave the portrait frame a rounded glass border treatment aligned with the Hero rolling image cards.
- Profile hierarchy refinement: removed the oversized Profile headline after browser feedback and kept only the compact `Profile / 关于我` section label.
- Profile layout redesign: rebuilt the Profile section away from a dashboard-style grid and toward the supplied reference layout, with a large bilingual `PROFILE EXPERIENCE` masthead, photo-led About block, compact information rows, a restrained metric strip, and two horizontal career paths for internship and campus experiences.
- Profile portrait polish: removed the extra inner glass ring between the portrait image and border, leaving a cleaner rounded image edge; added a pointer-following border highlight so the glass reflection appears on hover at the nearest edge.
- Hero interaction polish: extracted the pointer-following border highlight into a reusable `edge-glow` treatment and applied it to Hero/navigation interactive controls, including the brand capsule, nav links, contact button, Hero CTAs, and rolling photography cards.
- Hero-to-Profile transition: added a targeted wheel transition so scrolling down from the Hero accelerates smoothly to the Profile section and scrolling up near the Profile top returns cleanly to the Hero, preventing the page from resting awkwardly between sections.
- Checkpoint: added `docs/codex/conversations/2026-06-24-hero-profile-checkpoint.md` to summarize current progress, confirmed design decisions, pending sections, and tomorrow's continuation points.
- Verification: `pnpm run build` and `pnpm run lint` both pass.

## 2026-06-23 - Hero Typography Refinement

- Goal: respond to feedback that the center title font and signature placement should be closer to the provided reference.
- Change: adjusted the Hero title into a heavier geometric name line, a lighter `PORTFOLIO` line, and a closer `Jack` signature placement near the end of the portfolio word.
- Follow-up change: increased the `PORTFOLIO` line weight so it feels closer to the reference, moved the `Jack` signature outside the portfolio word so it no longer sits under the letters, and made visible rail thumbnails load eagerly.
- Rail refinement: slowed the photography rail animation by half, added left/right fade masks, removed thumbnail number badges, and added a short-wide viewport adjustment so the rail does not cover the Hero buttons.
- Signature micro-adjustment: moved the `Jack` signature left so the `J` visually touches the right edge of the final `O` in `PORTFOLIO`.
- Demo approval: changed the signature text to `Dsir.` and finalized its placement as the approved Hero first-version demo.
- Copy refinement: changed the Hero statement to `数据驱动创意 · 内容连接用户` with a heavier middle dot separator.
- Verification: `pnpm run build` and `pnpm run lint` both pass; refreshed `docs/codex/hero-screenshot.png`.

## 2026-06-23 - Portfolio Website Brainstorm

- Goal: plan a React + Vite personal portfolio website for operations internship applications, focused on content/new media operations while highlighting photography, visual design, and execution ability.
- Confirmed direction: dark, restrained, premium, technology-forward visual language; Apple-inspired clarity without template-like styling.
- Confirmed structure: full-screen Hero with photography background and rolling work strip; Profile/About hybrid section; Selected Works with photography, design materials, and content operations cases; Core Strengths cards with partial expandable detail; final contact section later.
- Confirmed constraints: PC-first demo only for now; no phone number on site; email and Douyin profile should be included; color system should be decided after selecting final works.
- Source review: read resume file from `F:\大学\实习\内容运营方向.docx` and inspected user-provided reference screenshots.
- Material review: read `F:\作品材料`, generated low-resolution contact sheets under `docs/codex/contact-sheets`, and identified available material categories: photography, commercial shoots, Anker exhibition design materials, with content operations and personal photo folders currently empty.
- Palette exploration: generated `docs/codex/palette-options.png` with three dark visual directions: Pure Silver Blue, Harbor Graphite, and Aviation Steel. Current recommendation is Harbor Graphite.
- Design documentation: wrote `docs/codex/decisions/2026-06-23-portfolio-design.md` and `docs/codex/decisions/2026-06-23-portfolio-prd.md`; added conversation summary under `docs/codex/conversations`.
- Project initialization: created a React + Vite + TypeScript scaffold, configured ESLint, installed dependencies with pnpm, initialized Git, and renamed the branch to `main`.
- Hero implementation: generated web-optimized photography assets under `public/portfolio/photography`, implemented the PC-first Hero page with city-night background, capsule navigation, bilingual title system, photography-only rolling rail, and a full-image lightbox viewer.
- Hero revision: replaced the `WKJ` mark with a cleaner `Jack Wang / Portfolio` wordmark, changed the second title line from the Chinese name to `PORTFOLIO` with a signature-style `Jack`, updated the slogan to `数据驱动创意，内容连接用户。`, and reordered the photography rail with a deterministic mixed sequence so adjacent works are less similar.
- Verification: `pnpm run build` and `pnpm run lint` both pass; captured `docs/codex/hero-screenshot.png`; no source assets in `F:\作品材料` were modified.
