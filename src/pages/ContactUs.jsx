import React from 'react'
import PageHero from '../components/hero/PageHero'
import ContactCardsSection from '../components/Contact-us/ContactCardsSection'
import ContactInquirySection from '../components/Contact-us/ContactInquirySection'
import CompanyStatsSection from '../components/Contact-us/CompanyStatsSection'
import ContactMapSection from '../components/Contact-us/ContactMapSection'

const ContactUs = () => {
  return (
    <div style={{ fontFamily: 'inherit', minHeight: '100vh' }}>
      
      {/* ══ 1. HERO SECTION ══ */}
      <PageHero
        title="Get in Touch"
        subtitle="Secure enterprise channel for infrastructure collaboration."
        breadcrumb="Contact"
        bgImage="/images/hero/Contact-Us.png"
      />

      {/* ══ 2. CONTACT CARDS SECTION ══ */}
      <ContactCardsSection />

      {/* ══ 3. CONTACT INQUIRY SECTION ══ */}
      <ContactInquirySection />

      {/* ══ 4. COMPANY STATS SECTION ══ */}
      <CompanyStatsSection />

      {/* ══ 5. MAP SECTION ══ */}
      <ContactMapSection />

    </div>
  )
}

export default ContactUs