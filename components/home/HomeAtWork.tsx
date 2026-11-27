'use client';

import { useEffect, useRef, useState } from 'react';
import { manrope } from '@/app/fonts';
import QuoteButton from '@/components/quote/QuoteButton';
import Link from 'next/link';

type HomeAtWorkProps = {
  eyebrow: string;
  titleLines: readonly string[];
  lead: string;
  steps: readonly string[];
  video: { mp4: string; webm: string; poster: string; label: string; length: number };
  parts: readonly { from: number; caption: readonly [string, string]; step: number }[];
};

function setVideoSource(element: HTMLVideoElement, sources: HomeAtWorkProps['video']) {
  if (element.currentSrc || element.getAttribute('src')) return;
  const supportsWebm = element.canPlayType('video/webm; codecs="vp9"') !== '';
  element.src = supportsWebm ? sources.webm : sources.mp4;
  element.load();
}

// "See us at work": a straight black phone on the left playing a short clip of
// Niels at work, with story-style bars and a caption for each part; the words
// and steps on the right light up with the clip. The clip only starts once the
// section is on screen, stays still for people who ask for less motion, and
// can be paused.
export default function HomeAtWork({ eyebrow, titleLines, lead, steps, video, parts }: HomeAtWorkProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const lastLine = titleLines.length - 1;

  let part = 0;
  parts.forEach((entry, index) => {
    if (time >= entry.from) part = index;
  });
  const current = parts[part];

  // Desktops load one supported format once the phone is in view. Phones keep
  // the poster and download nothing until the visitor explicitly taps play.
  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia('(min-width: 48rem)');
    if (still) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && desktop.matches && !userPaused) {
          setVideoSource(element, video);
          element.play().catch(() => {});
        }
        else element.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [userPaused, video]);

  function toggle() {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      setUserPaused(false);
      setVideoSource(element, video);
      element.play().catch(() => {});
    } else {
      setUserPaused(true);
      element.pause();
    }
  }

  return (
    <section
      id='home-at-work'
      aria-labelledby='home-at-work-heading'
      className={`hx-section hx-aw ${manrope.variable}`}>
      <div className='hx-container'>
        <p className='hx-aw-eyebrow hx-reveal'>{eyebrow}</p>
        <div className='hx-aw-grid'>
          <div className='hx-aw-phone hx-reveal'>
            <div className='hx-aw-screen'>
              <span
                aria-hidden='true'
                className='hx-aw-island'
              />
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload='none'
                poster={video.poster}
                aria-label={video.label}
                onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
              <p
                aria-hidden='true'
                key={part}
                className='hx-aw-caption'>
                <span>
                  {current.caption[0]} <em>{current.caption[1]}</em>
                </span>
              </p>
              <div
                aria-hidden='true'
                className='hx-aw-bars'>
                {parts.map((entry, index) => {
                  const end = parts[index + 1]?.from ?? video.length;
                  const fill = index < part ? 1 : index > part ? 0 : Math.min(1, (time - entry.from) / (end - entry.from));
                  return (
                    <i key={entry.from}>
                      <u style={{ transform: `scaleX(${fill})` }} />
                    </i>
                  );
                })}
              </div>
              <button
                type='button'
                className='hx-aw-toggle'
                aria-label={playing ? 'Pause the video' : 'Play the video'}
                onClick={toggle}>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  fill='currentColor'>
                  {playing ? <path d='M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' /> : <path d='M8 5.5v13l10.5-6.5z' />}
                </svg>
              </button>
            </div>
          </div>

          <div className='hx-aw-copy hx-reveal'>
            <h2
              id='home-at-work-heading'
              className='hx-aw-title'>
              {titleLines.map((line, index) => (
                <span key={line}>{index === lastLine && lastLine > 0 ? <em>{line}</em> : line}</span>
              ))}
            </h2>
            <p className='hx-aw-lead'>{lead}</p>
            <ol className='hx-aw-steps'>
              {steps.map((step, index) => (
                <li
                  key={step}
                  data-on={index === current.step || undefined}>
                  <i aria-hidden='true'>{index + 1}</i>
                  {step}
                </li>
              ))}
            </ol>
            <div className='hx-aw-ctas'>
              <QuoteButton className='hx-aw-quote'>Get a free quote</QuoteButton>
              <Link
                href='/services'
                className='hx-aw-more'>
                See our services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
