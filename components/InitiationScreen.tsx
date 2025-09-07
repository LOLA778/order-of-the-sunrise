
import React, { useState, useEffect } from 'react';

interface InitiationScreenProps {
  onInitiate: () => void;
}

const steps = [
  { text: "На рассвете добеги до реки или любого водоёма.", duration: 3000 },
  { text: "Окунись в холодную воду.", duration: 3000 },
  { text: 'Произнеси вслух: "Я принимаю путь Ордена Восхода."', duration: 4000 },
  { text: "Сделай 10 отжиманий как символ вступления.", duration: 3000 },
  { text: "Твоё обещание дано. Путь начат.", duration: 2000 },
];

const InitiationScreen: React.FC<InitiationScreenProps> = ({ onInitiate }) => {
    const [stepIndex, setStepIndex] = useState(-1);
    const [animating, setAnimating] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (animating && stepIndex < steps.length) {
            const timer = setTimeout(() => {
                setStepIndex(stepIndex + 1);
            }, steps[stepIndex]?.duration || 1000);
            return () => clearTimeout(timer);
        } else if (stepIndex >= steps.length) {
            setAnimating(false);
            setShowButton(true);
        }
    }, [stepIndex, animating]);

    const startRitual = () => {
        setStepIndex(0);
        setAnimating(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-warm-white p-6 text-center transition-opacity duration-1000">
            <h1 className="text-4xl md:text-5xl font-black tracking-wider text-shadow-gold">ОРДЕН ВОСХОДА</h1>
            <p className="mt-4 max-w-2xl text-lg text-steel-gray">
                Каждый день — твой новый бой. Каждый день — твой новый рассвет.
            </p>
            <div className="mt-8 border-t-2 border-gold/30 w-24"></div>
            
            <div className="mt-8 text-center max-w-xl h-48 flex items-center justify-center">
                {!animating && !showButton && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4">Обряд вступления</h2>
                        <p className="mb-2 text-steel-gray">Путь начинается с первого шага. С ритуала.</p>
                        <button onClick={startRitual} className="fire-button mt-4 px-6 py-2 font-bold rounded-lg">Начать ритуал</button>
                    </div>
                )}
                {animating && stepIndex < steps.length && (
                     <p key={stepIndex} className="text-2xl font-semibold animate-fade-in-out">
                        {steps[stepIndex].text}
                     </p>
                )}
            </div>

            {showButton && (
                 <button
                    onClick={onInitiate}
                    className="fire-button mt-10 px-8 py-3 text-lg font-bold rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-fire-orange/20 animate-fade-in"
                >
                    ЗАВЕРШИТЬ ОБРЯД
                </button>
            )}
            
            <style>{`
                .text-shadow-gold {
                    text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
                }
                .fire-button {
                    background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700);
                    color: #1A0A0A;
                    background-size: 200% auto;
                    transition: background-position 0.5s;
                }
                .fire-button:hover {
                    background-position: right center;
                }
                .animate-fade-in { animation: fadeIn 1.5s ease-in-out; }
                .animate-fade-in-out { animation: fadeInOut ${steps[stepIndex]?.duration / 1000}s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInOut { 
                    0% { opacity: 0; transform: translateY(10px); } 
                    20% { opacity: 1; transform: translateY(0); }
                    80% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); } 
                }
            `}</style>
        </div>
    );
};

export default InitiationScreen;
