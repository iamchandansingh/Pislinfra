import React from 'react'
import PageHero from '../components/hero/PageHero'
import CareerBenefitsSection from '../components/Careers/CareerBenefitsSection'
import CurrentOpeningsSection from '../components/Careers/CurrentOpeningsSection'
import HiringProcessSection from '../components/Careers/HiringProcessSection'
import CareerApplicationSection from '../components/Careers/CareerApplicationSection'

const Careers = () => {
  return (
    <div style={{ fontFamily: 'inherit', minHeight: '100vh' }}>
      
      {/* HERO */}
      <PageHero
        title="Careers"
        subtitle="Join PISL INFRA and build tomorrow's India with us."
        breadcrumb="Careers"
        bgImage="/images/hero/Careers.png"
      />

      {/* WHY JOIN PISL? */}
      <CareerBenefitsSection />

      {/* CURRENT OPENINGS */}
      <CurrentOpeningsSection />

      {/* HIRING PROCESS */}
      <HiringProcessSection />

      {/* APPLICATION FORM + CONTACT */}
      <CareerApplicationSection />

    </div>
  )
}

export default Careers