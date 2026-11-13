import React, { useRef, useEffect, useState, useCallback } from 'react';

const getMediaFilename = (url = '') => {
  if (!url || typeof url !== 'string') return '';
  return url.split('?')[0].split('/').pop() || '';
};

const HeroVideo = ({ videoSrc, bannerImage, heroImage, onReady }) => {
  const videoRef = useRef(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const readyNotifiedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeSrc, setActiveSrc] = useState(videoSrc || '/videos/PISL-WEBSITE.mp4');

  const activeBanner = bannerImage || heroImage || '/images/hero/11.png';

  const notifyReady = useCallback(() => {
    if (readyNotifiedRef.current) return;
    readyNotifiedRef.current = true;
    if (typeof onReadyRef.current === 'function') {
      onReadyRef.current();
    }
  }, []);

  // Avoid reloading the exact same video file when snapshot URL hydrates to live WP URL
  useEffect(() => {
    if (!videoSrc || hasError) return;
    if (videoSrc === activeSrc) return;

    const nextName = getMediaFilename(videoSrc);
    const currentName = getMediaFilename(activeSrc);
    if (nextName && nextName === currentName) {
      return;
    }

    setActiveSrc(videoSrc);
    setIsPlaying(false);
  }, [videoSrc, activeSrc, hasError]);

  useEffect(() => {
    if (!activeSrc) {
      notifyReady();
    }
  }, [activeSrc, notifyReady]);

  // Handle browser autoplay policy cleanly with muted playback
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    // Start playback only when enough data is ready
    if (video.readyState >= 2) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!video.paused) {
              setIsPlaying(true);
              notifyReady();
            }
          })
          .catch((err) => {
            console.warn('[HeroVideo] Autoplay note:', err?.message || err);
            // Reveal first decoded video frame if autoplay is blocked by browser policy
            setIsPlaying(true);
            notifyReady();
          });
      }
    }
  }, [notifyReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.readyState >= 3 && !video.paused) {
      setIsPlaying(true);
      notifyReady();
    } else if (video.readyState >= 2) {
      attemptPlay();
    }
  }, [activeSrc, attemptPlay, notifyReady]);

  const handleLoadedData = () => {
    attemptPlay();
  };

  const handleCanPlay = () => {
    attemptPlay();
  };

  const handlePlaying = () => {
    // Video is actively playing and rendering frames
    setIsPlaying(true);
    notifyReady();
  };

  const handleWaiting = () => {
    // Temporary lack of data while buffering
  };

  const handleError = () => {
    // If remote URL fails, attempt local fallback before showing graceful cover image
    if (activeSrc !== '/videos/PISL-WEBSITE.mp4') {
      setActiveSrc('/videos/PISL-WEBSITE.mp4');
    } else {
      setHasError(true);
      setIsPlaying(false);
      notifyReady();
    }
  };

  const showFallbackBanner = hasError || !activeSrc;

  return (
    <section className="pisl-hero-container relative w-full overflow-hidden bg-[#07132b]">
      <h1 className="sr-only">Pragati Infra Solutions - Industrial Infrastructure &amp; EPC Company India</h1>
      {/* Fallback Cover Image: Shown only when no video exists or video playback fails */}
      {showFallbackBanner && (
        <div
          className="pisl-hero-banner absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${activeBanner}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'brightness(0.9)',
          }}
        />
      )}

      {/* Video Background: Preloads eagerly under page preloader so video plays immediately on reveal */}
      {!hasError && activeSrc && (
        <video
          ref={videoRef}
          src={activeSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onPlaying={handlePlaying}
          onWaiting={handleWaiting}
          onError={handleError}
          className="pisl-hero-video absolute top-0 left-0 w-full h-full z-[1]"
          style={{
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.25s ease-out',
          }}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/35 z-10 pointer-events-none"></div>

      <style>{`
        /* Mobile: Reduced size (~180px) with object-fit contain so all text and video edges fit 100% without cut-off */
        @media (max-width: 768px) {
          .pisl-hero-container {
            width: 100%;
            height: clamp(170px, 22vh, 195px);
            min-height: 170px;
            max-height: 195px;
          }
          .pisl-hero-video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
          }
        }

        /* Desktop: Cinematic high-impact view */
        @media (min-width: 769px) {
          .pisl-hero-container {
            height: 70vh;
            min-height: 480px;
            max-height: 720px;
          }
          .pisl-hero-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroVideo;
