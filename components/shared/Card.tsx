
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <>
      <div 
          className={`bg-glass-red backdrop-blur-lg border border-gold/30 rounded-2xl shadow-lg p-5 ${className}`}
      >
        {children}
      </div>
      <style>{`
        .bg-glass-red { background-color: rgba(44, 21, 21, 0.4); }
        .border-gold\\/30 { border-color: rgba(255, 215, 0, 0.3); }
        .shadow-lg { box-shadow: 0 0 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05); }
      `}</style>
    </>
  );
};

export default Card;
