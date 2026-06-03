"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function WorkImage({
  src,
  alt,
  fill,
  className = "",
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-elevated ${fill ? "absolute inset-0" : "aspect-video w-full"} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="text-center px-6">
          <p className="text-accent/80 text-xs uppercase tracking-[0.2em] mb-2">
            待上传作品图
          </p>
          <p className="text-muted text-sm max-w-xs">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : 1200}
      height={fill ? undefined : 675}
      className={`object-cover ${className}`}
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
