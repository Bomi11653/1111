import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectSections } from "@/components/ProjectSections";
import { Button } from "@/components/ui/Button";
import { WorkImage } from "@/components/WorkImage";
import { featuredProjects, getProjectBySlug } from "@/data/projects";

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

  return (
    <article>
      <header className="relative min-h-[50vh] flex items-end border-b border-border">
        <div className="absolute inset-0">
          <WorkImage src={project.cover} alt={project.title} fill priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>
        <div className="relative mx-auto max-w-6xl w-full px-6 pb-16 pt-32">
          <Link
            href="/works"
            className="text-sm text-muted hover:text-accent mb-8 inline-block"
          >
            ← 返回作品
          </Link>
          <p className="text-accent text-xs tracking-[0.2em] uppercase">
            {project.year} · {project.role}
          </p>
          <h1 className="font-display text-4xl md:text-6xl mt-3 text-foreground">
            {project.title}
          </h1>
          <p className="text-muted text-lg mt-4 max-w-2xl">{project.summary}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {project.tools.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full border border-border text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <ProjectSections sections={project.sections} />
      </div>

      <footer className="border-t border-border mx-auto max-w-6xl px-6 py-16 flex flex-wrap gap-4 justify-between items-center">
        <p className="text-muted text-sm">下一个项目</p>
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
  );
}
