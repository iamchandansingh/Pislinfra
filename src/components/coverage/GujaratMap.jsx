/**
 * =============================================================================
 * FILE: src/components/coverage/GujaratMap.jsx
 * FINAL - Dahej + Dahej-02 Combined in One Marker
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Building2, Ruler, ClipboardList, User,
  ChevronRight, ChevronLeft, Activity, X, Layers,
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import projectsData from '../../data/projectsData';

const ORANGE = '#f97316';
const FALLBACK_IMG = 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600';

const gujaratOngoingProjects = projectsData
  .filter(p => p.state === 'Gujarat')
  .map(p => ({
    id: p.id, name: p.name, state: p.state, city: p.location,
    status: 'Ongoing', category: p.category, area: p.area,
    client: p.client, scope: p.scope, timeline: p.timeline,
    progress: Math.floor(Math.random() * 60) + 25,
    image: p.images?.[0] || FALLBACK_IMG,
  }));

// ⭐ COMBINE Dahej + Dahej-02 under 'Dahej' key ⭐
const locationCounts = {};
gujaratOngoingProjects.forEach(p => { 
  let key = p.city;
  if (key === 'Dahej-02') key = 'Dahej'; // Combine into Dahej
  if (!locationCounts[key]) locationCounts[key] = [];
  locationCounts[key].push(p);
});

const LOCATIONS = {
  'Mundra':{cx:25.0,cy:43.0},'Hazira, Surat':{cx:64,cy:63},
  'Jamnagar':{cx:30,cy:50},
  'Dahej':{cx:63,cy:56.5}, // Single marker for both
  'GIDC Sanand':{cx:64.5,cy:39},
};

const POPUP_W=280,DOT_R=8,GAP=6,FLIP_TH=220;

const RoundProgress = ({ progress, size = 40, strokeWidth = 4, color = ORANGE }) => {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const off = circ - (progress / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <motion.circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circ} initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:off}} transition={{duration:2, ease:'easeOut'}} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size>40?13:10, fontWeight: 900, color }}>{progress}%</span>
      </div>
    </div>
  );
};

const InlineProgress = ({ progress, color = ORANGE }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
    <div style={{ width: 55, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
      <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:2,ease:'easeOut'}} style={{height:'100%',background:color,borderRadius:3}} />
    </div>
    <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 34, textAlign: 'right' }}>{progress}%</span>
  </div>
);

const SingleProjectPopup = ({ project, anchorPx, mapSize, onClose, onProjectClick }) => {
  const popupW = 200;
  const flipDown = (anchorPx.y - DOT_R - GAP) < FLIP_TH;
  let left = anchorPx.x - popupW / 2;
  left = Math.max(8, Math.min(left, mapSize.w - popupW - 8));
  const arrowLeft = Math.max(14, Math.min(anchorPx.x - left, popupW - 14));
  const vertStyle = flipDown ? { top: anchorPx.y + DOT_R + GAP + 10 } : { bottom: mapSize.h - anchorPx.y + DOT_R + GAP + 10 };
  return (
    <motion.div initial={{opacity:0,scale:0.88,y:flipDown?-8:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.88,y:flipDown?-6:6}} transition={{type:'spring',stiffness:380,damping:28}} style={{position:'absolute',width:popupW,left,zIndex:100,pointerEvents:'all',...vertStyle}}>
      {!flipDown && <div style={{position:'absolute',bottom:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderTop:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}
      <div onClick={e=>{e.stopPropagation();onProjectClick(project);}} style={{background:'#ffffff',borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',overflow:'hidden',cursor:'pointer',padding:'14px',position:'relative'}}>
        <button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'absolute',top:6,right:6,width:20,height:20,borderRadius:'50%',background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:5,padding:0}}><X size={10}/></button>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <RoundProgress progress={project.progress} size={44} strokeWidth={4} />
          <span style={{fontSize:12,fontWeight:700,color:'#1e293b',flex:1,lineHeight:1.4}}>{project.name}</span>
        </div>
      </div>
      {flipDown && <div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}
    </motion.div>
  );
};

const CityProjectsPopup=({cityProjects,anchorPx,mapSize,onClose,onProjectClick})=>{const projectCount=cityProjects.length;const popupW=Math.min(POPUP_W,mapSize.w-24);const flipDown=(anchorPx.y-DOT_R-GAP)<FLIP_TH;let left=anchorPx.x-popupW/2;left=Math.max(8,Math.min(left,mapSize.w-popupW-8));const arrowLeft=Math.max(14,Math.min(anchorPx.x-left,popupW-14));const vertStyle=flipDown?{top:anchorPx.y+DOT_R+GAP+10}:{bottom:mapSize.h-anchorPx.y+DOT_R+GAP+10};return(<motion.div initial={{opacity:0,scale:0.88,y:flipDown?-8:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.88,y:flipDown?-6:6}} transition={{type:'spring',stiffness:380,damping:28}} style={{position:'absolute',width:popupW,left,zIndex:100,pointerEvents:'all',...vertStyle}}>{!flipDown&&<div style={{position:'absolute',bottom:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderTop:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}<div style={{background:'#ffffff',borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',overflow:'hidden',position:'relative',maxHeight:400,overflowY:'auto'}}><button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'sticky',top:8,float:'right',width:22,height:22,borderRadius:'50%',background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:5,padding:0,marginRight:8,marginTop:4}}><X size={11}/></button><div style={{padding:'10px 14px 6px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:8}}><div style={{background:`${ORANGE}15`,borderRadius:6,padding:'4px 8px',display:'flex',alignItems:'center',gap:4}}><Layers size={12} color={ORANGE}/><span style={{fontSize:10,fontWeight:700,color:ORANGE}}>{projectCount} Projects</span></div><span style={{fontSize:10,fontWeight:600,color:'#64748b'}}>Dahej, Gujarat</span></div>{cityProjects.map((project,idx)=>(<div key={project.id} onClick={e=>{e.stopPropagation();onProjectClick(project);}} style={{padding:'10px 14px',cursor:'pointer',borderBottom:idx<cityProjects.length-1?'1px solid #f1f5f9':'none',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{flex:1,fontSize:12,fontWeight:700,color:'#1e293b',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{project.name}</span><InlineProgress progress={project.progress} /></div></div>))}</div>{flipDown&&<div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}</motion.div>);};

const MapMarker=({cityProjects,isSelected,isHovered,onHover,onLeave,onClick})=>{const color=ORANGE;const isActive=isSelected||isHovered;const projectCount=cityProjects.length;const loc=LOCATIONS[cityProjects[0].city]||{cx:50,cy:50};const SIZE=26;return(<div style={{position:'absolute',left:`${loc.cx}%`,top:`${loc.cy}%`,transform:'translate(-50%,-50%)',cursor:'pointer',zIndex:isSelected?60:50,pointerEvents:'all'}} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick}><span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',background:color,opacity:isActive?0.30:0.15,animation:'mmPing 2.4s cubic-bezier(0,.2,.2,1) infinite',animationDuration:isActive?'1.2s':'2.4s',pointerEvents:'none'}}/>{isSelected&&<motion.span initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',border:`2px solid ${color}`,animation:'mmGlow 1.6s ease-in-out infinite',pointerEvents:'none'}}/>}<motion.div animate={{scale:isActive?1.4:1}} transition={{type:'spring',stiffness:320,damping:22}} style={{width:SIZE,height:SIZE,borderRadius:'50%',background:color,border:'2.5px solid #ffffff',boxShadow:isSelected?`0 0 0 3px ${ORANGE}30`:'0 2px 6px rgba(0,0,0,0.18)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}><MapPin size={14} color="#ffffff" strokeWidth={2.2} style={{flexShrink:0}}/></motion.div>{projectCount>1&&<div style={{position:'absolute',top:-5,right:-12,background:'#ef4444',color:'#ffffff',minWidth:18,height:18,borderRadius:10,fontSize:10,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px',border:'2px solid #ffffff',boxShadow:'0 2px 6px rgba(0,0,0,0.2)',pointerEvents:'none',zIndex:5}}>{projectCount}</div>}</div>);};

const CardProject=({project,isSelected,onClick})=>{const circ=2*Math.PI*22;const off=circ-(project.progress/100)*circ;return(<div className={`gcm-card ${isSelected?'gcm-card-selected':''}`} onClick={()=>onClick(project)} style={{cursor:'pointer'}}><div className="gcm-card-image-wrapper"><img src={project.image} alt={project.name} className="gcm-card-image"/><div className="gcm-badges-overlay"><span className="gcm-badge-status" style={{background:'#fff5f0',color:ORANGE,border:'1px solid #ffd5c2'}}><Activity size={11}/>{project.status}</span></div></div><div className="gcm-card-content"><span className="gcm-badge-cat">{project.category}</span><h3 className="gcm-card-title">{project.name}</h3><div className="gcm-labels-grid"><div className="gcm-label-item"><MapPin size={12} color={ORANGE}/><div><span className="gcm-label-head">Location</span><span className="gcm-label-val">{project.city}, {project.state}</span></div></div><div className="gcm-label-item"><Ruler size={12} color={ORANGE}/><div><span className="gcm-label-head">Build-up Area</span><span className="gcm-label-val">{project.area}</span></div></div><div className="gcm-label-item gcm-label-full"><ClipboardList size={12} color={ORANGE}/><div><span className="gcm-label-head">Scope of Work</span><span className="gcm-label-val">{project.scope}</span></div></div><div className="gcm-label-item gcm-label-full"><User size={12} color={ORANGE}/><div><span className="gcm-label-head">Client</span><span className="gcm-label-val">{project.client}</span></div></div></div><div className="gcm-divider"/><div className="gcm-card-bottom"><div style={{position:'relative',width:50,height:50,flexShrink:0}}><svg width="50" height="50" style={{transform:'rotate(-90deg)'}}><circle cx="25" cy="25" r="22" fill="none" stroke="#f1f5f9" strokeWidth="4.5"/><motion.circle cx="25" cy="25" r="22" fill="none" stroke={ORANGE} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ} initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:off}} transition={{duration:2,ease:'easeOut'}}/></svg><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:13,fontWeight:900,color:ORANGE}}>{project.progress}%</span></div></div><div style={{flex:1,marginLeft:12}}><span style={{fontSize:11,fontWeight:600,color:'#94a3b8',display:'block',marginBottom:4}}>{project.timeline||'N/A'}</span><span style={{fontSize:12,fontWeight:700,color:ORANGE}}>View Details <ChevronRight size={14} style={{verticalAlign:'middle'}}/></span></div></div></div></div>);};

export default function GujaratMap(){const navigate=useNavigate();const[selectedCity,setSelectedCity]=useState(null);const[highlightedIds,setHighlightedIds]=useState([]);const[hoveredCity,setHoveredCity]=useState(null);const[popupAnchor,setPopupAnchor]=useState(null);const[mapSize,setMapSize]=useState({w:0,h:0});const mapRef=useRef(null);const swiperRef=useRef(null);const prevRef=useRef(null);const nextRef=useRef(null);

const syncMapSize=useCallback(()=>{if(mapRef.current){const{width,height}=mapRef.current.getBoundingClientRect();setMapSize({w:width,h:height});}},[]);
useEffect(()=>{syncMapSize();const ro=new ResizeObserver(syncMapSize);if(mapRef.current)ro.observe(mapRef.current);return()=>ro.disconnect();},[syncMapSize]);
useEffect(()=>{if(!selectedCity||mapSize.w===0)return;const cityProjects=locationCounts[selectedCity];if(!cityProjects||cityProjects.length===0)return;const loc=LOCATIONS[cityProjects[0].city]||{cx:50,cy:50};setPopupAnchor({x:(loc.cx/100)*mapSize.w,y:(loc.cy/100)*mapSize.h});},[mapSize,selectedCity]);
useEffect(()=>{if(selectedCity){const projs=gujaratOngoingProjects.filter(p=>p.city===selectedCity||(selectedCity==='Dahej'&&p.city==='Dahej-02'));setHighlightedIds(projs.map(p=>p.id));const cardIdx=gujaratOngoingProjects.findIndex(p=>p.city===selectedCity||(selectedCity==='Dahej'&&p.city==='Dahej-02'));setTimeout(()=>{if(swiperRef.current&&cardIdx>=0)swiperRef.current.slideTo(cardIdx);},80);}else{setHighlightedIds([]);}},[selectedCity]);

const selectedCityProjects=selectedCity?(locationCounts[selectedCity]||null):null;
const isSingleProject=selectedCityProjects&&selectedCityProjects.length===1;

const handleMarkerClick=(city,projects)=>{if(selectedCity===city){setSelectedCity(null);setPopupAnchor(null);return;}const loc=LOCATIONS[projects[0].city]||{cx:50,cy:50};setPopupAnchor({x:(loc.cx/100)*mapSize.w,y:(loc.cy/100)*mapSize.h});setSelectedCity(city);};
const closePopup=()=>{setSelectedCity(null);setPopupAnchor(null);};
const handleProjectClickFromPopup=(project)=>{setHighlightedIds([project.id]);const cardIdx=gujaratOngoingProjects.findIndex(p=>p.id===project.id);setTimeout(()=>{if(swiperRef.current&&cardIdx>=0)swiperRef.current.slideTo(cardIdx);},80);};
const handleCardClick=(project)=>{const slug=project.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');window.location.href=`/project/ongoing/${slug}`;};

return(<div className="gcm-layout">
<div className="gcm-left-panel"><div className="gcm-map-container" ref={mapRef}><img src="/images/Home/Gujrat.png" alt="Gujarat Map" style={{width:'100%',height:'100%',objectFit:'contain',position:'absolute',inset:0}}/><div className="gcm-markers-overlay">{selectedCity&&<div onClick={closePopup} style={{position:'absolute',inset:0,zIndex:45,pointerEvents:'all',cursor:'default'}}/>}{Object.entries(locationCounts).map(([city,projects])=>(<MapMarker key={city} cityProjects={projects} isSelected={selectedCity===city} isHovered={hoveredCity===city} onHover={()=>setHoveredCity(city)} onLeave={()=>setHoveredCity(null)} onClick={()=>handleMarkerClick(city,projects)}/>))}<AnimatePresence>{selectedCityProjects&&popupAnchor&&mapSize.w>0&&isSingleProject&&<SingleProjectPopup key={selectedCity} project={selectedCityProjects[0]} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup}/>}{selectedCityProjects&&popupAnchor&&mapSize.w>0&&!isSingleProject&&<CityProjectsPopup key={selectedCity} cityProjects={selectedCityProjects} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup}/>}</AnimatePresence></div></div><div className="gcm-legend"><h4>Gujarat Ongoing Projects</h4><div className="gcm-legend-item"><span className="cm-legend-dot" style={{backgroundColor:ORANGE}}/><span>Ongoing ({gujaratOngoingProjects.length})</span></div></div></div>
<div className="gcm-right-panel">
<div className="gcm-header"><div className="gcm-header-top"><div><h1 className="gcm-main-title">Gujarat <span style={{color:ORANGE}}>Ongoing</span> Projects</h1><p className="gcm-subtitle">Real-time monitoring of infrastructure development across Gujarat.</p></div><div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,border:'2px solid #f97316',background:'#fff5f0',color:ORANGE,fontWeight:700,fontSize:14}}><Activity size={15}/>Ongoing<span style={{background:ORANGE,color:'#fff',borderRadius:20,padding:'2px 10px',fontSize:12,fontWeight:800}}>{gujaratOngoingProjects.length}</span></div></div></div>
<div className="gcm-content-area">{gujaratOngoingProjects.length>0?(<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}} style={{flex:1,display:'flex',flexDirection:'column'}}><div className="gcm-slider-wrapper"><div className="gcm-nav-arrows"><button ref={prevRef} className="gcm-nav-btn gcm-nav-prev-btn" onClick={()=>swiperRef.current?.slidePrev()}><ChevronLeft size={20}/></button><button ref={nextRef} className="gcm-nav-btn gcm-nav-next-btn" onClick={()=>swiperRef.current?.slideNext()}><ChevronRight size={20}/></button></div><Swiper onSwiper={s=>(swiperRef.current=s)} modules={[Navigation,Pagination,Autoplay]} spaceBetween={16} slidesPerView={2} slidesPerGroup={2} navigation={{prevEl:prevRef.current,nextEl:nextRef.current}} pagination={{clickable:true,dynamicBullets:true}} autoplay={{delay:4000,disableOnInteraction:false,pauseOnMouseEnter:true}} breakpoints={{0:{slidesPerView:1,slidesPerGroup:1},1024:{slidesPerView:2,slidesPerGroup:2}}} onBeforeInit={sw=>{sw.params.navigation.prevEl=prevRef.current;sw.params.navigation.nextEl=nextRef.current;}} style={{paddingBottom:'50px'}}>{gujaratOngoingProjects.map(project=>(<SwiperSlide key={project.id} style={{height:'auto'}}><div onMouseEnter={()=>setHoveredCity(project.city)} onMouseLeave={()=>setHoveredCity(null)}><CardProject project={project} isSelected={highlightedIds.includes(project.id)} onClick={handleCardClick}/></div></SwiperSlide>))}</Swiper></div></motion.div>):(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="gcm-empty-state"><Building2 size={64}/><h3>No ongoing projects found in Gujarat</h3></motion.div>)}</div>
</div>
<style>{`
@keyframes mmPing{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.4;}70%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}100%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}}
@keyframes mmGlow{0%,100%{opacity:0.9;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.4;transform:translate(-50%,-50%) scale(1.35);}}
.gcm-layout{display:flex;flex-direction:column;min-height:100vh;background:#fff;color:#0f172a;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
@media(min-width:1024px){.gcm-layout{flex-direction:row;height:100vh;overflow:hidden;}}
.gcm-left-panel{width:100%;min-height:50vh;position:relative;background:#f8fafc;border-right:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;padding:20px;}
@media(min-width:1024px){.gcm-left-panel{width:45%;min-height:100%;}}
.gcm-map-container{position:relative;width:100%;max-width:600px;aspect-ratio:1/1.3;overflow:visible;}
.gcm-markers-overlay{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
.gcm-legend{position:absolute;bottom:20px;left:20px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border:1px solid #e2e8f0;padding:12px 16px;border-radius:12px;}
.gcm-legend h4{margin:0 0 8px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;}
.gcm-legend-item{display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:12px;font-weight:600;color:#28286e;}
.cm-legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.gcm-right-panel{width:100%;display:flex;flex-direction:column;background:#fff;overflow:hidden;}
@media(min-width:1024px){.gcm-right-panel{width:55%;}}
.gcm-header{flex-shrink:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:24px 40px 20px;border-bottom:1px solid #e2e8f0;}
.gcm-header-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
.gcm-main-title{margin:0;font-size:26px;font-weight:900;color:#28286e;letter-spacing:-0.5px;}
.gcm-subtitle{margin:4px 0 0;color:#64748b;font-size:13px;}
.gcm-content-area{padding:28px 40px;flex:1;display:flex;flex-direction:column;overflow:hidden;}
.gcm-slider-wrapper{position:relative;width:100%;height:100%;}
.gcm-nav-arrows{position:absolute;top:-54px;right:0;display:flex;gap:6px;z-index:10;}
.gcm-nav-btn{width:34px;height:34px;border-radius:8px;background:#fff;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#28286e;transition:all 0.2s;}
.gcm-nav-btn:hover{background:#f8fafc;border-color:#f97316;color:#f97316;}
@media(max-width:1024px){.gcm-nav-arrows{display:none;}}
.gcm-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;transition:all 0.3s;display:flex;flex-direction:column;overflow:hidden;height:100%;}
.gcm-card:hover{border-color:#cbd5e1;transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,0.06);}
.gcm-card-selected{border:3px solid #f97316!important;box-shadow:0 0 0 4px rgba(249,115,22,0.12)!important;}
.gcm-card-image-wrapper{position:relative;width:100%;height:185px;overflow:hidden;flex-shrink:0;}
.gcm-card-image{width:100%;height:100%;object-fit:cover;transition:transform 0.4s;}
.gcm-card:hover .gcm-card-image{transform:scale(1.06);}
.gcm-badges-overlay{position:absolute;top:12px;left:12px;}
.gcm-badge-status{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px;backdrop-filter:blur(4px);}
.gcm-card-content{padding:16px 18px 18px;flex:1;display:flex;flex-direction:column;gap:9px;}
.gcm-badge-cat{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.6px;padding:3px 8px;border-radius:10px;display:inline-block;background:#f1f5f9;color:#475569;width:fit-content;}
.gcm-card-title{margin:0;font-size:15px;font-weight:800;color:#28286e;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.gcm-labels-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.gcm-label-item{display:flex;align-items:flex-start;gap:7px;padding:7px 9px;background:#f8fafc;border-radius:8px;border:1px solid #f1f5f9;}
.gcm-label-full{grid-column:1/-1;}
.gcm-label-head{font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:2px;}
.gcm-label-val{font-size:11px;font-weight:600;color:#334155;line-height:1.35;}
.gcm-divider{height:1px;background:#e2e8f0;margin:2px 0;}
.gcm-card-bottom{display:flex;align-items:center;gap:10px;margin-top:auto;padding-top:4px;}
.gcm-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 0;color:#94a3b8;text-align:center;flex:1;}
.gcm-empty-state svg{opacity:0.3;margin-bottom:16px;}
.gcm-empty-state h3{margin:0;color:#28286e;font-size:20px;font-weight:700;}
.swiper{width:100%!important;}
.swiper-wrapper{align-items:stretch!important;}
.swiper-slide{height:auto!important;}
.swiper-pagination{position:relative!important;bottom:auto!important;margin-top:16px!important;text-align:center!important;}
.swiper-pagination-bullet{background:#cbd5e1!important;width:8px!important;height:8px!important;opacity:1!important;transition:all 0.3s!important;margin:0 4px!important;}
.swiper-pagination-bullet-active{background:#f97316!important;width:24px!important;border-radius:4px!important;}
`}</style>
</div>);}