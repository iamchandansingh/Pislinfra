/**
 * =============================================================================
 * FILE: src/components/coverage/HaryanaCompletedMap.jsx
 * FINAL - Single: Round Progress | Multi: Inline Bar Progress
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Building2, Ruler, ClipboardList, User,
  ChevronRight, ChevronLeft, CheckCircle2, X, Layers,
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import completedProjectsData from '../../data/completedProjects';

const GREEN = '#198847';
const FALLBACK_IMG = 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600';

const normalizeCity = (city) => {
  const mapping = {'Farukhnagar':'Farukhnagar','Farrukhnagar':'Farukhnagar'};
  return mapping[city] || city;
};

const haryanaCompletedProjects = completedProjectsData
  .filter(p => p.state === 'Haryana')
  .map(p => ({
    id: p.id, name: p.name, state: p.state, city: normalizeCity(p.location),
    status: 'Completed', category: p.category, area: p.area,
    client: p.client, scope: p.scope, timeline: p.timeline,
    progress: 100, image: p.images?.[0] || FALLBACK_IMG,
  }));

const locationCounts = {};
haryanaCompletedProjects.forEach(p => { const key = p.city; if (!locationCounts[key]) locationCounts[key] = []; locationCounts[key].push(p); });

const LOCATIONS = {
  'Pataudi':{cx:35,cy:44},'Patli':{cx:36,cy:41},'Tauru':{cx:42,cy:50},
  'Palwal':{cx:60,cy:55},'Farukhnagar':{cx:30,cy:38},'Khijuri':{cx:31,cy:55},
  'Luhari':{cx:31,cy:41},'Pathreri':{cx:36,cy:51},'Jamalpur':{cx:39,cy:41},
  'Manesar':{cx:44,cy:42},'Bilaspur':{cx:40,cy:45},'Dharuhera':{cx:31,cy:51},
};

const POPUP_W=280,DOT_R=8,GAP=6,FLIP_TH=220;

/* =============================================================================
   ROUND PROGRESS - Single Project (Animated 2s)
============================================================================= */
const RoundProgress = ({ progress, size = 40, strokeWidth = 4, color = GREEN }) => {
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

/* =============================================================================
   INLINE BAR PROGRESS - Multi Project List (Animated 2s)
============================================================================= */
const InlineProgress = ({ progress, color = GREEN }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
    <div style={{ width: 55, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
      <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:2,ease:'easeOut'}} style={{height:'100%',background:color,borderRadius:3}} />
    </div>
    <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 34, textAlign: 'right' }}>{progress}%</span>
  </div>
);

/* =============================================================================
   SINGLE PROJECT POPUP - Round Progress
============================================================================= */
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

/* =============================================================================
   MULTI PROJECT POPUP - Inline Bar Progress
============================================================================= */
const CityProjectsPopup=({cityProjects,anchorPx,mapSize,onClose,onProjectClick})=>{const projectCount=cityProjects.length;const popupW=Math.min(POPUP_W,mapSize.w-24);const flipDown=(anchorPx.y-DOT_R-GAP)<FLIP_TH;let left=anchorPx.x-popupW/2;left=Math.max(8,Math.min(left,mapSize.w-popupW-8));const arrowLeft=Math.max(14,Math.min(anchorPx.x-left,popupW-14));const vertStyle=flipDown?{top:anchorPx.y+DOT_R+GAP+10}:{bottom:mapSize.h-anchorPx.y+DOT_R+GAP+10};return(<motion.div initial={{opacity:0,scale:0.88,y:flipDown?-8:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.88,y:flipDown?-6:6}} transition={{type:'spring',stiffness:380,damping:28}} style={{position:'absolute',width:popupW,left,zIndex:100,pointerEvents:'all',...vertStyle}}>{!flipDown&&<div style={{position:'absolute',bottom:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderTop:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}<div style={{background:'#ffffff',borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',overflow:'hidden',position:'relative',maxHeight:400,overflowY:'auto'}}><button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'sticky',top:8,float:'right',width:22,height:22,borderRadius:'50%',background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:5,padding:0,marginRight:8,marginTop:4}}><X size={11}/></button><div style={{padding:'10px 14px 6px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:8}}><div style={{background:`${GREEN}15`,borderRadius:6,padding:'4px 8px',display:'flex',alignItems:'center',gap:4}}><Layers size={12} color={GREEN}/><span style={{fontSize:10,fontWeight:700,color:GREEN}}>{projectCount} Projects</span></div><span style={{fontSize:10,fontWeight:600,color:'#64748b'}}>{cityProjects[0].city}, {cityProjects[0].state}</span></div>{cityProjects.map((project,idx)=>(<div key={project.id} onClick={e=>{e.stopPropagation();onProjectClick(project);}} style={{padding:'10px 14px',cursor:'pointer',borderBottom:idx<cityProjects.length-1?'1px solid #f1f5f9':'none',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{flex:1,fontSize:12,fontWeight:700,color:'#1e293b',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{project.name}</span><InlineProgress progress={project.progress} /></div></div>))}</div>{flipDown&&<div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}</motion.div>);};

const MapMarker=({cityProjects,isSelected,isHovered,onHover,onLeave,onClick})=>{const color=GREEN;const isActive=isSelected||isHovered;const projectCount=cityProjects.length;const loc=LOCATIONS[cityProjects[0].city]||{cx:50,cy:50};const SIZE=26;return(<div style={{position:'absolute',left:`${loc.cx}%`,top:`${loc.cy}%`,transform:'translate(-50%,-50%)',cursor:'pointer',zIndex:isSelected?60:50,pointerEvents:'all'}} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick}><span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',background:color,opacity:isActive?0.30:0.15,animation:'mmPing 2.4s cubic-bezier(0,.2,.2,1) infinite',animationDuration:isActive?'1.2s':'2.4s',pointerEvents:'none'}}/>{isSelected&&<motion.span initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',border:`2px solid ${color}`,animation:'mmGlow 1.6s ease-in-out infinite',pointerEvents:'none'}}/>}<motion.div animate={{scale:isActive?1.4:1}} transition={{type:'spring',stiffness:320,damping:22}} style={{width:SIZE,height:SIZE,borderRadius:'50%',background:color,border:'2.5px solid #ffffff',boxShadow:isSelected?`0 0 0 3px ${GREEN}30`:'0 2px 6px rgba(0,0,0,0.18)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}><MapPin size={14} color="#ffffff" strokeWidth={2.2} style={{flexShrink:0}}/></motion.div>{projectCount>1&&<div style={{position:'absolute',top:-5,right:-12,background:'#ef4444',color:'#ffffff',minWidth:18,height:18,borderRadius:10,fontSize:10,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px',border:'2px solid #ffffff',boxShadow:'0 2px 6px rgba(0,0,0,0.2)',pointerEvents:'none',zIndex:5}}>{projectCount}</div>}</div>);};

const CardProject=({project,isSelected,onClick})=>{const circ=2*Math.PI*22;const off=circ-(project.progress/100)*circ;return(<div className={`hcm-card ${isSelected?'hcm-card-selected':''}`} onClick={()=>onClick(project)} style={{cursor:'pointer'}}><div className="hcm-card-image-wrapper"><img src={project.image} alt={project.name} className="hcm-card-image"/><div className="hcm-badges-overlay"><span className="hcm-badge-status" style={{background:'#f0fdf4',color:GREEN,border:'1px solid #bbf7d0'}}><CheckCircle2 size={11}/>{project.status}</span></div></div><div className="hcm-card-content"><span className="hcm-badge-cat">{project.category}</span><h3 className="hcm-card-title">{project.name}</h3><div className="hcm-labels-grid"><div className="hcm-label-item"><MapPin size={12} color={GREEN}/><div><span className="hcm-label-head">Location</span><span className="hcm-label-val">{project.city}, {project.state}</span></div></div><div className="hcm-label-item"><Ruler size={12} color={GREEN}/><div><span className="hcm-label-head">Build-up Area</span><span className="hcm-label-val">{project.area}</span></div></div><div className="hcm-label-item hcm-label-full"><ClipboardList size={12} color={GREEN}/><div><span className="hcm-label-head">Scope of Work</span><span className="hcm-label-val">{project.scope}</span></div></div><div className="hcm-label-item hcm-label-full"><User size={12} color={GREEN}/><div><span className="hcm-label-head">Client</span><span className="hcm-label-val">{project.client}</span></div></div></div><div className="hcm-divider"/><div className="hcm-card-bottom"><div style={{position:'relative',width:50,height:50,flexShrink:0}}><svg width="50" height="50" style={{transform:'rotate(-90deg)'}}><circle cx="25" cy="25" r="22" fill="none" stroke="#f1f5f9" strokeWidth="4.5"/><motion.circle cx="25" cy="25" r="22" fill="none" stroke={GREEN} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ} initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:off}} transition={{duration:2,ease:'easeOut'}}/></svg><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:13,fontWeight:900,color:GREEN}}>{project.progress}%</span></div></div><div style={{flex:1,marginLeft:12}}><span style={{fontSize:11,fontWeight:600,color:'#94a3b8',display:'block',marginBottom:4}}>{project.timeline||'N/A'}</span><span style={{fontSize:12,fontWeight:700,color:GREEN}}>View Details <ChevronRight size={14} style={{verticalAlign:'middle'}}/></span></div></div></div></div>);};

export default function HaryanaCompletedMap(){const navigate=useNavigate();const[selectedCity,setSelectedCity]=useState(null);const[highlightedIds,setHighlightedIds]=useState([]);const[hoveredCity,setHoveredCity]=useState(null);const[popupAnchor,setPopupAnchor]=useState(null);const[mapSize,setMapSize]=useState({w:0,h:0});const mapRef=useRef(null);const swiperRef=useRef(null);const prevRef=useRef(null);const nextRef=useRef(null);

const syncMapSize=useCallback(()=>{if(mapRef.current){const{width,height}=mapRef.current.getBoundingClientRect();setMapSize({w:width,h:height});}},[]);
useEffect(()=>{syncMapSize();const ro=new ResizeObserver(syncMapSize);if(mapRef.current)ro.observe(mapRef.current);return()=>ro.disconnect();},[syncMapSize]);
useEffect(()=>{if(!selectedCity||mapSize.w===0)return;const cityProjects=locationCounts[selectedCity];if(!cityProjects||cityProjects.length===0)return;const loc=LOCATIONS[cityProjects[0].city]||{cx:50,cy:50};setPopupAnchor({x:(loc.cx/100)*mapSize.w,y:(loc.cy/100)*mapSize.h});},[mapSize,selectedCity]);
useEffect(()=>{if(selectedCity){const projs=haryanaCompletedProjects.filter(p=>p.city===selectedCity);setHighlightedIds(projs.map(p=>p.id));const cardIdx=haryanaCompletedProjects.findIndex(p=>p.city===selectedCity);setTimeout(()=>{if(swiperRef.current&&cardIdx>=0)swiperRef.current.slideTo(cardIdx);},80);}else{setHighlightedIds([]);}},[selectedCity]);

const selectedCityProjects=selectedCity?(locationCounts[selectedCity]||null):null;
const isSingleProject=selectedCityProjects&&selectedCityProjects.length===1;

const handleMarkerClick=(city,projects)=>{if(selectedCity===city){setSelectedCity(null);setPopupAnchor(null);return;}const loc=LOCATIONS[projects[0].city]||{cx:50,cy:50};setPopupAnchor({x:(loc.cx/100)*mapSize.w,y:(loc.cy/100)*mapSize.h});setSelectedCity(city);};
const closePopup=()=>{setSelectedCity(null);setPopupAnchor(null);};
const handleProjectClickFromPopup=(project)=>{setHighlightedIds([project.id]);const cardIdx=haryanaCompletedProjects.findIndex(p=>p.id===project.id);setTimeout(()=>{if(swiperRef.current&&cardIdx>=0)swiperRef.current.slideTo(cardIdx);},80);};
const handleCardClick=(project)=>{const slug=project.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');navigate(`/project/completed/${slug}`,{state:{projectData:project}});};

return(<div className="hcm-layout">
<div className="hcm-left-panel"><div className="hcm-map-container" ref={mapRef}><img src="/images/Home/Haryana.png" alt="Haryana Map" style={{width:'130%',height:'130%',objectFit:'contain',position:'absolute',inset:0,transform:'translate(-11.5%,-11.5%)'}}/><div className="hcm-markers-overlay">{selectedCity&&<div onClick={closePopup} style={{position:'absolute',inset:0,zIndex:45,pointerEvents:'all',cursor:'default'}}/>}{Object.entries(locationCounts).map(([city,projects])=>(<MapMarker key={city} cityProjects={projects} isSelected={selectedCity===city} isHovered={hoveredCity===city} onHover={()=>setHoveredCity(city)} onLeave={()=>setHoveredCity(null)} onClick={()=>handleMarkerClick(city,projects)}/>))}<AnimatePresence>{selectedCityProjects&&popupAnchor&&mapSize.w>0&&isSingleProject&&<SingleProjectPopup key={selectedCity} project={selectedCityProjects[0]} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup}/>}{selectedCityProjects&&popupAnchor&&mapSize.w>0&&!isSingleProject&&<CityProjectsPopup key={selectedCity} cityProjects={selectedCityProjects} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup}/>}</AnimatePresence></div></div><div className="hcm-legend"><h4>Haryana Completed Projects</h4><div className="hcm-legend-item"><Building2 size={12} color={GREEN} style={{flexShrink:0}}/><span>Completed ({haryanaCompletedProjects.length})</span></div></div></div>
<div className="hcm-right-panel">
<div className="hcm-header"><div className="hcm-header-top"><div><h1 className="hcm-main-title">Haryana <span style={{color:GREEN}}>Completed</span> Projects</h1><p className="hcm-subtitle">Successfully delivered industrial & logistics parks across Haryana.</p></div><div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:10,border:'1.5px solid #198847',background:'#f0fdf4',color:GREEN,fontWeight:700,fontSize:13}}><CheckCircle2 size={14}/>Completed<span style={{background:GREEN,color:'#fff',borderRadius:20,padding:'2px 10px',fontSize:12,fontWeight:800}}>{haryanaCompletedProjects.length}</span></div></div></div>
<div className="hcm-content-area">{haryanaCompletedProjects.length>0?(<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}} style={{flex:1,display:'flex',flexDirection:'column'}}><div className="hcm-slider-wrapper"><div className="hcm-nav-arrows"><button ref={prevRef} className="hcm-nav-btn hcm-nav-prev-btn" onClick={()=>swiperRef.current?.slidePrev()}><ChevronLeft size={20}/></button><button ref={nextRef} className="hcm-nav-btn hcm-nav-next-btn" onClick={()=>swiperRef.current?.slideNext()}><ChevronRight size={20}/></button></div><Swiper onSwiper={s=>(swiperRef.current=s)} modules={[Navigation,Pagination,Autoplay]} spaceBetween={16} slidesPerView={2} slidesPerGroup={2} navigation={{prevEl:prevRef.current,nextEl:nextRef.current}} pagination={{clickable:true,dynamicBullets:true}} autoplay={{delay:4000,disableOnInteraction:false,pauseOnMouseEnter:true}} breakpoints={{0:{slidesPerView:1,slidesPerGroup:1},1024:{slidesPerView:2,slidesPerGroup:2}}} onBeforeInit={sw=>{sw.params.navigation.prevEl=prevRef.current;sw.params.navigation.nextEl=nextRef.current;}} style={{paddingBottom:'50px'}}>{haryanaCompletedProjects.map(project=>(<SwiperSlide key={project.id} style={{height:'auto'}}><div onMouseEnter={()=>setHoveredCity(project.city)} onMouseLeave={()=>setHoveredCity(null)}><CardProject project={project} isSelected={highlightedIds.includes(project.id)} onClick={handleCardClick}/></div></SwiperSlide>))}</Swiper></div></motion.div>):(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="hcm-empty-state"><Building2 size={64}/><h3>No completed projects found in Haryana</h3></motion.div>)}</div>
</div>
<style>{`
@keyframes mmPing{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.4;}70%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}100%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}}
@keyframes mmGlow{0%,100%{opacity:0.9;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.4;transform:translate(-50%,-50%) scale(1.35);}}
.hcm-layout{display:flex;flex-direction:column;min-height:100vh;background:#ffffff;color:#0f172a;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
@media(min-width:1024px){.hcm-layout{flex-direction:row;height:100vh;overflow:hidden;}}
.hcm-left-panel{width:100%;min-height:50vh;position:relative;background:#f8fafc;border-right:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;padding:20px;overflow:hidden;}
@media(min-width:1024px){.hcm-left-panel{width:45%;min-height:100%;}}
.hcm-map-container{position:relative;width:100%;max-width:600px;aspect-ratio:1/1.3;overflow:visible;}
.hcm-markers-overlay{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
.hcm-legend{position:absolute;bottom:20px;left:20px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border:1px solid #e2e8f0;padding:12px 16px;border-radius:12px;}
.hcm-legend h4{margin:0 0 8px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;}
.hcm-legend-item{display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:12px;font-weight:600;color:#28286e;}
.hcm-right-panel{width:100%;display:flex;flex-direction:column;background:#ffffff;overflow:hidden;}
@media(min-width:1024px){.hcm-right-panel{width:55%;}}
.hcm-header{flex-shrink:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:24px 40px 20px;border-bottom:1px solid #e2e8f0;}
.hcm-header-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
.hcm-main-title{margin:0;font-size:26px;font-weight:900;color:#28286e;letter-spacing:-0.5px;}
.hcm-subtitle{margin:4px 0 0;color:#64748b;font-size:13px;}
.hcm-content-area{padding:28px 40px;flex:1;display:flex;flex-direction:column;overflow:hidden;}
.hcm-slider-wrapper{position:relative;width:100%;height:100%;}
.hcm-nav-arrows{position:absolute;top:-54px;right:0;display:flex;gap:6px;z-index:10;}
.hcm-nav-btn{width:34px;height:34px;border-radius:8px;background:#ffffff;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#28286e;transition:all 0.2s;}
.hcm-nav-btn:hover{background:#f8fafc;border-color:#198847;color:#198847;}
.hcm-nav-btn.swiper-button-disabled{opacity:0.4;cursor:not-allowed;}
@media(max-width:1024px){.hcm-nav-arrows{display:none;}}
.hcm-card{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;transition:all 0.3s ease;display:flex;flex-direction:column;overflow:hidden;height:100%;}
.hcm-card:hover{border-color:#cbd5e1;transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,0.06);}
.hcm-card-selected{border:1.5px solid #198847!important;box-shadow:0 6px 20px rgba(25,136,71,0.15)!important;}
.hcm-card-image-wrapper{position:relative;width:100%;height:185px;overflow:hidden;flex-shrink:0;}
.hcm-card-image{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;}
.hcm-card:hover .hcm-card-image{transform:scale(1.06);}
.hcm-badges-overlay{position:absolute;top:12px;left:12px;}
.hcm-badge-status{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px;backdrop-filter:blur(4px);}
.hcm-card-content{padding:16px 18px 18px;flex:1;display:flex;flex-direction:column;gap:9px;}
.hcm-badge-cat{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.6px;padding:3px 8px;border-radius:10px;display:inline-block;background:#f1f5f9;color:#475569;width:fit-content;}
.hcm-card-title{margin:0;font-size:15px;font-weight:800;color:#28286e;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.hcm-labels-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.hcm-label-item{display:flex;align-items:flex-start;gap:7px;padding:7px 9px;background:#f8fafc;border-radius:8px;border:1px solid #f1f5f9;}
.hcm-label-full{grid-column:1/-1;}
.hcm-label-head{font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:2px;}
.hcm-label-val{font-size:11px;font-weight:600;color:#334155;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.hcm-divider{height:1px;background:#e2e8f0;margin:2px 0;}
.hcm-card-bottom{display:flex;align-items:center;gap:10px;margin-top:auto;padding-top:4px;}
.hcm-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 0;color:#94a3b8;text-align:center;flex:1;}
.hcm-empty-state svg{opacity:0.3;margin-bottom:16px;}
.hcm-empty-state h3{margin:0;color:#28286e;font-size:20px;font-weight:700;}
.swiper{width:100%!important;}
.swiper-wrapper{align-items:stretch!important;}
.swiper-slide{height:auto!important;}
.swiper-pagination{position:relative!important;bottom:auto!important;margin-top:16px!important;text-align:center!important;}
.swiper-pagination-bullet{background:#cbd5e1!important;width:8px!important;height:8px!important;opacity:1!important;transition:all 0.3s!important;margin:0 4px!important;}
.swiper-pagination-bullet-active{background:#198847!important;width:24px!important;border-radius:4px!important;}
`}</style>
</div>);}