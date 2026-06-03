import type { MediaBlock, ProjectSection } from "@/data/projects";
import { WorkImage } from "./WorkImage";

function MediaRenderer({ block }: { block: MediaBlock }) {
  if (block.type === "image") {
    return (
      <figure className="rounded-xl overflow-hidden border border-border">
        <div className="relative aspect-video w-full">
          <WorkImage src={block.src} alt={block.alt} fill />
        </div>
        {block.caption && (
          <figcaption className="text-xs text-muted px-4 py-3 border-t border-border">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "video") {
    return (
      <figure className="rounded-xl overflow-hidden border border-border">
        <video
          className="w-full aspect-video bg-black"
          controls
          playsInline
          poster={block.poster}
          preload="metadata"
        >
          <source src={block.src} />
          您的浏览器不支持视频播放
        </video>
        {block.caption && (
          <figcaption className="text-xs text-muted px-4 py-3 border-t border-border">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <a
      href={block.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-6 py-5 hover:border-accent/50 transition-colors group"
    >
      <span className="text-foreground group-hover:text-accent transition-colors">
        {block.caption ?? "打开外部链接"}
      </span>
      <span className="text-accent">↗</span>
    </a>
  );
}

export function ProjectSections({ sections }: { sections: ProjectSection[] }) {
  return (
    <div className="space-y-24 md:space-y-32">
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="min-h-[70vh] flex flex-col justify-center scroll-mt-24"
          aria-label={section.title}
        >
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4 md:sticky md:top-28">
              <span className="text-accent text-xs tracking-[0.25em] uppercase">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-3 text-foreground">
                {section.title}
              </h2>
            </div>
            <div className="md:col-span-8 space-y-8">
              <p className="text-muted text-lg leading-relaxed">{section.body}</p>
              {section.media?.map((m, i) => (
                <MediaRenderer key={`${section.id}-media-${i}`} block={m} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
