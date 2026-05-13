import React from 'react';
import '../index.css'; // Assuming this imports standard styles

const FallbackPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <img src="/ican.png" alt="Thoughts Logo" style={{ width: '80px', height: '80px', marginBottom: '24px', borderRadius: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#101720', marginBottom: '12px' }}>
        Open in Thoughts
      </h1>
      <p style={{ fontSize: '16px', color: '#687684', marginBottom: '32px', maxWidth: '400px', lineHeight: '1.5' }}>
        To view this content, please download the Thoughts app. Share your mind and see what others are thinking!
      </p>
      
      <a 
        href="#" 
        onClick={(e) => {
          e.preventDefault();
          alert('Download link will be available soon!');
        }}
        style={{
          backgroundColor: '#45BFD0',
          color: '#ffffff',
          padding: '12px 32px',
          borderRadius: '24px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px',
          boxShadow: '0 4px 6px rgba(69, 191, 208, 0.2)'
        }}
      >
        Download App
      </a>
      <p style={{ fontSize: '14px', color: '#999', marginTop: '24px' }}>
        If you already have the app installed, this link should open automatically.
      </p>
    </div>
  );
};

export default FallbackPage;
