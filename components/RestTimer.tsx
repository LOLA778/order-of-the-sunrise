


import React, { useState, useEffect, useRef } from 'react';

const RestTimer: React.FC = () => {
    const [seconds, setSeconds] = useState(180);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const startTimer = () => {
        if (seconds > 0) {
            setIsActive(true);
        }
    };
    
    const pauseTimer = () => setIsActive(false);

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(180);
    };
    
    useEffect(() => {
        if (isActive && seconds > 0) {
            intervalRef.current = window.setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            if(intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, seconds]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mt-6 text-center">
            <h3 className="text-lg font-bold text-steel-gray mb-2">Таймер отдыха</h3>
            <div className="text-5xl font-mono font-bold text-gold p-4 bg-black/30 rounded-lg inline-block">
                {formatTime(seconds)}
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                 <button 
                    onClick={isActive ? pauseTimer : startTimer} 
                    className="px-6 py-2 bg-fire-gradient text-black font-bold rounded-lg hover:shadow-fire-glow transition-shadow"
                 >
                    {isActive ? 'Пауза' : 'Старт'}
                </button>
                <button 
                    onClick={resetTimer} 
                    className="px-6 py-2 bg-black/30 border border-gold/50 text-gold font-bold rounded-lg hover:bg-black/40"
                >
                    Сброс
                </button>
            </div>
            <style>{`
                .text-gold { color: #FFD700; }
                .text-steel-gray { color: #C0A080; }
                .bg-fire-gradient { background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700); }
                .hover\\:shadow-fire-glow:hover { box-shadow: 0 0 15px rgba(255, 107, 53, 0.6); }
                .border-gold\\/50 { border-color: rgba(255, 215, 0, 0.5); }
            `}</style>
        </div>
    );
};

export default RestTimer;
