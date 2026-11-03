'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getServiceMedia } from '@/data/media';
import ServiceIcon from './ServiceIcon';

type ServiceMediaProps = {
  slug: string;
  sizes: string;
  className?: string;
};

// Show a service's video, photo, or a branded placeholder, in that order.
// Videos only play for people who have not asked for reduced motion.
export default function ServiceMedia({ slug, sizes, className = '' }: ServiceMediaProps) {
  const { image, video } = getServiceMedia(slug);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPlayVideo(!motion.matches);
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, [video]);

  return (
    <div className={`media-frame relative overflow-hidden bg-[#33195a] ${className}`}>
      {video && playVideo ? (
        <video
          className='media-fill absolute inset-0 size-full object-cover'
          src={video.src}
          poster={image?.src}
          autoPlay
          muted
          loop
          playsInline
          aria-label={image?.alt}
        />
      ) : image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className='media-fill object-cover'
        />
      ) : (
        // No media yet: a soft pane of glass with the service icon.
        <div className='media-empty absolute inset-0 grid place-items-center'>
          <ServiceIcon
            slug={slug}
            draw='none'
            className='size-14 text-[#d9b65f]'
          />
        </div>
      )}
    </div>
  );
}
