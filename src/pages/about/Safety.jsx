import React from 'react';
import PageHero from '../../components/hero/PageHero';
import SafetyApproach from '../../components/safety/SafetyApproach';
import SafetyCulture from '../../components/safety/SafetyCulture';
import SafetyStats2025 from '../../components/safety/SafetyStats2025';
import SafetyPhilosophy from '../../components/safety/SafetyPhilosophy';
import IndustryRecognition from '../../components/safety/IndustryRecognition';
import SafetyResources from '../../components/safety/SafetyResources';

const SafetyPage = () => {
  return (
    <div style={{ 
      background: '#ffffff', 
      fontFamily: '"Helvetica Neue", Arial, sans-serif', 
      minHeight: '100vh' 
    }}>
      <PageHero 
        title="Hsc For Core" 
        subtitle="Our commitment to zero harm and sustainable practices"
        breadcrumb="About Us / EHS"
        bgImage="/images/hero/safety-Hero-image.png"
      />

      <SafetyApproach />
      <SafetyCulture />
      <SafetyStats2025 />
      <SafetyPhilosophy />
      <IndustryRecognition />
      <SafetyResources />
    </div>
  );
};

export default SafetyPage;