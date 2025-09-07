
import React from 'react';

interface IconProps {
  className?: string;
}

const TargetIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.552 8.086a5.5 5.5 0 010 7.828M17.676 6.06a8 8 0 010 11.88m-11.314-11.88a8 8 0 0111.314 0m-11.314 11.88a8 8 0 010-11.88m2.122 9.758a5.5 5.5 0 017.828 0M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    </svg>
);

export default TargetIcon;