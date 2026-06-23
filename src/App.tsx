import { useEffect, useMemo, useState } from "react";
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

const fallbackHero = "/portfolio/photography/hero/city-night.jpg";
const email = "zj2020dq@163.com";

const navItems = [
  { label: "Profile", subLabel: "关于我", href: "#profile" },
  { label: "Works", subLabel: "精选项目", href: "#works" },
  { label: "Strengths", subLabel: "个人优势", href: "#strengths" },
  { label: "Contact", subLabel: "联系我", href: "#contact" },
];

const preferredRailStart = [
  144, 10, 67, 156, 1, 140, 158, 24, 94, 103, 55, 121, 148, 57, 161, 124,
];

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
    <main>
      <section className="hero" aria-label="Wang Kejie portfolio hero">
        <img className="hero__background" src={heroImage} alt="" aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />

        <header className="nav-shell" aria-label="Primary navigation">
          <a className="brand-mark" href="#top" aria-label="Wang Kejie portfolio home">
            <span className="brand-mark__name">Jack Wang</span>
            <span className="brand-mark__divider" aria-hidden="true" />
            <span className="brand-mark__scope">Portfolio</span>
          </a>
          <nav className="nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                <span>{item.label}</span>
                <small>{item.subLabel}</small>
              </a>
            ))}
          </nav>
          <a className="nav-contact" href={`mailto:${email}`}>
            <Mail size={16} aria-hidden="true" />
            <span>联系我</span>
          </a>
        </header>

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
            数据驱动创意，内容连接用户。
          </p>
          <div className="hero__actions">
            <a className="primary-action" href="#works">
              <span>View Selected Work</span>
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a className="secondary-action" href={`mailto:${email}`}>
              Contact / 联系我
            </a>
          </div>
        </div>

        <div className="photo-rail" aria-label="Photography preview rail">
          <div className="photo-rail__scrim" aria-hidden="true" />
          <div className="photo-rail__track">
            {railPhotos.map((photo, index) => {
              const realIndex = index % Math.max(orderedPhotos.length, 1);

              return (
                <button
                  className="photo-card"
                  key={`${photo.id}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(realIndex)}
                  aria-label={`Open photography work ${realIndex + 1}`}
                >
                  <img src={photo.thumb} alt="" loading={index < 12 ? "eager" : "lazy"} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="stage-placeholder" id="profile" aria-label="Next build stages">
        <div className="stage-placeholder__copy">
          <p>Next Stage</p>
          <h2>Profile, Works, Strengths and Contact will build on this hero system.</h2>
        </div>
        <div className="stage-placeholder__anchors" aria-label="Future section anchors">
          <span id="works">Works</span>
          <span id="strengths">Strengths</span>
          <span id="contact">Contact</span>
        </div>
      </section>

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
    </main>
  );
}
