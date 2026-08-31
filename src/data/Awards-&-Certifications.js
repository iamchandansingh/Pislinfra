import untitledDesign from '../assets/Award&Certificate/Untitled-design-1.jpg';
import timesIndia from "../assets/Award&Certificate/times-india's.png";
import indianAchieverCertificate from '../assets/Award&Certificate/indian-achiever-award-certificate.webp';
import indianAchieverAward from '../assets/Award&Certificate/indian-achiever-award.webp';
import leedCertificate from '../assets/Award&Certificate/leed-certificate.webp';
import leedGold from '../assets/Award&Certificate/leed-gold.webp';
import certificate from '../assets/Award&Certificate/certificate.jpg';
import awards15 from '../assets/Award&Certificate/15.jpeg';
import awardsClient from '../assets/Award&Certificate/awards.png';
import award2 from '../assets/Award&Certificate/2.jpg.jpeg';
import award13 from '../assets/Award&Certificate/13.jpeg';
import award10 from '../assets/Award&Certificate/10.jpeg';

const awardsAndCertifications = [
  {
    id: 1,
    title: "ArcelorMittal Nippon Steel India – Sanand Service Centre",
    category: "Safety Excellence",
    year: "2026",
    company: "AM/NS India",
    location: "Sanand, Gujarat",
    description: "Awarded in recognition of exceptional industrial construction execution, zero-harm safety standards, and benchmark EPC delivery at the Sanand Steel Service Centre project.",
    image: "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/1_AMNS_INDIA_svg_svg_778803768e.svg",
    clientImage: "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/2_AMNS_INDIA_svg_svg_cbda376d70.svg",
    images: [
      "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/1_AMNS_INDIA_svg_svg_778803768e.svg",
      "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/2_AMNS_INDIA_svg_svg_cbda376d70.svg",
      "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/3_AMNS_INDIA_svg_svg_25c6bc6a74.svg",
      "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/4_AMNS_INDIA_svg_svg_7ec5727f1d.svg",
      "https://pub-eeb28a3c927b4ae1b67e3e8e731ee105.r2.dev/5_AMNS_INDIA_svg_svg_8d79cef566.svg"
    ],
    pdf: null,
  },
  {
    id: 2,
    title: "Purpose-Driven Infrastructure",
    category: "Report",
    year: "2024",
    description: "At PISL, we are motivated by positive impact sustainability of purpose-driven infrastructure projects which enhance communities, promote eco-friendly practices, and drive economic growth.",
    image: untitledDesign,
    clientImage: timesIndia,
    pdf: "/reports/Pragati-Infra-Solutions-2.pdf",
  },
  {
    id: 2,
    title: "Entrepreneur of the Year",
    category: "Award",
    year: "2024",
    description: "Lt Col Jitender Yadav, the Founder and Chairman of Pragati, has been honoured with the 'Entrepreneur of the Year' award by 'Indian Achievers Forum' for his exceptional achievements and contributions.",
    image: indianAchieverCertificate,
    clientImage: indianAchieverAward,
    pdf: null,
  },
  {
    id: 3,
    title: "The Economic Times Real Estate Awards 2022 – North",
    category: "Award",
    year: "2022",
    description: "Our project Pragati One Logistics Park has been declared the winner of the inaugural edition of 'The Economic Times Real Estate Awards 2022 – North' under the category of Industrial/Warehousing Project.",
    image: null,
    clientImage: null,
    videoUrl: "https://www.youtube.com/watch?v=meNdkFjFuNY",
    pdf: null,
  },
  {
    id: 4,
    title: "LEED Gold Certification",
    category: "Certification",
    year: "2024",
    description: "Pragati One Logistics Park is the first non-captive warehousing project in India to receive Gold certification by the U.S. Green Building Council & Green Business Certification Inc.(GBCI) under Leed V4 Building Design and Construction: Core and Shell Development.",
    image: leedCertificate,
    clientImage: leedGold,
    pdf: null,
  },
  {
    id: 5,
    title: "US LEED Gold Certification",
    category: "Certification",
    year: "2024",
    description: "PISL received US LEED Gold Certification to become one of the first Gold rated warehouses in India. It is a privilege to be honoured by the USGBC for the efforts of bringing sustainability and protecting the environment.",
    image: certificate,
    clientImage: null,
    pdf: null,
  },
  {
    id: 6,
    title: "The Economic Times Real Estate Conclave & Awards 2022",
    category: "Award",
    year: "2022",
    description: "Pragati One Logistics Park was recognized as a Winner at The Economic Times Real Estate Conclave & Awards 2022 (North). The award highlights the project's excellence in logistics infrastructure and its contribution to modern industrial and warehousing development.",
    image: awards15,
    clientImage: awardsClient,
    pdf: null,
  },
  {
    id: 7,
    title: "Safety Excellence Award - Adani KCL Project",
    category: "Award",
    year: "2025",
    description: "Pragati Infra Solutions Pvt. Ltd. received the Safety Excellence Award from Adani for the KCL Project at Mundra, achieving 3.5 million safe man-hours and remaining LTI-free from June 2022 to July 2025.",
    image: award2,
    clientImage: award13,
    pdf: null,
  },
  {
    id: 8,
    title: "Best Safety Conscious Contractor - Adani Petrochemicals",
    category: "Award",
    year: "2024",
    description: "Pragati Infra Solutions Pvt. Ltd. received the Best Safety Conscious Contractor award from Adani Petrochemicals for maintaining excellent safety practices at the Green PVC Project, Mundra. This recognition reflects the company's commitment to high safety standards and a secure working environment across its operations.",
    image: award10,
    clientImage: awardsClient,
    pdf: null,
  },
  {
    id: 9,
    title: "Heavy Industrial EPC & Infrastructure Excellence Award",
    category: "Award",
    year: "2023",
    company: "National Infrastructure Forum",
    description: "Conferred for outstanding heavy industrial EPC execution, precision PEB construction, and accelerated delivery across Rajasthan and Gujarat industrial corridors.",
    image: award13,
    clientImage: award2,
    pdf: null,
  },
  {
    id: 10,
    title: "Zero-Incident Safety & Quality Benchmark Accolade",
    category: "Award",
    year: "2023",
    company: "Adani & Industrial Safety Council",
    description: "Awarded for exceptional site safety, rigorous QA/QC adherence, and zero reportable lost-time injuries during mega logistics park execution.",
    image: awards15,
    clientImage: awardsClient,
    pdf: null,
  }
];

export default awardsAndCertifications;