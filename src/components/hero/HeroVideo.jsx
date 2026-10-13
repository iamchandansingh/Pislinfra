import React, { useRef, useEffect, useState } from 'react';

const HeroVideo = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
    <section className="relative w-full h-[40vh] md:h-[70vh] overflow-hidden bg-[#07132b]">
      {/* Loading Animation until video is loaded */}
      {!isVideoLoaded && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#07132b]"
          style={{ transition: 'opacity 0.4s ease' }}
        >
          <div className="relative w-[130px] h-[130px] flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm shadow-xl">
            <img
              src="/logo.png"
              alt="Pislinfra Logo"
              className="w-[65px] h-auto z-10"
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
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        defaultMuted
        preload="auto"
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        onPlaying={handleVideoReady}
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isVideoLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
        }}
      >
        <source src={videoSrc || "/videos/PISL-WEBSITE.mp4"} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 pointer-events-none"></div>

      <style>{`
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