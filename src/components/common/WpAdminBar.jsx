import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  clearLocalSiteCache,
  fetchAdminSession,
  fetchPreviewRecord,
  getPreviewContext,
  triggerCacheBump,
  WP_URL,
} from '../../services/wordpress';

const WpAdminBar = () => {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [previewInfo, setPreviewInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const previewCtx = getPreviewContext();

  useEffect(() => {
    // Only fetch session & preview info when actively previewing a page from WordPress
    if (!previewCtx) return;

    let active = true;
    const loadSession = async () => {
      const [sess, prev] = await Promise.all([
        fetchAdminSession(location.pathname),
        fetchPreviewRecord(previewCtx),
      ]);
      if (!active) return;
      setSession(sess && sess.authenticated ? sess : null);
      setPreviewInfo(prev || null);
    };
    loadSession();
    return () => {
      active = false;
    };
  }, [location.pathname, location.search]);

  // NEVER show on normal browsing. Only show when user specifically clicked "Preview" in WordPress
  if (!previewCtx) {
    return null;
  }

  const editUrl = previewInfo?.editUrl || session?.editTarget?.editUrl || `${WP_URL}/wp-admin/`;
  const editLabel = session?.editTarget?.label || 'Edit in WordPress';
  const listUrl = session?.editTarget?.listUrl || `${WP_URL}/wp-admin/`;
  const isDraftPreview = Boolean(previewCtx || previewInfo);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (session?.wpRestNonce) {
      await triggerCacheBump(session.wpRestNonce);
    }
    clearLocalSiteCache();
    window.location.reload();
  };

  const exitPreview = () => {
    const params = new URLSearchParams(window.location.search);
    ['pisl_preview', 'pisl_type', 'pisl_id', 'pisl_exp', 'pisl_sig'].forEach((k) => params.delete(k));
    const qs = params.toString();
    window.location.href = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
  };

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label="Open WordPress Editor Bar"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          zIndex: 99999,
          backgroundColor: '#0A2A66',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 135, 85, 0.8)',
          borderRadius: '9999px',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {isDraftPreview ? 'Preview Mode' : 'WP Admin'}
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="WordPress CMS Editor Controls"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 99999,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        border: `1.5px solid ${isDraftPreview ? '#F59E0B' : '#FF8755'}`,
        borderRadius: '12px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.32)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <span
        style={{
          padding: '3px 8px',
          borderRadius: '6px',
          backgroundColor: isDraftPreview ? '#B45309' : '#065F46',
          color: '#FFFFFF',
          fontWeight: 700,
          letterSpacing: '0.4px',
          fontSize: '11px',
        }}
      >
        {isDraftPreview
          ? `PREVIEW${previewInfo?.status ? ` (${String(previewInfo.status).toUpperCase()})` : ''}`
          : `WP: ${session?.user?.name || 'Editor'}`}
      </span>

      <a
        href={editUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: '#FF8755',
          color: '#FFFFFF',
          textDecoration: 'none',
          padding: '5px 10px',
          borderRadius: '6px',
          fontWeight: 700,
        }}
      >
        {editLabel}
      </a>

      <a
        href={listUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: '#1E293B',
          color: '#E2E8F0',
          textDecoration: 'none',
          padding: '5px 10px',
          borderRadius: '6px',
          fontWeight: 600,
          border: '1px solid #334155',
        }}
      >
        Dashboard
      </a>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        style={{
          backgroundColor: '#1E293B',
          color: '#E2E8F0',
          border: '1px solid #334155',
          borderRadius: '6px',
          padding: '5px 10px',
          fontWeight: 600,
          cursor: refreshing ? 'wait' : 'pointer',
        }}
      >
        {refreshing ? 'Refreshing...' : 'Refresh Cache'}
      </button>

      {isDraftPreview && (
        <button
          type="button"
          onClick={exitPreview}
          style={{
            backgroundColor: 'transparent',
            color: '#FBBF24',
            border: '1px solid #F59E0B',
            borderRadius: '6px',
            padding: '5px 9px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Exit Preview
        </button>
      )}

      <button
        type="button"
        onClick={() => setMinimized(true)}
        aria-label="Minimize WordPress Bar"
        style={{
          backgroundColor: 'transparent',
          color: '#94A3B8',
          border: 'none',
          padding: '2px 6px',
          fontSize: '15px',
          lineHeight: 1,
          cursor: 'pointer',
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default WpAdminBar;
