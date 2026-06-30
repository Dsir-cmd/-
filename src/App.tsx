import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ExternalLink, Mail, X } from "lucide-react";

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

type StrengthItem = {
  id: string;
  index: string;
  title: string;
  english: string;
  category: "core" | "system";
  tone: "dark" | "blue" | "light";
  visual: "spark" | "lens" | "orbit" | "stack" | "flow";
  summary: string;
  metrics: Array<{ value: string; label: string }>;
  evidence: string[];
  relatedWorks: string[];
};

type WorkGalleryItem = NonNullable<WorkItem["gallery"]>[number];

type WorkGalleryManifest = Record<"01" | "02" | "03", WorkGalleryItem[]>;

const fallbackHero = "/portfolio/photography/hero/city-night.jpg";
const email = "zj2020dq@163.com";
const wechat = "Dsir2024";
type OverlayKind = "photo" | "work" | "strength";
const overlayExitDurationMs = 240;
const douyinUrl = "https://v.douyin.com/kUAKI4nSODo/";

const navItems = [
  { label: "Profile", subLabel: "关于我", href: "#profile" },
  { label: "Works", subLabel: "精选项目", href: "#works" },
  { label: "Strengths", subLabel: "个人优势", href: "#strengths" },
];

const profileStats = [
  { value: "Observe", label: "从真实场景里找内容入口" },
  { value: "Shape", label: "把信息整理成清晰表达" },
  { value: "Deliver", label: "让作品可以被使用和复盘" },
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

const strengthItems: StrengthItem[] = [
  {
    id: "content-strategy",
    index: "01",
    title: "内容策略主导力",
    english: "Content Strategy",
    category: "core",
    tone: "dark",
    visual: "spark",
    summary: "能从选题、表达、发布节奏和数据反馈出发，把内容从单次创作推进为可复用的传播方法。",
    metrics: [
      { value: "121w", label: "抖音单条最高播放" },
      { value: "8.1w", label: "单条最高获赞" },
      { value: "100+", label: "公众号推文" },
    ],
    evidence: ["个人抖音内容账号", "学生会融媒体中心内容统筹", "活动宣传与图文排版"],
    relatedWorks: ["Douyin Content Case", "Campus Operations"],
  },
  {
    id: "visual-storytelling",
    index: "02",
    title: "摄影视觉表达",
    english: "Visual Storytelling",
    category: "core",
    tone: "dark",
    visual: "lens",
    summary: "能用构图、光影、现场观察和后期审美建立内容质感，并把视觉产出转化为作品或客户交付。",
    metrics: [
      { value: "173", label: "已接入摄影作品" },
      { value: "10+", label: "商业拍摄交付" },
      { value: "3", label: "商业拍摄场景" },
    ],
    evidence: ["个人摄影作品库", "商业拍摄交付", "摄影协会社长经历"],
    relatedWorks: ["Photography Archive", "Commercial Shooting"],
  },
  {
    id: "ai-data",
    index: "03",
    title: "AI 与数据提效",
    english: "AI & Data",
    category: "system",
    tone: "dark",
    visual: "orbit",
    summary: "能把分散资料、字段、客户线索和业务信息拆解归类，再用 AI 与工具提升沉淀效率。",
    metrics: [
      { value: "1", label: "AI 提效流程" },
      { value: "4", label: "信息资产类型" },
      { value: "30+", label: "金融指标字段" },
    ],
    evidence: ["LSEG 产品资料整理", "客户线索与字段说明归纳", "运营资料结构化沉淀"],
    relatedWorks: ["Internship Ops Cases"],
  },
  {
    id: "market-ops",
    index: "04",
    title: "市场运营统筹",
    english: "Market Operations",
    category: "system",
    tone: "dark",
    visual: "stack",
    summary: "能接住真实市场部门和校园场景里的需求，把资料、物料、线索和协作流程整理成可执行动作。",
    metrics: [
      { value: "2", label: "市场部门实习" },
      { value: "50+", label: "校园触点" },
      { value: "15", label: "协同团队" },
    ],
    evidence: ["LSEG 金融市场部实习", "上海欣巴国际市场部实习", "美团校园大使触点运营"],
    relatedWorks: ["Internship Ops Cases", "Campus Operations"],
  },
  {
    id: "cross-functional",
    index: "05",
    title: "跨角色协同",
    english: "Cross-functional Delivery",
    category: "system",
    tone: "light",
    visual: "flow",
    summary: "能在内容、视觉、市场和社群之间切换语言，把想法翻译成团队可执行、可复盘的交付。",
    metrics: [
      { value: "5", label: "能力模块连接" },
      { value: "6", label: "经历与作品入口" },
      { value: "1", label: "完整交付闭环" },
    ],
    evidence: ["内容生产与活动宣传协同", "设计物料与运营目标对齐", "跨团队执行和反馈整理"],
    relatedWorks: ["Design Materials", "Campus Operations", "Internship Ops Cases"],
  },
];

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
      "以城市建筑、航拍、舞台与自然光影为主的个人摄影作品。集中展示取景判断、构图审美与后期风格控制，已接入首页滚动视觉入口。",
    cover: "/portfolio/works/covers/01-yangshan-port.jpg",
    coverAlt: "上海城市夜景摄影作品",
    metrics: [
      { value: "173", label: "已接入网页图" },
      { value: "4", label: "题材覆盖类型" },
      { value: "100%", label: "独立拍摄后期" },
    ],
    tags: ["摄影视觉", "城市建筑", "航拍", "后期审美"],
    process: ["筛选个人摄影作品", "控制构图、光线与拍摄时机", "通过后期调色统一视觉风格"],
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
      "已完成商业拍摄案例 10 余项，累计收入超万元；覆盖人物产品特写、舞台活动、静态景观等场景，体现从人物、现场到空间细节的拍摄交付能力。",
    cover: "/portfolio/works/covers/02-red-dance.jpg",
    coverAlt: "舞团表演现场商业拍摄作品",
    metrics: [
      { value: "6", label: "拍摄场景覆盖" },
      { value: "10+", label: "商业拍摄交付" },
      { value: "100%", label: "结单率" },
    ],
    tags: ["客户交付", "舞台现场", "人物特写", "空间造景"],
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
    cover: "/portfolio/works/covers/03-anker-prime.jpg",
    coverAlt: "Anker 展会展位视觉设计图",
    metrics: [
      { value: "15", label: "设计素材" },
      { value: "5", label: "物料类型覆盖" },
      { value: "1", label: "展位视觉系统" },
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
    subtitle: "市场运营经历",
    area: "lseg",
    tone: "neutral",
    eyebrow: "Company Ops Evidence",
    summary:
      "两段市场部门实习经历，聚焦客户线索、产品资料、业务报表与宣传物料整理，把真实公司环境中的信息处理、市场支持和跨角色协作转化为运营能力证据。",
    metrics: [
      { value: "2", label: "市场部实习" },
      { value: "4", label: "信息资产类型" },
      { value: "AI", label: "资料提效" },
    ],
    tags: ["客户线索", "产品资料", "业务报表", "宣传册整改", "AI 提效"],
    process: ["接收业务和市场侧需求", "拆解客户、产品和资料信息", "整理成可复用的市场支持资产", "通过 AI 与工具提高资料处理效率"],
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
      "选择非大众熟知的古建筑，以航拍构图和高强度后期拉开“现场与成片”的反差，再用后台数据与评论反馈验证内容传播效果。",
    metrics: [
      { value: "121w", label: "播放量" },
      { value: "8.14w", label: "点赞量" },
      { value: "5050", label: "分享量" },
    ],
    tags: ["小众选题", "后期反差", "图文内容", "数据复盘", "评论洞察"],
    process: ["选择非大众熟知的古建筑题材", "用航拍构图和后期强化虚实反差", "通过后台数据与评论反馈复盘传播点"],
    missing: [],
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
      "围绕校园内容、社群触达、品牌活动与结案复盘，完成从活动策划、H5/推文内容制作、私域社群执行到线下活动反馈的数据化运营闭环。",
    metrics: [
      { value: "100+", label: "公众号推文" },
      { value: "150+", label: "社群沉淀" },
      { value: "3000+", label: "活动触达" },
    ],
    tags: ["内容制作", "社群触达", "线下活动", "品牌合作", "结案复盘"],
    process: ["拆解校园活动目标与用户触点", "制作 H5 长图、推文与活动宣传素材", "联动社群、KOC 与现场执行完成活动反馈"],
    missing: [],
  },
];

const preferredRailStart = [
  144, 10, 67, 156, 1, 140, 158, 24, 94, 103, 55, 121, 148, 57, 161, 124,
];

const internshipCompanies = [
  {
    code: "LSEG",
    role: "路孚特上海金融市场部实习生",
    time: "2025.07 - 2025.09",
    focus: "金融数据产品场景梳理、客户线索整理、资料沉淀与 AI 提效。",
    opsValue: "把复杂金融产品与客户信息整理成可复用的市场支持资料。",
  },
  {
    code: "Simba",
    role: "上海欣巴国际市场部实习生",
    time: "2024.08 - 2024.09",
    focus: "客户沟通跟进、产品宣传册整改、业务报表与市场资料整理。",
    opsValue: "参与产品卖点表达、市场资料更新和客户侧信息同步。",
  },
];

const internshipPreviewCompanies = [
  {
    code: "LSEG",
    role: "金融市场运营",
    scope: "客户线索 / 数据产品资料",
  },
  {
    code: "Simba",
    role: "国际市场运营",
    scope: "宣传册整改 / 业务报表",
  },
];

const internshipPreviewAssets = [
  { value: "Lead", label: "客户线索" },
  { value: "Material", label: "产品资料" },
  { value: "Report", label: "业务报表" },
  { value: "AI", label: "资料提效" },
];

const internshipPreviewFlow = ["需求接收", "信息整理", "协作交付"];

const internshipWorkflow = [
  { title: "需求接收", detail: "理解市场/业务侧需要解决的问题" },
  { title: "信息拆解", detail: "把客户、产品、资料拆成可执行任务" },
  { title: "资料整理", detail: "沉淀线索、报表、宣传册等信息资产" },
  { title: "协作交付", detail: "对齐反馈并支持后续市场动作" },
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

function InternshipCardGraphic() {
  return (
    <span className="work-card__ops-map" aria-hidden="true">
      <span className="work-card__ops-count">
        <b>2</b>
        <small>Internships</small>
      </span>
      <span className="work-card__ops-company">
        <b>LSEG</b>
        <b>Simba</b>
      </span>
    </span>
  );
}

function DouyinCardGraphic() {
  return (
    <span className="work-card__douyin-graphic" aria-hidden="true">
      <img src="/portfolio/works/content/douyin-top-post-card.png" alt="" />
      <span className="work-card__douyin-signal">
        <span className="work-card__douyin-metric">
          <b>121w</b>
          <small>Top post</small>
        </span>
        <span className="work-card__douyin-bars">
          <i />
          <i />
          <i />
        </span>
        <span className="work-card__douyin-proof">
          <b>8.14w</b>
          <b>5050</b>
        </span>
      </span>
    </span>
  );
}

function CampusCardGraphic() {
  return (
    <span className="work-card__campus-graphic" aria-hidden="true">
      <span className="work-card__campus-signal">
        <b>100+</b>
        <small>Posts</small>
      </span>
      <span className="work-card__campus-flow">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

const previewMetricLabels: Partial<Record<WorkItem["id"], string[]>> = {
  photography: ["网页图", "题材覆盖", "独立后期"],
  commercial: ["场景覆盖", "交付案例", "结单率"],
  design: ["素材", "类型", "系统"],
};

const previewSummaryOverrides: Partial<Record<WorkItem["id"], string>> = {
  commercial: "已完成商业拍摄案例10余项，累计收入超万元，体现从人物，现场到空间细节的拍摄交付能力。",
};

function getPreviewMetrics(work: WorkItem) {
  const labels = previewMetricLabels[work.id];

  return work.metrics.map((metric, index) => ({
    ...metric,
    label: labels?.[index] ?? metric.label,
  }));
}

function WorksPreviewVisual({ work }: { work: WorkItem }) {
  if (work.id === "photography") {
    return (
      <div className="works-preview works-preview--photography">
        <figure className="works-preview__image">
          <img src={work.cover ?? ""} alt={work.coverAlt ?? ""} />
        </figure>
        <div className="works-preview__metric-row">
          {getPreviewMetrics(work).map((metric) => (
            <span key={`${metric.value}-${metric.label}`}>
              <b>{metric.value}</b>
              <small>{metric.label}</small>
            </span>
          ))}
        </div>
        <div className="works-preview__copy">
          <span>{work.eyebrow}</span>
          <strong>{work.title}</strong>
          <p>{work.subtitle}</p>
        </div>
      </div>
    );
  }

  if (work.id === "commercial") {
    return (
      <div className="works-preview works-preview--commercial">
        <figure className="works-preview__image">
          <img src="/portfolio/works/commercial/stage-solo-preview-cropped.jpg" alt={work.coverAlt ?? ""} />
        </figure>
        <div className="works-preview__metric-stack">
          {getPreviewMetrics(work).map((metric) => (
            <span key={`${metric.value}-${metric.label}`}>
              <b>{metric.value}</b>
              <small>{metric.label}</small>
            </span>
          ))}
        </div>
        <div className="works-preview__copy">
          <span>{work.eyebrow}</span>
          <strong>{work.title}</strong>
          <p>{previewSummaryOverrides[work.id] ?? work.summary}</p>
        </div>
      </div>
    );
  }

  if (work.id === "design") {
    return (
      <div className="works-preview works-preview--design">
        <div className="works-preview__design-board" aria-hidden="true">
          <figure className="works-preview__design-hero">
            <img src="/portfolio/works/design/preview-booth-center.jpg" alt="" />
          </figure>
          <div className="works-preview__design-metrics">
            {getPreviewMetrics(work).map((metric) => (
              <span key={`${metric.value}-${metric.label}`}>
                <b>{metric.value}</b>
                <small>{metric.label}</small>
              </span>
            ))}
          </div>
          <div className="works-preview__design-system">
            <span>Visual Identity</span>
            <i />
            <span>Exhibition Material</span>
          </div>
        </div>
        <div className="works-preview__copy">
          <span>{work.eyebrow}</span>
          <strong>{work.title}</strong>
          <p>{work.summary}</p>
        </div>
      </div>
    );
  }

  if (work.id === "internship") {
    return (
      <div className="works-preview works-preview--internship">
        <div className="works-preview__internship-companies">
          {internshipPreviewCompanies.map((company) => (
            <article key={company.code}>
              <b>{company.code}</b>
              <strong>{company.role}</strong>
              <small>{company.scope}</small>
            </article>
          ))}
        </div>
        <div className="works-preview__internship-assets" aria-label="Internship information assets">
          {internshipPreviewAssets.map((asset) => (
            <span key={asset.value}>
              <b>{asset.value}</b>
              <small>{asset.label}</small>
            </span>
          ))}
        </div>
        <div className="works-preview__internship-flow">
          {internshipPreviewFlow.map((step, index) => (
            <span key={step}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              {step}
            </span>
          ))}
        </div>
        <div className="works-preview__metric-row">
          {work.metrics.map((metric) => (
            <span key={`${metric.value}-${metric.label}`}>
              <b>{metric.value}</b>
              <small>{metric.label}</small>
            </span>
          ))}
        </div>
        <div className="works-preview__copy">
          <span>{work.eyebrow}</span>
          <strong>{work.title}</strong>
          <p>{work.summary}</p>
        </div>
      </div>
    );
  }

  if (work.id === "douyin") {
    return (
      <div className="works-preview works-preview--douyin">
        <div className="works-preview__douyin-hero">
          <figure>
            <img src="/portfolio/works/content/douyin-top-post-card.png" alt="" />
          </figure>
          <div>
            <span>Top Post</span>
            <b>121w</b>
            <small>天镜阁图文播放</small>
          </div>
        </div>
        <div className="works-preview__douyin-data">
          <span>
            <b>8.14w</b>
            <small>点赞量</small>
          </span>
          <span>
            <b>5050</b>
            <small>分享量</small>
          </span>
          <span>
            <b>446</b>
            <small>评论量</small>
          </span>
        </div>
        <div className="works-preview__douyin-proof">
          <span>Comment Proof</span>
          <p>评论区围绕“现场与成片反差”展开讨论，证明视觉处理本身成为传播点。</p>
          <div>
            <small>现场反差</small>
            <small>后期质感</small>
          </div>
        </div>
        <div className="works-preview__copy">
          <span>{work.eyebrow}</span>
          <strong>{work.title}</strong>
          <p>{work.summary}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="works-preview works-preview--campus">
      <div className="works-preview__metric-row">
        {work.metrics.map((metric) => (
          <span key={`${metric.value}-${metric.label}`}>
            <b>{metric.value}</b>
            <small>{metric.label}</small>
          </span>
        ))}
      </div>
      <div className="works-preview__campus-board">
        <div className="works-preview__campus-flow">
          <span>
            <i>01</i>
            <b>内容制作</b>
            <small>推文 / H5 / 海报</small>
          </span>
          <span>
            <i>02</i>
            <b>社群触达</b>
            <small>私域群 / KOC</small>
          </span>
          <span>
            <i>03</i>
            <b>线下执行</b>
            <small>签到 / 体验 / 记录</small>
          </span>
          <span>
            <i>04</i>
            <b>结案复盘</b>
            <small>数据 / 反馈 / 报告</small>
          </span>
        </div>
        <div className="works-preview__campus-bars" aria-label="校园运营执行数据">
          <span>
            <b>活动群起量</b>
            <i style={{ "--bar": "64%" } as CSSProperties} />
            <small>50-100</small>
          </span>
          <span>
            <b>社群增长</b>
            <i style={{ "--bar": "78%" } as CSSProperties} />
            <small>83-150</small>
          </span>
          <span>
            <b>KOC 覆盖</b>
            <i style={{ "--bar": "100%" } as CSSProperties} />
            <small>3000+</small>
          </span>
        </div>
        <div className="works-preview__campus-output">
          <span>推文</span>
          <span>社群</span>
          <span>现场</span>
          <span>复盘</span>
        </div>
      </div>
      <div className="works-preview__copy">
        <span>{work.eyebrow}</span>
        <strong>{work.title}</strong>
        <p>{work.summary}</p>
      </div>
    </div>
  );
}

function InternshipDetailVisual() {
  return (
    <div className="internship-detail-visual" aria-label="Internship operations workflow">
      <div className="internship-detail-visual__header">
        <span>Company Internship</span>
        <strong>Market Support Flow</strong>
      </div>
      <div className="internship-detail-visual__nodes">
        {internshipWorkflow.map((step, index) => (
          <div key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{step.title}</b>
          </div>
        ))}
      </div>
      <div className="internship-detail-visual__assets">
        <span>Lead</span>
        <span>Material</span>
        <span>Report</span>
        <span>AI</span>
      </div>
    </div>
  );
}

function InternshipDetailContent({ activeWork }: { activeWork: WorkItem }) {
  return (
    <>
      <p>{activeWork.eyebrow}</p>
      <h3>{activeWork.title}</h3>
      <small>{activeWork.subtitle}</small>
      <strong className="work-detail__lead">{activeWork.summary}</strong>

      <div className="internship-proof-strip" aria-label="Internship evidence metrics">
        {activeWork.metrics.map((metric) => (
          <div key={`${metric.value}-${metric.label}`}>
            <b>{metric.value}</b>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="internship-detail-block">
        <span>Company Internship / 公司实习经验</span>
        <div className="internship-company-list">
          {internshipCompanies.map((company) => (
            <article key={company.code}>
              <div>
                <b>{company.code}</b>
                <time>{company.time}</time>
              </div>
              <h4>{company.role}</h4>
              <p>{company.focus}</p>
              <strong>{company.opsValue}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="internship-detail-block">
        <span>Ops Workflow / 运营协作方式</span>
        <div className="internship-workflow-list">
          {internshipWorkflow.map((step, index) => (
            <article key={step.title}>
              <em>{String(index + 1).padStart(2, "0")}</em>
              <b>{step.title}</b>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="work-detail__tags">
        {activeWork.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </>
  );
}

const douyinStrategySteps = [
  {
    label: "小众题材",
    title: "避开大众景点",
    detail: "选择非大众熟知的古建筑，让内容先具备陌生感和可讨论性。",
  },
  {
    label: "后期反差",
    title: "制造非现实质感",
    detail: "通过航拍构图、色彩和后期处理，把真实建筑转译成近似游戏建模的视觉记忆点。",
  },
  {
    label: "评论传播",
    title: "让差异成为话题",
    detail: "评论区围绕“现场与成片差异”展开讨论，反向证明反差策略抓住了注意力。",
  },
];

const douyinEngagementMetrics = [
  { label: "点赞量", value: "8.14万", rate: "6.73%", bar: 100 },
  { label: "收藏量", value: "5312", rate: "0.44%", bar: 18 },
  { label: "分享量", value: "5050", rate: "0.42%", bar: 17 },
  { label: "评论量", value: "446", rate: "0.04%", bar: 10 },
];

const douyinCommentGroups = [
  {
    title: "现场反差反馈",
    note: "用户把成片效果与现实现场进行对比，反差本身成为讨论点。",
    comments: [
      {
        text: "你一p我一p，到了现场全懵逼",
        meta: "1年前 · 广东",
        action: "56 赞",
      },
      {
        text: "p成海中建筑了",
        meta: "1年前 · 福建",
        action: "0 赞",
      },
    ],
  },
  {
    title: "后期质感反馈",
    note: "用户把后期风格联想到游戏建模，说明视觉处理形成了可识别记忆点。",
    comments: [
      {
        text: "后期又不老实了 😁",
        meta: "1年前 · 湖北",
        action: "3 赞",
      },
      {
        text: "不开玩笑像游戏里的建模 🌚",
        meta: "1年前 · 安徽",
        action: "6 赞",
      },
    ],
  },
];

const campusH5Screens = [
  { src: "/portfolio/works/campus/h5-01.jpg", label: "传统文化主题" },
  { src: "/portfolio/works/campus/h5-02.jpg", label: "活动总结长图" },
  { src: "/portfolio/works/campus/h5-03.jpg", label: "节日主题推文" },
  { src: "/portfolio/works/campus/h5-04.jpg", label: "海纳新声活动" },
  { src: "/portfolio/works/campus/h5-05.jpg", label: "赛事报名页面" },
  { src: "/portfolio/works/campus/h5-06.jpg", label: "返乡金秋活动" },
];

const campusFlowSteps = [
  { step: "01", title: "活动策划", detail: "把品牌目标拆成校园用户能参与的活动主题、预算、物料和执行节奏。" },
  { step: "02", title: "内容生产", detail: "输出 H5 长图、推文、海报、社群话术与活动说明，统一传播入口。" },
  { step: "03", title: "社群触达", detail: "联动 KOC、校园墙、朋友圈和私域群，制造第一轮报名和讨论。" },
  { step: "04", title: "现场执行", detail: "完成签到、产品体验、拍摄记录、互动引导和现场素材回收。" },
  { step: "05", title: "复盘沉淀", detail: "整理参与人数、发布数据、社群增长和反馈材料，形成结案报告。" },
];

const campusMeituanProofs = [
  "/portfolio/works/campus/meituan-01.jpg",
  "/portfolio/works/campus/meituan-02.jpg",
  "/portfolio/works/campus/meituan-03.jpg",
  "/portfolio/works/campus/meituan-04.jpg",
  "/portfolio/works/campus/meituan-05.jpg",
];

const campusMeituanBars = [
  { label: "活动群起量", value: "50→100", bar: 62 },
  { label: "权益中心", value: "83→150", bar: 88 },
  { label: "好友沉淀", value: "40→52", bar: 46 },
  { label: "KOC 覆盖", value: "3000+", bar: 100 },
];

const campusFujiPhotos = [
  "/portfolio/works/campus/fuji-04.jpg",
  "/portfolio/works/campus/fuji-02.jpg",
  "/portfolio/works/campus/fuji-03.jpg",
];

const campusFujiBars = [
  { label: "F******e", value: "214", bar: 100 },
  { label: "G******R", value: "198", bar: 92 },
  { label: "6******7", value: "103", bar: 48 },
  { label: "闭******羊", value: "93", bar: 43 },
  { label: "是******a", value: "80", bar: 37 },
];

function DouyinDetailContent({ activeWork }: { activeWork: WorkItem }) {
  return (
    <div className="douyin-case">
      <div className="douyin-case__hero">
        <div>
          <p className="douyin-case__eyebrow">{activeWork.eyebrow}</p>
          <h3>
            <span>用后期反差放大</span>
            <span>小众建筑的传播记忆点</span>
          </h3>
          <strong>{activeWork.summary}</strong>
          <div className="douyin-case__tags">
            {activeWork.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <aside className="douyin-case__hero-metric" aria-label="爆款作品核心数据">
          <span>Top Post</span>
          <b>121w</b>
          <small>播放量 / 天镜阁图文内容</small>
          <time>2025.06.21</time>
        </aside>
      </div>

      <section className="douyin-case__pinned" aria-label="抖音主页置顶作品截图">
        <div>
          <span>Homepage Evidence</span>
          <h4>置顶内容建立账号第一眼认知</h4>
        </div>
        <figure>
          <img
            src="/portfolio/works/content/douyin-pinned-works.png"
            alt="抖音主页置顶作品截图，展示三条置顶内容的播放数据"
          />
        </figure>
      </section>

      <section className="douyin-case__strategy" aria-label="爆款内容逻辑">
        {douyinStrategySteps.map((step, index) => (
          <article key={step.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <small>{step.label}</small>
            <h4>{step.title}</h4>
            <p>{step.detail}</p>
          </article>
        ))}
      </section>

      <section className="douyin-case__data" aria-label="后台数据可视化">
        <div className="douyin-case__data-main">
          <span>Performance</span>
          <b>121万</b>
          <small>播放量</small>
          <p>小众古建筑题材通过强后期风格完成破圈传播，单条图文内容进入百万级曝光。</p>
        </div>
        <div className="douyin-case__bars">
          <div className="douyin-case__section-label">
            <span>Engagement Breakdown</span>
            <small>占播放量比例</small>
          </div>
          {douyinEngagementMetrics.map((metric) => (
            <div className="douyin-case__bar" key={metric.label}>
              <div>
                <b>{metric.label}</b>
                <span>{metric.value}</span>
              </div>
              <i style={{ "--bar": `${metric.bar}%` } as CSSProperties} />
              <small>{metric.rate}</small>
            </div>
          ))}
        </div>
        <div className="douyin-case__retention">
          <span>Swipe Away</span>
          <div className="douyin-case__gauge" style={{ "--loss": "41.44%" } as CSSProperties}>
            <b>41.44%</b>
          </div>
          <p>划走率低于一半，说明封面与题材反差能有效留住第一眼注意力。</p>
        </div>
      </section>

      <section className="douyin-case__comments" aria-label="评论反馈截图">
        <div className="douyin-case__section-label">
          <span>Comment Proof</span>
          <small>评论区验证“反差感”成为传播点</small>
        </div>
        <div className="douyin-case__comment-grid">
          {douyinCommentGroups.map((group) => (
            <article className="douyin-case__comment-group" key={group.title}>
              <div>
                <h4>{group.title}</h4>
                <p>{group.note}</p>
              </div>
              <div className="douyin-case__comment-list">
                {group.comments.map((comment) => (
                  <blockquote className="douyin-comment-card" key={comment.text}>
                    <div className="douyin-comment-card__identity" aria-label="用户头像和昵称已打码">
                      <span aria-hidden="true" />
                      <i aria-hidden="true" />
                    </div>
                    <p>{comment.text}</p>
                    <small>{comment.meta}</small>
                    <div>
                      <span>回复</span>
                      <span>分享</span>
                      <span>{comment.action}</span>
                    </div>
                  </blockquote>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="douyin-case__bottom-tags" aria-label="抖音内容案例能力标签">
        <span>小众选题</span>
        <span>后期反差</span>
        <span>图文内容</span>
        <span>数据复盘</span>
        <span>评论洞察</span>
      </footer>
    </div>
  );
}

function CampusDetailContent({ activeWork }: { activeWork: WorkItem }) {
  return (
    <div className="campus-case">
      <header className="campus-case__hero">
        <div className="campus-case__intro">
          <p className="campus-case__eyebrow">{activeWork.eyebrow}</p>
          <h3>
            <span>把校园活动</span>
            <span>跑成可复盘的运营闭环</span>
          </h3>
          <strong>{activeWork.summary}</strong>
          <div className="campus-case__tags">
            {activeWork.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <aside className="campus-case__metric-stack" aria-label="校园运营核心数据">
          {activeWork.metrics.map((metric) => (
            <div key={`${metric.value}-${metric.label}`}>
              <b>{metric.value}</b>
              <span>{metric.label}</span>
            </div>
          ))}
        </aside>
      </header>

      <section className="campus-case__flow" aria-label="校园运营流程">
        {campusFlowSteps.map((item) => (
          <article key={item.step}>
            <span>{item.step}</span>
            <h4>{item.title}</h4>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="campus-case__h5" aria-label="公众号 H5 长图内容">
        <div className="campus-case__section-head">
          <span>Content Matrix</span>
          <div>
            <h4>公众号内容与活动信息组织</h4>
            <p>围绕节日、赛事、晚会和返乡活动，把主题包装、信息层级、报名入口与视觉节奏组织成可传播的长图内容。</p>
          </div>
        </div>
        <div className="campus-case__h5-strip">
          {campusH5Screens.map((item, index) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.label} />
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{item.label}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="campus-case__split" aria-label="美团校园运营和富士活动复盘">
        <article className="campus-case__meituan">
          <div className="campus-case__section-head">
            <span>Community Growth</span>
            <div>
              <h4>美团校园俱乐部：社群与活动执行</h4>
              <p>从活动计划、KOC 宣发、朋友圈触达到私域社群反馈，形成可追踪的校园增长动作。</p>
            </div>
          </div>
          <div className="campus-case__mini-metrics">
            <div>
              <b>3</b>
              <span>部门协同</span>
            </div>
            <div>
              <b>15</b>
              <span>KOC 宣发</span>
            </div>
            <div>
              <b>3000+</b>
              <span>预估触达</span>
            </div>
          </div>
          <div className="campus-case__proof-wall">
            {campusMeituanProofs.map((src, index) => (
              <img src={src} alt={`美团校园运营执行截图 ${index + 1}`} key={src} />
            ))}
          </div>
          <div className="campus-case__community-window">
            <span>Execution Window</span>
            <small>从活动群、权益中心、好友沉淀到 KOC 覆盖，呈现社群增长链路。</small>
            <div className="campus-case__bar-list" aria-label="美团校园运营增长数据">
              {campusMeituanBars.map((bar) => (
                <div className="campus-case__bar" key={bar.label}>
                  <span>{bar.label}</span>
                  <i style={{ "--bar": `${bar.bar}%` } as CSSProperties} />
                  <b>{bar.value}</b>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="campus-case__fuji">
          <div className="campus-case__section-head">
            <span>Brand Event</span>
            <div>
              <h4>富士 instax：线下体验与内容发酵</h4>
              <p>把产品体验嵌入摄影社团活动，现场体验、照片记录、小红书发布和结案数据形成完整闭环。</p>
            </div>
          </div>
          <div className="campus-case__fuji-grid">
            {campusFujiPhotos.map((src, index) => (
              <img src={src} alt={`富士 instax 校园活动素材 ${index + 1}`} key={src} />
            ))}
          </div>
          <div className="campus-case__fuji-data">
            <div>
              <b>77</b>
              <span>现场参与</span>
            </div>
            <div>
              <b>10</b>
              <span>小红书笔记</span>
            </div>
            <div>
              <b>981</b>
              <span>阅读总量</span>
            </div>
          </div>
          <div className="campus-case__bar-list" aria-label="富士活动小红书阅读数据">
            {campusFujiBars.map((bar) => (
              <div className="campus-case__bar" key={bar.label}>
                <span>{bar.label}</span>
                <i style={{ "--bar": `${bar.bar}%` } as CSSProperties} />
                <b>{bar.value}</b>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="campus-case__bottom-tags" aria-label="校园运营案例能力标签">
        <span>内容制作</span>
        <span>社群触达</span>
        <span>线下执行</span>
        <span>品牌合作</span>
        <span>结案复盘</span>
      </footer>
    </div>
  );
}

function StrengthVisual({ type }: { type: StrengthItem["visual"] }) {
  return (
    <span className={`strength-card__visual strength-card__visual--${type}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function App() {
  const [manifest, setManifest] = useState<PhotoManifest | null>(null);
  const [workGalleryManifest, setWorkGalleryManifest] = useState<WorkGalleryManifest | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);
  const [activeWorkSlide, setActiveWorkSlide] = useState(0);
  const [activeWorkGalleryOverride, setActiveWorkGalleryOverride] = useState<WorkGalleryItem[] | null>(null);
  const [activeStrengthIndex, setActiveStrengthIndex] = useState<number | null>(null);
  const [closingOverlay, setClosingOverlay] = useState<OverlayKind | null>(null);
  const [previewWorkIndex, setPreviewWorkIndex] = useState(0);
  const [revealReady, setRevealReady] = useState(false);
  const [emailToastKey, setEmailToastKey] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const workGalleryManifestRef = useRef<WorkGalleryManifest | null>(null);
  const workGalleryManifestRequestRef = useRef<Promise<WorkGalleryManifest | null> | null>(null);
  const workCarouselPauseUntilRef = useRef(0);
  const emailToastTimeoutRef = useRef<number | null>(null);
  const overlayCloseTimeoutRef = useRef<number | null>(null);
  const isProfileCapture =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("capture") === "profile";

  const cancelOverlayClose = useCallback(() => {
    if (overlayCloseTimeoutRef.current !== null) {
      window.clearTimeout(overlayCloseTimeoutRef.current);
      overlayCloseTimeoutRef.current = null;
    }

    setClosingOverlay(null);
  }, []);

  const requestCloseOverlay = useCallback(
    (kind: OverlayKind) => {
      if (closingOverlay !== null) {
        return;
      }

      cancelOverlayClose();
      setClosingOverlay(kind);
      const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      overlayCloseTimeoutRef.current = window.setTimeout(() => {
        if (kind === "photo") {
          setActiveIndex(null);
        }

        if (kind === "work") {
          setActiveWorkGalleryOverride(null);
          setActiveWorkIndex(null);
        }

        if (kind === "strength") {
          setActiveStrengthIndex(null);
        }

        setClosingOverlay(null);
        overlayCloseTimeoutRef.current = null;
      }, shouldReduceMotion ? 0 : overlayExitDurationMs);
    },
    [cancelOverlayClose, closingOverlay],
  );

  useEffect(() => {
    return () => {
      if (overlayCloseTimeoutRef.current !== null) {
        window.clearTimeout(overlayCloseTimeoutRef.current);
      }
    };
  }, []);

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
  const activeStrength = activeStrengthIndex === null ? null : strengthItems[activeStrengthIndex];
  const previewWork = workItems[previewWorkIndex];
  const activeWorkGallery = activeWorkGalleryOverride ?? activeWork?.gallery ?? [];
  const hasOpenOverlay = activeIndex !== null || activeWorkIndex !== null || activeStrengthIndex !== null;

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

  useEffect(
    () => () => {
      if (emailToastTimeoutRef.current !== null) {
        window.clearTimeout(emailToastTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!hasOpenOverlay) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverscroll = document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousOverscroll;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [hasOpenOverlay]);

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
        requestCloseOverlay("photo");
        return;
      }

      if (closingOverlay === "photo") {
        return;
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
  }, [activeIndex, closingOverlay, orderedPhotos.length, requestCloseOverlay]);

  useEffect(() => {
    if (activeWorkIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestCloseOverlay("work");
        return;
      }

      if (closingOverlay === "work") {
        return;
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
  }, [activeWorkGallery.length, activeWorkIndex, closingOverlay, requestCloseOverlay]);

  useEffect(() => {
    if (activeStrengthIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestCloseOverlay("strength");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeStrengthIndex, requestCloseOverlay]);

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
    if (isProfileCapture || hasOpenOverlay) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let isTransitioning = false;
    let heroReturnLockedUntil = 0;

    const easeOutQuint = (progress: number) => 1 - (1 - progress) ** 5;

    const lockHeroReturnBriefly = () => {
      heroReturnLockedUntil = performance.now() + 420;
    };

    const animateTo = (targetY: number, onComplete?: () => void) => {
      window.cancelAnimationFrame(animationFrame);

      if (reduceMotion.matches) {
        window.scrollTo(0, targetY);
        onComplete?.();
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
        onComplete?.();
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const handleHeroWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 6) {
        return;
      }

      const profileSection = document.getElementById("profile");
      if (!profileSection) {
        return;
      }

      const profileTop = profileSection.getBoundingClientRect().top + window.scrollY;
      const currentY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const snapZoneEnd = profileTop + viewportHeight * 0.46;

      if (isTransitioning) {
        if (currentY <= snapZoneEnd) {
          event.preventDefault();
        }
        return;
      }

      const isBeforeProfile = currentY < profileTop - 12;
      const profileTopTolerance = 14;
      const isAtProfileTop =
        currentY >= profileTop - 12 && currentY <= profileTop + profileTopTolerance;
      const isWithinProfileIntro =
        currentY > profileTop + profileTopTolerance &&
        currentY <= snapZoneEnd;
      const willOvershootProfileTop = currentY + event.deltaY <= profileTop + profileTopTolerance;

      if (event.deltaY > 0 && isBeforeProfile) {
        event.preventDefault();
        animateTo(profileTop, lockHeroReturnBriefly);
        return;
      }

      if (event.deltaY < 0 && isWithinProfileIntro && willOvershootProfileTop) {
        event.preventDefault();
        animateTo(profileTop, lockHeroReturnBriefly);
        return;
      }

      if (event.deltaY < 0 && isAtProfileTop) {
        event.preventDefault();
        if (performance.now() < heroReturnLockedUntil) {
          return;
        }
        animateTo(0);
      }
    };

    window.addEventListener("wheel", handleHeroWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("wheel", handleHeroWheel);
    };
  }, [hasOpenOverlay, isProfileCapture]);

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
    cancelOverlayClose();
    const work = workItems[index];
    const manifest = workGalleryManifest ?? (await loadWorkGalleryManifest());
    const gallery = manifest?.[work.index as "01" | "02" | "03"] ?? work.gallery ?? [];

    setActiveWorkGalleryOverride(work.index === "01" ? shuffleGallery(gallery) : gallery);
    setActiveWorkIndex(index);
  };

  const showEmailCopiedToast = () => {
    setEmailToastKey((current) => current + 1);

    if (emailToastTimeoutRef.current !== null) {
      window.clearTimeout(emailToastTimeoutRef.current);
    }

    emailToastTimeoutRef.current = window.setTimeout(() => {
      setEmailToastKey(0);
      emailToastTimeoutRef.current = null;
    }, 2600);
  };

  const copyEmailToClipboard = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable.");
      }

      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    showEmailCopiedToast();
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
            </a>
          ))}
        </nav>
        <a
          className="nav-contact edge-glow"
          href="#contact"
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
              href="#contact"
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
                  onClick={() => {
                    cancelOverlayClose();
                    setActiveIndex(realIndex);
                  }}
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
              <p className="profile-content__role">Content, Product & New Media Operations</p>
              <h3>
                Hi, I am Wang Kejie.
                <span>王柯杰 / Jack Wang</span>
              </h3>
              <p className="profile-content__intro">
                把内容当作一次完整的体验设计：从选题、画面、节奏到数据反馈，
                都需要被组织成能被理解、被传播、被复用的表达。
              </p>

              <div className="profile-lines" aria-label="Profile information">
                <p>
                  <span>观察切面</span>
                  <strong>内容 × 产品 × 视觉</strong>
                </p>
                <p>
                  <span>创作闭环</span>
                  <strong>策划 / 拍摄 / 设计 / 复盘</strong>
                </p>
                <p>
                  <span>实践场景</span>
                  <strong>新媒体内容、产品表达、商务场景</strong>
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
                  className={`work-card work-card--${work.area} work-card--${work.tone} work-card--case-${work.id} edge-glow`}
                  key={work.id}
                  type="button"
                  data-reveal
                  style={revealDelay(index + 1)}
                  onClick={() => openWorkDetail(index)}
                  onFocus={() => setPreviewWorkIndex(index)}
                  onPointerMove={updateEdgeGlow}
                  onPointerEnter={() => setPreviewWorkIndex(index)}
                  onPointerLeave={clearEdgeGlow}
                  aria-label={`Open ${work.title} detail`}
                >
                  {work.cover ? (
                    <img className="work-card__cover" src={work.cover} alt="" aria-hidden="true" />
                    ) : null}
                    <span className="work-card__index">{work.index}</span>
                    <span className="work-card__ghost" aria-hidden="true" />
                    {work.id === "internship" ? <InternshipCardGraphic /> : null}
                    {work.id === "douyin" ? <DouyinCardGraphic /> : null}
                    {work.id === "campus" ? <CampusCardGraphic /> : null}
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
              className={`works-modal-preview works-modal-preview--${previewWork.id} is-visible`}
              data-reveal
              style={revealDelay(7)}
              aria-label="Works detail modal wireframe preview"
            >
              <WorksPreviewVisual work={previewWork} />
              <div className="works-modal-preview__chips">
                {previewWork.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="strengths-section"
        id="strengths"
        data-reveal-scope
        aria-label="Strengths / 个人优势"
      >
        <div className="strengths-section__inner">
          <div className="strengths-masthead" data-reveal>
            <div>
              <p className="section-kicker">Strengths / 个人优势</p>
              <h2>
                <span>CORE STRENGTHS</span>
                <i aria-hidden="true">↘</i>
              </h2>
              <small>个人优势</small>
            </div>
          </div>

          <div className="strengths-grid" aria-label="Core strengths">
            {strengthItems.map((strength, index) => (
              <button
                className={`strength-card strength-card--${strength.id} strength-card--${strength.tone} edge-glow`}
                key={strength.id}
                type="button"
                data-reveal
                style={revealDelay(index + 1)}
                onClick={() => {
                  cancelOverlayClose();
                  setActiveStrengthIndex(index);
                }}
                onPointerMove={updateEdgeGlow}
                onPointerLeave={clearEdgeGlow}
                aria-label={`Open ${strength.title} detail`}
              >
                <span className="strength-card__topline">
                  <b>{strength.index}</b>
                  <em>{strength.category}</em>
                </span>
                <span className="strength-card__title">
                  {strength.title}
                  <i aria-hidden="true">·</i>
                </span>
                <StrengthVisual type={strength.visual} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className="contact-section"
        id="contact"
        data-reveal-scope
        aria-label="Contact / 联系我"
      >
        <div className="contact-section__inner">
          <div className="contact-hero" data-reveal>
            <p>联系方式</p>
            <h2>
              <span>LET'S BUILD</span>
              <span>CONTENT</span>
              <span>
                THAT TRAVELS
                <i aria-hidden="true">↘</i>
              </span>
            </h2>
            <a
              className="contact-back edge-glow"
              href="#top"
              onPointerMove={updateEdgeGlow}
              onPointerLeave={clearEdgeGlow}
            >
              <span>Back to Start</span>
              <ArrowUp size={17} aria-hidden="true" />
            </a>
          </div>

          <aside
            className="contact-card"
            data-reveal
            style={revealDelay(1)}
            aria-label="Contact information"
          >
            <p>Contact</p>
            <dl className="contact-lines">
              <div>
                <dt>邮箱</dt>
                <dd>
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
              <div>
                <dt>微信</dt>
                <dd>{wechat}</dd>
              </div>
            </dl>

            <div className="contact-qr">
              <span>Douyin QR</span>
              <img
                src="/portfolio/contact/douyin-qr-blue-solid.png"
                alt="抖音账号二维码"
              />
            </div>

            <div className="contact-actions">
              <button
                className="contact-action contact-action--primary edge-glow"
                type="button"
                onClick={copyEmailToClipboard}
                onPointerMove={updateEdgeGlow}
                onPointerLeave={clearEdgeGlow}
              >
                <Mail size={16} aria-hidden="true" />
                <span>发邮件</span>
              </button>
              <a
                className="contact-action contact-action--secondary edge-glow"
                href={douyinUrl}
                target="_blank"
                rel="noreferrer"
                onPointerMove={updateEdgeGlow}
                onPointerLeave={clearEdgeGlow}
              >
                <span>抖音主页</span>
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>

        <footer className="site-footer" data-reveal style={revealDelay(2)}>
          <span>Wang Kejie Portfolio</span>
          <span>Content / Visual / Operations</span>
          <a href={`mailto:${email}`}>{email}</a>
        </footer>
      </section>

      {emailToastKey > 0 ? (
        <div className="copy-toast" key={emailToastKey} role="status" aria-live="polite">
          邮箱已复制
        </div>
      ) : null}

      {activePhoto && activeIndex !== null ? (
        <div
          className={`lightbox${closingOverlay === "photo" ? " is-closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Photography viewer"
        >
          <button
            className="lightbox__close"
            type="button"
            onClick={() => requestCloseOverlay("photo")}
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
        <div
          className={`work-detail${closingOverlay === "work" ? " is-closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Works detail"
        >
          <button
            className="work-detail__close"
            type="button"
            onClick={() => requestCloseOverlay("work")}
            aria-label="Close works detail"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <section
            className={`work-detail__panel ${activeWork.id === "internship" ? "work-detail__panel--internship" : ""} ${
              activeWork.id === "douyin" ? "work-detail__panel--douyin" : ""
            } ${
              activeWork.id === "campus" ? "work-detail__panel--campus" : ""
            }`}
          >
            {activeWork.id === "douyin" ? (
              <DouyinDetailContent activeWork={activeWork} />
            ) : activeWork.id === "campus" ? (
              <CampusDetailContent activeWork={activeWork} />
            ) : (
              <>
                <div className="work-detail__visual">
                  {activeWork.id === "internship" ? (
                    <InternshipDetailVisual />
                  ) : activeWorkGallery.length ? (
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
                  {activeWork.id === "internship" ? (
                    <InternshipDetailContent activeWork={activeWork} />
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}

      {activeStrength && activeStrengthIndex !== null ? (
        <div
          className={`strength-detail${closingOverlay === "strength" ? " is-closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Strength detail"
        >
          <button
            className="strength-detail__close"
            type="button"
            onClick={() => requestCloseOverlay("strength")}
            aria-label="Close strength detail"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <section className={`strength-detail__panel strength-detail__panel--${activeStrength.tone}`}>
            <div className="strength-detail__visual">
              <span>{activeStrength.index}</span>
              <h3>{activeStrength.title}</h3>
              <small>{activeStrength.english}</small>
              <StrengthVisual type={activeStrength.visual} />
            </div>
            <div className="strength-detail__content">
              <p>{activeStrength.category} capability</p>
              <h4>{activeStrength.title}</h4>
              <strong>{activeStrength.summary}</strong>

              <div className="strength-detail__metrics" aria-label="Strength evidence metrics">
                {activeStrength.metrics.map((metric) => (
                  <div key={`${metric.value}-${metric.label}`}>
                    <b>{metric.value}</b>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="strength-detail__block">
                <span>Evidence</span>
                <ul>
                  {activeStrength.evidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="strength-detail__block">
                <span>Related Works</span>
                <div className="strength-detail__chips">
                  {activeStrength.relatedWorks.map((work) => (
                    <b key={work}>{work}</b>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
