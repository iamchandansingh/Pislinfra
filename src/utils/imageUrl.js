import { STRAPI_URL } from '../services/strapi';

const BLOG_FILES = new Set(["25291982daf56f9ce02e7cd1aefc6e5d.png","32711eb5adf0d85f234b64323e755351.png","44ef59a859f6567fe3a5b25e9a750f31.png","72c75288ddf4456952d341fe2720432e.png","9644769f233415508cdb1b859fc9d6a7.png","9721c065918a9f62c31b6d2f834258dc.png","Choosing_the_Right_Industrial_Construction_Partner_12_Questions_to_Ask_284223dc16.avif","Data_Centre_and_Digital_Infrastructure_065af3faf6.avif","How_Smart_Warehouses_Are_Transforming_Supply_Chain_Efficiency_in_2026_3bef2a8522.avif","Industrial_Corridors_in_India_7cff9486a8.avif","Industrial_Flooring_Options_for_Manufacturing_Plants_24700cc7b7.avif","Industrial_Infrastructure_and_Manufacturing1_80a8505b0d.avif","Industrial_Infrastructure_and_Manufacturing_081f9bbb37.avif","ae2b646d9b1d28205efe8c43f041481a.png","c175083bfde97a499aa3e5288439dfd8.png","c3510e1e5b8a53a434fe66166506096f.png","c4f31083a8b547cfdc95ee9cb9a7539f.png","cb91f7b12d9525440063b22374471313.png","fbdfe5b5b2bebbaf5ab446e5388d8d58.png","industrial_EPC_contractor_83969ef29f.avif","industrial_flooring_for_factories_32e837e8a8.avif","optimized_1787755045721_882_Technology_png.webp","optimized_1787755078619_572_Green-Industrial-Park_png.webp","optimized_1787755079697_328_Industrial-Parks_png.webp","optimized_1787755102107_84_Sustainable-Warehouse-Construction_png.webp","optimized_1787755103540_138_Innovative-Materials_png.webp","optimized_1787755126710_874_Logistics-Infrastructure-India_png.webp","optimized_1787755169116_146_Industrial-Construction_png.webp","optimized_1787755169120_911_Understanding-Different_png.webp","optimized_1787755279974_473_Phases-of-Construction_png.webp","optimized_1787755299577_273_Best-EPC-contractors_png.webp","optimized_1787755313504_490_Constructionsd_png.webp","optimized_1787755328860_778_Water-Management_png.webp","optimized_1787755414635_339_Logistics-Park-Companies_png.webp","pexels-photo-1216589.jpeg","pisl_1889ae287f.avif"]);
const AWARD_FILES = new Set(["1.png","10.jpeg","13.jpeg","15.jpeg","1_AMNS_INDIA_svg_svg_778803768e.svg","2.jpg.jpeg","2.png","2_AMNS_INDIA_svg_svg_cbda376d70.svg","3 copy.png","3.png","3_AMNS_INDIA_svg_svg_25c6bc6a74.svg","3_Pragati_57962644f1.avif","4_AMNS_INDIA_svg_svg_7ec5727f1d.svg","4_Pragati_1e9b6445d4.avif","5_AMNS_INDIA_svg_svg_8d79cef566.svg","5_Pragati_8ec3d6d39f.avif","6_Pragati_c805c2e1e6.avif","7_Pragati_706674e3b4.avif","8_Pragati_645979f246.avif","AMNS_india_Hazira_0d9cb9f750.avif","AMNS_india_Haziraa_9b47157a37.avif","CERTIFICATE_OF_APPRECIATION_c275666565.avif","Camera.png","Celebrated-National-Safety-PRR-Jhamuwas-(2).png","Celebrated-National-Safety-PRR-Jhamuwas-(3).png","Celebrated-National-Safety-PRR-Jhamuwas-(4).png","Celebrated-National-Safety-PRR-Jhamuwas-(5).png","Celebrated-National-Safety-PRR-Jhamuwas-(6).png","Celebrated-National-Safety-PRR-Jhamuwas.png","Certificate_of_Appreciation1_fc28b1ea81.avif","Certificate_of_Appreciation_03d82b5347.avif","Compliance.png","Mr_Surendra_Kumar_07babf7d15.avif","Mundra-Petrochem-Adani.png","NCR-Patli.png","PISL-large.png","Reliance-Jamnagar-HSE-(2).png","Reliance-Jamnagar-HSE.png","Safety-Excellence-Awards-Adani-(2).png","Safety-Excellence-Awards-Adani-(3).png","Safety-Excellence-Awards-Adani.png","Untitled-design-1.jpg","Untitled_design_1_8e0ada492c.jpg","adani-Mundra-Petrochem-LTd-Green-Pvc-Project-(2).png","adani-Mundra-Petrochem-LTd-Green-Pvc-Project.png","adani-Mundra-Petrochem-limmited-Jan-25.png","adani-Mundra-Petrochem-limmited-july2025.png","awards (1).png","awards.png","certificate.jpg","ibc-green-warehouse.jpg","indian-achiever-award-certificate.webp","indian-achiever-award.webp","large_2_0_Million_Safe_Man_Hours_ca47844a2d.jpeg","large_Adani_2025_9cc1db32a0.jpeg","large_Adani_8212684d8e.jpeg","large_Adani_Petrochemicals_4b8d3aee71.jpeg","large_Award_0041713e17.jpeg","large_Certificate_c2b0dd8bb2.jpeg","large_Corporate_Excellence_Award_Display_102c19dcdd.png","large_HSE_2024_58e975a8f3.jpeg","large_HSE_e66fd4c36c.jpeg","large_June_2022_July_2025_336c680b3b.jpeg","large_Mundra_Gujarat_India2026_872f6b19e1.jpeg","large_PISL_3f05c00f1e.png","large_Quality_Safety_Training_9cd487d2ab.jpeg","large_SAFETY_EXCELLENCE_AWARD_bc882229ac.jpeg","leed-certificate.webp","leed-gold.webp","medium_Whats_App_Image_2026_09_28_at_17_08_56_e67e5b31ba.jpeg","medium_jamnagar_6764b3e849.jpeg","protection.png","real-estate-conclave.webp","times-india's.png","times_india_s_c79efceb51.png"]);

export const getImageUrl = (url, defaultImg = '') => {
  if (!url) return defaultImg;
  if (typeof url === 'object') {
    url = url.formats?.large?.url ||
          url.formats?.medium?.url ||
          url.formats?.small?.url ||
          url.formats?.thumbnail?.url ||
          url.url ||
          url.attributes?.formats?.large?.url ||
          url.attributes?.formats?.medium?.url ||
          url.attributes?.formats?.small?.url ||
          url.attributes?.formats?.thumbnail?.url ||
          url.attributes?.url ||
          url.data?.attributes?.formats?.large?.url ||
          url.data?.attributes?.url ||
          url.data?.url ||
          '';
  }
  if (!url || typeof url !== 'string') return defaultImg;
  url = url.trim();

  // If already a local image path, return directly
  if (url.startsWith('/images/')) return url;

  if (url.includes('r2.dev/')) {
    const filename = url.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_');
    if (BLOG_FILES.has(filename)) return '/images/blogs/' + filename;
    if (AWARD_FILES.has(filename)) return '/images/awards/' + filename;
    return '/images/projects/' + filename;
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads')) return STRAPI_URL ? (STRAPI_URL + url) : (defaultImg || url);
  return url;
};
