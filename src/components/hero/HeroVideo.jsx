import React, { useRef, useEffect } from 'react';

const HeroVideo = ({ videoSrc }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
    }
  }, []);

  return (
    <section className="relative w-full h-[40vh] md:h-[70vh] overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        defaultMuted
        preload="auto"
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // cover prevents stretching on mobile/desktop
        }}
      >
        <source src={videoSrc || "/videos/PISL-WEBSITE.mp4"} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
    </section>
  );
};

export default HeroVideo;