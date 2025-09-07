

import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <>
      <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-fire-gradient h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safePercentage}%` }}
        ></div>
      </div>
      <style>{`
        .bg-fire-gradient { background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700); }
      `}</style>
    </>
  );
};

export default ProgressBar;
