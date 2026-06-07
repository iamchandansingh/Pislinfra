/**
 * =============================================================================
 * FILE: src/components/coverage/CoverageMap.jsx
 * FINAL - Single: Round Progress | Multi: Inline Bar | Same as Haryana/Gujarat
 * COLOR SCHEME: Ongoing = Orange (#f97316) | Completed = Green (#198847)
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Building2, Ruler, ClipboardList, User,
  ChevronRight, ChevronLeft, Activity, CheckCircle2, X,
  ExternalLink, Layers,
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import projectsData from '../../data/projectsData';
import completedProjectsData from '../../data/completedProjects';
import HaryanaCompletedMap from './HaryanaCompletedMap';
import GujaratMap from './GujaratMap';

const ORANGE = '#f97316';
const GREEN = '#198847';
const FALLBACK_IMG = 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600';

const ongoingProjects = projectsData.map(p => ({
  id: p.id, name: p.name, state: p.state, city: p.location,
  status: 'Ongoing', category: p.category, area: p.area,
  client: p.client, scope: p.scope, timeline: p.timeline,
  progress: Math.floor(Math.random() * 60) + 25,
  image: p.images?.[0] || FALLBACK_IMG,
}));

const completedProjects = completedProjectsData.map(p => ({
  id: p.id, name: p.name, state: p.state, city: p.location,
  status: 'Completed', category: p.category, area: p.area,
  client: p.client, scope: p.scope, timeline: p.timeline,
  progress: 100,
  image: p.images?.[0] || FALLBACK_IMG,
}));

const LOCATIONS = {
  'Mundra':{cx:5.0,cy:49.0},'Hazira, Surat':{cx:16,cy:54},'Surat':{cx:16,cy:54},
  'Jamnagar':{cx:7,cy:51},'Dahej':{cx:13,cy:52},
  'GIDC Sanand':{cx:17.5,cy:48.5},'Mappedu, Chennai':{cx:41.0,cy:78.0},
  'Chennai':{cx:41.0,cy:78.0},'Coimbatore':{cx:30.5,cy:85.5},'Tuticorin':{cx:36.0,cy:90.5},
  'Najibabad':{cx:36.0,cy:29.0},'Dhanbad':{cx:61.55,cy:46.10},'Pune':{cx:20,cy:63},
  'Mumbai':{cx:17,cy:62.0},'Bangalore':{cx:32.5,cy:79.5},'Bengaluru':{cx:32.5,cy:79.5},
  'Hyderabad':{cx:35.5,cy:65},'Ludhiana':{cx:25.50,cy:23.1},'Neemrana':{cx:28.0,cy:32.5},
  'Jaipur':{cx:25.5,cy:36.0},
};

const POPUP_W=280,DOT_R=8,GAP=6,FLIP_TH=220;

// ==================== GUJARAT HUB COUNT ====================
// Gujarat ke ongoing projects ka count (projectsData se filter karke)
const gujaratProjectCount=projectsData.filter(p=>p.state==='Gujarat').length;

// ==================== HARYANA HUB COUNT ====================
// Haryana ke completed projects ka count (completedProjectsData se filter karke)
const haryanaProjectCount=completedProjectsData.filter(p=>p.state==='Haryana').length;

/* =============================================================================
   ROUND PROGRESS - Single Project
============================================================================= */
const RoundProgress = ({ progress, size = 40, strokeWidth = 4, color }) => {
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
   INLINE BAR PROGRESS - Multi Project
============================================================================= */
const InlineProgress = ({ progress, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
    <div style={{ width: 55, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
      <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:2,ease:'easeOut'}} style={{height:'100%',background:color,borderRadius:3}} />
    </div>
    <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 34, textAlign: 'right' }}>{progress}%</span>
  </div>
);

/* =============================================================================
   SINGLE PROJECT POPUP
============================================================================= */
const SingleProjectPopup = ({ project, anchorPx, mapSize, onClose, onProjectClick, color }) => {
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
          <RoundProgress progress={project.progress} size={44} strokeWidth={4} color={color} />
          <span style={{fontSize:12,fontWeight:700,color:'#1e293b',flex:1,lineHeight:1.4}}>{project.name}</span>
        </div>
      </div>
      {flipDown && <div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}
    </motion.div>
  );
};

/* =============================================================================
   MULTI PROJECT POPUP
============================================================================= */
const CityProjectsPopup=({cityProjects,anchorPx,mapSize,onClose,onProjectClick,color})=>{const projectCount=cityProjects.length;const popupW=Math.min(280,mapSize.w-24);const flipDown=(anchorPx.y-DOT_R-GAP)<FLIP_TH;let left=anchorPx.x-popupW/2;left=Math.max(8,Math.min(left,mapSize.w-popupW-8));const arrowLeft=Math.max(14,Math.min(anchorPx.x-left,popupW-14));const vertStyle=flipDown?{top:anchorPx.y+DOT_R+GAP+10}:{bottom:mapSize.h-anchorPx.y+DOT_R+GAP+10};return(<motion.div initial={{opacity:0,scale:0.88,y:flipDown?-8:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.88,y:flipDown?-6:6}} transition={{type:'spring',stiffness:380,damping:28}} style={{position:'absolute',width:popupW,left,zIndex:100,pointerEvents:'all',...vertStyle}}>{!flipDown&&<div style={{position:'absolute',bottom:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderTop:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}<div style={{background:'#ffffff',borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',overflow:'hidden',position:'relative',maxHeight:400,overflowY:'auto'}}><button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'sticky',top:8,float:'right',width:22,height:22,borderRadius:'50%',background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:5,padding:0,marginRight:8,marginTop:4}}><X size={11}/></button><div style={{padding:'10px 14px 6px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:8}}><div style={{background:`${color}15`,borderRadius:6,padding:'4px 8px',display:'flex',alignItems:'center',gap:4}}><Layers size={12} color={color}/><span style={{fontSize:10,fontWeight:700,color}}>{projectCount} Projects</span></div><span style={{fontSize:10,fontWeight:600,color:'#64748b'}}>{cityProjects[0].city}, {cityProjects[0].state}</span></div>{cityProjects.map((project,idx)=>(<div key={project.id} onClick={e=>{e.stopPropagation();onProjectClick(project);}} style={{padding:'10px 14px',cursor:'pointer',borderBottom:idx<cityProjects.length-1?'1px solid #f1f5f9':'none',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{flex:1,fontSize:12,fontWeight:700,color:'#1e293b',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{project.name}</span><InlineProgress progress={project.progress} color={color} /></div></div>))}</div>{flipDown&&<div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}</motion.div>);};

// ==================== MAP MARKER (CITY LEVEL) ====================
const MapMarker=({cityProjects,isSelected,isHovered,onHover,onLeave,onClick,color})=>{const isActive=isSelected||isHovered;const projectCount=cityProjects.length;const loc=LOCATIONS[cityProjects[0].city]||{cx:50,cy:50};const SIZE=26;return(<div style={{position:'absolute',left:`${loc.cx}%`,top:`${loc.cy}%`,transform:'translate(-50%,-50%)',cursor:'pointer',zIndex:isSelected?60:50,pointerEvents:'all'}} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick}><span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',background:color,opacity:isActive?0.30:0.15,animation:'mmPing 2.4s cubic-bezier(0,.2,.2,1) infinite',animationDuration:isActive?'1.2s':'2.4s',pointerEvents:'none'}}/>{isSelected&&<motion.span initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',border:`2px solid ${color}`,animation:'mmGlow 1.6s ease-in-out infinite',pointerEvents:'none'}}/>}<motion.div animate={{scale:isActive?1.4:1}} transition={{type:'spring',stiffness:320,damping:22}} style={{width:SIZE,height:SIZE,borderRadius:'50%',background:color,border:'2.5px solid #ffffff',boxShadow:isSelected?`0 0 0 3px ${color}30`:'0 2px 6px rgba(0,0,0,0.18)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}><MapPin size={14} color="#ffffff" strokeWidth={2.2} style={{flexShrink:0}}/></motion.div>{projectCount>1&&<div style={{position:'absolute',top:-5,right:-12,background:'#ef4444',color:'#ffffff',minWidth:18,height:18,borderRadius:10,fontSize:10,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px',border:'2px solid #ffffff',boxShadow:'0 2px 6px rgba(0,0,0,0.2)',pointerEvents:'none',zIndex:5}}>{projectCount}</div>}</div>);};

// ==================== STATE HUB MARKER (GUJARAT & HARYANA) ====================
// cx, cy = position on map (%) | color = state color | label = text shown below marker
// isActive = true when popup is open | onClick = opens the state popup
const StateHubMarker=({cx,cy,color,isActive,onClick,label})=>(<div style={{position:'absolute',left:`${cx}%`,top:`${cy}%`,transform:'translate(-50%,-50%)',cursor:'pointer',zIndex:isActive?60:55,pointerEvents:'all'}} onClick={onClick}><span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:44,height:44,borderRadius:'50%',background:color,opacity:isActive?0.35:0.20,animation:'mmPing 2s cubic-bezier(0,.2,.2,1) infinite',pointerEvents:'none'}}/>{isActive&&<motion.span initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:40,height:40,borderRadius:'50%',border:`3px solid ${color}`,animation:'mmGlow 1.6s ease-in-out infinite',pointerEvents:'none'}}/>}<motion.div animate={{scale:isActive?1.4:1}} transition={{type:'spring',stiffness:320,damping:22}} style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${color},${color}dd)`,border:'3px solid #ffffff',boxShadow:isActive?`0 0 0 6px ${color}40`:'0 3px 10px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}><Building2 size={14} color="#ffffff" strokeWidth={2.2} style={{flexShrink:0}}/></motion.div><div style={{position:'absolute',top:'100%',left:'50%',transform:'translateX(-50%)',marginTop:6,background:`${color}ee`,color:'#fff',padding:'3px 10px',borderRadius:12,fontSize:9,fontWeight:700,whiteSpace:'nowrap',pointerEvents:'none',letterSpacing:'0.3px'}}>{label}</div></div>);

// ==================== STATE POPUP (GUJARAT & HARYANA) ====================
// anchorPx = {x, y} pixel position where popup arrow points
// color = state color | label = "Ongoing Projects" / "Completed Projects"
// count = total projects in that state | stateName = "Gujarat" / "Haryana"
// onViewMore = navigates to full state map
const StatePopup=({anchorPx,mapSize,onClose,onViewMore,color,label,count,stateName})=>{const popupW=240;const flipDown=(anchorPx.y-16-GAP)<FLIP_TH;let left=anchorPx.x-popupW/2;left=Math.max(8,Math.min(left,mapSize.w-popupW-8));const arrowLeft=Math.max(14,Math.min(anchorPx.x-left,popupW-14));const vertStyle=flipDown?{top:anchorPx.y+16+GAP+10}:{bottom:mapSize.h-anchorPx.y+16+GAP+10};return(<motion.div initial={{opacity:0,scale:0.9,y:flipDown?-8:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:flipDown?-6:6}} transition={{type:'spring',stiffness:380,damping:28}} style={{position:'absolute',width:popupW,left,zIndex:110,pointerEvents:'all',...vertStyle}}>{!flipDown&&<div style={{position:'absolute',bottom:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderTop:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}<div style={{background:'#ffffff',borderRadius:14,border:`2px solid ${color}`,boxShadow:'0 12px 32px rgba(0,0,0,0.15)',overflow:'hidden',position:'relative'}}><button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'absolute',top:10,right:10,width:24,height:24,borderRadius:'50%',background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:5,padding:0}}><X size={12}/></button><div style={{background:`linear-gradient(135deg,${color},${color}dd)`,padding:'16px 20px',textAlign:'center'}}><span style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'rgba(255,255,255,0.8)',display:'block',marginBottom:4}}>{label}</span><h4 style={{margin:0,fontSize:16,fontWeight:800,color:'#ffffff',letterSpacing:'-0.3px'}}>{stateName}</h4></div><div style={{padding:'16px 20px'}}><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,padding:'8px 12px',background:`${color}15`,borderRadius:8,border:`1px solid ${color}30`}}><Building2 size={14} color={color}/><span style={{fontSize:12,fontWeight:600,color}}>{count} Projects</span></div><button onClick={e=>{e.stopPropagation();onViewMore();}} style={{width:'100%',padding:'10px 16px',borderRadius:8,background:color,color:'#ffffff',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all 0.2s'}}>View All Projects <ExternalLink size={14}/></button></div></div>{flipDown&&<div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}</motion.div>);};

/* =============================================================================
   CARD PROJECT
   UPDATED: Completed accent uses GREEN (#198847) instead of #22C55E
============================================================================= */
const CardProject=({project,isSelected,onCardClick})=>{
  const isOngoing=project.status==='Ongoing';

  // Ongoing: orange palette (#f97316)
  // Completed: green palette (#198847)
  const accent        = isOngoing ? '#f97316'                   : '#198847';
  const accentHover   = isOngoing ? '#ea580c'                   : '#166534';
  const accentBg      = isOngoing ? '#fff7ed'                   : 'rgba(25,136,71,0.08)';
  const accentBorder  = isOngoing ? '#fed7aa'                   : 'rgba(25,136,71,0.25)';
  const selectedBorder= isOngoing ? '#f97316'                   : '#198847';
  const selectedGlow  = isOngoing ? 'rgba(249,115,22,0.12)'     : 'rgba(25,136,71,0.15)';

  const circ=2*Math.PI*22;
  const off=circ-(project.progress/100)*circ;

  return(
    <div
      className={`cm-card ${isSelected?'cm-card-selected':''} ${isOngoing?'cm-card-ongoing':'cm-card-completed'}`}
      onClick={()=>onCardClick(project)}
      style={{
        cursor:'pointer',
        // Override selected border/glow per status via inline style when selected
        ...(isSelected ? {
          border:`3px solid ${selectedBorder}`,
          boxShadow:`0 0 0 4px ${selectedGlow}`,
        } : {}),
      }}
    >
      <div className="cm-card-image-wrapper">
        <img src={project.image} alt={project.name} className="cm-card-image"/>
        <div className="cm-badges-overlay">
          <span className="cm-badge-status" style={{background:accentBg,color:accent,border:`1px solid ${accentBorder}`}}>
            {isOngoing?<Activity size={11}/>:<CheckCircle2 size={11}/>}
            {project.status}
          </span>
        </div>
      </div>
      <div className="cm-card-content">
        <span className="cm-badge-cat">{project.category}</span>
        <h3 className="cm-card-title">{project.name}</h3>
        <div className="cm-labels-grid">
          <div className="cm-label-item">
            <MapPin size={12} color={accent}/>
            <div><span className="cm-label-head">Location</span><span className="cm-label-val">{project.city}, {project.state}</span></div>
          </div>
          <div className="cm-label-item">
            <Ruler size={12} color={accent}/>
            <div><span className="cm-label-head">Build-up Area</span><span className="cm-label-val">{project.area}</span></div>
          </div>
          <div className="cm-label-item cm-label-full">
            <ClipboardList size={12} color={accent}/>
            <div><span className="cm-label-head">Scope of Work</span><span className="cm-label-val">{project.scope}</span></div>
          </div>
          <div className="cm-label-item cm-label-full">
            <User size={12} color={accent}/>
            <div><span className="cm-label-head">Client</span><span className="cm-label-val">{project.client}</span></div>
          </div>
        </div>
        <div className="cm-divider"/>
        <div className="cm-card-bottom">
          <div style={{position:'relative',width:50,height:50,flexShrink:0}}>
            <svg width="50" height="50" style={{transform:'rotate(-90deg)'}}>
              <circle cx="25" cy="25" r="22" fill="none" stroke="#f1f5f9" strokeWidth="4.5"/>
              <motion.circle
                cx="25" cy="25" r="22" fill="none"
                stroke={accent} strokeWidth="4.5" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ}
                initial={{strokeDashoffset:circ}}
                animate={{strokeDashoffset:off}}
                transition={{duration:2,ease:'easeOut'}}
              />
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:13,fontWeight:900,color:accent}}>{project.progress}%</span>
            </div>
          </div>
          <div style={{flex:1,marginLeft:12}}>
            <span style={{fontSize:11,fontWeight:600,color:'#94a3b8',display:'block',marginBottom:4}}>{project.timeline||'N/A'}</span>
            <span style={{fontSize:12,fontWeight:700,color:accent}}>View Details <ChevronRight size={14} style={{verticalAlign:'middle'}}/></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CoverageMap(){const navigate=useNavigate();const[activeTab,setActiveTab]=useState('ongoing');const[selectedCity,setSelectedCity]=useState(null);const[highlightedIds,setHighlightedIds]=useState([]);const[hoveredCity,setHoveredCity]=useState(null);const[svgContent,setSvgContent]=useState('');const[popupAnchor,setPopupAnchor]=useState(null);const[mapSize,setMapSize]=useState({w:0,h:0});

// ==================== GUJARAT STATE POPUP STATE ====================
const[showGujaratPopup,setShowGujaratPopup]=useState(false);          // true = popup dikhega
const[gujaratPopupAnchor,setGujaratPopupAnchor]=useState(null);       // popup ka {x, y} position pixel mein
const[showGujaratMap,setShowGujaratMap]=useState(false);             // true = full Gujarat map page

// ==================== HARYANA STATE POPUP STATE ====================
const[showHaryanaPopup,setShowHaryanaPopup]=useState(false);          // true = popup dikhega
const[haryanaPopupAnchor,setHaryanaPopupAnchor]=useState(null);       // popup ka {x, y} position pixel mein
const[showHaryanaMap,setShowHaryanaMap]=useState(false);             // true = full Haryana map page

const[swiperKey,setSwiperKey]=useState(0);const mapRef=useRef(null);const swiperRef=useRef(null);const prevRef=useRef(null);const nextRef=useRef(null);

useEffect(()=>{fetch('/indiaHigh.svg').then(r=>r.text()).then(data=>setSvgContent(data.replace(/<svg/,'<svg class="cm-india-svg" preserveAspectRatio="xMidYMid meet"'))).catch(()=>{});},[]);
const syncMapSize=useCallback(()=>{if(mapRef.current){const{width,height}=mapRef.current.getBoundingClientRect();setMapSize({w:width,h:height});}},[]);
useEffect(()=>{syncMapSize();const ro=new ResizeObserver(syncMapSize);if(mapRef.current)ro.observe(mapRef.current);return()=>ro.disconnect();},[syncMapSize]);

const filteredProjects=activeTab==='ongoing'?ongoingProjects:completedProjects;
const currentColor=activeTab==='ongoing'?'#f97316':'#198847';
const locationCounts={};filteredProjects.forEach(p=>{const key=p.city;if(activeTab==='ongoing'&&p.state==='Gujarat')return;if(activeTab==='completed'&&p.state==='Haryana')return;if(!locationCounts[key])locationCounts[key]=[];locationCounts[key].push(p);});

useEffect(()=>{if(!selectedCity||mapSize.w===0)return;const cityProjects=locationCounts[selectedCity];if(!cityProjects||cityProjects.length===0)return;const loc=LOCATIONS[cityProjects[0].city]||{cx:50,cy:50};setPopupAnchor({x:(loc.cx/100)*mapSize.w,y:(loc.cy/100)*mapSize.h});},[mapSize,selectedCity]);
useEffect(()=>{if(selectedCity){const projs=filteredProjects.filter(p=>p.city===selectedCity);setHighlightedIds(projs.map(p=>p.id));const cardIdx=filteredProjects.findIndex(p=>p.city===selectedCity);setTimeout(()=>{if(swiperRef.current&&cardIdx>=0)swiperRef.current.slideTo(cardIdx);},80);}else{setHighlightedIds([]);}},[selectedCity,activeTab]);

const selectedCityProjects=selectedCity?(locationCounts[selectedCity]||null):null;
const isSingleProject=selectedCityProjects&&selectedCityProjects.length===1;

const handleMarkerClick=(city,projects)=>{if(selectedCity===city){setSelectedCity(null);setPopupAnchor(null);return;}const loc=LOCATIONS[projects[0].city]||{cx:50,cy:50};setPopupAnchor({x:(loc.cx/100)*mapSize.w,y:(loc.cy/100)*mapSize.h});setSelectedCity(city);setShowGujaratPopup(false);setShowHaryanaPopup(false);};

// ==================== GUJARAT HUB CLICK HANDLER ====================
// Gujarat StateHubMarker par click karne pe popup toggle hota hai
// cx:8, cy:48 = map ke left side, Gujarat ki position
const handleGujaratHubClick=()=>{setSelectedCity(null);setPopupAnchor(null);setShowHaryanaPopup(false);setShowGujaratPopup(!showGujaratPopup);setGujaratPopupAnchor({x:(8/100)*mapSize.w,y:(48/100)*mapSize.h});};

// ==================== HARYANA HUB CLICK HANDLER ====================
// Haryana StateHubMarker par click karne pe popup toggle hota hai
// cx:29, cy:30 = map ke top-center, Haryana ki position
const handleHaryanaHubClick=()=>{setSelectedCity(null);setPopupAnchor(null);setShowGujaratPopup(false);setShowHaryanaPopup(!showHaryanaPopup);setHaryanaPopupAnchor({x:(29/100)*mapSize.w,y:(30/100)*mapSize.h});};

const closePopup=()=>{setSelectedCity(null);setPopupAnchor(null);};
const handleProjectClickFromPopup=(project)=>{setHighlightedIds([project.id]);const cardIdx=filteredProjects.findIndex(p=>p.id===project.id);setTimeout(()=>{if(swiperRef.current&&cardIdx>=0)swiperRef.current.slideTo(cardIdx);},80);};
const handleCardClick=(project)=>{const type=project.status==='Ongoing'?'ongoing':'completed';const slug=project.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');window.location.href=`/project/${type}/${slug}`;};
const handleTabChange=(tab)=>{if(activeTab===tab)return;setActiveTab(tab);setSelectedCity(null);setPopupAnchor(null);setShowGujaratPopup(false);setShowHaryanaPopup(false);setHighlightedIds([]);setSwiperKey(prev=>prev+1);};

// ==================== GUJARAT FULL MAP VIEW ====================
// Agar showGujaratMap true hai to poora page GujaratMap component se replace ho jata hai
if(showGujaratMap)return(<div style={{position:'relative'}}><button onClick={()=>setShowGujaratMap(false)} style={{position:'absolute',top:20,left:20,zIndex:1000,padding:'10px 20px',borderRadius:8,background:ORANGE,color:'#fff',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8,boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}><ChevronLeft size={16}/>Back to India Map</button><GujaratMap/></div>);

// ==================== HARYANA FULL MAP VIEW ====================
// Agar showHaryanaMap true hai to poora page HaryanaCompletedMap component se replace ho jata hai
if(showHaryanaMap)return(<div style={{position:'relative'}}><button onClick={()=>setShowHaryanaMap(false)} style={{position:'absolute',top:20,left:20,zIndex:1000,padding:'10px 20px',borderRadius:8,background:GREEN,color:'#fff',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8,boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}><ChevronLeft size={16}/>Back to India Map</button><HaryanaCompletedMap/></div>);

return(<div className="cm-layout">
<div className="cm-left-panel"><div className="cm-map-container" ref={mapRef}>{svgContent?<div className="cm-svg-wrapper" dangerouslySetInnerHTML={{__html:svgContent}}/>:<div className="cm-missing-svg"><p>Place <b>indiaHigh.svg</b> in <b>/public</b></p></div>}<div className="cm-markers-overlay">{(selectedCity||showGujaratPopup||showHaryanaPopup)&&<div onClick={()=>{closePopup();setShowGujaratPopup(false);setShowHaryanaPopup(false);}} style={{position:'absolute',inset:0,zIndex:45,pointerEvents:'all',cursor:'default'}}/>}{Object.entries(locationCounts).map(([city,projects])=>(<MapMarker key={city} cityProjects={projects} isSelected={selectedCity===city} isHovered={hoveredCity===city} color={currentColor} onHover={()=>setHoveredCity(city)} onLeave={()=>setHoveredCity(null)} onClick={()=>handleMarkerClick(city,projects)}/>))}

{/* ==================== GUJARAT STATE HUB MARKER ==================== */}
{/* Sirf Ongoing tab mein dikhega | cx:8, cy:48 | Orange color | Label: "Gujarat" */}
{activeTab==='ongoing'&&<StateHubMarker cx={12} cy={48} color="#f97316" isActive={showGujaratPopup} onClick={handleGujaratHubClick} label="Gujarat"/>}

{/* ==================== HARYANA STATE HUB MARKER ==================== */}
{/* Sirf Completed tab mein dikhega | cx:29, cy:30 | Green color | Label: "Haryana" */}
{activeTab==='completed'&&<StateHubMarker cx={28} cy={29} color="#198847" isActive={showHaryanaPopup} onClick={handleHaryanaHubClick} label="Haryana"/>}

<AnimatePresence>
  {selectedCityProjects&&popupAnchor&&mapSize.w>0&&isSingleProject&&<SingleProjectPopup key={selectedCity} project={selectedCityProjects[0]} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup} color={currentColor}/>}
  {selectedCityProjects&&popupAnchor&&mapSize.w>0&&!isSingleProject&&<CityProjectsPopup key={selectedCity} cityProjects={selectedCityProjects} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup} color={currentColor}/>}
</AnimatePresence>

<AnimatePresence>
{/* ==================== GUJARAT STATE POPUP ==================== */}
{/* showGujaratPopup true hone par dikhega | Orange color | "Ongoing Projects" label | gujaratProjectCount = kitne projects */}
{showGujaratPopup&&gujaratPopupAnchor&&mapSize.w>0&&<StatePopup anchorPx={gujaratPopupAnchor} mapSize={mapSize} onClose={()=>setShowGujaratPopup(false)} onViewMore={()=>{setShowGujaratPopup(false);setShowGujaratMap(true);}} color="#f97316" label="Ongoing Projects" count={gujaratProjectCount} stateName="Gujarat"/>}

{/* ==================== HARYANA STATE POPUP ==================== */}
{/* showHaryanaPopup true hone par dikhega | Green color | "Completed Projects" label | haryanaProjectCount = kitne projects */}
{showHaryanaPopup&&haryanaPopupAnchor&&mapSize.w>0&&<StatePopup anchorPx={haryanaPopupAnchor} mapSize={mapSize} onClose={()=>setShowHaryanaPopup(false)} onViewMore={()=>{setShowHaryanaPopup(false);setShowHaryanaMap(true);}} color="#198847" label="Completed Projects" count={haryanaProjectCount} stateName="Haryana"/>}
</AnimatePresence></div></div><div className="cm-legend"><h4>Infrastructure Network</h4><div className="cm-legend-item"><span className="cm-legend-dot" style={{backgroundColor:'#f97316'}}/><span>Ongoing ({ongoingProjects.length})</span></div><div className="cm-legend-item"><span className="cm-legend-dot" style={{backgroundColor:'#198847'}}/><span>Completed ({completedProjects.length})</span></div></div></div>
<div className="cm-right-panel">
<div className="cm-header"><div className="cm-header-top"><div><h1 className="cm-main-title">Nationwide <span style={{color:'#f97316'}}>Coverage</span></h1><p className="cm-subtitle">Click marker to highlight city projects</p></div><div style={{display:'flex',gap:10}}><button onClick={()=>handleTabChange('ongoing')} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,border:activeTab==='ongoing'?'2px solid #f97316':'1px solid #e2e8f0',background:activeTab==='ongoing'?'#fff7ed':'#ffffff',color:activeTab==='ongoing'?'#f97316':'#64748b',fontWeight:700,fontSize:14,cursor:'pointer',transition:'all 0.2s',userSelect:'none'}}><Activity size={15}/>Ongoing<span style={{background:activeTab==='ongoing'?'#f97316':'#e2e8f0',color:activeTab==='ongoing'?'#fff':'#64748b',borderRadius:20,padding:'2px 10px',fontSize:12,fontWeight:800}}>{ongoingProjects.length}</span></button><button onClick={()=>handleTabChange('completed')} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,border:activeTab==='completed'?'2px solid #198847':'1px solid #e2e8f0',background:activeTab==='completed'?'rgba(25,136,71,0.08)':'#ffffff',color:activeTab==='completed'?'#166534':'#64748b',fontWeight:700,fontSize:14,cursor:'pointer',transition:'all 0.2s',userSelect:'none'}}><CheckCircle2 size={15}/>Completed<span style={{background:activeTab==='completed'?'#198847':'#e2e8f0',color:activeTab==='completed'?'#fff':'#64748b',borderRadius:20,padding:'2px 10px',fontSize:12,fontWeight:800}}>{completedProjects.length}</span></button></div></div></div>
<div className="cm-content-area"><AnimatePresence mode="wait">{filteredProjects.length>0?(<motion.div key={`sw-${activeTab}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} style={{flex:1,display:'flex',flexDirection:'column'}}><div className="cm-slider-wrapper"><div className="cm-nav-arrows"><button ref={prevRef} className="cm-nav-btn cm-nav-prev-btn" onClick={()=>swiperRef.current?.slidePrev()}><ChevronLeft size={20}/></button><button ref={nextRef} className="cm-nav-btn cm-nav-next-btn" onClick={()=>swiperRef.current?.slideNext()}><ChevronRight size={20}/></button></div><Swiper key={swiperKey} onSwiper={s=>{swiperRef.current=s;}} modules={[Navigation,Pagination,Autoplay]} spaceBetween={16} slidesPerView={2} slidesPerGroup={2} navigation={{prevEl:prevRef.current,nextEl:nextRef.current}} pagination={{clickable:true,dynamicBullets:true}} autoplay={{delay:4000,disableOnInteraction:false,pauseOnMouseEnter:true}} breakpoints={{0:{slidesPerView:1,slidesPerGroup:1},1024:{slidesPerView:2,slidesPerGroup:2}}} onBeforeInit={sw=>{sw.params.navigation.prevEl=prevRef.current;sw.params.navigation.nextEl=nextRef.current;}} style={{paddingBottom:'50px'}}>{filteredProjects.map(project=>(<SwiperSlide key={`${project.id}-${project.status}`} style={{height:'auto'}}><div onMouseEnter={()=>setHoveredCity(project.city)} onMouseLeave={()=>setHoveredCity(null)}><CardProject project={project} isSelected={highlightedIds.includes(project.id)} onCardClick={handleCardClick}/></div></SwiperSlide>))}</Swiper></div></motion.div>):(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="cm-empty-state"><Building2 size={64}/><h3>No projects found</h3></motion.div>)}</AnimatePresence></div>
</div>
<style>{`
@keyframes mmPing{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.4;}70%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}100%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}}
@keyframes mmGlow{0%,100%{opacity:0.9;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.4;transform:translate(-50%,-50%) scale(1.35);}}
.cm-layout{display:flex;flex-direction:column;min-height:100vh;background:#ffffff;color:#0f172a;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
@media(min-width:1024px){.cm-layout{flex-direction:row;height:100vh;overflow:hidden;}}
.cm-left-panel{width:100%;min-height:50vh;position:relative;background:#f8fafc;border-right:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;padding:40px;}
@media(min-width:1024px){.cm-left-panel{width:45%;min-height:100%;}}
.cm-map-container{position:relative;width:100%;max-width:480px;aspect-ratio:1/1.18;overflow:visible;}
.cm-svg-wrapper{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
.cm-india-svg{width:100%;height:100%;fill:#28286e;stroke:#3b3b8e;stroke-width:1.2px;}
.cm-missing-svg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border:2px dashed #cbd5e1;border-radius:12px;color:#64748b;font-size:14px;text-align:center;padding:24px;background:#f8fafc;}
.cm-markers-overlay{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
.cm-legend{position:absolute;bottom:20px;left:20px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border:1px solid #e2e8f0;padding:12px 16px;border-radius:12px;}
.cm-legend h4{margin:0 0 8px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;}
.cm-legend-item{display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:12px;font-weight:600;color:#28286e;}
.cm-legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.cm-right-panel{width:100%;display:flex;flex-direction:column;background:#ffffff;overflow:hidden;}
@media(min-width:1024px){.cm-right-panel{width:55%;}}
.cm-header{flex-shrink:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:24px 40px 20px;border-bottom:1px solid #e2e8f0;}
.cm-header-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
.cm-main-title{margin:0;font-size:26px;font-weight:900;color:#28286e;letter-spacing:-0.5px;}
.cm-subtitle{margin:4px 0 0;color:#64748b;font-size:13px;}
.cm-content-area{padding:28px 40px;flex:1;display:flex;flex-direction:column;overflow:hidden;}
.cm-slider-wrapper{position:relative;width:100%;height:100%;}
.cm-nav-arrows{position:absolute;top:-54px;right:0;display:flex;gap:6px;z-index:10;}
.cm-nav-btn{width:34px;height:34px;border-radius:8px;background:#ffffff;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#28286e;transition:all 0.2s;}
.cm-nav-btn:hover{background:#f8fafc;border-color:#f97316;color:#f97316;}
.cm-nav-btn.swiper-button-disabled{opacity:0.4;cursor:not-allowed;}
@media(max-width:1024px){.cm-nav-arrows{display:none;}}
.cm-card{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;transition:all 0.3s ease;display:flex;flex-direction:column;overflow:hidden;height:100%;}
.cm-card:hover{border-color:#cbd5e1;transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,0.06);}
.cm-card-ongoing.cm-card-selected{border:3px solid #f97316!important;box-shadow:0 0 0 4px rgba(249,115,22,0.12)!important;}
.cm-card-completed.cm-card-selected{border:3px solid #198847!important;box-shadow:0 0 0 4px rgba(25,136,71,0.15)!important;}
.cm-card-image-wrapper{position:relative;width:100%;height:185px;overflow:hidden;flex-shrink:0;}
.cm-card-image{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;}
.cm-card:hover .cm-card-image{transform:scale(1.06);}
.cm-badges-overlay{position:absolute;top:12px;left:12px;}
.cm-badge-status{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px;backdrop-filter:blur(4px);}
.cm-card-content{padding:16px 18px 18px;flex:1;display:flex;flex-direction:column;gap:9px;}
.cm-badge-cat{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.6px;padding:3px 8px;border-radius:10px;display:inline-block;background:#f1f5f9;color:#475569;width:fit-content;}
.cm-card-title{margin:0;font-size:15px;font-weight:800;color:#28286e;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cm-labels-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.cm-label-item{display:flex;align-items:flex-start;gap:7px;padding:7px 9px;background:#f8fafc;border-radius:8px;border:1px solid #f1f5f9;}
.cm-label-full{grid-column:1/-1;}
.cm-label-head{font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:2px;}
.cm-label-val{font-size:11px;font-weight:600;color:#334155;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cm-divider{height:1px;background:#e2e8f0;margin:2px 0;}
.cm-card-bottom{display:flex;align-items:center;gap:10px;margin-top:auto;padding-top:4px;}
.cm-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 0;color:#94a3b8;text-align:center;flex:1;}
.cm-empty-state svg{opacity:0.3;margin-bottom:16px;}
.cm-empty-state h3{margin:0;color:#28286e;fontSize:20px;fontWeight:700;}
.swiper{width:100%!important;}
.swiper-wrapper{align-items:stretch!important;}
.swiper-slide{height:auto!important;}
.swiper-pagination{position:relative!important;bottom:auto!important;margin-top:16px!important;text-align:center!important;}
.swiper-pagination-bullet{background:#cbd5e1!important;width:8px!important;height:8px!important;opacity:1!important;transition:all 0.3s!important;margin:0 4px!important;}
.swiper-pagination-bullet-active{background:#198847!important;width:24px!important;border-radius:4px!important;}
`}</style>
</div>);}