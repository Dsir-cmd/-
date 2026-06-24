# 2026-06-24 Hero/Profile Checkpoint

## 当前目标

从零搭建王柯杰个人作品集网站的 PC 端 demo，用于内容运营、新媒体运营、产品/市场运营实习求职。整体风格为暗色、高级、克制、科技感，参考 Apple 式清晰与质感，但避免模板感。

## 已完成

- React + Vite + TypeScript 项目已初始化，Git 仓库已建立。
- Hero 第一版已完成并经用户认可：
  - 暗色城市摄影背景。
  - 顶部固定胶囊导航。
  - `WANG KEJIE / PORTFOLIO / Dsir.` 标题组合。
  - 标语为 `数据驱动创意 · 内容连接用户`。
  - 底部摄影作品滚动轨道，仅放摄影作品，顺序已打乱。
  - 摄影作品可点击打开大图灯箱。
  - Hero 交互按钮与摄影卡片已加入鼠标跟随边框发光效果。
- Profile 第一版已完成并进入可继续微调状态：
  - 采用参考图方向的 `PROFILE EXPERIENCE / 个人经历` 视觉结构。
  - 左侧大图使用 `public/portfolio/profile/portrait-dsc0014.jpg`。
  - 右侧为个人介绍、求职方向、实习时间、邮箱和核心数据。
  - 底部用两条经历线区分实习经历与校内经历。
  - 头像边框使用更干净的 liquid glass 式边缘反光，不再有内圈毛玻璃。
- 页面滚动体验：
  - 顶部导航已固定在全站。
  - Hero 到 Profile 增加了局部滚轮过渡，避免停留在两页分割处。
  - Hero 主按钮现在跳转到 `#profile`。
  - `#profile` 跳转位置已调整，避免落在 Hero/Profile 中间。
- 本地截图能力：
  - 新增 `docs/codex/capture-section.cjs`，通过 DevTools 协议截图。
  - 可用于后续让 Codex 自行检查页面，而不完全依赖用户截图。

## 待继续

- 继续微调 Profile 版式，尤其是首屏比例、头像裁切、经历线的视觉节奏。
- 正式开始 Works 页面：
  - 摄影作品。
  - 商单作品。
  - 设计物料。
  - 内容运营/SOP/推文/H5 等资料，待用户继续补充。
- Strengths 页面也需要支持弹层或详情展开。
- Contact 作为整屏收尾页后续再设计，抖音入口放入 Contact。

## 注意事项

- 不展示手机号，只展示邮箱。
- 先做 PC 端，不处理移动端独立排版。
- 使用 `F:\作品材料` 中的素材生成网页资源，但不要修改源素材。
- Profile 图片当前引用路径是 `/portfolio/profile/portrait-dsc0014.jpg`。
- 本地验证命令需要使用内置 pnpm，并把内置 Node 加入临时 PATH。
