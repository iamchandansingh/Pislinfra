import React from 'react';
import { ArrowRight, Building2, Users, Award, MapPin, ChevronRight } from 'lucide-react';

const statsData = [
  { id: 'projects', icon: <Building2 size={24} />, value: '500+', label: 'Projects Delivered' },
  { id: 'clients', icon: <Users size={24} />, value: '250+', label: 'Happy Clients' },
  { id: 'experience', icon: <Award size={24} />, value: '15+', label: 'Years Experience' },
  { id: 'presence', icon: <MapPin size={24} />, value: 'Pan India', label: 'Presence' },
];

const clientLogos = [
  { id: 'adani', name: 'Adani', color: '#FFFFFF' },
  { id: 'reliance', name: 'Reliance', color: '#FFFFFF' },
  { id: 'tata', name: 'Tata', color: '#FFFFFF' },
  { id: 'jsw', name: 'JSW', color: '#FFFFFF' },
  { id: 'dpworld', name: 'DP World', color: '#FFFFFF' },
  { id: 'amns', name: 'AMNS', color: '#FFFFFF' },
];

const CaseStudyCTA = () => {
  return (
    <section style={{ width: '100%', padding: '80px 0 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        
        <div style={{
          background: 'linear-gradient(135deg, #0B1450 0%, #1A237E 30%, #0D1B5C 60%, #0B1450 100%)',
          borderRadius: '24px', padding: '60px 48px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(11, 20, 80, 0.2)', marginBottom: '48px',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '10%', width: '200px', height: '200px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, color: '#FF6B35', backgroundColor: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.2)', padding: '6px 20px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
              Let's Build Together
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0', lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}>
              Ready to Start Your Next <span style={{ color: '#FF6B35' }}>Infrastructure Project?</span>
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: '0 0 32px 0', fontFamily: 'Inter, sans-serif' }}>
              Partner with PISL Infra to deliver industrial, logistics, warehousing and infrastructure projects with confidence, quality and speed.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button style={{ height: '50px', padding: '0 28px', backgroundColor: '#FF6B35', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(255,107,53,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F45A22'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FF6B35'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Request Consultation <ArrowRight size={18} />
              </button>
              <button style={{ height: '50px', padding: '0 28px', backgroundColor: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              >
                View Our Projects <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }} className="cta-stats-grid">
            {statsData.map((stat) => (
              <div key={stat.id} style={{ textAlign: 'center', padding: '0 16px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '12px' }}>
                  <span style={{ color: '#FF6B35', display: 'flex', lineHeight: 0 }}>{stat.icon}</span>
                </div>
                <div style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 0 60px' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px', fontFamily: 'Inter, sans-serif' }}>
            Trusted by Industry Leaders
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(24px, 5vw, 48px)' }}>
            {clientLogos.map((client) => (
              <div key={client.id} style={{ padding: '12px 24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5EAF2', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1E2A5A', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}>{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .cta-stats-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 1px !important; } }
      `}</style>
    </section>
  );
};

export default CaseStudyCTA;