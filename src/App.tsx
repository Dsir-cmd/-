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
  const heroImage = manifest?.hero.src ?? fallbackHero;
  const railPhotos = useMemo(() => [...photos, ...photos], [photos]);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];
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
          current === null || photos.length === 0 ? current : (current + 1) % photos.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null || photos.length === 0
            ? current
            : (current - 1 + photos.length) % photos.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, photos.length]);

  const showPreviousPhoto = () => {
    setActiveIndex((current) =>
      current === null || photos.length === 0 ? current : (current - 1 + photos.length) % photos.length,
    );
  };

  const showNextPhoto = () => {
    setActiveIndex((current) =>
      current === null || photos.length === 0 ? current : (current + 1) % photos.length,
    );
  };

  return (
    <main>
      <section className="hero" aria-label="Wang Kejie portfolio hero">
        <img className="hero__background" src={heroImage} alt="" aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />

        <header className="nav-shell" aria-label="Primary navigation">
          <a className="brand-mark" href="#top" aria-label="Wang Kejie portfolio home">
            <span className="brand-mark__symbol">WKJ</span>
            <span className="brand-mark__name">Wang Kejie</span>
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
          <h1>
            <span>WANG KEJIE</span>
            <strong>王柯杰</strong>
          </h1>
          <p className="hero__statement">
            用内容策划、摄影视觉与 AI 工作流，把运营表达做得更清晰、更有辨识度。
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
              const realIndex = index % Math.max(photos.length, 1);

              return (
                <button
                  className="photo-card"
                  key={`${photo.id}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(realIndex)}
                  aria-label={`Open photography work ${realIndex + 1}`}
                >
                  <img src={photo.thumb} alt="" loading="lazy" />
                  <span>{String(realIndex + 1).padStart(3, "0")}</span>
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
