
import React from 'react';

interface IconProps {
  className?: string;
}

const KatanaIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l1.5-1.5L6 16.5l-1.5 1.5-2.25-2.25zM6 16.5l3-3 1.5 1.5-3 3M21 3L12 12m1.5-4.5L12 9l-1.5 1.5M4.5 21l3-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12l-1.5 1.5" />
    </svg>
);

export default KatanaIcon;