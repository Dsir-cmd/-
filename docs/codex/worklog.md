# Codex Worklog

## 2026-06-27 - Top Navigation Centering

- Goal: respond to browser feedback that the three center navigation links should be centered relative to the full navigation bar.
- Change: changed the fixed nav shell from a three-column grid to a space-between flex shell, then absolutely centered `.nav-links` at the shell's 50% point so the left brand mark and right contact button no longer offset the center group.
- Navigation compression: removed the Chinese sublabels from the three center nav links and reduced the nav shell, brand capsule, center link, and contact button heights/font sizes so the fixed header feels flatter.
- 16:9 viewport pass: added a 1200px desktop canvas floor for narrow windows, enabling horizontal scrolling below that width instead of crushing the portfolio grid; added short-height rules for Hero, Works, and Strengths so 1366x768 screens avoid navigation overlap and keep the key card layouts visible.
- Hero/Profile scroll snap: refined the wheel snap behavior into a two-step return. Upward scrolling from inside the Profile intro now first snaps to the Profile top, then a later upward input returns to Hero; a 420ms lockout filters wheel/touchpad inertia so one large input does not immediately jump past the Profile title.
- Scroll snap stability: prevented native wheel scrolling while the Hero/Profile snap animation is already running inside the snap zone, so large first wheel inputs cannot leave the page stuck between the two sections.
- Scope rollback: briefly explored applying the same section-boundary snap pattern to all main sections, then reverted it after deciding that lower sections should use normal browser scrolling; the retained snap behavior is only between Hero and Profile.
- Verification: `pnpm run lint` and `pnpm run build` pass; refreshed `docs/codex/strengths-section-check.png` for visual QA.

## 2026-06-27 - Contact Footer Compression

- Goal: shorten the Contact end-cap so the footer feels attached to the bottom of the final viewport instead of becoming a tall separate block.
- Change: converted the Contact section to a vertical flex layout, aligned the footer to the bottom, reduced the `CONTACT` watermark to the same sizing rule as the Strengths watermark, and layered the footer text over the lower half of the watermark.
- Capture workflow: added optional width/height arguments to `docs/codex/capture-section.cjs` and captured `docs/codex/contact-section-check-1328x911.png` to match the in-app browser's approximate viewport.
- QR polish: rebuilt the Douyin QR asset on top of a complete blue/white circular base and inset the original code slightly, so the displayed QR reads as a full circle instead of appearing clipped at the bottom edge.
- Hero CTA fix: changed the Hero `Contact / 联系我` button from a direct `mailto:` link to `#contact`, keeping email actions inside the Contact section.
- Contact copy: changed the secondary Contact action label from `打开抖音` to `抖音主页`.
- Email copy interaction: changed the primary Contact action into a clipboard-copy button that copies `zj2020dq@163.com` and shows a centered `邮箱已复制` toast with a short fade-in/fade-out animation.
- Verification: `pnpm run lint` and `pnpm run build` pass.

## 2026-06-27 - Contact Section Planning

- Goal: plan the final Contact section before implementation.
- Direction: use a sparse full-viewport close with a large left headline and compact right contact panel, following the supplied reference's composition while preserving the current portfolio's dark blue visual system.
- Content: exclude phone number; include email and the supplied Douyin link `https://v.douyin.com/kUAKI4nSODo/`.
- Design artifact: added `docs/codex/contact-layout-reference.svg` as the initial vector layout reference.
- Preview fix: escaped the SVG ampersand entity and exported `docs/codex/contact-layout-reference.png` so the Contact reference can be viewed reliably in the app.
- QR refinement: processed the supplied Douyin circular QR into `docs/codex/douyin-qr-blue-solid.png`, cropping out the poster background and recoloring the purple code marks to a scan-safe portfolio blue. Updated the Contact reference so email and WeChat stay as rows, while the circular QR becomes the card's visual center.
- Implementation: copied the processed QR to `public/portfolio/contact/douyin-qr-blue-solid.png`, implemented the final `Contact / 联系我` section with email, WeChat `Dsir2024`, Douyin QR, mail/Douyin actions, a back-to-start button, and a production-style footer close.
- Verification: `pnpm run lint` and `pnpm run build` pass; captured `docs/codex/contact-section-check.png` for visual QA.
- Navigation refinement: removed the duplicate center `Contact / 联系我` nav item and changed the right-side `联系我` capsule to jump to `#contact`; email actions remain inside the Contact section.
- Contact polish: regenerated the Douyin QR crop with more transparent padding so the circular code is no longer clipped, removed the small caption under the QR, and reduced the contact card's forced height and vertical spacing so it balances better with the left headline.

## 2026-06-27 - Strengths Section Implementation

- Goal: implement the Strengths section using the approved v3 direction.
- Change: added a real `Strengths / 个人优势` page section after Works with five spacious card-only capability entries, avoiding the Works live-preview interaction pattern.
- Interaction: added a dedicated Strengths detail modal so the landing cards stay low-density while metrics, evidence, and related Works move into the popup.
- Visual direction: used dark professional cards, one restrained light-blue highlight card, and abstract glass/geometry marks inspired by the supplied reference without copying its neon-green palette.
- Modal visual alignment: adjusted the fifth Strengths detail modal's `flow` visual to use bottom-based positioning inside the enlarged modal art area, matching the lower placement used by the other Strengths modal visuals.
- Layout refinement: rebalanced the Strengths page density so all five cards fit in the first viewport while the section still reads as a full page; added the blue `Strengths / 个人优势` kicker above the heading to match Profile and Works.
- Verification: `pnpm run lint` and `pnpm run build` pass; captured `docs/codex/strengths-section-check.png` and `docs/codex/strengths-modal-check.png` for visual QA.

## 2026-06-27 - Strengths Section Planning

- Goal: plan the Strengths section before implementation.
- Direction: treat Strengths as a capability evidence system rather than a generic skills list, with five clickable strengths tied to metrics, experiences, and related Works.
- Design artifact: added `docs/codex/strengths-layout-reference.svg` as a vector layout reference with a left proof panel, five capability cards, and modal interaction notes.
- Revision: added `docs/codex/strengths-layout-reference-v2.svg` after feedback to avoid repeating the Works live-preview interaction. The v2 direction uses spacious card-only entries on the page and moves evidence, metrics, and related Works into the modal.
- Visual reference revision: added `docs/codex/strengths-layout-reference-v3.svg`, responding to the supplied reference screenshot by reducing page density, removing explanatory card copy from the landing view, using quieter abstract glass/geometry marks, and changing the heading subtitle to `个人优势`.

## 2026-06-27 - Works Card Browser Feedback

- Goal: respond to the browser comment on Works card 04.
- Change: updated the card 04 Chinese subtitle from `实习经历` to `市场运营经历`, affecting the card, preview panel, and detail modal because they share the same `workItems` data source.
- Verification: `pnpm run build` and `pnpm run lint` pass.

## 2026-06-26 - Internship Ops Case Design

- Goal: redesign Works card 04 as an internship-focused operations case without image-gallery framing, strictly using the two company internship experiences.
- Change: rewrote the 04 case copy toward company operations evidence, added a compact card-level operations diagram, and replaced the default no-image modal treatment with a dedicated internship detail layout.
- Detail layout: split the modal into a company internship block for LSEG and Shanghai Xinba, a visible `2 / 4 / AI` evidence strip, and an operations workflow block covering demand intake, information breakdown, material organization, and collaborative delivery.
- Card refinement: simplified the parent 04 card from a crowded process mini-map into a compact `2 Internships / LSEG / Xinba` evidence badge, changed the Chinese subtitle to `实习经历`, and removed cramped micro-labels from the small-card viewport.
- Card layout fix: changed the 04 badge into a right-edge glass information column that spans the full card height, separating it from the title text and eliminating the previous cropped/empty top-right composition.
- Modal interaction fix: locked background page scrolling while either the Works detail modal or photography lightbox is open, preserving the original scroll position after close; revised the lock to avoid fixed-body top jumps so closing a modal no longer visually returns to Hero before settling back on Works.
- Verification: `pnpm run lint` and `pnpm run build` pass; captured `docs/codex/internship-works-card-check.png` and `docs/codex/internship-modal-check.png` for visual QA.

## 2026-06-26 - Works Preview Panel Stability

- Goal: fix the right-side Works preview panel changing size when hovering cards 02/03.
- Change: locked the Works parent layout to a shared wall height, gave the right preview card a fixed internal grid, and constrained preview copy with line clamping so longer titles/summaries no longer resize the card.
- Verification: `pnpm run lint` and `pnpm run build` pass; captured `docs/codex/works-preview-fixed-check.png` for visual QA.
- Follow-up: regenerated the card-02 red dance cover with a tighter source-image crop, reducing empty black stage above the fabric while keeping the dancer and red cloth intact.

## 2026-06-26 - Works Parent Card Cover Update

- Goal: replace the parent Works cards 01-03 with stronger source-image covers from the user's material folder rather than clipboard screenshots.
- Change: exported card-specific covers from `F:\作品材料\works materials` for Yangshan Port night photography, the red dance commercial shoot, and the right-side Anker Prime panel from the first design-material image.
- Crop handling: generated cover assets with subject-safe framing, especially preserving the full red dancer and fabric in card 02 while using a right-panel crop for card 03.
- Verification: `pnpm run lint` and `pnpm run build` pass; captured `docs/codex/works-cover-update-check.png` for visual QA.

## 2026-06-26 - Code Hygiene Pass

- Goal: inspect the current portfolio code after multiple design iterations and remove obvious stale or invalid frontend leftovers.
- Cleanup: removed the unused `stage-placeholder` CSS block left from the earlier placeholder section, removed unused lightbox orientation class output, and aligned the Works carousel arrow hover background with the current `edge-glow` pointer variables.
- Verification: `pnpm run lint` and `pnpm run build` pass; CSS class usage comparison reports no obvious unused class selectors.
- Note: QA screenshots and asset-preparation scripts under `docs/codex` are intentionally retained as project records and reproducible helper files, not runtime code.

## 2026-06-27 - Douyin Works Case Modal

- Goal: build the Works page `Douyin Content Case` detail modal from the newly provided content-operations materials.
- Materials: added the Douyin pinned-works screenshot and user comment evidence images under `public/portfolio/works/content`; retained the backend analytics screenshot only as a source record under `docs/codex/douyin-viral-backend-source.png`.
- Content: rewrote the Douyin work item around a niche ancient-architecture topic, high-contrast post-production strategy, and comment/data proof of the resulting attention.
- Modal design: created a dedicated full-report modal for the Douyin case instead of the generic left/right Works detail layout, with a hero statement, pinned-work evidence, three-step content logic, backend metrics redrawn as data visualization, comment proof, and a conclusion.
- Verification: `pnpm run build` and `pnpm run lint` pass after adding the bundled Node runtime to PATH for the command; captured `docs/codex/douyin-case-modal-check.png` and `docs/codex/douyin-case-modal-data-check.png` for visual QA.
- Next: review the Douyin modal in the live browser and tune copy/spacing if the user wants a stronger or shorter presentation.

## 2026-06-27 - Douyin Comment Proof Privacy Pass

- Goal: incorporate the newly provided Douyin comment screenshot while keeping the comment proof section visually consistent and anonymized.
- Materials: moved the raw comment screenshots into `docs/codex/douyin-comment-source-01.png`, `docs/codex/douyin-comment-source-02.png`, and `docs/codex/douyin-comment-source-03.png` as source records; removed unmasked comment screenshots from `public/portfolio/works/content`.
- Change: replaced screenshot-based comment proof with two matched groups, each containing two anonymous comment cards with masked avatar/name treatment and preserved comment meaning, location age, and like signal.
- Verification: `pnpm run build` and `pnpm run lint` pass; captured `docs/codex/douyin-case-comment-groups-check.png` and confirmed the modal renders two groups, four cards, and zero raw comment images in the comment grid.

## 2026-06-27 - Douyin Modal Hero Alignment

- Goal: respond to browser feedback that the Douyin modal hero should align the left text block and right metric card on the same horizontal start line.
- Change: top-aligned the Douyin hero grid, centered the metric content inside its card, and rewrote the headline into two fixed semantic lines: `用后期反差放大 / 小众建筑的传播记忆点`.
- Verification: `pnpm run build` and `pnpm run lint` pass; captured `docs/codex/douyin-case-hero-alignment-check.png` and confirmed the left label and right metric card share the same top coordinate.
- Follow-up: shortened the pinned-works evidence heading to `置顶内容建立账号第一眼认知` and kept it on one line by removing the narrow text constraint.

## 2026-06-26 - Works Modal Gallery Checkpoint

- Goal: save the current Works modal gallery refinement as the daily Git checkpoint.
- Change: ingested the user-provided Works gallery materials for cases 01-03, wired the modal carousel to the generated manifest, randomized case 01 order per open, and kept cases 02/03 in numeric order.
- Layout fix: constrained the Works detail modal within the viewport, preserved visible carousel controls, and changed gallery images to a bounded contain-blur display stage so portrait and wide assets show completely instead of being cropped.
- Verification: `pnpm run lint` and `pnpm run build` pass; captured modal fit check screenshots under `docs/codex`.
- Next: continue reviewing Works modal content/detail quality and add missing project proof materials when provided.

## 2026-06-25 - Section Reveal Motion

- Goal: add a site-level section-enter motion so content surfaces upward when the user navigates or scrolls into major tabs such as Profile and Works.
- Change: added an IntersectionObserver-based reveal system that keeps content visible by default, then applies upward fade/blur/scale motion only after the page is ready.
- Applied reveal choreography to the Profile masthead, portrait, profile panel, career paths, Works masthead, Works cards, and Works preview panel with staggered delays.
- Reveal reset: changed the reveal trigger from one-time element observation to section-scoped observation, so leaving Profile or Works resets their child reveal states and returning to the section replays the upward entrance motion.
- Motion safety: preserved reduced-motion behavior and kept hover transforms on Works cards compatible with the reveal transform.
- Capture workflow: extended the section capture wait after scroll so screenshots are taken after the reveal motion settles instead of mid-animation.
- Verification: `pnpm run lint` and `pnpm run build` both pass; refreshed `docs/codex/works-reveal-screenshot.png` for visual QA.

## 2026-06-25 - Works Content Pass

- Goal: replace the Works wireframe placeholders with currently available portfolio content and identify missing materials for later supplementation.
- Material processing: generated contact sheets for commercial shooting and Anker design materials, then exported web-optimized Works assets under `public/portfolio/works`.
- Works content: updated the six Works entries to Photography Archive, Commercial Shooting, Design Materials, Douyin Content Case, Internship Ops Cases, and Campus Operations.
- Works refinement: swapped Douyin Content Case and Internship Ops Cases on the parent Works grid, placing Internship into the smaller 04 information card because it currently lacks image proof, and moving Douyin into the larger 05 card.
- Works grid refinement: revised the parent Works layout back toward an asymmetric portfolio wall, preserving the earlier collage rhythm while enlarging the 04 Internship card enough to keep its title readable.
- Works modal refinement: replaced the 1/2/3 case detail mosaic gallery with a full-height image carousel, including automatic slide advance, arrow/dot controls, keyboard arrow support, and a 10-second pause after user selection before autoplay resumes.
- Works modal image-fit refinement: added per-image display modes and switched current gallery slides to a full-image `contain-blur` treatment, keeping horizontal photography and design materials complete while using a blurred enlarged copy of the same image to fill the surrounding stage.
- Works material ingestion: exported the user-provided `F:\作品材料\works materials` folders into `public/portfolio/works/gallery`, generated `gallery-manifest.json`, wired cases 01/02/03 to the new manifest, randomized case 01 order on every modal open, and preserved numeric ordering for cases 02 and 03.
- Works modal fit fix: constrained the modal to the viewport, moved overflow to the right-side content column, and changed `contain-blur` images to fit inside a bounded display-stage safe area so portrait slides in cases 01/02 no longer crop vertically and carousel controls remain visible.
- Interaction content: replaced the right preview panel and click detail modal with real cover images, summaries, metrics, process notes, tags, and per-case missing-material notes.
- Documentation: added `docs/codex/works-materials-gap-list.md` as the running checklist for assets and proof materials still needed from the user.
- Verification: `pnpm run lint` and `pnpm run build` both pass; captured `docs/codex/works-content-screenshot.png`.

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
