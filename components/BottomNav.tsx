
import React from 'react';
import { PathId } from '../types';
import { PATHS } from '../constants';
import SunIcon from './icons/SunIcon';
import KatanaIcon from './icons/KatanaIcon';
import ScrollIcon from './icons/ScrollIcon';
import FlameIcon from './icons/FlameIcon';
import TargetIcon from './icons/TargetIcon';
import CoinIcon from './icons/CoinIcon';

interface BottomNavProps {
  activePath: PathId;
  setActivePath: (path: PathId) => void;
}

const iconMap: { [key in PathId]?: React.ReactNode } = {
  [PathId.DASHBOARD]: <SunIcon className="h-full w-full" />,
  [PathId.PHYSICS]: <KatanaIcon className="h-full w-full" />,
  [PathId.MIND]: <ScrollIcon className="h-full w-full" />,
  [PathId.SPIRIT]: <FlameIcon className="h-full w-full" />,
  [PathId.CHALLENGES]: <TargetIcon className="h-full w-full" />,
  [PathId.FINANCE]: <CoinIcon className="h-full w-full" />,
};

const BottomNav: React.FC<BottomNavProps> = ({ activePath, setActivePath }) => {
  return (
    <>
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg h-20 bg-glass-red backdrop-blur-lg border border-gold/30 rounded-2xl shadow-lg">
        <div className="flex justify-around h-full">
          {PATHS.map(path => {
            const isActive = activePath === path.id;
            return (
              <button
                key={path.id}
                onClick={() => setActivePath(path.id)}
                className={`flex flex-col items-center justify-center w-full pt-1 text-center transition-colors duration-200 relative ${
                  isActive ? 'text-gold' : 'text-steel-gray hover:text-gold'
                }`}
              >
                <div className={`w-8 h-8 transition-all duration-300 ${isActive ? 'icon-glow' : ''}`}>
                  {iconMap[path.id]}
                </div>
                <span className={`text-xs font-medium mt-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{path.name}</span>
              </button>
            )
          })}
        </div>
      </nav>
      <style>{`
        .bg-glass-red { background-color: rgba(44, 21, 21, 0.4); }
        .text-gold { color: #FFD700; }
        .border-gold\\/30 { border-color: rgba(255, 215, 0, 0.3); }
        .text-steel-gray { color: #C0A080; }
        .icon-glow {
          filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.7));
        }
      `}</style>
    </>
  );
};

export default BottomNav;