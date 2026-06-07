import React from 'react';
import { motion } from 'framer-motion';

const NAVY = '#28286e';
const ORANGE = '#ff8755';
const FONT_FAMILY = '"Helvetica Neue", Arial, sans-serif';

const philosophyData = [
  {
    title: 'CCTV Camera',
    description:
      'Strong safety awareness helps teams identify risks early, stay alert on-site, and protect both themselves and others through responsible actions and active participation.',
    image: '/images/awards/Camera.png'
  },
  {
    title: 'Fall Protection',
    description:
      'Encouraging communication, teamwork, and regular engagement helps strengthen confidence, improve decision-making, and create a workplace focused on continuous safety improvement.',
    image: '/images/awards/protection.png'
  },
  {
    title: 'Edge Professional',
    description:
      'Promoting disciplined work practices and responsible decision-making helps reduce risks, prevent incidents, and build long-term operational excellence across projects.',
    image: '/images/awards/2.png',
  },
  {
    title: 'IGBC Compliance',
    description:
      'Safety is a collective responsibility where every team member contributes through accountability, coordination, and commitment towards maintaining safe project environments.',
    image: '/images/awards/Compliance.png'
  },
  {
    title: 'Third Party Training',
    description:
      'Safety is a collective responsibility where every team member contributes through accountability, coordination, and commitment towards maintaining safe project environments.',
    image: '/images/awards/Celebrated-National-Safety-PRR-Jhamuwas-(5).png',
  },
  {
    title: 'Motivational HSE Training',
    description:
      'Safety is a collective responsibility where every team member contributes through accountability, coordination, and commitment towards maintaining safe project environments.',
    image: '/images/awards/3.png'
  },
];

const SafetyPhilosophy = () => {
  return (
    <section
      style={{
        padding: '80px 28px',
        background: '#f8fafc',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              fontWeight: 800,
              color: NAVY,
              margin: 0,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              fontFamily: FONT_FAMILY,
            }}
          >
            Latest <span style={{ color: ORANGE }}>HSC Statistics</span>
          </h2>
        </motion.div>

        {/* Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px 1fr 220px',
            gap: '24px',
            alignItems: 'start',
          }}
          className="safety-grid"
        >

          {/* LEFT COLUMN - Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
            }}
          >

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: NAVY,
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.3px',
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[0].title}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#64748b',
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[0].description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: NAVY,
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.3px',
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[2].title}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#64748b',
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[2].description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: NAVY,
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.3px',
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[4].title}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#64748b',
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[4].description}
              </p>
            </motion.div>
          </div>

          {/* CENTER LEFT - Images */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {[philosophyData[0], philosophyData[2], philosophyData[4]].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -3 }}
                style={{
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 6px 20px rgba(40,40,110,0.06)',
                  height: '120px',
                  border: `1px solid ${ORANGE}10`,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* CENTER RIGHT - Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
            }}
          >

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: NAVY,
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.3px',
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[1].title}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#64748b',
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[1].description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: NAVY,
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.3px',
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[3].title}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#64748b',
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[3].description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: NAVY,
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.3px',
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[5].title}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#64748b',
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {philosophyData[5].description}
              </p>
            </motion.div>
          </div>

          {/* RIGHT - Images */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {[philosophyData[1], philosophyData[3], philosophyData[5]].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -3 }}
                style={{
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 6px 20px rgba(40,40,110,0.06)',
                  height: '120px',
                  border: `1px solid ${ORANGE}10`,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .safety-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .safety-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SafetyPhilosophy;