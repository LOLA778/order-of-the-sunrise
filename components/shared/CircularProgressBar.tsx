


import React from 'react';

interface CircularProgressBarProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 100,
  strokeWidth = 10,
}) => {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercentage / 100) * circumference;
  const gradientId = `fireGradient-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E63946" />
                <stop offset="50%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
        </defs>
        <circle
          stroke="rgba(255, 215, 0, 0.1)" // trackColor #FFD700 at 10%
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={`url(#${gradientId})`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.5s ease-out',
            filter: 'drop-shadow(0 0 5px rgba(255, 107, 53, 0.5))' // #FF6B35
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-warm-white" style={{ fontSize: size / 4.5, textShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
          {`${Math.round(safePercentage)}%`}
        </span>
      </div>
      <style>{`.text-warm-white { color: #F8F0E3; }`}</style>
    </div>
  );
};

export default CircularProgressBar;
