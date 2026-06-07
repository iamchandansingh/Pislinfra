import React from 'react';
import HeroVideo from '../components/hero/HeroVideo';
import AboutUs from '../components/about/AboutUs';
import StatsSection from '../components/about/StatsSection';
import Services from '../components/services/Services';
import CoverageMap from '../components/coverage/CoverageMap';
import Industries from '../components/industries/Industries';
import Clients from '../components/clients/Clients';
import Awards from '../components/Home/Awards';

const Home = () => {
  return (
    <div>
      <HeroVideo />
      <AboutUs />
      <StatsSection /> 
      <Services /> 
      <CoverageMap />
      <Industries />
      <Awards />
      <Clients />
    </div>
  );
};

export default Home;