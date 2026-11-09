import React, { useRef, useEffect, useState, useCallback } from 'react';

const HeroVideo = ({ videoSrc, bannerImage, heroImage }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeSrc, setActiveSrc] = useState(videoSrc || '/videos/PISL-WEBSITE.mp4');

  const activeBanner = bannerImage || heroImage || '/images/hero/11.png';

  // Keep activeSrc updated when videoSrc prop changes
  useEffect(() => {
    if (videoSrc && videoSrc !== activeSrc && !hasError) {
      setActiveSrc(videoSrc);
      setIsPlaying(false);
    }
  }, [videoSrc]);

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
            // Playback started successfully
          })
          .catch((err) => {
            console.warn('[HeroVideo] Autoplay note:', err?.message || err);
            // Retry with muted guarantee
            if (!video.muted) {
              video.muted = true;
              video.play().catch(() => {});
            }
          });
      }
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.readyState >= 3 && !video.paused) {
      setIsPlaying(true);
    } else if (video.readyState >= 3) {
      attemptPlay();
    }
  }, [activeSrc, attemptPlay]);

  const handleLoadedData = () => {
    attemptPlay();
  };

  const handleCanPlay = () => {
    attemptPlay();
  };

  const handlePlaying = () => {
    // Video is actively playing and rendering frames
    setIsPlaying(true);
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
    }
  };

  const showLoadingIndicator = !isPlaying && !hasError && Boolean(activeSrc);

  return (
    <section className="pisl-hero-container relative w-full overflow-hidden bg-[#07132b]">
      {/* 1. Hero Banner Image: Always visible immediately (0ms paint) */}
      <div 
        className="pisl-hero-banner absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${activeBanner})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'brightness(0.9)'
        }}
      />

      {/* 2. Loading Animation: Shown only while video is loading, disappears when playing or on error */}
      {showLoadingIndicator && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
          style={{ transition: 'opacity 0.4s ease' }}
        >
          <div className="pisl-hero-spinner relative flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-xl">
            <img
              src="/logo.png"
              alt="Pislinfra Logo"
              className="pisl-hero-logo h-auto z-10"
              style={{ animation: 'hero-pulse-logo 1.8s ease-in-out infinite' }}
            />
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ animation: 'hero-spin 0.8s linear infinite' }}
            >
              <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <g transform="rotate(-135 50 50)">
                <circle cx="50" cy="50" r="47" fill="none" stroke="#6B21A8" strokeWidth="2" strokeDasharray="40 255.5" strokeLinecap="round" />
                <circle cx="97" cy="50" r="1.5" fill="#6B21A8" />
              </g>
              <g transform="rotate(-45 50 50)">
                <circle cx="50" cy="50" r="47" fill="none" stroke="#16A34A" strokeWidth="2" strokeDasharray="40 255.5" strokeLinecap="round" />
                <circle cx="97" cy="50" r="1.5" fill="#16A34A" />
              </g>
              <g transform="rotate(45 50 50)">
                <circle cx="50" cy="50" r="47" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="40 255.5" strokeLinecap="round" />
                <circle cx="97" cy="50" r="1.5" fill="#DC2626" />
              </g>
              <g transform="rotate(135 50 50)">
                <circle cx="50" cy="50" r="47" fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="40 255.5" strokeLinecap="round" />
                <circle cx="97" cy="50" r="1.5" fill="#F97316" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* 3. Video Background: Plays only when ready, fades in only when actually playing */}
      {!hasError && activeSrc && (
        <video
          ref={videoRef}
          src={activeSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={activeBanner}
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onPlaying={handlePlaying}
          onWaiting={handleWaiting}
          onError={handleError}
          className="pisl-hero-video absolute top-0 left-0 w-full h-full z-[1]"
          style={{
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
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
          .pisl-hero-spinner {
            width: 80px;
            height: 80px;
          }
          .pisl-hero-logo {
            width: 40px;
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
          .pisl-hero-spinner {
            width: 130px;
            height: 130px;
          }
          .pisl-hero-logo {
            width: 65px;
          }
        }

        @keyframes hero-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hero-pulse-logo {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default HeroVideo;