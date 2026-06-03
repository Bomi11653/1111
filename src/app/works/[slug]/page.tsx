import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectSections } from "@/components/ProjectSections";
import { ProjectDetailEntrance } from "@/components/transitions/ProjectDetailEntrance";
import { Button } from "@/components/ui/Button";
import { WorkImage } from "@/components/WorkImage";
import { featuredProjects, getProjectBySlug } from "@/data/projects";
import { getImmersiveVisual } from "@/data/immersiveProjects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "未找到项目" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const visual = getImmersiveVisual(slug);

  return (
    <ProjectDetailEntrance>
      <article className="relative bg-[#0a0a0a]">
        <header className="relative min-h-[55vh] flex items-end border-b border-white/5 overflow-hidden">
          {visual && (
            <div className="absolute inset-0 opacity-25 pointer-events-none project-detail-glow" aria-hidden />
          )}
          <div className="absolute inset-0">
            <WorkImage src={project.cover} alt={project.title} fill priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/75 to-[#0a0a0a]/40" />
          </div>
          <div className="relative mx-auto max-w-6xl w-full px-6 pb-16 pt-32 mt-16">
            <Link
              href="/works"
              className="text-sm text-white/50 hover:text-accent mb-8 inline-block"
            >
              ← 返回作品
            </Link>
            <p className="text-accent text-xs tracking-[0.2em] uppercase">
              {project.year} · {project.role}
            </p>
            <h1 className="font-display-tight text-4xl md:text-6xl lg:text-7xl mt-3 text-white tracking-[-0.03em]">
              {project.title}
            </h1>
            <p className="text-white/55 text-lg mt-4 max-w-2xl leading-relaxed">{project.summary}</p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-white/45">
              <span>
                <span className="text-white/80">类型</span> · {project.meta.category}
              </span>
              <span>
                <span className="text-white/80">周期</span> · {project.meta.durationWeeks} 周
              </span>
              <span>
                <span className="text-white/80">制作</span> ·{" "}
                {project.meta.solo ? "独立完成" : "团队协作"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tools.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50"
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href={project.meta.ggacUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-sm text-accent hover:underline"
            >
              在 GGAC 查看完整作品 ↗
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <ProjectSections sections={project.sections} />
        </div>

        <footer className="border-t border-white/5 mx-auto max-w-6xl px-6 py-16 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-white/40 text-sm">下一个项目</p>
          <div className="flex gap-3">
            <Button href="/works" variant="secondary">
              全部作品
            </Button>
            <Button href="/contact" variant="primary">
              讨论合作
            </Button>
          </div>
        </footer>
      </article>
    </ProjectDetailEntrance>
  );
}
