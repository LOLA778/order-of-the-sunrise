

import React from 'react';
import { ReadingPlan } from '../types';
import Card from './shared/Card';

interface ReadingPlanSelectorProps {
  plans: ReadingPlan[];
  onSelect: (planId: string) => void;
}

const ReadingPlanSelector: React.FC<ReadingPlanSelectorProps> = ({ plans, onSelect }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-warm-white p-4">
        <h1 className="text-3xl font-black text-shadow-gold mb-2 text-center">Выбери свой путь чтения</h1>
        <p className="text-steel-gray mb-8 text-center">Каждая книга — это шаг к новой версии себя. С чего начнёшь?</p>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <Card key={plan.id} className="flex flex-col h-full !p-6 transition-all hover:border-gold/60">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-warm-white">{plan.name}</h2>
                <p className="text-steel-gray mt-2 mb-4">{plan.description}</p>
              </div>
              <button
                onClick={() => onSelect(plan.id)}
                className="mt-auto w-full px-6 py-3 bg-fire-gradient text-black font-bold rounded-lg transition-shadow hover:shadow-fire-glow"
              >
                Выбрать этот путь
              </button>
            </Card>
          ))}
        </div>
      </div>
      <style>{`
        .text-warm-white { color: #F8F0E3; }
        .text-steel-gray { color: #C0A080; }
        .text-shadow-gold { text-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
        .bg-fire-gradient { background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700); }
        .hover\\:shadow-fire-glow:hover { box-shadow: 0 0 15px rgba(255, 107, 53, 0.6); }
        .border-gold\\/60 { border-color: rgba(255, 215, 0, 0.6); }
      `}</style>
    </>
  );
};

export default ReadingPlanSelector;
