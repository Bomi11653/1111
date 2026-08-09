import Image from "next/image";
import type { CmsProject } from "@/lib/project-types";
import { AdminBadge } from "@/components/admin/ui";

type Props = { project: CmsProject };

export function ProjectPreview({ project }: Props) {
  return (
    <div className="space-y-4 text-left scale-[0.92] origin-top">
      <div className="relative aspect-[16/10] rounded-md overflow-hidden border border-white/10 bg-white/5">
        <Image src={project.coverImage} alt={project.title} fill className="object-cover" unoptimized />
      </div>
      <div>
        <div className="flex flex-wrap gap-1 mb-2">
          <AdminBadge variant={project.published ? "published" : "draft"}>
            {project.published ? "已发布" : "草稿"}
          </AdminBadge>
          {project.featured ? <AdminBadge variant="featured">精选</AdminBadge> : null}
        </div>
        <h3 className="text-base font-medium text-white/90">{project.title || "项目标题"}</h3>
        <p className="text-xs text-white/45 mt-1">{project.subtitle}</p>
        <p className="text-[11px] text-white/35 mt-2 line-clamp-3">{project.summary}</p>
      </div>
      {project.gallery.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {project.gallery.slice(0, 6).map((g) => (
            <div key={g.id} className="relative aspect-square rounded overflow-hidden bg-white/5">
              <Image src={g.url} alt={g.alt} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
