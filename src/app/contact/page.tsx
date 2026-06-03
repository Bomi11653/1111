import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";

export const metadata = {
  title: "联系",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="max-w-2xl mb-16">
        <h1 className="font-display text-4xl md:text-5xl text-foreground">联系</h1>
        <p className="text-muted mt-4 text-lg">
          正式合作与应聘请优先使用邮箱；亦可关注 Bilibili 与 GGAC 上的过程分享。
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs text-muted uppercase tracking-wider">邮箱</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block text-xl text-accent hover:underline break-all"
            >
              {site.email}
            </a>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <h2 className="text-xs text-muted uppercase tracking-wider">社交媒体</h2>
            <a
              href={site.social.bilibili.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center py-3 border-b border-border text-foreground hover:text-accent transition-colors"
            >
              <span>{site.social.bilibili.label}</span>
              <span>↗</span>
            </a>
            <a
              href={site.social.ggac.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center py-3 text-foreground hover:text-accent transition-colors"
            >
              <span>{site.social.ggac.label}</span>
              <span>↗</span>
            </a>
          </div>

          <Button href={site.resumePath} variant="secondary" className="w-full sm:w-auto">
            下载简历（PDF）
          </Button>
          <p className="text-xs text-muted">
            文件名：{site.resumeFilename} · 放置于 public/resume/
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-display text-xl text-foreground mb-6">留言表单</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
