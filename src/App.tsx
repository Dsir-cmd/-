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

type WorkItem = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  area: "photo" | "douyin" | "design" | "lseg" | "media" | "growth";
  tone: "blue" | "orange" | "neutral";
  eyebrow: string;
  summary: string;
  cover?: string;
  coverAlt?: string;
  metrics: Array<{ value: string; label: string }>;
  tags: string[];
  process: string[];
  missing: string[];
  gallery?: Array<{ src: string; alt: string; displayMode?: "contain-blur" | "cover" }>;
};

type WorkGalleryItem = NonNullable<WorkItem["gallery"]>[number];

type WorkGalleryManifest = Record<"01" | "02" | "03", WorkGalleryItem[]>;

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

const workItems: WorkItem[] = [
  {
    id: "photography",
    index: "01",
    title: "Photography Archive",
    subtitle: "摄影作品集",
    area: "photo",
    tone: "blue",
    eyebrow: "Personal Visual System",
    summary:
      "以城市建筑、航拍、舞台与自然光影为主的个人摄影作品。当前已接入网页图库，可从 Hero 滚动图进入大图浏览。",
    cover: "/portfolio/photography/hero/city-night.jpg",
    coverAlt: "上海城市夜景摄影作品",
    metrics: [
      { value: "173", label: "已接入网页图" },
      { value: "4", label: "主要视觉题材" },
      { value: "Lightbox", label: "大图查看" },
    ],
    tags: ["摄影视觉", "城市建筑", "航拍", "后期审美"],
    process: ["筛选个人摄影作品", "压缩生成网页图与缩略图", "建立滚动预览与大图查看逻辑"],
    missing: ["后续可补充每组摄影作品的主题分组与拍摄说明。"],
    gallery: [
      { src: "/portfolio/photography/large/p144.jpg", alt: "摄影作品精选一", displayMode: "contain-blur" },
      { src: "/portfolio/photography/large/p010.jpg", alt: "摄影作品精选二", displayMode: "contain-blur" },
      { src: "/portfolio/photography/large/p067.jpg", alt: "摄影作品精选三", displayMode: "contain-blur" },
    ],
  },
  {
    id: "commercial",
    index: "02",
    title: "Commercial Shooting",
    subtitle: "商业拍摄交付",
    area: "douyin",
    tone: "orange",
    eyebrow: "Client Delivery",
    summary:
      "已整理慕风戏剧定妆照、舞团表演现场、鱼缸造景实拍三类商业/委托拍摄素材，体现从人物、现场到空间细节的拍摄交付能力。",
    cover: "/portfolio/works/commercial/stage-dance.jpg",
    coverAlt: "舞团表演现场商业拍摄作品",
    metrics: [
      { value: "3", label: "拍摄场景" },
      { value: "98", label: "原始素材已整理" },
      { value: "10+", label: "商业拍摄交付" },
    ],
    tags: ["客户交付", "舞台现场", "定妆照", "空间造景"],
    process: ["沟通拍摄需求与场景", "现场拍摄与构图捕捉", "筛选、调色并交付客户可用素材"],
    missing: ["可补充客户需求 brief、最终交付数量、客户使用场景或授权说明。"],
    gallery: [
      { src: "/portfolio/works/commercial/theatre-portrait.jpg", alt: "戏剧定妆照拍摄作品", displayMode: "contain-blur" },
      { src: "/portfolio/works/commercial/stage-dance.jpg", alt: "舞团表演现场拍摄作品", displayMode: "contain-blur" },
      { src: "/portfolio/works/commercial/aquarium.jpg", alt: "鱼缸造景实拍作品", displayMode: "contain-blur" },
    ],
  },
  {
    id: "design",
    index: "03",
    title: "Design Materials",
    subtitle: "设计物料系统",
    area: "design",
    tone: "neutral",
    eyebrow: "Anker Exhibition Visual",
    summary:
      "围绕 Anker Prime 展会场景整理出的物料与空间视觉方案，包含宣传册、展位正视图、咨询台、产品展示与名片等。",
    cover: "/portfolio/works/design/booth-front.jpg",
    coverAlt: "Anker 展会展位视觉设计图",
    metrics: [
      { value: "15", label: "设计素材" },
      { value: "Booth", label: "展位视觉" },
      { value: "Print", label: "宣传物料" },
    ],
    tags: ["品牌一致性", "展会物料", "版式设计", "产品展示"],
    process: ["梳理品牌与产品信息", "制作展位视觉和宣传物料", "统一颜色、字体和信息层级"],
    missing: ["可补充设计目标、迭代前后对比、物料落地尺寸或真实使用照片。"],
    gallery: [
      { src: "/portfolio/works/design/booth-front.jpg", alt: "Anker 展位正视图", displayMode: "contain-blur" },
      { src: "/portfolio/works/design/brochure-front.jpg", alt: "Anker 产品宣传册正面", displayMode: "contain-blur" },
      { src: "/portfolio/works/design/booth-detail.jpg", alt: "Anker 咨询台细节图", displayMode: "contain-blur" },
    ],
  },
  {
    id: "internship",
    index: "04",
    title: "Internship Ops Cases",
    subtitle: "实习项目沉淀",
    area: "lseg",
    tone: "neutral",
    eyebrow: "Product & Market Support",
    summary:
      "已包含 LSEG 金融市场部与上海欣巴国际市场部两段实习经历，可作为产品资料整理、客户线索、市场资料与 AI 提效能力的运营案例入口。",
    metrics: [
      { value: "2", label: "实习经历" },
      { value: "AI", label: "资料提效" },
      { value: "Market", label: "市场支持" },
    ],
    tags: ["资料沉淀", "客户线索", "产品宣传", "AI 工作流"],
    process: ["整理金融数据产品场景和客户线索", "参与产品宣传册整改和市场资料归档", "沉淀可复用资料并探索 AI 提效"],
    missing: ["可公开的脱敏工作样例", "产品资料整理前后对比", "AI 提效流程截图", "业务报表或宣传册修改记录。"],
  },
  {
    id: "douyin",
    index: "05",
    title: "Douyin Content Case",
    subtitle: "抖音内容案例",
    area: "media",
    tone: "blue",
    eyebrow: "Personal Content Account",
    summary:
      "个人抖音内容账号是目前最明确的新媒体运营证据，可展示从选题、拍摄、剪辑、发布到数据复盘的完整链路。",
    metrics: [
      { value: "121w", label: "单条最高播放" },
      { value: "8.1w", label: "单条最高获赞" },
      { value: "5000+", label: "内容收藏" },
    ],
    tags: ["内容选题", "短视频剪辑", "数据复盘", "个人账号"],
    process: ["确定选题与内容表达角度", "完成拍摄剪辑和发布", "通过播放、点赞、收藏数据复盘内容表现"],
    missing: ["抖音主页链接", "爆款视频截图", "后台数据截图", "选题/脚本/复盘文档。"],
  },
  {
    id: "campus",
    index: "06",
    title: "Campus Operations",
    subtitle: "校园运营案例",
    area: "growth",
    tone: "orange",
    eyebrow: "Media / Growth / Community",
    summary:
      "校园经历可合并展示美团校园大使、爱恩学生会融媒体中心部长、摄影协会社长三条线，体现内容发布、活动宣传、社群触达与资源对接。",
    metrics: [
      { value: "100+", label: "公众号推文" },
      { value: "50+", label: "校园触点" },
      { value: "15", label: "协同团队" },
    ],
    tags: ["校园增长", "融媒体运营", "活动宣传", "社群触达"],
    process: ["统筹推文、活动宣传和物料制作", "协同团队搭建校园触点和私域社群", "负责摄影社团运营与校园影像输出"],
    missing: ["公众号推文/H5截图", "活动海报与现场图", "社群运营数据", "摄影协会活动方案或复盘。"],
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

function shuffleGallery(items: WorkGalleryItem[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  return shuffled;
}

export function App() {
  const [manifest, setManifest] = useState<PhotoManifest | null>(null);
  const [workGalleryManifest, setWorkGalleryManifest] = useState<WorkGalleryManifest | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);
  const [activeWorkSlide, setActiveWorkSlide] = useState(0);
  const [activeWorkGalleryOverride, setActiveWorkGalleryOverride] = useState<WorkGalleryItem[] | null>(null);
  const [previewWorkIndex, setPreviewWorkIndex] = useState(0);
  const [revealReady, setRevealReady] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const workGalleryManifestRef = useRef<WorkGalleryManifest | null>(null);
  const workGalleryManifestRequestRef = useRef<Promise<WorkGalleryManifest | null> | null>(null);
  const workCarouselPauseUntilRef = useRef(0);
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

  useEffect(() => {
    let isMounted = true;

    fetch("/portfolio/works/gallery-manifest.json")
      .then((response) => response.json() as Promise<WorkGalleryManifest>)
      .then((data) => {
        if (isMounted) {
          workGalleryManifestRef.current = data;
          setWorkGalleryManifest(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          workGalleryManifestRef.current = null;
          setWorkGalleryManifest(null);
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
  const activeWork = activeWorkIndex === null ? null : workItems[activeWorkIndex];
  const previewWork = workItems[previewWorkIndex];
  const activeWorkGallery = activeWorkGalleryOverride ?? activeWork?.gallery ?? [];

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
        setActiveWorkGalleryOverride(null);
        setActiveWorkIndex(null);
      }

      if (event.key === "ArrowRight" && activeWorkGallery.length > 1) {
        workCarouselPauseUntilRef.current = Date.now() + 10_000;
        setActiveWorkSlide((current) => (current + 1) % activeWorkGallery.length);
      }

      if (event.key === "ArrowLeft" && activeWorkGallery.length > 1) {
        workCarouselPauseUntilRef.current = Date.now() + 10_000;
        setActiveWorkSlide((current) => (current - 1 + activeWorkGallery.length) % activeWorkGallery.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeWorkGallery.length, activeWorkIndex]);

  useEffect(() => {
    setActiveWorkSlide(0);
    workCarouselPauseUntilRef.current = 0;
  }, [activeWorkIndex]);

  useEffect(() => {
    if (activeWorkIndex === null || activeWorkGallery.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      if (Date.now() < workCarouselPauseUntilRef.current) {
        return;
      }

      setActiveWorkSlide((current) => (current + 1) % activeWorkGallery.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [activeWorkGallery.length, activeWorkIndex]);

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

  const holdWorkCarousel = () => {
    workCarouselPauseUntilRef.current = Date.now() + 10_000;
  };

  const showPreviousWorkSlide = () => {
    if (activeWorkGallery.length <= 1) {
      return;
    }

    holdWorkCarousel();
    setActiveWorkSlide((current) => (current - 1 + activeWorkGallery.length) % activeWorkGallery.length);
  };

  const showNextWorkSlide = () => {
    if (activeWorkGallery.length <= 1) {
      return;
    }

    holdWorkCarousel();
    setActiveWorkSlide((current) => (current + 1) % activeWorkGallery.length);
  };

  const selectWorkSlide = (index: number) => {
    holdWorkCarousel();
    setActiveWorkSlide(index);
  };

  const loadWorkGalleryManifest = async () => {
    if (workGalleryManifestRef.current) {
      return workGalleryManifestRef.current;
    }

    if (!workGalleryManifestRequestRef.current) {
      workGalleryManifestRequestRef.current = fetch("/portfolio/works/gallery-manifest.json")
        .then((response) => response.json() as Promise<WorkGalleryManifest>)
        .then((data) => {
          workGalleryManifestRef.current = data;
          setWorkGalleryManifest(data);
          return data;
        })
        .catch(() => null)
        .finally(() => {
          workGalleryManifestRequestRef.current = null;
        });
    }

    return workGalleryManifestRequestRef.current;
  };

  const openWorkDetail = async (index: number) => {
    const work = workItems[index];
    const manifest = workGalleryManifest ?? (await loadWorkGalleryManifest());
    const gallery = manifest?.[work.index as "01" | "02" | "03"] ?? work.gallery ?? [];

    setActiveWorkGalleryOverride(work.index === "01" ? shuffleGallery(gallery) : gallery);
    setActiveWorkIndex(index);
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
              {workItems.map((work, index) => (
                <button
                  className={`work-card work-card--${work.area} work-card--${work.tone} edge-glow`}
                  key={work.id}
                  type="button"
                  data-reveal
                  style={revealDelay(index + 1)}
                  onClick={() => openWorkDetail(index)}
                  onFocus={() => setPreviewWorkIndex(index)}
                  onPointerMove={updateEdgeGlow}
                  onPointerEnter={() => setPreviewWorkIndex(index)}
                  onPointerLeave={clearEdgeGlow}
                  aria-label={`Open ${work.title} detail placeholder`}
                >
                  {work.cover ? (
                    <img className="work-card__cover" src={work.cover} alt="" aria-hidden="true" />
                  ) : null}
                  <span className="work-card__index">{work.index}</span>
                  <span className="work-card__ghost" aria-hidden="true" />
                  <span className="work-card__body">
                    <em>{work.eyebrow}</em>
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
              <div className="works-modal-preview__media">
                {previewWork.cover ? (
                  <img src={previewWork.cover} alt={previewWork.coverAlt ?? ""} />
                ) : (
                  <div className="works-modal-preview__metric">
                    <strong>{previewWork.metrics[0]?.value}</strong>
                    <span>{previewWork.metrics[0]?.label}</span>
                  </div>
                )}
              </div>
              <div className="works-modal-preview__copy">
                <span>{previewWork.eyebrow}</span>
                <strong>{previewWork.title}</strong>
                <p>{previewWork.subtitle}</p>
                <p>{previewWork.summary}</p>
              </div>
              <div className="works-modal-preview__chips">
                {previewWork.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
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
            onClick={() => {
              setActiveWorkGalleryOverride(null);
              setActiveWorkIndex(null);
            }}
            aria-label="Close works detail placeholder"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <section className="work-detail__panel">
            <div className="work-detail__visual">
              {activeWorkGallery.length ? (
                <div className="work-detail__carousel" aria-label={`${activeWork.title} image gallery`}>
                  <div className="work-detail__track" style={{ "--slide": activeWorkSlide } as CSSProperties}>
                    {activeWorkGallery.map((item) => (
                      <figure
                        className={`work-detail__slide work-detail__slide--${item.displayMode ?? "cover"}`}
                        key={item.src}
                      >
                        {(item.displayMode ?? "cover") === "contain-blur" ? (
                          <img className="work-detail__slide-backdrop" src={item.src} alt="" aria-hidden="true" />
                        ) : null}
                        <img className="work-detail__slide-image" src={item.src} alt={item.alt} />
                      </figure>
                    ))}
                  </div>
                  {activeWorkGallery.length > 1 ? (
                    <div className="work-detail__carousel-controls">
                      <button
                        className="work-detail__carousel-button edge-glow"
                        type="button"
                        onClick={showPreviousWorkSlide}
                        onPointerMove={updateEdgeGlow}
                        onPointerLeave={clearEdgeGlow}
                        aria-label="Previous work image"
                      >
                        <ChevronLeft size={20} aria-hidden="true" />
                      </button>
                      <div className="work-detail__carousel-dots" aria-label="Select work image">
                        {activeWorkGallery.map((item, index) => (
                          <button
                            className={index === activeWorkSlide ? "is-active" : ""}
                            type="button"
                            key={item.src}
                            onClick={() => selectWorkSlide(index)}
                            aria-label={`Show image ${index + 1}`}
                            aria-pressed={index === activeWorkSlide}
                          />
                        ))}
                      </div>
                      <button
                        className="work-detail__carousel-button edge-glow"
                        type="button"
                        onClick={showNextWorkSlide}
                        onPointerMove={updateEdgeGlow}
                        onPointerLeave={clearEdgeGlow}
                        aria-label="Next work image"
                      >
                        <ChevronRight size={20} aria-hidden="true" />
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : activeWork.cover ? (
                <img className="work-detail__hero-image" src={activeWork.cover} alt={activeWork.coverAlt ?? ""} />
              ) : (
                <div className="work-detail__metric-focus">
                  <span>{activeWork.metrics[0]?.value}</span>
                  <small>{activeWork.metrics[0]?.label}</small>
                </div>
              )}
            </div>
            <div className="work-detail__content">
              <p>{activeWork.eyebrow}</p>
              <h3>{activeWork.title}</h3>
              <small>{activeWork.subtitle}</small>
              <strong className="work-detail__lead">{activeWork.summary}</strong>
              <div className="work-detail__metrics" aria-label="Case metrics">
                {activeWork.metrics.map((metric) => (
                  <div key={`${metric.value}-${metric.label}`}>
                    <b>{metric.value}</b>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
              <div className="work-detail__section">
                <span>Process</span>
                <ul>
                  {activeWork.process.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="work-detail__tags">
                {activeWork.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="work-detail__missing">
                <span>待补充资料</span>
                <ul>
                  {activeWork.missing.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
