


import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';

interface TaskTimerProps {
    task: Task;
    isCompleted: boolean;
    onComplete: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ task, isCompleted, onComplete }) => {
    const [durationMinutes, setDurationMinutes] = useState(task.target);
    const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isCompleted) {
            setIsActive(false);
            setSecondsRemaining(0);
        } else {
            setSecondsRemaining(durationMinutes * 60);
        }
    }, [isCompleted, durationMinutes]);
    
    useEffect(() => {
        if (isActive && secondsRemaining > 0) {
            intervalRef.current = window.setInterval(() => {
                setSecondsRemaining(s => s - 1);
            }, 1000);
        } else if (secondsRemaining === 0 && isActive) {
            setIsActive(false);
            onComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, secondsRemaining, onComplete]);
    
    const handleStartPause = () => {
        if (isCompleted) return;
        if (secondsRemaining > 0) {
            setIsActive(!isActive);
        }
    };
    
    const handleReset = () => {
        setIsActive(false);
        setSecondsRemaining(durationMinutes * 60);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMinutes = parseInt(e.target.value, 10) || 0;
        setDurationMinutes(newMinutes);
        setSecondsRemaining(newMinutes * 60);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (isCompleted) {
        return (
             <div className="text-gold font-bold">Выполнено</div>
        );
    }
    
    return (
        <div className="flex items-center space-x-2">
            <input
                type="number"
                value={durationMinutes}
                onChange={handleDurationChange}
                disabled={isActive}
                className="w-16 bg-black/30 border border-gold/30 rounded-md p-2 text-center text-warm-white focus:ring-gold focus:border-gold disabled:opacity-50"
                min="1"
            />
            <span className="font-mono text-lg text-gold w-20 text-center">{formatTime(secondsRemaining)}</span>
            <button onClick={handleStartPause} className={`px-3 py-1 text-sm font-bold text-black rounded-md bg-fire-gradient hover:shadow-fire-glow transition-shadow`}>
                {isActive ? 'Пауза' : 'Старт'}
            </button>
             <button onClick={handleReset} className="px-3 py-1 text-sm font-bold text-gold rounded-md bg-black/30 border border-gold/50 hover:bg-black/40">
                Сброс
            </button>
            <style>{`.text-warm-white{color:#F8F0E3}.text-gold{color:#FFD700}.bg-fire-gradient{background-image:linear-gradient(to right, #E63946, #FF6B35, #FFD700)}.hover\\:shadow-fire-glow:hover{box-shadow:0 0 10px rgba(255,107,53,0.6)}.border-gold{border-color:#FFD700}.ring-gold:focus{--tw-ring-color:#FFD700}.border-gold\\/30{border-color:rgba(255,215,0,0.3)}.border-gold\\/50{border-color:rgba(255,215,0,0.5)}`}</style>
        </div>
    );
};

export default TaskTimer;
