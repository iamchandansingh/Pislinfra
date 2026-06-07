import React from 'react';
import PageHero from '../../components/hero/PageHero';
import CSRStats from '../../components/csr/CSRStats';
import CSRPhilosophy from '../../components/csr/CSRPhilosophy';
import CSRFocusAreas from '../../components/csr/CSRFocusAreas';
import CSRInitiatives from '../../components/csr/CSRInitiatives';
import CSRCTA from '../../components/csr/CSRCTA';

const CSR = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hero */}
      <PageHero 
        title="CSR Initiatives" 
        subtitle="Changing lives beyond business" 
        breadcrumb="About Us / CSR" 
        bgImage="/images/hero/leadership.png" 
      />

      {/* CSR Stats - Overlapping Panel */}
      <CSRStats />

      {/* Our Philosophy */}
      <CSRPhilosophy />

      {/* Focus Areas */}
      <CSRFocusAreas />

      {/* Initiatives - Giving Back, Environment, Celebrations */}
      <CSRInitiatives />

      {/* Final CTA */}
      <CSRCTA />

    </div>
  );
};

export default CSR;