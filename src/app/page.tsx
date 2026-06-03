import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WorkImage } from "@/components/WorkImage";
import { getHomePreview } from "@/data/projects";
import { site } from "@/data/site";

export default function HomePage() {
  const previews = getHomePreview();

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28 relative">
          <p className="text-accent text-xs tracking-[0.35em] uppercase mb-6">
            {site.title} · {site.tagline}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground max-w-3xl">
            {site.name}
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-muted max-w-2xl leading-relaxed">
            {site.headline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/works" variant="primary">
              查看作品集
            </Button>
            <Button href={site.resumePath} variant="secondary">
              下载简历
            </Button>
            <Button href="/contact" variant="ghost">
              联系我
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl text-foreground">精选作品</h2>
            <p className="text-muted mt-2 text-sm">代表性环境场景 · 点击可进入作品页</p>
          </div>
          <Link href="/works" className="text-sm text-accent hover:underline hidden sm:inline">
            全部作品 →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previews.map((item, i) => {
            const href = item.slug ? `/works/${item.slug}` : "/works";
            return (
              <Link
                key={item.id}
                href={href}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-border bg-surface hover:border-accent/40 transition-all duration-300"
              >
                <WorkImage
                  src={item.cover}
                  alt={item.title}
                  fill
                  priority={i < 2}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs text-accent mb-1">{item.year}</p>
                  <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-border bg-surface p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-2xl text-foreground">准备开始合作？</h2>
            <p className="text-muted mt-2 max-w-md">
              欢迎通过邮件或社交平台查看完整过程与演示视频。
            </p>
          </div>
          <Button href="/contact" variant="primary">
            联系郑荣成
          </Button>
        </div>
      </section>
    </>
  );
}
