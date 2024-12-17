import React from 'react';

const GlowingHeader = ({ name = 'Organization' }) => {
  return (
    <h1 
      className="text-xl font-semibold relative"
      style={{
        textShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
      }}
    >
      {name}
    </h1>
  );
};

export default GlowingHeader;