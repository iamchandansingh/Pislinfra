const HeroVideo = () => {
  return (
    <section style={{
      position: 'relative',
      width: '100%',           // ✅ Full Width
      height: '100vh',         // ✅ Full Screen Height
      overflow: 'hidden',
    }}>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',       // ✅ Full Width
          height: '100%',      // ✅ Full Height
          objectFit: 'cover',  // ✅ Cover Entire Area
          zIndex: 0,
        }}
      >
        <source src="/videos/PISL-WEBSITE.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',         // ✅ Full Width
        height: '100%',        // ✅ Full Height
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
      }}></div>
    </section>
  )
}

export default HeroVideo