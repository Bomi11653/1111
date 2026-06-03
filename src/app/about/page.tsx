import { SkillBars } from "@/components/SkillBars";
import { WorkImage } from "@/components/WorkImage";
import { site } from "@/data/site";

export const metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="grid md:grid-cols-12 gap-12 items-start mb-20">
        <div className="md:col-span-5">
          <div className="relative aspect-[3/4] max-w-sm rounded-2xl overflow-hidden border border-border bg-surface-elevated">
            <WorkImage
              src="/about/profile.jpg"
              alt={`${site.name} 职业照片`}
              fill
            />
          </div>
          <p className="text-xs text-muted mt-3">
            将照片放入 public/about/profile.jpg（可选）
          </p>
        </div>
        <div className="md:col-span-7">
          <h1 className="font-display text-4xl md:text-5xl text-foreground">关于我</h1>
          <p className="text-lg text-muted mt-6 leading-relaxed">
            我是 <span className="text-foreground">{site.name}</span>，
            {site.title}，{site.tagline}。{site.headline}
          </p>
          <div className="mt-10 p-6 rounded-xl border border-border bg-surface">
            <h2 className="text-sm text-accent uppercase tracking-wider">专业经历</h2>
            <ul className="mt-4 space-y-3 text-muted">
              <li>
                <span className="text-foreground">工作年限：</span>
                {site.experience.years} 年
              </li>
              <li>
                <span className="text-foreground">曾任职公司：</span>
                {site.experience.company}
              </li>
              <li className="leading-relaxed">{site.experience.summary}</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="mb-20">
        <h2 className="font-display text-2xl text-foreground mb-8">技能树</h2>
        <SkillBars />
      </section>

      <section>
        <h2 className="font-display text-2xl text-foreground mb-8">设计 / 工作理念</h2>
        <ul className="space-y-6">
          {site.philosophy.map((line, i) => (
            <li
              key={i}
              className="flex gap-4 text-muted leading-relaxed border-l-2 border-accent/40 pl-6"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
