import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectSections } from "@/components/ProjectSections";
import { ProjectDetailEntrance } from "@/components/transitions/ProjectDetailEntrance";
import { Button } from "@/components/ui/Button";
import { WorkImage } from "@/components/WorkImage";
import { getFeaturedProjects, getProjectBySlug } from "@/data/projects";
import { translations } from "@/data/i18n";
import { getImmersiveVisual } from "@/data/immersiveProjects";
import { getServerLocale } from "@/lib/serverLocale";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getFeaturedProjects("zh").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const project = getProjectBySlug(slug, locale);
  if (!project) return { title: translations[locale].ui.projectNotFound };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const project = getProjectBySlug(slug, locale);
  const t = translations[locale];

  if (!project) notFound();

  const visual = getImmersiveVisual(slug, locale);

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
              {t.ui.backToWorks}
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
                <span className="text-white/80">{t.ui.category}</span> · {project.meta.category}
              </span>
              <span>
                <span className="text-white/80">{t.ui.duration}</span> · {project.meta.durationWeeks} {t.ui.weeks}
              </span>
              <span>
                <span className="text-white/80">{t.ui.production}</span> ·{" "}
                {project.meta.solo ? t.ui.solo : t.ui.team}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50"
                >
                  {tool}
                </span>
              ))}
            </div>
            <a
              href={project.meta.ggacUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-sm text-accent hover:underline"
            >
              {t.ui.viewOnGgac}
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <ProjectSections sections={project.sections} fallbackExternal={t.ui.openExternal} videoUnsupported={t.ui.videoUnsupported} />
        </div>

        <footer className="border-t border-white/5 mx-auto max-w-6xl px-6 py-16 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-white/40 text-sm">{t.ui.nextProject}</p>
          <div className="flex gap-3">
            <Button href="/works" variant="secondary">
              {t.ui.allWorks}
            </Button>
            <Button href="/contact" variant="primary">
              {t.ui.discuss}
            </Button>
          </div>
        </footer>
      </article>
    </ProjectDetailEntrance>
  );
}
