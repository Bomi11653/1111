import { StackGallery } from "@/components/StackGallery";
import { WorkImage } from "@/components/WorkImage";
import { galleryItems, featuredProjects } from "@/data/projects";
import Link from "next/link";

export const metadata = {
  title: "作品",
};

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="max-w-2xl mb-16">
        <h1 className="font-display text-4xl md:text-5xl text-foreground">作品</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          叠页式浏览全部条目；下方为重点项目，点击进入 3–5 屏详情叙事。
        </p>
      </header>

      <StackGallery items={galleryItems} />

      <section className="mt-28 border-t border-border pt-20">
        <h2 className="font-display text-2xl text-foreground mb-3">重点项目</h2>
        <p className="text-muted text-sm mb-10">
          仅展示 2–3 个完整案例，适合招聘方深度阅读
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/works/${project.slug}`}
              className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-colors"
            >
              <div className="relative aspect-video">
                <WorkImage src={project.cover} alt={project.title} fill />
              </div>
              <div className="p-6">
                <p className="text-xs text-accent">{project.year}</p>
                <h3 className="font-display text-xl mt-1 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted mt-2 line-clamp-2">{project.summary}</p>
                <span className="inline-block mt-4 text-sm text-accent">阅读案例 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
