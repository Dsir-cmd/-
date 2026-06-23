const sections = [
  "Hero",
  "Profile / 关于我",
  "Works / 精选项目",
  "Strengths / 个人优势",
  "Contact / 联系我",
];

export function App() {
  return (
    <main className="app-shell">
      <section className="setup-panel" aria-labelledby="setup-title">
        <p className="eyebrow">React + Vite initialized</p>
        <h1 id="setup-title">WANG KEJIE Portfolio</h1>
        <p className="lead">
          项目骨架已建立。下一步将在确认 PRD 与素材后实现暗色个人作品集页面。
        </p>
        <div className="section-list" aria-label="Planned sections">
          {sections.map((section) => (
            <span key={section}>{section}</span>
          ))}
        </div>
      </section>
    </main>
  );
}

