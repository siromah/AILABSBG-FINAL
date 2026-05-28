import React, { useState, useEffect, useRef } from 'react';

interface BackgroundMediaProps {
  videoSrc?: string;
  imageSrc?: string;
  overlayClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackgroundMedia({
  videoSrc,
  imageSrc,
  overlayClassName = 'bg-gradient-to-b from-black/40 via-black/20 to-black/50',
  className = '',
  children,
}: BackgroundMediaProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const showVideo = videoSrc && !prefersReducedMotion && !videoError;
  const showImage = imageSrc && !imageError && (!showVideo || !videoLoaded);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video layer */}
      {showVideo && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Image fallback layer */}
      {showImage && (
        <img
          src={imageSrc}
          alt=""
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
