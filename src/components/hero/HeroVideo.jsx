const HeroVideo = ({ videoSrc }) => {
  return (
    <section className="relative w-full h-[40vh] md:h-[70vh] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
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