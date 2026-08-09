import Image from "next/image";
import type { HomeContent, SiteContent } from "@/lib/cms-types";
import type { CmsProject } from "@/lib/project-types";

type Props = {
  site: SiteContent;
  home: HomeContent;
  featuredProjects: CmsProject[];
};

export function HomePreview({ site, home, featuredProjects }: Props) {
  return (
    <div className="space-y-6 text-left scale-[0.92] origin-top">
      <section className="rounded-md border border-white/10 overflow-hidden">
        <div className="relative h-36 overflow-hidden">
          {home.hero.backgroundImage ? (
            <Image
              src={home.hero.backgroundImage}
              alt=""
              fill
              className="object-cover opacity-40"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="relative p-4 flex flex-col justify-end h-full">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{home.hero.taglineZh}</p>
            <h2 className="text-lg font-semibold text-white/90 mt-1 leading-tight">{home.hero.titleZh}</h2>
            <p className="text-[11px] text-white/50 mt-1">{home.hero.subtitleZh}</p>
            <span className="inline-block mt-3 text-[10px] px-3 py-1 border border-white/20 text-white/70 rounded-sm w-fit">
              {home.hero.ctaTextZh}
            </span>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 ? (
        <section>
          <p className="text-[10px] text-white/35 uppercase tracking-widest mb-2">精选作品</p>
          <div className="grid grid-cols-2 gap-2">
            {featuredProjects.slice(0, 4).map((p) => (
              <div key={p.id} className="rounded-sm border border-white/10 overflow-hidden">
                <div className="relative h-16 bg-white/5">
                  <Image src={p.coverImage} alt={p.title} fill className="object-cover" unoptimized />
                </div>
                <p className="text-[10px] text-white/60 p-1.5 truncate">{p.title}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-md border border-white/10 p-3">
        <p className="text-[10px] text-white/35 uppercase tracking-widest mb-2">关于我</p>
        <p className="text-[11px] text-white/55 leading-relaxed line-clamp-3">{site.headline}</p>
      </section>

      <section className="rounded-md border border-dashed border-white/10 p-4 text-center">
        <p className="text-[10px] text-white/35">{site.name} · {site.title}</p>
        <p className="text-[10px] text-white/25 mt-1">联系 / 简历</p>
      </section>
    </div>
  );
}
