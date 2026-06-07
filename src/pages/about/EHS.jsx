import React from 'react'
import PageHero from '../../components/hero/PageHero'
import EHSStats from '../../components/ehs/EHSStats'
import SafeManHoursAndCommitment from '../../components/ehs/SafeManHoursAndCommitment'
import EHSSafetyPrograms from '../../components/ehs/EHSSafetyPrograms'
import EHSPillarsAndPrograms from '../../components/ehs/EHSPillarsAndPrograms'
import CertificationsAndEHSAction from '../../components/ehs/CertificationsAndEHSAction'

const EHS = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageHero 
        title="EHS Standards" 
        subtitle="Environment, Health & Safety Standards"
        breadcrumb="About Us / EHS"
        bgImage="/images/hero/EHS.png"
      />
      
      <div style={{ height: '40px', backgroundColor: '#FFFFFF' }} />
      
      <EHSStats />
      <SafeManHoursAndCommitment />
      <EHSPillarsAndPrograms />
        <EHSSafetyPrograms />
      <CertificationsAndEHSAction />
    </div>
  )
}

export default EHS