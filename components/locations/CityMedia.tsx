'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { LocationMedia } from '@/data/locations';
import styles from '@/app/locations/locations.module.css';

// The photo or video beside a city's description, set in Sanity Studio.
// A video plays silently on a loop with a pause button, and stays paused
// for visitors who have turned off motion. The photo shows while it loads.
export default function CityMedia({ media }: { media: LocationMedia }) {
  const { photo, video, alt } = media;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Fall back to the photo if the video can't play in this browser.
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.play().catch(() => setPlaying(false));
  }, [video?.url]);

  const togglePlaying = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      element.play().catch(() => setPlaying(false));
    } else {
      element.pause();
    }
  };

  if (video && !videoFailed) {
    return (
      <div className={styles.mediaFrame}>
        <video
          ref={videoRef}
          src={video.url}
          // Sanity resizes the photo, so the poster loads quickly.
          poster={photo ? `${photo.url}?w=1200&auto=format` : undefined}
          aria-label={alt || undefined}
          muted
          loop
          playsInline
          preload='metadata'
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setVideoFailed(true)}
          className={styles.servicePhoto}
        />
        <button
          type='button'
          onClick={togglePlaying}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className={styles.videoToggle}>
          <svg aria-hidden='true' viewBox='0 0 24 24' fill='currentColor' className='size-5'>
            {playing ? (
              <path d='M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' />
            ) : (
              <path d='M8 5v14l11-7z' />
            )}
          </svg>
        </button>
      </div>
    );
  }

  if (!photo) return null;

  return (
    <Image
      src={photo.url}
      alt={alt}
      width={photo.width}
      height={photo.height}
      sizes='(max-width: 760px) 100vw, 50vw'
      className={styles.servicePhoto}
      // Keep the part chosen in Studio in view when the photo is cropped.
      style={photo.hotspot
        ? { objectPosition: `${photo.hotspot.x * 100}% ${photo.hotspot.y * 100}%` }
        : undefined}
    />
  );
}
