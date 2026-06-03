"use client";

import Link from "next/link";
import { useState } from "react";
import type { GalleryItem } from "@/data/projects";
import { WorkImage } from "./WorkImage";

type Props = {
  items: GalleryItem[];
  /** 详情页模式：仅 featured 且带 slug 的可点击进入 */
  linkFeatured?: boolean;
};

export function StackGallery({ items, linkFeatured = true }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative mx-auto max-w-4xl">
      <p className="text-muted text-sm mb-8 text-center">
        点击卡片切换层级 · Featured 项目可进入详情
      </p>

      <div className="relative h-[420px] sm:h-[480px] md:h-[520px]">
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;
          const zIndex = items.length - Math.abs(offset);
          const translateY = offset * 28;
          const rotate = offset * 2.5;
          const scale = isActive ? 1 : 0.94 - Math.abs(offset) * 0.02;
          const opacity = Math.abs(offset) > 3 ? 0 : 1 - Math.abs(offset) * 0.12;

          const inner = (
            <article
              className={`absolute inset-x-4 sm:inset-x-8 top-0 h-full rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl transition-all duration-500 ease-out cursor-pointer ${
                isActive ? "border-accent/40" : ""
              }`}
              style={{
                zIndex,
                transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                opacity,
              }}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${item.title}，${isActive ? "当前选中" : "点击选中"}`}
            >
              <div className="relative h-[55%] w-full">
                <WorkImage src={item.cover} alt={item.title} fill className="opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border border-border text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-muted ml-auto">{item.year}</span>
                </div>
                <h3 className="font-display text-2xl text-foreground">{item.title}</h3>
                <p className="text-muted mt-1">{item.subtitle}</p>
                {isActive && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {linkFeatured && item.slug && (
                      <Link
                        href={`/works/${item.slug}`}
                        className="text-sm text-accent hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        查看项目详情 →
                      </Link>
                    )}
                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-accent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        外部链接 ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          );

          return <div key={item.id}>{inner}</div>;
        })}
      </div>

      <div className="flex justify-center gap-2 mt-10">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`切换到第 ${i + 1} 张`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted"
            }`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
