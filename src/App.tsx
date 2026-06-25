import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Mail, X } from "lucide-react";

type PhotoItem = {
  id: string;
  orientation: "landscape" | "portrait";
  width: number;
  height: number;
  thumb: string;
  large: string;
};

type PhotoManifest = {
  hero: {
    src: string;
    sourceName: string;
  };
  items: PhotoItem[];
};

type WorkPlaceholder = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  area: "photo" | "douyin" | "design" | "lseg" | "media" | "growth";
  tone: "blue" | "orange" | "neutral";
};

const fallbackHero = "/portfolio/photography/hero/city-night.jpg";
const email = "zj2020dq@163.com";

const navItems = [
  { label: "Profile", subLabel: "关于我", href: "#profile" },
  { label: "Works", subLabel: "精选项目", href: "#works" },
  { label: "Strengths", subLabel: "个人优势", href: "#strengths" },
  { label: "Contact", subLabel: "联系我", href: "#contact" },
];

const profileStats = [
  { value: "121w", label: "抖音单条最高播放" },
  { value: "8.1w", label: "单条最高获赞" },
  { value: "5000+", label: "内容收藏" },
  { value: "100+", label: "公众号推文" },
  { value: "10+", label: "商业拍摄交付" },
  { value: "50+", label: "校园触点网络" },
];

const profileTimeline = [
  {
    time: "2025.07 - 2025.09",
    title: "LSEG 金融市场部实习生",
    detail: "金融数据产品场景梳理、客户线索整理、资料沉淀与 AI 提效。",
  },
  {
    time: "2024.08 - 2024.09",
    title: "上海欣巴国际市场部实习生",
    detail: "客户沟通跟进、产品宣传册整改、业务报表与市场资料整理。",
  },
  {
    time: "长期进行",
    title: "个人内容创作与商业拍摄",
    detail: "独立完成选题、拍摄、剪辑、发布与客户交付，产出 121w 播放内容。",
  },
  {
    time: "2024.02 - 2025.01",
    title: "美团校园大使",
    detail: "参与本地生活推广，协同 15 人团队搭建触点网络与私域社群。",
  },
  {
    time: "2024.09 - 2026.06",
    title: "爱恩学生会融媒体中心部长",
    detail: "统筹公众号推文、活动宣传、图文排版、视频剪辑与宣传物料制作。",
  },
  {
    time: "2025.09 - 2026.06",
    title: "上海海洋大学摄影协会社长",
    detail: "负责社团运营、校园影像输出、摄影活动策划与品牌资源对接。",
  },
];

const profileTags = ["内容策划", "摄影视觉", "新媒体运营", "设计物料", "AI 工作流"];

const workPlaceholders: WorkPlaceholder[] = [
  {
    id: "photography",
    index: "01",
    title: "Photography Works",
    subtitle: "摄影作品",
    area: "photo",
    tone: "blue",
  },
  {
    id: "douyin",
    index: "02",
    title: "Douyin Content Case",
    subtitle: "抖音内容案例",
    area: "douyin",
    tone: "orange",
  },
  {
    id: "design",
    index: "03",
    title: "Design Materials",
    subtitle: "设计物料",
    area: "design",
    tone: "neutral",
  },
  {
    id: "lseg",
    index: "04",
    title: "LSEG Internship",
    subtitle: "产品与市场支持",
    area: "lseg",
    tone: "blue",
  },
  {
    id: "media",
    index: "05",
    title: "Campus Media Operations",
    subtitle: "融媒体内容运营",
    area: "media",
    tone: "neutral",
  },
  {
    id: "growth",
    index: "06",
    title: "Campus Growth & Community",
    subtitle: "校园增长与社群运营",
    area: "growth",
    tone: "orange",
  },
];

const preferredRailStart = [
  144, 10, 67, 156, 1, 140, 158, 24, 94, 103, 55, 121, 148, 57, 161, 124,
];

function updateEdgeGlow(event: ReactPointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
}

function clearEdgeGlow(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty("--glow-x");
  event.currentTarget.style.removeProperty("--glow-y");
}

function revealDelay(index: number): CSSProperties {
  return { "--reveal-delay": `${index * 80}ms` } as CSSProperties;
}

function buildRailOrder(items: PhotoItem[]) {
  if (items.length === 0) {
    return [];
  }

  const seen = new Set<number>();
  const ordered: PhotoItem[] = [];

  const addIndex = (oneBasedIndex: number) => {
    const index = oneBasedIndex - 1;

    if (index >= 0 && index < items.length && !seen.has(index)) {
      seen.add(index);
      ordered.push(items[index]);
    }
  };

  preferredRailStart.forEach(addIndex);

  for (let step = 0; step < items.length; step += 1) {
    addIndex(((step * 37 + 11) % items.length) + 1);
  }

  return ordered;
}

export function App() {
  const [manifest, setManifest] = useState<PhotoManifest | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);
  const [previewWorkIndex, setPreviewWorkIndex] = useState(0);
  const [revealReady, setRevealReady] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const isProfileCapture =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("capture") === "profile";

  useEffect(() => {
    let isMounted = true;

    fetch("/portfolio/photography/manifest.json")
      .then((response) => response.json() as Promise<PhotoManifest>)
      .then((data) => {
        if (isMounted) {
          setManifest(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setManifest({ hero: { src: fallbackHero, sourceName: "" }, items: [] });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const photos = useMemo(() => manifest?.items ?? [], [manifest]);
  const orderedPhotos = useMemo(() => buildRailOrder(photos), [photos]);
  const heroImage = manifest?.hero.src ?? fallbackHero;
  const railPhotos = useMemo(() => [...orderedPhotos, ...orderedPhotos], [orderedPhotos]);
  const activePhoto = activeIndex === null ? null : orderedPhotos[activeIndex];
  const activePhotoNumber = activeIndex === null ? "" : String(activeIndex + 1).padStart(3, "0");
  const activeWork = activeWorkIndex === null ? null : workPlaceholders[activeWorkIndex];
  const previewWork = workPlaceholders[previewWorkIndex];

  useEffect(() => {
    setRevealReady(true);

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealScopes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-scope]"),
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const scopeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scopeTargets = Array.from(
            entry.target.querySelectorAll<HTMLElement>("[data-reveal]"),
          );

          scopeTargets.forEach((target) => {
            target.classList.toggle("is-visible", entry.isIntersecting);
          });
        });
      },
      { rootMargin: "-8% 0px -18% 0px", threshold: 0 },
    );

    revealScopes.forEach((scope) => scopeObserver.observe(scope));

    return () => scopeObserver.disconnect();
  }, []);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail || railPhotos.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(rail.querySelectorAll<HTMLElement>(".photo-card"));
    let animationFrame = 0;

    if (reduceMotion.matches) {
      cards.forEach((card) => {
        card.style.setProperty("--rail-presence", "1");
        card.style.setProperty("--rail-scale", "1");
      });
      return;
    }

    const smoothStep = (progress: number) => progress * progress * (3 - 2 * progress);

    const updateRailPresence = () => {
      const railBounds = rail.getBoundingClientRect();
      const edgeRange = Math.min(280, railBounds.width * 0.18);

      cards.forEach((card) => {
        const cardBounds = card.getBoundingClientRect();
        const cardCenter = cardBounds.left + cardBounds.width / 2;
        const distanceToVisibleEdge = Math.min(
          cardCenter - railBounds.left,
          railBounds.right - cardCenter,
        );
        const rawPresence = Math.max(0, Math.min(1, distanceToVisibleEdge / edgeRange));
        const presence = smoothStep(rawPresence);

        card.style.setProperty("--rail-presence", presence.toFixed(3));
        card.style.setProperty("--rail-scale", (0.91 + presence * 0.09).toFixed(3));
      });

      animationFrame = window.requestAnimationFrame(updateRailPresence);
    };

    updateRailPresence();

    return () => window.cancelAnimationFrame(animationFrame);
  }, [railPhotos.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null || orderedPhotos.length === 0
            ? current
            : (current + 1) % orderedPhotos.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null || orderedPhotos.length === 0
            ? current
            : (current - 1 + orderedPhotos.length) % orderedPhotos.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, orderedPhotos.length]);

  useEffect(() => {
    if (activeWorkIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveWorkIndex(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeWorkIndex]);

  useEffect(() => {
    if (isProfileCapture || activeIndex !== null) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let isTransitioning = false;

    const easeOutQuint = (progress: number) => 1 - (1 - progress) ** 5;

    const animateTo = (targetY: number) => {
      window.cancelAnimationFrame(animationFrame);

      if (reduceMotion.matches) {
        window.scrollTo(0, targetY);
        return;
      }

      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = Math.min(980, Math.max(620, Math.abs(distance) * 0.72));
      const startTime = performance.now();
      isTransitioning = true;

      const tick = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);
        window.scrollTo(0, startY + distance * easeOutQuint(progress));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
          return;
        }

        isTransitioning = false;
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const handleHeroWheel = (event: WheelEvent) => {
      if (isTransitioning || Math.abs(event.deltaY) < 6) {
        return;
      }

      const profileSection = document.getElementById("profile");
      if (!profileSection) {
        return;
      }

      const profileTop = profileSection.getBoundingClientRect().top + window.scrollY;
      const currentY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const isBeforeProfile = currentY < profileTop - 12;
      const isNearProfileTop =
        currentY >= profileTop - 12 && currentY <= profileTop + viewportHeight * 0.46;

      if (event.deltaY > 0 && isBeforeProfile) {
        event.preventDefault();
        animateTo(profileTop);
        return;
      }

      if (event.deltaY < 0 && isNearProfileTop) {
        event.preventDefault();
        animateTo(0);
      }
    };

    window.addEventListener("wheel", handleHeroWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("wheel", handleHeroWheel);
    };
  }, [activeIndex, isProfileCapture]);

  const showPreviousPhoto = () => {
    setActiveIndex((current) =>
      current === null || orderedPhotos.length === 0
        ? current
        : (current - 1 + orderedPhotos.length) % orderedPhotos.length,
    );
  };

  const showNextPhoto = () => {
    setActiveIndex((current) =>
      current === null || orderedPhotos.length === 0
        ? current
        : (current + 1) % orderedPhotos.length,
    );
  };

  return (
    <main
      className={`${isProfileCapture ? "capture-profile" : ""} ${
        revealReady ? "reveal-ready" : ""
      }`.trim()}
    >
      <header className="nav-shell" aria-label="Primary navigation">
        <a
          className="brand-mark edge-glow"
          href="#top"
          aria-label="Wang Kejie portfolio home"
          onPointerMove={updateEdgeGlow}
          onPointerLeave={clearEdgeGlow}
        >
          <span className="brand-mark__name">Jack Wang</span>
          <span className="brand-mark__divider" aria-hidden="true" />
          <span className="brand-mark__scope">Portfolio</span>
        </a>
        <nav className="nav-links">
          {navItems.map((item) => (
              <a
                className="edge-glow"
                key={item.href}
                href={item.href}
                onPointerMove={updateEdgeGlow}
                onPointerLeave={clearEdgeGlow}
              >
              <span>{item.label}</span>
              <small>{item.subLabel}</small>
            </a>
          ))}
        </nav>
        <a
          className="nav-contact edge-glow"
          href={`mailto:${email}`}
          onPointerMove={updateEdgeGlow}
          onPointerLeave={clearEdgeGlow}
        >
          <Mail size={16} aria-hidden="true" />
          <span>联系我</span>
        </a>
      </header>

      <section className="hero" aria-label="Wang Kejie portfolio hero">
        <img className="hero__background" src={heroImage} alt="" aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__content" id="top">
          <p className="hero__kicker">Content & New Media Operations Portfolio</p>
          <h1 className="hero-title">
            <span>WANG KEJIE</span>
            <span className="hero-title__portfolio">
              <strong>PORTFOLIO</strong>
              <em>Dsir.</em>
            </span>
          </h1>
          <p className="hero__statement">
            <span>数据驱动创意</span>
            <strong aria-hidden="true">·</strong>
            <span>内容连接用户</span>
          </p>
          <div className="hero__actions">
            <a
              className="primary-action edge-glow"
              href="#profile"
              onPointerMove={updateEdgeGlow}
              onPointerLeave={clearEdgeGlow}
            >
              <span>View Selected Work</span>
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a
              className="secondary-action edge-glow"
              href={`mailto:${email}`}
              onPointerMove={updateEdgeGlow}
              onPointerLeave={clearEdgeGlow}
            >
              Contact / 联系我
            </a>
          </div>
        </div>

        <div className="photo-rail" ref={railRef} aria-label="Photography preview rail">
          <div className="photo-rail__scrim" aria-hidden="true" />
          <div className="photo-rail__track">
            {railPhotos.map((photo, index) => {
              const realIndex = index % Math.max(orderedPhotos.length, 1);

              return (
                <button
                  className="photo-card edge-glow"
                  key={`${photo.id}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(realIndex)}
                  onPointerMove={updateEdgeGlow}
                  onPointerLeave={clearEdgeGlow}
                  aria-label={`Open photography work ${realIndex + 1}`}
                >
                  <img src={photo.thumb} alt="" loading={index < 12 ? "eager" : "lazy"} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="profile-section"
        id="profile"
        data-reveal-scope
        aria-label="Profile / 关于我"
      >
        <div className="profile-section__inner">
          <div className="profile-masthead" data-reveal>
            <div>
              <p className="section-kicker">Profile / 关于我</p>
              <h2>
                <span>PROFILE</span>
                <span>EXPERIENCE</span>
                <i aria-hidden="true">↘</i>
              </h2>
              <small>个人经历</small>
            </div>
            <p className="profile-masthead__note">Content / Visual / Execution</p>
          </div>

          <div className="profile-overview">
            <figure
              className="profile-portrait"
              data-reveal
              style={revealDelay(1)}
              onPointerMove={updateEdgeGlow}
              onPointerLeave={clearEdgeGlow}
            >
              <img
                src="/portfolio/profile/portrait-dsc0014.jpg"
                alt="王柯杰站在海岸步道上，背后是城市天际线"
              />
            </figure>

            <div className="profile-panel" data-reveal style={revealDelay(2)}>
              <p className="profile-content__role">Content & New Media Operations Intern</p>
              <h3>
                Hi, I am Wang Kejie.
                <span>王柯杰 / Jack Wang</span>
              </h3>
              <p className="profile-content__intro">
                上海海洋大学市场营销本科在读，目标方向为内容运营、新媒体运营与产品/市场运营。
                我更擅长把内容策划、摄影视觉、设计物料和 AI 工作流串成可落地的运营表达。
              </p>

              <div className="profile-lines" aria-label="Profile information">
                <p>
                  <span>当前身份</span>
                  <strong>上海海洋大学 · 市场营销 · 2027届</strong>
                </p>
                <p>
                  <span>求职方向</span>
                  <strong>内容运营 / 新媒体运营 / 产品市场运营</strong>
                </p>
                <p>
                  <span>实习时间</span>
                  <strong>2026年6月起 · 每周5天 · 6个月及以上</strong>
                </p>
                <p>
                  <span>邮箱</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </div>

              <div className="profile-number-strip" aria-label="Profile highlights">
                {profileStats.slice(0, 3).map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="profile-tags" aria-label="Current focus">
                <span>Now Building</span>
                {profileTags.map((tag) => (
                  <b key={tag}>{tag}</b>
                ))}
              </div>
            </div>
          </div>

          <div className="career-paths" aria-label="Experience paths">
            <article className="career-path" data-reveal style={revealDelay(3)}>
              <div className="career-path__header">
                <span>Internship Path</span>
                <strong>实习经历</strong>
              </div>
              <div className="career-path__rail">
                {profileTimeline.slice(0, 2).map((item) => (
                  <section className="career-node" key={`${item.time}-${item.title}`}>
                    <time>{item.time}</time>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </section>
                ))}
              </div>
            </article>

            <article className="career-path career-path--campus" data-reveal style={revealDelay(4)}>
              <div className="career-path__header">
                <span>Campus Path</span>
                <strong>校内经历</strong>
              </div>
              <div className="career-path__rail">
                {profileTimeline.slice(3).map((item) => (
                  <section className="career-node" key={`${item.time}-${item.title}`}>
                    <time>{item.time}</time>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="works-section"
        id="works"
        data-reveal-scope
        aria-label="Works / 精选项目"
      >
        <div className="works-section__inner">
          <div className="works-masthead" data-reveal>
            <div>
              <p className="section-kicker">Works / 精选项目</p>
              <h2>
                <span>SELECTED</span>
                <span>WORKS</span>
                <i aria-hidden="true">↘</i>
              </h2>
              <small>作品与案例入口</small>
            </div>
            <p className="works-masthead__note">Portfolio / Case / Evidence</p>
          </div>

          <div className="works-layout">
            <div className="works-grid" aria-label="Selected works placeholder grid">
              {workPlaceholders.map((work, index) => (
                <button
                  className={`work-card work-card--${work.area} work-card--${work.tone} edge-glow`}
                  key={work.id}
                  type="button"
                  data-reveal
                  style={revealDelay(index + 1)}
                  onClick={() => setActiveWorkIndex(index)}
                  onFocus={() => setPreviewWorkIndex(index)}
                  onPointerMove={updateEdgeGlow}
                  onPointerEnter={() => setPreviewWorkIndex(index)}
                  onPointerLeave={clearEdgeGlow}
                  aria-label={`Open ${work.title} detail placeholder`}
                >
                  <span className="work-card__index">{work.index}</span>
                  <span className="work-card__ghost" aria-hidden="true" />
                  <span className="work-card__body">
                    <strong>{work.title}</strong>
                    <small>{work.subtitle}</small>
                  </span>
                  <span className="work-card__corner" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>

            <aside
              className="works-modal-preview"
              data-reveal
              style={revealDelay(7)}
              aria-label="Works detail modal wireframe preview"
            >
              <div className="works-modal-preview__bar">
                <span>{previewWork.index}</span>
                <span />
              </div>
              <div className="works-modal-preview__media" />
              <div className="works-modal-preview__copy">
                <span>Preview follows hover</span>
                <strong>{previewWork.title}</strong>
                <p>{previewWork.subtitle}</p>
                <p />
              </div>
              <div className="works-modal-preview__chips">
                <span>Hover</span>
                <span>Click</span>
                <span>Detail</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="section-anchors" aria-label="Future section anchors">
        <span id="strengths">Strengths</span>
        <span id="contact">Contact</span>
      </div>

      {activePhoto && activeIndex !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photography viewer">
          <button
            className="lightbox__close"
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close image viewer"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            type="button"
            onClick={showPreviousPhoto}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} aria-hidden="true" />
          </button>
          <figure className="lightbox__figure">
            <img
              src={activePhoto.large}
              alt={`Photography work ${activeIndex + 1}`}
              className={activePhoto.orientation === "portrait" ? "is-portrait" : "is-landscape"}
            />
            <figcaption>
              <span>Photography Work</span>
              <strong>{activePhotoNumber}</strong>
              <small>
                {activePhoto.width} × {activePhoto.height}
              </small>
            </figcaption>
          </figure>
          <button
            className="lightbox__nav lightbox__nav--next"
            type="button"
            onClick={showNextPhoto}
            aria-label="Next image"
          >
            <ChevronRight size={32} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {activeWork && activeWorkIndex !== null ? (
        <div className="work-detail" role="dialog" aria-modal="true" aria-label="Works detail placeholder">
          <button
            className="work-detail__close"
            type="button"
            onClick={() => setActiveWorkIndex(null)}
            aria-label="Close works detail placeholder"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <section className="work-detail__panel">
            <div className="work-detail__visual">
              <span>{activeWork.index}</span>
            </div>
            <div className="work-detail__content">
              <p>Detail Placeholder</p>
              <h3>{activeWork.title}</h3>
              <small>{activeWork.subtitle}</small>
              <div className="work-detail__lines" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="work-detail__blocks" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
