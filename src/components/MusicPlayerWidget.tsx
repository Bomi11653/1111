"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";

/** 可替换 public/music/ambient.mp3 为你喜欢的音乐文件 */
const DEFAULT_TRACK = {
  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  title: "Ambient Session",
  artist: "Portfolio BGM",
};

export function MusicPlayerWidget() {
  const { t } = useLocale();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={DEFAULT_TRACK.src} preload="none" loop />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-64 rounded-xl border border-border/60 bg-surface/90 backdrop-blur-xl p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-accent uppercase">
                  {t.music.title}
                </p>
                <p className="text-sm text-foreground mt-1">{DEFAULT_TRACK.title}</p>
                <p className="text-xs text-muted">{DEFAULT_TRACK.artist}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-foreground text-xs"
                aria-label={t.music.close}
                data-cursor="hover"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={togglePlay}
              className="mt-4 w-full rounded-lg border border-border/60 py-2.5 text-xs tracking-widest uppercase hover:border-accent/50 hover:text-accent transition-colors"
              data-cursor="hover"
            >
              {playing ? t.music.pause : t.music.play}
            </button>
            <p className="text-[10px] text-muted mt-3 leading-relaxed">
              替换音乐：将 MP3 放入 public/music/ 并修改 MusicPlayerWidget.tsx
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-surface/80 backdrop-blur-xl hover:border-accent/50 transition-colors group"
        aria-label={open ? t.music.close : t.music.open}
        data-cursor="hover"
      >
        <span className="relative flex h-4 w-4 items-end justify-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-0.5 rounded-full bg-accent transition-all ${
                playing ? "animate-music-bar" : "h-2"
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </button>
    </div>
  );
}
