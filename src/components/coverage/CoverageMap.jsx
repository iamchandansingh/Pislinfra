/**
 * =============================================================================
 * FILE: src/components/coverage/CoverageMap.jsx
 * FINAL - Single: Round Progress | Multi: Inline Bar | Same as Haryana/Gujarat
 * COLOR SCHEME: Ongoing = Orange (#f97316) | Completed = Green (#198847)
 * INCLUDES: Dynamic Add Marker Modal, Interactive Map Click Picker & Active Markers Drawer
 * =============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Building2, Ruler, ClipboardList, User,
  ChevronRight, ChevronLeft, Activity, CheckCircle2, X,
  ExternalLink, Layers, Plus, List, Copy, Check, MousePointer, Info, Sparkles
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

const LOCATIONS = {
  'Mundra': { cx: 5.0, cy: 49.0 },
  'Hazira, Surat': { cx: 16.0, cy: 54.0 },
  'Surat': { cx: 16.0, cy: 54.0 },
  'Hazira': { cx: 16.0, cy: 54.0 },
  'Jamnagar': { cx: 7.0, cy: 51.0 },
  'Dahej': { cx: 13.0, cy: 52.0 },
  'GIDC Sanand': { cx: 17.5, cy: 48.5 },
  'Sanand': { cx: 17.5, cy: 48.5 },
  'Ahmedabad': { cx: 18.0, cy: 48.5 },
  'Vadodara': { cx: 18.5, cy: 51.0 },
  'Rajkot': { cx: 12.0, cy: 50.0 },
  'Bharuch': { cx: 15.0, cy: 52.5 },
  'Mappedu, Chennai': { cx: 41.0, cy: 78.0 },
  'Mappedu': { cx: 41.0, cy: 78.0 },
  'Chennai': { cx: 41.0, cy: 78.0 },
  'Coimbatore': { cx: 30.5, cy: 85.5 },
  'Tuticorin': { cx: 36.0, cy: 90.5 },
  'Thoothukudi': { cx: 36.0, cy: 90.5 },
  'Hosur': { cx: 33.5, cy: 80.5 },
  'Najibabad': { cx: 36.0, cy: 29.0 },
  'Noida': { cx: 30.5, cy: 31.5 },
  'Greater Noida': { cx: 30.5, cy: 31.5 },
  'Lucknow': { cx: 43.0, cy: 36.0 },
  'Kanpur': { cx: 40.0, cy: 38.0 },
  'Dhanbad': { cx: 61.55, cy: 46.10 },
  'Ranchi': { cx: 58.0, cy: 48.0 },
  'Jamshedpur': { cx: 63.0, cy: 49.0 },
  'Pune': { cx: 20.0, cy: 63.0 },
  'Mumbai': { cx: 17.0, cy: 62.0 },
  'Nagpur': { cx: 39.0, cy: 53.0 },
  'Bangalore': { cx: 32.5, cy: 79.5 },
  'Bengaluru': { cx: 32.5, cy: 79.5 },
  'Hyderabad': { cx: 35.5, cy: 65.0 },
  'Ludhiana': { cx: 25.50, cy: 23.1 },
  'Neemrana': { cx: 28.0, cy: 32.5 },
  'Jaipur': { cx: 25.5, cy: 36.0 },
  'Bhiwadi': { cx: 28.5, cy: 31.8 },
  'Gurgaon': { cx: 28.5, cy: 30.5 },
  'Gurugram': { cx: 28.5, cy: 30.5 },
  'Faridabad': { cx: 29.5, cy: 31.0 },
  'Kolkata': { cx: 67.0, cy: 50.0 },
  'Indore': { cx: 25.0, cy: 49.0 },
  'Bhopal': { cx: 30.0, cy: 47.0 },
  'Visakhapatnam': { cx: 54.0, cy: 63.0 },
};

const STATE_FALLBACKS = {
  'Gujarat': { cx: 15.0, cy: 50.0 },
  'Haryana': { cx: 28.0, cy: 29.0 },
  'Tamil Nadu': { cx: 35.0, cy: 83.0 },
  'Uttar Pradesh': { cx: 40.0, cy: 34.0 },
  'Maharashtra': { cx: 21.0, cy: 60.0 },
  'Karnataka': { cx: 30.0, cy: 78.0 },
  'Rajasthan': { cx: 24.0, cy: 35.0 },
  'West Bengal': { cx: 65.0, cy: 49.0 },
  'Jharkhand': { cx: 60.0, cy: 47.0 },
  'Punjab': { cx: 25.0, cy: 23.0 },
  'Telangana': { cx: 36.0, cy: 65.0 },
  'Andhra Pradesh': { cx: 44.0, cy: 68.0 },
  'Madhya Pradesh': { cx: 28.0, cy: 48.0 },
  'Odisha': { cx: 58.0, cy: 56.0 },
};

const getLoc = (p0, mapMarkers = [], customLocations = {}) => {
  if (!p0) return { cx: 50, cy: 50 };
  
  // Direct cx/cy override if defined on project object
  if (p0.cx !== undefined && p0.cy !== undefined && p0.cx !== '' && p0.cy !== '') {
    return { cx: Number(p0.cx), cy: Number(p0.cy) };
  }

  const city = (p0.city || p0.location || '').trim();
  const state = (p0.state || '').trim();
  
  if (!city) return { cx: 50, cy: 50 };
  const lowerCity = city.toLowerCase();
  
  // 1. Custom dynamically added locations state
  if (customLocations[city]) return customLocations[city];
  for (const [key, coords] of Object.entries(customLocations)) {
    if (key.toLowerCase() === lowerCity) return coords;
  }

  // 2. Check Strapi custom mapMarkers
  if (Array.isArray(mapMarkers) && mapMarkers.length > 0) {
    const pName = (p0.name || p0.title || '').toLowerCase().trim();
    const strapiMarker = mapMarkers.find(m => {
      const mName = (m.projectName || m.project_name || m.name || m.title || '').toLowerCase().trim();
      const mCity = (m.city || m.location || '').toLowerCase().trim();
      return (mName && (mName === pName || pName.includes(mName) || mName.includes(pName))) ||
             (mCity && lowerCity && (mCity === lowerCity || lowerCity.includes(mCity) || mCity.includes(lowerCity)));
    });
    if (strapiMarker && strapiMarker.cx != null && strapiMarker.cy != null) {
      return { cx: Number(strapiMarker.cx), cy: Number(strapiMarker.cy) };
    }
  }
  
  // 3. Check LOCATIONS dictionary
  for (const [key, coords] of Object.entries(LOCATIONS)) {
    if (key.toLowerCase() === lowerCity || lowerCity.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCity)) {
      return coords;
    }
  }
  
  // 4. Fallback state coordinates
  if (state && STATE_FALLBACKS[state]) {
    return STATE_FALLBACKS[state];
  }
  
  return { cx: 50, cy: 50 };
};

const POPUP_W = 280, DOT_R = 8, GAP = 6, FLIP_TH = 220;

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

const InlineProgress = ({ progress, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
    <div style={{ width: 55, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
      <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:2,ease:'easeOut'}} style={{height:'100%',background:color,borderRadius:3}} />
    </div>
    <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 34, textAlign: 'right' }}>{progress}%</span>
  </div>
);

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

const CityProjectsPopup = ({cityProjects,anchorPx,mapSize,onClose,onProjectClick,color}) => {
  const projectCount=cityProjects.length;
  const popupW=Math.min(280,mapSize.w-24);
  const flipDown=(anchorPx.y-DOT_R-GAP)<FLIP_TH;
  let left=anchorPx.x-popupW/2;
  left=Math.max(8,Math.min(left,mapSize.w-popupW-8));
  const arrowLeft=Math.max(14,Math.min(anchorPx.x-left,popupW-14));
  const vertStyle=flipDown?{top:anchorPx.y+DOT_R+GAP+10}:{bottom:mapSize.h-anchorPx.y+DOT_R+GAP+10};
  return(
    <motion.div initial={{opacity:0,scale:0.88,y:flipDown?-8:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.88,y:flipDown?-6:6}} transition={{type:'spring',stiffness:380,damping:28}} style={{position:'absolute',width:popupW,left,zIndex:100,pointerEvents:'all',...vertStyle}}>
      {!flipDown&&<div style={{position:'absolute',bottom:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderTop:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}
      <div style={{background:'#ffffff',borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',overflow:'hidden',position:'relative',maxHeight:400,overflowY:'auto'}}>
        <button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'sticky',top:8,float:'right',width:22,height:22,borderRadius:'50%',background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:5,padding:0,marginRight:8,marginTop:4}}><X size={11}/></button>
        <div style={{padding:'10px 14px 6px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:8}}>
          <div style={{background:`${color}15`,borderRadius:6,padding:'4px 8px',display:'flex',alignItems:'center',gap:4}}>
            <Layers size={12} color={color}/>
            <span style={{fontSize:10,fontWeight:700,color}}>{projectCount} Projects</span>
          </div>
          <span style={{fontSize:10,fontWeight:600,color:'#64748b'}}>{cityProjects[0].city}, {cityProjects[0].state}</span>
        </div>
        {cityProjects.map((project,idx)=>(
          <div key={project.id} onClick={e=>{e.stopPropagation();onProjectClick(project);}} style={{padding:'10px 14px',cursor:'pointer',borderBottom:idx<cityProjects.length-1?'1px solid #f1f5f9':'none',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{flex:1,fontSize:12,fontWeight:700,color:'#1e293b',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{project.name}</span>
              <InlineProgress progress={project.progress} color={color} />
            </div>
          </div>
        ))}
      </div>
      {flipDown&&<div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}
    </motion.div>
  );
};

const MapMarker = ({cityProjects,isSelected,isHovered,onHover,onLeave,onClick,color,mapMarkers=[],customLocations={}}) => {
  const isActive=isSelected||isHovered;
  const projectCount=cityProjects.length;
  const p0 = cityProjects[0]; 
  const loc = getLoc(p0, mapMarkers, customLocations); 
  const SIZE=26;
  return(
    <div style={{position:'absolute',left:`${loc.cx}%`,top:`${loc.cy}%`,transform:'translate(-50%,-50%)',cursor:'pointer',zIndex:isSelected?60:50,pointerEvents:'all'}} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick}>
      <span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',background:color,opacity:isActive?0.30:0.15,animation:'mmPing 2.4s cubic-bezier(0,.2,.2,1) infinite',animationDuration:isActive?'1.2s':'2.4s',pointerEvents:'none'}}/>
      {isSelected&&<motion.span initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:36,height:36,borderRadius:'50%',border:`2px solid ${color}`,animation:'mmGlow 1.6s ease-in-out infinite',pointerEvents:'none'}}/>}
      <motion.div animate={{scale:isActive?1.4:1}} transition={{type:'spring',stiffness:320,damping:22}} style={{width:SIZE,height:SIZE,borderRadius:'50%',background:color,border:'2.5px solid #ffffff',boxShadow:isSelected?`0 0 0 3px ${color}30`:'0 2px 6px rgba(0,0,0,0.18)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
        <MapPin size={14} color="#ffffff" strokeWidth={2.2} style={{flexShrink:0}}/>
      </motion.div>
      {projectCount>1&&<div style={{position:'absolute',top:-5,right:-12,background:'#ef4444',color:'#ffffff',minWidth:18,height:18,borderRadius:10,fontSize:10,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px',border:'2px solid #ffffff',boxShadow:'0 2px 6px rgba(0,0,0,0.2)',pointerEvents:'none',zIndex:5}}>{projectCount}</div>}
    </div>
  );
};

const StateHubMarker = ({cx,cy,color,isActive,onClick,label}) => (
  <div style={{position:'absolute',left:`${cx}%`,top:`${cy}%`,transform:'translate(-50%,-50%)',cursor:'pointer',zIndex:isActive?60:55,pointerEvents:'all'}} onClick={onClick}>
    <span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:44,height:44,borderRadius:'50%',background:color,opacity:isActive?0.35:0.20,animation:'mmPing 2s cubic-bezier(0,.2,.2,1) infinite',pointerEvents:'none'}}/>
    {isActive&&<motion.span initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:40,height:40,borderRadius:'50%',border:`3px solid ${color}`,animation:'mmGlow 1.6s ease-in-out infinite',pointerEvents:'none'}}/>}
    <motion.div animate={{scale:isActive?1.4:1}} transition={{type:'spring',stiffness:320,damping:22}} style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${color},${color}dd)`,border:'3px solid #ffffff',boxShadow:isActive?`0 0 0 6px ${color}40`:'0 3px 10px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
      <Building2 size={14} color="#ffffff" strokeWidth={2.2} style={{flexShrink:0}}/>
    </motion.div>
    <div style={{position:'absolute',top:'100%',left:'50%',transform:'translateX(-50%)',marginTop:6,background:`${color}ee`,color:'#fff',padding:'3px 10px',borderRadius:12,fontSize:9,fontWeight:700,whiteSpace:'nowrap',pointerEvents:'none',letterSpacing:'0.3px'}}>{label}</div>
  </div>
);

const StatePopup = ({anchorPx,mapSize,onClose,onViewMore,color,label,count,stateName}) => {
  const popupW=240;
  const flipDown=(anchorPx.y-16-GAP)<FLIP_TH;
  let left=anchorPx.x-popupW/2;
  left=Math.max(8,Math.min(left,mapSize.w-popupW-8));
  const arrowLeft=Math.max(14,Math.min(anchorPx.x-left,popupW-14));
  const vertStyle=flipDown?{top:anchorPx.y+16+GAP+10}:{bottom:mapSize.h-anchorPx.y+16+GAP+10};
  return(
    <motion.div initial={{opacity:0,scale:0.9,y:flipDown?-8:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:flipDown?-6:6}} transition={{type:'spring',stiffness:380,damping:28}} style={{position:'absolute',width:popupW,left,zIndex:110,pointerEvents:'all',...vertStyle}}>
      {!flipDown&&<div style={{position:'absolute',bottom:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderTop:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}
      <div style={{background:'#ffffff',borderRadius:14,border:`1.5px solid ${color}`,boxShadow:'0 8px 24px rgba(0,0,0,0.10)',overflow:'hidden',position:'relative'}}>
        <button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'absolute',top:10,right:10,width:24,height:24,borderRadius:'50%',background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:5,padding:0}}><X size={12}/></button>
        <div style={{background:`linear-gradient(135deg,${color},${color}dd)`,padding:'14px 18px',textAlign:'center'}}>
          <span style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'rgba(255,255,255,0.85)',display:'block',marginBottom:3}}>{label}</span>
          <h4 style={{margin:0,fontSize:15,fontWeight:800,color:'#ffffff',letterSpacing:'-0.3px'}}>{stateName}</h4>
        </div>
        <div style={{padding:'14px 18px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,padding:'7px 10px',background:`${color}12`,borderRadius:8,border:`1px solid ${color}25`}}>
            <Building2 size={14} color={color}/>
            <span style={{fontSize:12,fontWeight:700,color}}>{count} Projects</span>
          </div>
          <button onClick={e=>{e.stopPropagation();onViewMore();}} style={{width:'100%',padding:'9px 14px',borderRadius:8,background:color,color:'#ffffff',border:'none',fontSize:12.5,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7,transition:'all 0.2s'}}>View All Projects <ExternalLink size={13}/></button>
        </div>
      </div>
      {flipDown&&<div style={{position:'absolute',top:-9,left:arrowLeft,transform:'translateX(-50%)',width:0,height:0,borderLeft:'9px solid transparent',borderRight:'9px solid transparent',borderBottom:'9px solid #ffffff',pointerEvents:'none',zIndex:2}}/>}
    </motion.div>
  );
};

const CardProject = ({project,isSelected,onCardClick}) => {
  const isOngoing=project.status==='Ongoing';
  const accent        = isOngoing ? '#f97316'                   : '#198847';
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
        ...(isSelected ? {
          border:`1.5px solid ${selectedBorder}`,
          boxShadow:`0 6px 20px rgba(0,0,0,0.08)`,
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

export default function CoverageMap({ data, mapMarkers = [], ongoingProjects: strapiOngoing, completedProjects: strapiCompleted }){
  const navigate = useNavigate();

  // Dynamic state for ongoing & completed project lists
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [customLocations, setCustomLocations] = useState({});

  useEffect(() => {
    if (Array.isArray(mapMarkers) && mapMarkers.length > 0) {
      const allProjectsFromMarkers = mapMarkers.map(m => {
        const mName = m.projectName || m.project_name || m.name || '';
        const mCity = m.city || m.location || '';
        const mState = m.state || '';
        const isOngoing = (m.projectType || m.project_type || 'Ongoing').toLowerCase() === 'ongoing';

        // Match with ongoing or completed project detailed data if available
        const detailPool = isOngoing 
          ? [...(strapiOngoing || []), ...projectsData]
          : [...(strapiCompleted || []), ...completedProjectsData];

        const lowerName = mName.toLowerCase().trim();
        const lowerCity = mCity.toLowerCase().trim();
        const lowerState = mState.toLowerCase().trim();

        // MATCH BY (Name + Location) FIRST so identical names in different cities never clash!
        const match = detailPool.find(p => {
          const pName = (p.name || p.title || '').toLowerCase().trim();
          const pCity = (p.city || p.location || '').toLowerCase().trim();
          return pName === lowerName && (pCity === lowerCity || lowerCity.includes(pCity) || pCity.includes(lowerCity));
        }) || detailPool.find(p => {
          const pName = (p.name || p.title || '').toLowerCase().trim();
          const pState = (p.state || '').toLowerCase().trim();
          return pName === lowerName && (pState === lowerState || lowerState.includes(pState) || pState.includes(lowerState));
        }) || detailPool.find(p => {
          const pCity = (p.city || p.location || '').toLowerCase().trim();
          return pCity && lowerCity && (pCity === lowerCity || lowerCity.includes(pCity) || pCity.includes(lowerCity));
        }) || detailPool.find(p => {
          const pName = (p.name || p.title || '').toLowerCase().trim();
          return pName === lowerName || lowerName.includes(pName) || pName.includes(lowerName);
        }) || {};

        // Resolve images: prioritize accurate matched project gallery, then marker images
        let markerImgs = [];
        if (Array.isArray(m.images) && m.images.length > 1) {
          markerImgs = m.images.map(img => {
            const url = img.url || '';
            return url.startsWith('http') ? url : `http://localhost:1337${url}`;
          });
        } else if (match.images && match.images.length > 0) {
          markerImgs = match.images;
        } else if (Array.isArray(m.images) && m.images.length === 1) {
          const url = m.images[0].url || '';
          markerImgs = [url.startsWith('http') ? url : `http://localhost:1337${url}`];
        } else if (m.image?.url) {
          const url = m.image.url;
          markerImgs = [url.startsWith('http') ? url : `http://localhost:1337${url}`];
        } else if (match.image) {
          markerImgs = [match.image];
        } else {
          markerImgs = [FALLBACK_IMG];
        }

        return {
          id: m.id || m.documentId || match.id,
          name: mName || match.name || 'Project',
          state: mState || match.state || 'Default State',
          city: mCity || match.city || match.location || 'Default City',
          location: mCity || match.location || match.city || 'Default City',
          status: isOngoing ? 'Ongoing' : 'Completed',
          category: match.category || (isOngoing ? 'Infrastructure' : 'Industrial'),
          area: match.area || 'N/A',
          client: match.client || 'PISL Client',
          scope: match.scope || (isOngoing ? 'EPC Services' : 'Full Turnkey Construction'),
          timeline: match.timeline || (isOngoing ? '2024 - 2026' : 'Completed'),
          progress: match.progress || (isOngoing ? (Math.floor(Math.random() * 50) + 35) : 100),
          cx: m.cx != null ? Number(m.cx) : (match.cx != null ? Number(match.cx) : 50),
          cy: m.cy != null ? Number(m.cy) : (match.cy != null ? Number(match.cy) : 50),
          images: markerImgs,
          image: markerImgs[0] || FALLBACK_IMG,
        };
      });

      const ogList = allProjectsFromMarkers.filter(p => p.status === 'Ongoing');
      const compList = allProjectsFromMarkers.filter(p => p.status === 'Completed');

      setOngoingProjects(ogList);
      setCompletedProjects(compList);
    } else {
      const ogList = (strapiOngoing && strapiOngoing.length > 0) ? strapiOngoing : projectsData;
      const compList = (strapiCompleted && strapiCompleted.length > 0) ? strapiCompleted : completedProjectsData;
      setOngoingProjects(ogList);
      setCompletedProjects(compList);
    }
  }, [strapiOngoing, strapiCompleted, mapMarkers]);

  const gujaratProjectCount = ongoingProjects.filter(p=>p.state==='Gujarat').length;
  const haryanaProjectCount = completedProjects.filter(p=>p.state==='Haryana').length;

  const [activeTab, setActiveTab] = useState('ongoing');
  const [selectedCity, setSelectedCity] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [svgContent, setSvgContent] = useState('');
  const [popupAnchor, setPopupAnchor] = useState(null);
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });

  const [showGujaratPopup, setShowGujaratPopup] = useState(false);
  const [gujaratPopupAnchor, setGujaratPopupAnchor] = useState(null);
  const [showGujaratMap, setShowGujaratMap] = useState(false);

  const [showHaryanaPopup, setShowHaryanaPopup] = useState(false);
  const [haryanaPopupAnchor, setHaryanaPopupAnchor] = useState(null);
  const [showHaryanaMap, setShowHaryanaMap] = useState(false);

  // New Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMarkersDrawer, setShowMarkersDrawer] = useState(false);
  const [isPickingCoords, setIsPickingCoords] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [drawerFilter, setDrawerFilter] = useState('all');

  // Add Marker Form State
  const [newMarkerForm, setNewMarkerForm] = useState({
    type: 'ongoing', // 'ongoing' or 'completed'
    name: '',
    city: '',
    state: '',
    category: 'Industrial Park',
    area: '5,00,000 Sq. Ft.',
    client: 'PISL Client',
    scope: 'Civil & Structural Steel Works',
    timeline: '2025 - 2026',
    progress: 65,
    cx: '25.5',
    cy: '36.0'
  });

  const [lastAddedMarker, setLastAddedMarker] = useState(null);

  const [swiperKey, setSwiperKey] = useState(0);
  const mapRef = useRef(null);
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    fetch('/indiaHigh.svg')
      .then(r => r.text())
      .then(data => setSvgContent(data.replace(/<svg/, '<svg class="cm-india-svg" preserveAspectRatio="xMidYMid meet"')))
      .catch(() => {});
  }, []);

  const syncMapSize = useCallback(() => {
    if (mapRef.current) {
      const { width, height } = mapRef.current.getBoundingClientRect();
      setMapSize({ w: width, h: height });
    }
  }, []);

  useEffect(() => {
    syncMapSize();
    const ro = new ResizeObserver(syncMapSize);
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, [syncMapSize]);

  const filteredProjects = activeTab === 'ongoing' ? ongoingProjects : completedProjects;
  const currentColor = activeTab === 'ongoing' ? ORANGE : GREEN;

  const locationCounts = {};
  filteredProjects.forEach(p => {
    const key = p.city;
    if (activeTab === 'ongoing' && p.state === 'Gujarat') return;
    if (activeTab === 'completed' && p.state === 'Haryana') return;
    if (!locationCounts[key]) locationCounts[key] = [];
    locationCounts[key].push(p);
  });

  useEffect(() => {
    if (!selectedCity || mapSize.w === 0) return;
    const cityProjects = locationCounts[selectedCity];
    if (!cityProjects || cityProjects.length === 0) return;
    const p0 = cityProjects[0];
    const loc = getLoc(p0, mapMarkers, customLocations);
    setPopupAnchor({ x: (loc.cx / 100) * mapSize.w, y: (loc.cy / 100) * mapSize.h });
  }, [mapSize, selectedCity, customLocations]);

  useEffect(() => {
    if (selectedCity) {
      const projs = filteredProjects.filter(p => p.city === selectedCity);
      setHighlightedIds(projs.map(p => p.id));
      const cardIdx = filteredProjects.findIndex(p => p.city === selectedCity);
      setTimeout(() => {
        if (swiperRef.current && cardIdx >= 0) swiperRef.current.slideTo(cardIdx);
      }, 80);
    } else {
      setHighlightedIds([]);
    }
  }, [selectedCity, activeTab, filteredProjects]);

  const selectedCityProjects = selectedCity ? (locationCounts[selectedCity] || null) : null;
  const isSingleProject = selectedCityProjects && selectedCityProjects.length === 1;

  // Click on Map to Pick Coordinates
  const handleMapClickToPickCoords = (e) => {
    if (!isPickingCoords || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const cxPct = Number(((clickX / rect.width) * 100).toFixed(1));
    const cyPct = Number(((clickY / rect.height) * 100).toFixed(1));
    
    setNewMarkerForm(prev => ({
      ...prev,
      cx: String(cxPct),
      cy: String(cyPct)
    }));
    setIsPickingCoords(false);
  };

  // Add Custom Marker Submission
  const handleAddMarkerSubmit = (e) => {
    e.preventDefault();
    if (!newMarkerForm.name || !newMarkerForm.city || !newMarkerForm.state) {
      alert("Please fill Project Name, City, and State.");
      return;
    }

    const cxNum = parseFloat(newMarkerForm.cx) || 50;
    const cyNum = parseFloat(newMarkerForm.cy) || 50;

    const newProj = {
      id: `custom-${Date.now()}`,
      name: newMarkerForm.name,
      city: newMarkerForm.city,
      state: newMarkerForm.state,
      location: newMarkerForm.city,
      status: newMarkerForm.type === 'ongoing' ? 'Ongoing' : 'Completed',
      category: newMarkerForm.category,
      area: newMarkerForm.area,
      client: newMarkerForm.client,
      scope: newMarkerForm.scope,
      timeline: newMarkerForm.timeline,
      progress: newMarkerForm.type === 'ongoing' ? (Number(newMarkerForm.progress) || 60) : 100,
      image: FALLBACK_IMG,
      images: [FALLBACK_IMG],
      cx: cxNum,
      cy: cyNum
    };

    // Update locations dictionary state
    setCustomLocations(prev => ({
      ...prev,
      [newMarkerForm.city]: { cx: cxNum, cy: cyNum }
    }));

    if (newMarkerForm.type === 'ongoing') {
      setOngoingProjects(prev => [newProj, ...prev]);
      setActiveTab('ongoing');
    } else {
      setCompletedProjects(prev => [newProj, ...prev]);
      setActiveTab('completed');
    }

    setLastAddedMarker(newProj);
    setShowAddModal(false);
    setSelectedCity(newMarkerForm.city);
    setSwiperKey(prev => prev + 1);
  };

  const handleMarkerClick = (city, projects) => {
    if (selectedCity === city) {
      setSelectedCity(null);
      setPopupAnchor(null);
      return;
    }
    const p0 = projects[0];
    const loc = getLoc(p0, mapMarkers, customLocations);
    setPopupAnchor({ x: (loc.cx / 100) * mapSize.w, y: (loc.cy / 100) * mapSize.h });
    setSelectedCity(city);
    setShowGujaratPopup(false);
    setShowHaryanaPopup(false);
  };

  const handleGujaratHubClick = () => {
    setSelectedCity(null);
    setPopupAnchor(null);
    setShowHaryanaPopup(false);
    setShowGujaratPopup(!showGujaratPopup);
    setGujaratPopupAnchor({ x: (8 / 100) * mapSize.w, y: (48 / 100) * mapSize.h });
  };

  const handleHaryanaHubClick = () => {
    setSelectedCity(null);
    setPopupAnchor(null);
    setShowGujaratPopup(false);
    setShowHaryanaPopup(!showHaryanaPopup);
    setHaryanaPopupAnchor({ x: (29 / 100) * mapSize.w, y: (30 / 100) * mapSize.h });
  };

  const closePopup = () => {
    setSelectedCity(null);
    setPopupAnchor(null);
  };

  const handleProjectClickFromPopup = (project) => {
    setHighlightedIds([project.id]);
    const cardIdx = filteredProjects.findIndex(p => p.id === project.id);
    setTimeout(() => {
      if (swiperRef.current && cardIdx >= 0) swiperRef.current.slideTo(cardIdx);
    }, 80);
  };

  const handleCardClick = (project) => {
    const type = project.status === 'Ongoing' || project.status === 'ongoing' ? 'ongoing' : 'completed';
    const slug = project.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/project/${type}/${slug}`, { state: { projectData: project } });
  };

  const handleTabChange = (tab) => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    setSelectedCity(null);
    setPopupAnchor(null);
    setShowGujaratPopup(false);
    setShowHaryanaPopup(false);
    setHighlightedIds([]);
    setSwiperKey(prev => prev + 1);
  };

  // Compile all active markers with full info for drawer
  const allPlottedMarkers = [];
  const processedCities = new Set();
  
  [...ongoingProjects, ...completedProjects].forEach(p => {
    const loc = getLoc(p, mapMarkers, customLocations);
    allPlottedMarkers.push({
      ...p,
      cx: loc.cx,
      cy: loc.cy
    });
  });

  // Filtered markers based on drawer dropdown
  const filteredDrawerMarkers = allPlottedMarkers.filter(m => {
    if (drawerFilter === 'ongoing') return m.status === 'Ongoing';
    if (drawerFilter === 'completed') return m.status === 'Completed';
    return true;
  });

  const handleCoordChange = (city, newCx, newCy) => {
    const cxNum = parseFloat(newCx) || 0;
    const cyNum = parseFloat(newCy) || 0;
    setCustomLocations(prev => ({
      ...prev,
      [city]: { cx: cxNum, cy: cyNum }
    }));
  };

  if (showGujaratMap) return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowGujaratMap(false)} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, padding: '10px 20px', borderRadius: 8, background: ORANGE, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <ChevronLeft size={16}/>Back to India Map
      </button>
      <GujaratMap/>
    </div>
  );

  if (showHaryanaMap) return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowHaryanaMap(false)} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, padding: '10px 20px', borderRadius: 8, background: GREEN, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <ChevronLeft size={16}/>Back to India Map
      </button>
      <HaryanaCompletedMap/>
    </div>
  );

  return (
    <div className="cm-wrapper">

      <div className="cm-layout" style={{ marginBottom: "20px" }}>
        <div className="cm-left-panel">
          <div className="cm-map-container" ref={mapRef} onClick={handleMapClickToPickCoords} style={{ cursor: isPickingCoords ? 'crosshair' : 'default' }}>
            {svgContent ? (
              <div className="cm-svg-wrapper" dangerouslySetInnerHTML={{ __html: svgContent }} />
            ) : (
              <div className="cm-missing-svg"><p>Place <b>indiaHigh.svg</b> in <b>/public</b></p></div>
            )}
            <div className="cm-markers-overlay">
              {(selectedCity || showGujaratPopup || showHaryanaPopup) && (
                <div onClick={() => { closePopup(); setShowGujaratPopup(false); setShowHaryanaPopup(false); }} style={{ position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'all', cursor: 'default' }} />
              )}
              {Object.entries(locationCounts).map(([city, projects]) => (
                <MapMarker key={city} cityProjects={projects} mapMarkers={mapMarkers} customLocations={customLocations} isSelected={selectedCity === city} isHovered={hoveredCity === city} color={currentColor} onHover={() => setHoveredCity(city)} onLeave={() => setHoveredCity(null)} onClick={() => handleMarkerClick(city, projects)} />
              ))}

              {activeTab === 'ongoing' && (
                <StateHubMarker cx={12} cy={48} color="#f97316" isActive={showGujaratPopup} onClick={handleGujaratHubClick} label="Gujarat" />
              )}

              {activeTab === 'completed' && (
                <StateHubMarker cx={28} cy={29} color="#198847" isActive={showHaryanaPopup} onClick={handleHaryanaHubClick} label="Haryana" />
              )}

              <AnimatePresence>
                {selectedCityProjects && popupAnchor && mapSize.w > 0 && isSingleProject && (
                  <SingleProjectPopup key={selectedCity} project={selectedCityProjects[0]} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup} color={currentColor} />
                )}
                {selectedCityProjects && popupAnchor && mapSize.w > 0 && !isSingleProject && (
                  <CityProjectsPopup key={selectedCity} cityProjects={selectedCityProjects} anchorPx={popupAnchor} mapSize={mapSize} onClose={closePopup} onProjectClick={handleProjectClickFromPopup} color={currentColor} />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showGujaratPopup && gujaratPopupAnchor && mapSize.w > 0 && (
                  <StatePopup anchorPx={gujaratPopupAnchor} mapSize={mapSize} onClose={() => setShowGujaratPopup(false)} onViewMore={() => { setShowGujaratPopup(false); setShowGujaratMap(true); }} color="#f97316" label="Ongoing Projects" count={gujaratProjectCount} stateName="Gujarat" />
                )}

                {showHaryanaPopup && haryanaPopupAnchor && mapSize.w > 0 && (
                  <StatePopup anchorPx={haryanaPopupAnchor} mapSize={mapSize} onClose={() => setShowHaryanaPopup(false)} onViewMore={() => { setShowHaryanaPopup(false); setShowHaryanaMap(true); }} color="#198847" label="Completed Projects" count={haryanaProjectCount} stateName="Haryana" />
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="cm-legend">
            <h4>Infrastructure Network</h4>
            <div className="cm-legend-item">
              <span className="cm-legend-dot" style={{ backgroundColor: '#f97316' }} />
              <span>Ongoing ({ongoingProjects.length})</span>
            </div>
            <div className="cm-legend-item">
              <span className="cm-legend-dot" style={{ backgroundColor: '#198847' }} />
              <span>Completed ({completedProjects.length})</span>
            </div>
          </div>
        </div>

        <div className="cm-right-panel">
          <div className="cm-header">
            <div className="cm-header-top">
              <div>
                <h1 className="cm-main-title">
                  {data?.coverageTitle ? <span dangerouslySetInnerHTML={{ __html: data.coverageTitle }} /> : <>Nationwide <span style={{ color: "#f97316" }}>Coverage</span></>}
                </h1>
                <p className="cm-subtitle">Click marker to highlight city projects</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleTabChange('ongoing')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: activeTab === 'ongoing' ? '2px solid #f97316' : '1px solid #e2e8f0', background: activeTab === 'ongoing' ? '#fff7ed' : '#ffffff', color: activeTab === 'ongoing' ? '#f97316' : '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                  <Activity size={15}/>Ongoing
                  <span style={{ background: activeTab === 'ongoing' ? '#f97316' : '#e2e8f0', color: activeTab === 'ongoing' ? '#fff' : '#64748b', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 800 }}>{ongoingProjects.length}</span>
                </button>
                <button onClick={() => handleTabChange('completed')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: activeTab === 'completed' ? '2px solid #198847' : '1px solid #e2e8f0', background: activeTab === 'completed' ? 'rgba(25,136,71,0.08)' : '#ffffff', color: activeTab === 'completed' ? '#166534' : '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                  <CheckCircle2 size={15}/>Completed
                  <span style={{ background: activeTab === 'completed' ? '#198847' : '#e2e8f0', color: activeTab === 'completed' ? '#fff' : '#64748b', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 800 }}>{completedProjects.length}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="cm-content-area">
            <AnimatePresence mode="wait">
              {filteredProjects.length > 0 ? (
                <motion.div key={`sw-${activeTab}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="cm-slider-wrapper">
                    <div className="cm-nav-arrows">
                      <button ref={prevRef} className="cm-nav-btn cm-nav-prev-btn" onClick={() => swiperRef.current?.slidePrev()}><ChevronLeft size={20}/></button>
                      <button ref={nextRef} className="cm-nav-btn cm-nav-next-btn" onClick={() => swiperRef.current?.slideNext()}><ChevronRight size={20}/></button>
                    </div>
                    <Swiper key={swiperKey} onSwiper={s => { swiperRef.current = s; }} modules={[Navigation, Pagination, Autoplay]} spaceBetween={16} slidesPerView={2} slidesPerGroup={2} navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }} pagination={{ clickable: true, dynamicBullets: true }} autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }} breakpoints={{ 0: { slidesPerView: 1, slidesPerGroup: 1 }, 1024: { slidesPerView: 2, slidesPerGroup: 2 } }} onBeforeInit={sw => { sw.params.navigation.prevEl = prevRef.current; sw.params.navigation.nextEl = nextRef.current; }} style={{ paddingBottom: '50px' }}>
                      {filteredProjects.map(project => (
                        <SwiperSlide key={`${project.id}-${project.status}`} style={{ height: 'auto' }}>
                          <div onMouseEnter={() => setHoveredCity(project.city)} onMouseLeave={() => setHoveredCity(null)}>
                            <CardProject project={project} isSelected={highlightedIds.includes(project.id)} onCardClick={handleCardClick}/>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cm-empty-state">
                  <Building2 size={64}/>
                  <h3>No projects found</h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mmPing{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.4;}70%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}100%{transform:translate(-50%,-50%) scale(2.3);opacity:0;}}
        @keyframes mmGlow{0%,100%{opacity:0.9;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.4;transform:translate(-50%,-50%) scale(1.35);}}
        .cm-wrapper{width:100%;background:#ffffff;}
        @media(min-width:1024px){.cm-wrapper{background:linear-gradient(to right, #f8fafc 45%, #ffffff 45%);}}
        .cm-layout{display:flex;flex-direction:column;min-height:100vh;background:transparent;color:#0f172a;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;max-width:1536px;margin:0 auto;box-shadow:0 0 40px rgba(0,0,0,0.03);}
        @media(min-width:1024px){.cm-layout{flex-direction:row;height:auto;min-height:650px;}}
        .cm-left-panel{width:100%;min-height:50vh;position:relative;background:#f8fafc;border-right:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;padding:40px;}
        @media(min-width:1024px){.cm-left-panel{width:45%;min-height:100%;align-items:flex-start;padding-top:65px;position:relative;}}
        .cm-map-container{position:relative;width:100%;max-width:465px;aspect-ratio:1/1.18;overflow:visible;}
        .cm-svg-wrapper{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
        .cm-india-svg{width:100%;height:100%;fill:#28286e;stroke:#3b3b8e;stroke-width:1.2px;}
        .cm-missing-svg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border:2px dashed #cbd5e1;border-radius:12px;color:#64748b;font-size:14px;text-align:center;padding:24px;background:#f8fafc;}
        .cm-markers-overlay{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
        .cm-legend{position:absolute;bottom:20px;left:20px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border:1px solid #e2e8f0;padding:12px 16px;border-radius:12px;}
        .cm-legend h4{margin:0 0 8px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;}
        .cm-legend-item{display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:12px;font-weight:600;color:#28286e;}
        .cm-legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
        .cm-right-panel{width:100%;display:flex;flex-direction:column;background:#ffffff;}
        @media(min-width:1024px){.cm-right-panel{width:55%;}}
        .cm-header{flex-shrink:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:24px 40px 20px;border-bottom:1px solid #e2e8f0;}
        .cm-header-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
        .cm-main-title{margin:0;font-size:26px;font-weight:900;color:#28286e;letter-spacing:-0.5px;}
        .cm-subtitle{margin:4px 0 0;color:#64748b;font-size:13px;}
        .cm-content-area{padding:28px 40px;flex:1;display:flex;flex-direction:column;}
        .cm-slider-wrapper{position:relative;width:100%;height:100%;}
        .cm-nav-arrows{position:absolute;top:-54px;right:0;display:flex;gap:6px;z-index:10;}
        .cm-nav-btn{width:34px;height:34px;border-radius:8px;background:#ffffff;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#28286e;transition:all 0.2s;}
        .cm-nav-btn:hover{background:#f8fafc;border-color:#f97316;color:#f97316;}
        .cm-nav-btn.swiper-button-disabled{opacity:0.4;cursor:not-allowed;}
        @media(max-width:1024px){.cm-nav-arrows{display:none;}}
        .cm-card{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;transition:all 0.3s ease;display:flex;flex-direction:column;overflow:hidden;height:100%;}
        .cm-card:hover{border-color:#cbd5e1;transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,0.06);}
        .cm-card-ongoing.cm-card-selected{border:1.5px solid #f97316!important;box-shadow:0 6px 20px rgba(249,115,22,0.15)!important;}
        .cm-card-completed.cm-card-selected{border:1.5px solid #198847!important;box-shadow:0 6px 20px rgba(25,136,71,0.15)!important;}
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
    </div>
  );
}