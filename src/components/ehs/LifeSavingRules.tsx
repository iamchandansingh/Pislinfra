import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

// @ts-ignore - Importing the statically generated base64 data file (large original files)
import { iconData } from './iconData';

const ruleData = [
  {
    id: 1,
    imgBase64: iconData['WORK-AT-HEIGHT'],
    titleEn: 'WORK AT HEIGHT',
    descEn: 'Always protect yourself against fall while ascending, descending or working at height (1.8 meters).',
    descHi: 'ऊंचाई (1.8 मीटर) पर चढ़ते, उतरते या काम करते समय हमेशा अपने आप को गिरने से बचाएं।',
  },
  {
    id: 2,
    imgBase64: iconData['PERMIT-TO-WORK'],
    titleEn: 'PERMIT TO WORK',
    descEn: 'Always perform a HSE Tool Box Talk. Work with a valid work permit when required.',
    descHi: 'काम शुरू करने से पहले हमेशा टूल बॉक्स टॉक करें। हमेशा वैध वर्क परमिट के साथ काम करें।',
  },
  {
    id: 3,
    imgBase64: iconData['INCIDENT-REPORTING'],
    titleEn: 'INCIDENT REPORTING',
    descEn: 'All Incidents must be recorded, reported, investigated and recommendations acted upon in a time bound manner.',
    descHi: 'सभी घटनाओं को दर्ज किया जाना चाहिए, रिपोर्ट किया जाना चाहिए और जांच की जानी चाहिए।',
  },
  {
    id: 4,
    imgBase64: iconData['PPE-COMPLIANCE'],
    titleEn: 'PPE COMPLIANCE',
    descEn: 'Personal Protective Equipment (PPE) applicable for the task, must be adhere to at all times.',
    descHi: 'कार्य के उपयुक्त व्यक्तिगत सुरक्षा उपकरण (पीपीई) का कार्य स्थल पे उपयोग करना आवश्यक है।',
  },
  {
    id: 5,
    imgBase64: iconData['LOCKOUT-TAGOUT'],
    titleEn: 'LOCKOUT TAGOUT',
    descEn: 'Always verify energy isolation process (LOTO) prior to commencing any maintenance or servicing work.',
    descHi: 'किसी भी रखरखाव कार्य को शुरू करने से पहले हमेशा लोटो (LOTO) का प्रयोग करें।',
  },
  {
    id: 6,
    imgBase64: iconData['SUSPENDED-LOAD'],
    titleEn: 'SUSPENDED LOAD',
    descEn: 'Never walk, work, or stand below a suspended load.',
    descHi: 'कभी भी लटकते हुए भार के नीचे ना चलें, ना काम करें और ना खड़े रहे।',
  },
  {
    id: 7,
    imgBase64: iconData['AUTHORIZED-ONLY'],
    titleEn: 'AUTHORIZED ONLY',
    descEn: 'Never perform tasks for which you are not trained and competent.',
    descHi: 'कभी भी ऐसे कोई कार्य न करें जिनके लिए आप प्रशिक्षित और अधिकृत नहीं हैं।',
  },
  {
    id: 8,
    imgBase64: iconData['FLOOR-OPENING'],
    titleEn: 'FLOOR OPENING',
    descEn: 'Always install suitable protection around floor edges/openings to prevent falls.',
    descHi: 'गिरने से रोकने के लिए हमेशा खुली छत या किनारे के चारो ओर सुरक्षा घेरा लगाए।',
  },
  {
    id: 9,
    imgBase64: iconData['SCAFFOLD-SAFETY'],
    titleEn: 'SCAFFOLD SAFETY',
    descEn: 'Never move mobile scaffold with personnel or materials on them, to prevent tipping.',
    descHi: 'पलटी होने से रोकने के लिए कभी भी मोबाइल स्काफोल्ड को कर्मियों या सामग्रियों के साथ ना हिलाएं।',
  },
  {
    id: 10,
    imgBase64: iconData['NO-ALCOHOL-DRUGS'],
    titleEn: 'NO ALCOHOL & DRUGS',
    descEn: 'Working under the influence of alcohol and drugs is prohibited. Do not smoke or sleep at workplace.',
    descHi: 'शराब और नशीली पदार्थ का सेवन करके काम करना सख्त मना है। कार्यस्थल पर धूम्रपान ना करें।',
  }
];

const LifeSavingRules = ({ rules, title, subtitle }) => {
  const activeRules = rules && rules.length > 0 ? rules.map((r, i) => ({ id: r.id || (i+1), imgBase64: r.imgBase64Key ? iconData[r.imgBase64Key] : ruleData[i]?.imgBase64, titleEn: r.titleEn, descEn: r.descEn, descHi: r.descHi })) : ruleData;
  const printRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [optimizedIcons, setOptimizedIcons] = useState<Record<number, string>>({});

  // VERY IMPORTANT FIX:
  // The original PNG icons are ~1MB each. When html-to-image tries to convert a DOM with 10MB of images
  // into an SVG string, it creates a massive payload that causes the browser's SVG renderer to crash silently,
  // resulting in missing icons in the PDF.
  // We fix this by compressing/downsizing the images to 300px in the background on load.
  useEffect(() => {
    const optimizeIcons = async () => {
      const optimized: Record<number, string> = {};
      
      for (const rule of ruleData) {
        try {
          optimized[rule.id] = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxDim = 300; // Perfect size for a crisp PDF without being massive
              let w = img.width;
              let h = img.height;
              
              if (w > maxDim || h > maxDim) {
                 const ratio = Math.min(maxDim / w, maxDim / h);
                 w *= ratio;
                 h *= ratio;
              } else {
                 w = maxDim;
                 h = maxDim;
              }
              
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Ensure transparent backgrounds are handled properly
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                // Convert back to PNG base64, now only ~30KB instead of 1MB!
                resolve(canvas.toDataURL('image/png'));
              } else {
                resolve(rule.imgBase64); // Fallback
              }
            };
            img.onerror = () => resolve(rule.imgBase64); // Fallback
            img.src = rule.imgBase64;
          });
        } catch (e) {
          optimized[rule.id] = rule.imgBase64;
        }
      }
      
      setOptimizedIcons(optimized);
    };

    optimizeIcons();
  }, []);

  const downloadPDF = async () => {
    setIsDownloading(true);
    
    setTimeout(async () => {
      try {
        const element = printRef.current;
        if (!element) return;

        // Take snapshot using the compressed icons. 
        // This will succeed flawlessly without hitting SVG memory limits.
        const imgData = await htmlToImage.toPng(element, { 
          pixelRatio: 2, 
          style: { transform: 'none' } 
        });
        
        const pdf = new jsPDF({
          orientation: element.offsetWidth > element.offsetHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [element.offsetWidth, element.offsetHeight]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
        pdf.save('Life_Saving_Safety_Rules.pdf');
      } catch (error: any) {
        console.error("Error generating PDF", error);
        alert("PDF Error: " + (error.message || error.toString()));
      } finally {
        setIsDownloading(false);
      }
    }, 50); 
  };

  const renderGrid = (isPrint = false) => (
    <div className={`grid ${isPrint ? 'grid-cols-5' : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-5'} bg-black gap-[1px]`}>
      {ruleData.map((rule) => {
        // Use the highly-compressed optimized icon for the print poster to avoid crashing the SVG renderer.
        // Use the high-res icon for the live website for best quality.
        const printIcon = optimizedIcons[rule.id] || rule.imgBase64;
        
        return (
          <div 
            key={rule.id}
            className={`bg-white flex flex-col h-full ${isPrint ? 'min-h-[350px]' : 'min-h-full md:min-h-[350px]'}`}
          >
            <div className={`flex flex-col items-center justify-center p-3 sm:p-4 ${isPrint ? 'min-h-[170px]' : 'min-h-[150px] md:min-h-[170px]'} border-b-[1px] border-black bg-white overflow-hidden`}>
              
              {isPrint ? (
                // STATIC ICON FOR PDF
                // Changed back to standard img tag as the massive base64 string issue is now fixed via compression.
                <div className="flex justify-center items-center h-28 w-full mb-4">
                  <img src={printIcon} alt={rule.titleEn} className="w-full h-full object-contain" />
                </div>
              ) : (
                // ANIMATED ICON FOR WEBSITE
                <motion.div 
                  className="flex justify-center items-center h-20 sm:h-28 w-full mb-2 sm:mb-4"
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={rule.imgBase64} alt={rule.titleEn} className="w-full h-full object-contain" />
                </motion.div>
              )}

              <h4 className="text-base font-black uppercase text-black text-center tracking-wide">
                {rule.titleEn}
              </h4>
            </div>

            <div className="flex flex-col flex-1 items-center justify-center p-2 sm:p-4 text-center bg-gray-50">
              <p className="text-[10px] sm:text-xs font-bold text-gray-800 leading-snug mb-2 sm:mb-3">
                {rule.descEn}
              </p>
              <p className="text-[11px] sm:text-sm font-extrabold text-gray-900 leading-snug">
                {rule.descHi}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="py-16 bg-white w-full font-sans flex justify-center relative">
      
      {/* 1. LIVE VISIBLE POSTER */}
      <div className="w-full max-w-[1150px] px-4">
        <div className="bg-white border-[2px] border-black shadow-2xl flex flex-col relative">
          
          <div className="bg-[#005BAC] text-white text-center py-6 border-b-[2px] border-black px-4 flex flex-col items-center justify-center relative">
            <h2 className="text-lg sm:text-xl md:text-3xl font-black uppercase tracking-wider leading-relaxed flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-center pr-12 md:pr-0">
              <span>Life Saving Safety Rules (LSSR)</span>
              <span className="hidden md:inline">/</span>
              <span className="font-bold">जीवन रक्षक सुरक्षा नियम</span>
            </h2>

            <button 
              id="download-btn"
              onClick={downloadPDF}
              title="Download Poster as PDF"
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/20 hover:bg-white/40 transition-colors rounded-full flex items-center justify-center cursor-pointer disabled:opacity-50"
              disabled={isDownloading || Object.keys(optimizedIcons).length < 10}
            >
              {isDownloading ? (
                <span className="text-xs md:text-sm font-bold">...</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </button>
          </div>

          {renderGrid(false)}
        </div>
      </div>

      {/* 2. HIDDEN PRINT POSTER */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div ref={printRef} className="w-[1150px] bg-white border-[2px] border-black flex flex-col">
          <div className="bg-[#005BAC] text-white text-center py-6 border-b-[2px] border-black px-4 flex items-center justify-center">
            <h2 className="text-3xl font-black uppercase tracking-wider leading-relaxed flex flex-row items-center justify-center gap-2 text-center">
              <span>Life Saving Safety Rules (LSSR)</span>
              <span>/</span>
              <span className="font-bold">जीवन रक्षक सुरक्षा नियम</span>
            </h2>
          </div>
          {renderGrid(true)}
        </div>
      </div>

    </section>
  );
};

export default LifeSavingRules;
