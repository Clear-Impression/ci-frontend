'use client';

import { useEffect, useRef } from 'react';

// The drone video behind the homepage hero: silent, looping and decorative,
// so screen readers skip it. With reduced motion turned on it stays on the
// still first frame.
export default function HeroBackdropVideo() {
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
      poster='/videos/home-drone-poster.jpg'
      className='hx-hero-backdrop-video'>
      <source
        src='/videos/home-drone.webm'
        type='video/webm'
      />
      <source
        src='/videos/home-drone.mp4'
        type='video/mp4'
      />
    </video>
  );
}
