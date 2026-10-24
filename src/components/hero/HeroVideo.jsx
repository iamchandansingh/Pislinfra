import React, { useRef, useEffect, useState } from 'react';

const HeroVideo = ({ videoSrc, bannerImage, heroImage }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const activeBanner = bannerImage || heroImage || '/images/hero/11.png';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      if (videoRef.current.readyState >= 3) {
        setIsVideoLoaded(true);
      }
    }
  }, []);

  const handleVideoReady = () => {
    setIsVideoLoaded(true);
  };

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

      {/* Loading Animation until video is loaded */}
      {!isVideoLoaded && (
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

      {/* Video Background */}
      {videoSrc !== null && videoSrc !== false && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={activeBanner}
          onLoadedData={handleVideoReady}
          onCanPlay={handleVideoReady}
          onPlaying={handleVideoReady}
          onError={() => setIsVideoLoaded(false)}
          className="pisl-hero-video absolute top-0 left-0 w-full h-full z-0"
          style={{
            opacity: isVideoLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
          }}
        >
          <source src={videoSrc || "/videos/PISL-WEBSITE.mp4"} type="video/mp4" />
        </video>
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