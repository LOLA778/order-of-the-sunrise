
import React from 'react';

interface IconProps {
  className?: string;
}

const ScrollIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M3.75 6.75h16.5m-16.5-3h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 3.75v16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 3.75v16.5" />
    </svg>
);

export default ScrollIcon;