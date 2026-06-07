const CoreTeamCard = ({ member }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #f0f0f0',
      overflow: 'hidden',
    }}>
      {/* Image Only */}
      <div style={{
        width: '100%',
        paddingTop: '120%',
        backgroundImage: `url(${member.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}></div>
    </div>
  )
}

export default CoreTeamCard