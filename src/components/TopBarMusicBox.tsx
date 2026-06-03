"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_VOLUME = 0.25;

const PLAYLIST = [
  {
    title: "1940s Autumn Vintage Jazz",
    artist: "🍒 适合沉思与放松",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Midnight Contemplation & Relax",
    artist: "🍒 适合沉思与放松",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
] as const;

export function TopBarMusicBox() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = AUDIO_VOLUME;
    audio.loop = true;
    audio.src = PLAYLIST[0].url;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const loadTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = AUDIO_VOLUME;
    audio.src = PLAYLIST[index].url;
    setTrackIndex(index);
  }, []);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = AUDIO_VOLUME;
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      const audio = audioRef.current;
      if (!audio) return;

      if (audio.paused) {
        await playAudio();
      } else {
        audio.pause();
      }
    },
    [playAudio],
  );

  const changeTrack = useCallback(
    async (direction: 1 | -1, event?: React.MouseEvent) => {
      event?.stopPropagation();
      const nextIndex =
        (trackIndex + direction + PLAYLIST.length) % PLAYLIST.length;
      loadTrack(nextIndex);
      await playAudio();
    },
    [trackIndex, loadTrack, playAudio],
  );

  return (
    <>
      <audio
        ref={audioRef}
        id="globalAudioPlayer"
        loop
        preload="metadata"
        className="pointer-events-none fixed h-px w-px opacity-0"
        aria-hidden
      />

      <div
        id="musicWrapper"
        className="top-bar-music-wrapper relative hidden lg:block"
      >
        <div
          id="topMusicBox"
          role="group"
          aria-label="氛围音乐播放器"
          className={`top-bar-music-box box-border flex h-9 cursor-default items-center gap-3 rounded-[30px] border border-white/10 bg-white/[0.05] px-4 py-1.5 transition-all hover:border-[rgba(224,169,109,0.4)] hover:bg-white/[0.08] ${
            isPlaying ? "playing" : ""
          }`}
        >
          <i
            className={`ri-disc-line music-disc-icon inline-block text-base text-white/80 ${
              isPlaying ? "music-disc-spin text-[#e0a96d]" : ""
            }`}
            aria-hidden
          />
          <div className="music-info-text flex w-[120px] flex-col">
            <p
              id="navSongTitle"
              className="nav-song-title m-0 truncate text-[11px] font-medium text-white/90"
            >
              {currentTrack.title}
            </p>
            <p className="nav-song-artist m-0 text-[8px] font-medium tracking-wide text-[rgba(224,169,109,0.7)]">
              {currentTrack.artist}
            </p>
          </div>
          <div className="nav-audio-controls flex items-center gap-2 border-l border-white/15 pl-2.5">
            <button
              type="button"
              className="nav-ctrl-btn flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-sm text-white/50 outline-none transition-all hover:scale-[1.15] hover:text-white"
              onClick={(e) => changeTrack(-1, e)}
              title="上一首"
              aria-label="上一首"
            >
              <i className="ri-skip-back-mini-line" aria-hidden />
            </button>
            <button
              type="button"
              className="nav-ctrl-btn nav-main-play flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-base text-[#e0a96d] outline-none transition-all hover:scale-[1.15]"
              onClick={togglePlayPause}
              title={isPlaying ? "暂停" : "播放"}
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              <i
                id="navPlayIcon"
                className={isPlaying ? "ri-pause-fill" : "ri-play-fill"}
                aria-hidden
              />
            </button>
            <button
              type="button"
              className="nav-ctrl-btn flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-sm text-white/50 outline-none transition-all hover:scale-[1.15] hover:text-white"
              onClick={(e) => changeTrack(1, e)}
              title="下一首"
              aria-label="下一首"
            >
              <i className="ri-skip-forward-mini-line" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
