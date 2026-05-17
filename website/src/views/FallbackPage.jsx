import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const FallbackPage = () => {
  const params = useParams();
  const location = useLocation();
  const [appOpened, setAppOpened] = useState(false);

  // Reconstruct the full deep link path (e.g. /poll/abc123 or /profile/username)
  const deepLinkPath = location.pathname; // e.g. "/poll/6a09d3f1..."

  // Android intent URL — tries to open the app; falls back to Play Store if not installed
  const PACKAGE_NAME = 'com.deepangokul.cryptoapp';
  const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

  // Intent URL: uses https scheme so the app receives https://thoughts.co.in/poll/:id
  // which matches the existing deep link handler in _layout.tsx
  const intentUrl = `intent://thoughts.co.in${deepLinkPath}#Intent;scheme=https;package=${PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

  // Universal link (Android App Links — works if app is installed & verified)
  const universalUrl = `https://thoughts.co.in${deepLinkPath}`;

  useEffect(() => {
    // Attempt to open the app automatically on page load
    const timer = setTimeout(() => {
      window.location.href = intentUrl;
      setAppOpened(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [intentUrl]);

  const handleOpenApp = (e) => {
    e.preventDefault();
    window.location.href = intentUrl;
  };

  const handlePlayStore = (e) => {
    e.preventDefault();
    window.open(PLAY_STORE_URL, '_blank');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1f2d 100%)',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
    }}>
      {/* Glow circle behind logo */}
      <div style={{
        position: 'relative',
        marginBottom: '28px'
      }}>
        <div style={{
          position: 'absolute',
          inset: '-20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(69,191,208,0.25) 0%, transparent 70%)',
          filter: 'blur(12px)'
        }} />
        <img
          src="/ican.png"
          alt="Thoughts Logo"
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '22px',
            boxShadow: '0 8px 32px rgba(69,191,208,0.3)',
            position: 'relative',
            zIndex: 1
          }}
        />
      </div>

      <h1 style={{
        fontSize: '26px',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '12px',
        letterSpacing: '-0.3px'
      }}>
        Opening in Thoughts…
      </h1>

      <p style={{
        fontSize: '15px',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '36px',
        maxWidth: '360px',
        lineHeight: '1.6'
      }}>
        We're redirecting you to the Thoughts app. If it doesn't open automatically, tap the button below.
      </p>

      {/* Primary CTA — open app */}
      <button
        onClick={handleOpenApp}
        style={{
          background: 'linear-gradient(135deg, #07F2DF, #45BFD0)',
          color: '#0a0f1a',
          padding: '14px 40px',
          borderRadius: '50px',
          border: 'none',
          fontWeight: '700',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(7,242,223,0.35)',
          marginBottom: '16px',
          transition: 'transform 0.15s, box-shadow 0.15s',
          letterSpacing: '0.2px',
          minWidth: '220px'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(7,242,223,0.45)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(7,242,223,0.35)';
        }}
      >
        Open in Thoughts App
      </button>

      {/* Secondary CTA — Play Store */}
      <button
        onClick={handlePlayStore}
        style={{
          background: 'transparent',
          color: 'rgba(255,255,255,0.55)',
          padding: '12px 40px',
          borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.15)',
          fontWeight: '500',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'color 0.15s, border-color 0.15s',
          minWidth: '220px'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }}
      >
        Download from Play Store
      </button>

      <p style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.25)',
        marginTop: '40px'
      }}>
        thoughts.co.in
      </p>
    </div>
  );
};

export default FallbackPage;
