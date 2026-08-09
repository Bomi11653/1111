import { WorkImage } from "@/components/WorkImage";

export type ProjectGalleryImage = {
  url: string;
  alt: string;
  title: string;
};

type Props = {
  images: ProjectGalleryImage[];
};

export function ProjectGallerySection({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <section className="mb-24 md:mb-32" aria-label="作品画廊">
      <h2 className="font-display-tight text-2xl md:text-3xl text-white mb-10 tracking-tight">
        作品画廊
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {images.map((img) => (
          <figure
            key={img.url}
            className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]"
          >
            <div className="relative aspect-[4/3] w-full">
              <WorkImage src={img.url} alt={img.alt || img.title} fill />
            </div>
            {img.title ? (
              <figcaption className="text-xs text-white/45 px-4 py-3 border-t border-white/5">
                {img.title}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
