'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const poster = '/videos/home-drone-poster.webp';

// The drone video behind the homepage hero: silent, looping and decorative,
// so screen readers skip it. Small screens and reduced-motion users see the
// poster without downloading the video.
export default function HeroBackdropVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const playback = window.matchMedia('(width > 760px) and (prefers-reduced-motion: no-preference)');
    const update = () => {
      if (!playback.matches) video.pause();
      else if (document.readyState === 'complete') video.play().catch(() => {
        // Autoplay can be blocked (e.g. low-power mode); the poster shows instead.
      });
    };
    update();
    window.addEventListener('load', update, { once: true });
    playback.addEventListener('change', update);
    return () => {
      window.removeEventListener('load', update);
      playback.removeEventListener('change', update);
    };
  }, []);

  return (
    <>
      {/* A responsive image paints the hero immediately without making phones
          download the full-width JPEG that a video poster would require. */}
      <Image
        src={poster}
        alt=''
        aria-hidden='true'
        fill
        loading='eager'
        fetchPriority='high'
        quality={65}
        sizes='100vw'
        className='hx-hero-backdrop-poster'
      />
      <video
        ref={videoRef}
        aria-hidden='true'
        tabIndex={-1}
        muted
        loop
        playsInline
        preload='none'
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
    </>
  );
}
