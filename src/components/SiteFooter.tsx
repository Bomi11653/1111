import Link from "next/link";
import { site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted">
        <p>
          © {year} {site.name} · {site.title}
        </p>
        <div className="flex gap-6">
          <Link href="/works" className="hover:text-accent transition-colors">
            作品
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="hover:text-accent transition-colors"
          >
            邮件
          </a>
        </div>
      </div>
    </footer>
  );
}
