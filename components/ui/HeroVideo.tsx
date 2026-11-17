'use client';

import { useEffect, useRef } from 'react';

type HeroVideoProps = {
  // The same clip in two formats; the browser plays the first it supports.
  webm: string;
  mp4: string;
  poster: string;
  className?: string;
};

// A silent, looping background video for a page header. It's decoration
// only, so screen readers skip it. With reduced motion turned on, it stays
// on the still first frame instead of playing.
export default function HeroVideo({ webm, mp4, poster, className = '' }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (motion.matches) video.pause();
      else video.play().catch(() => {
        // Autoplay can be blocked (e.g. low-power mode); the poster shows instead.
      });
    };
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  return (
    <video
      ref={videoRef}
      aria-hidden='true'
      tabIndex={-1}
      muted
      loop
      playsInline
      preload='metadata'
      poster={poster}
      className={className}>
      <source
        src={webm}
        type='video/webm'
      />
      <source
        src={mp4}
        type='video/mp4'
      />
    </video>
  );
}
