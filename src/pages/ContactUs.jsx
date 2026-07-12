import React from 'react'
import PageHero from '../components/hero/PageHero'
import BlogSEO from '../components/Blog/BlogSEO'
import ContactCardsSection from '../components/Contact-us/ContactCardsSection'
import ContactInquirySection from '../components/Contact-us/ContactInquirySection'
import ContactMapSection from '../components/Contact-us/ContactMapSection'

const ContactUs = () => {
  const seoData = {
    contentType: 'page',
    title: 'Contact Us',
    seoTitle: 'Contact Us',
    seoDescription: 'Contact Pislinfra for industrial infrastructure projects. Reach out via phone, email, or visit our office in Gurugram, Haryana. Get a quote today.',
    seoKeywords: 'contact Pislinfra, infrastructure company contact, construction inquiry, industrial project quote, PISL office, Gurugram',
    slug: 'contact-us',
    canonicalUrl: 'https://pislinfra.com/contact-us',
    ogTitle: 'Contact Pislinfra',
    ogDescription: 'Get in touch with Pislinfra for warehousing, logistics & construction projects. Call, email or visit us.',
    ogImage: 'https://pislinfra.com/images/hero/Contact-Us.png',
    ogType: 'website',
    twitterTitle: 'Contact Pislinfra - Infrastructure Company',
    twitterDescription: 'Reach out for industrial construction & infrastructure projects.',
    twitterImage: 'https://pislinfra.com/images/hero/Contact-Us.png',
    twitterCardType: 'summary_large_image',
    schemaType: 'ContactPage',
    breadcrumbSchema: true,
    organizationSchema: true,
    tags: ['Contact', 'Inquiry', 'Quote', 'Industrial', 'Construction'],
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      
      <BlogSEO blog={seoData} />

      <PageHero
        title="Get in Touch"
        subtitle="Secure enterprise channel for infrastructure collaboration."
        breadcrumb="Contact"
        bgImage="/images/hero/Contact-Us.png"
      />

      <div className="contact-sections" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0' }}>
        <ContactCardsSection />
        <ContactInquirySection />
        <ContactMapSection />
      </div>

      <style>{`
        @media (min-width: 640px) {
          .contact-sections { gap: 0 !important; }
        }
        @media (min-width: 1024px) {
          .contact-sections { gap: 0 !important; }
        }
      `}</style>
    </div>
  )
}

export default ContactUs