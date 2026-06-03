"use client";

import { useState } from "react";

const PLACEHOLDER = "/works/placeholder.svg";

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
}: Props) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = failed || !src ? PLACEHOLDER : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      className={
        fill
          ? `absolute inset-0 h-full w-full object-cover ${className}`
          : `w-full ${className.includes("object-") ? "" : "object-cover "}${className}`
      }
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
