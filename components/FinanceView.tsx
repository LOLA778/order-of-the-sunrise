
import React, { useState, useMemo } from 'react';
import { FinancialGoal } from '../types';
import Card from './shared/Card';
import CircularProgressBar from './shared/CircularProgressBar';

interface FinanceViewProps {
  goals: FinancialGoal[];
  onAddGoal: (name: string, target: number) => void;
  onUpdateGoal: (goalId: string, current: number) => void;
  onRemoveGoal: (goalId: string) => void;
}

const AddGoalModal: React.FC<{ onAddGoal: (name: string, target: number) => void; onClose: () => void; }> = ({ onAddGoal, onClose }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmount = parseFloat(target);
    if (name.trim() && !isNaN(targetAmount) && targetAmount > 0) {
      onAddGoal(name, targetAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-glass-red backdrop-blur-lg border border-gold/30 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
             <h2 className="text-xl font-bold text-warm-white mb-4">Добавить новую цель</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Название цели"
                    className="w-full bg-black/30 border border-gold/30 text-warm-white p-3 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
                    required
                />
                <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Сумма, $"
                    className="w-full bg-black/30 border border-gold/30 text-warm-white p-3 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
                    required
                    min="1"
                />
                 <div className="flex gap-4 pt-2">
                    <button type="button" onClick={onClose} className="w-full py-3 bg-black/30 border border-gold/50 text-gold font-bold rounded-lg hover:bg-black/40">Отмена</button>
                    <button type="submit" className="w-full py-3 bg-fire-gradient text-black font-bold rounded-lg hover:shadow-fire-glow">Добавить</button>
                </div>
            </form>
        </div>
    </div>
  );
};

const UpdateGoalModal: React.FC<{ goal: FinancialGoal; onUpdate: (amount: number) => void; onClose: () => void; }> = ({ goal, onUpdate, onClose }) => {
    const [currentAmount, setCurrentAmount] = useState(goal.current.toString());

    const handleUpdate = () => {
        const amount = parseFloat(currentAmount);
        if(!isNaN(amount)) {
            onUpdate(amount);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-glass-red backdrop-blur-lg border border-gold/30 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-warm-white mb-2">Обновить прогресс</h3>
                <p className="text-steel-gray mb-4 truncate">{goal.name}</p>
                 <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="Текущая сумма, $"
                    className="w-full bg-black/30 border border-gold/30 text-warm-white p-3 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none mb-4"
                    min="0"
                    max={goal.target}
                />
                <div className="flex gap-4">
                    <button onClick={onClose} className="w-full py-2 bg-black/30 border border-gold/50 text-gold rounded-lg">Отмена</button>
                    <button onClick={handleUpdate} className="w-full py-2 bg-fire-gradient text-black font-bold rounded-lg">Обновить</button>
                </div>
            </div>
        </div>
    );
};


const FinanceView: React.FC<FinanceViewProps> = ({ goals, onAddGoal, onUpdateGoal, onRemoveGoal }) => {
  const [goalToUpdate, setGoalToUpdate] = useState<FinancialGoal | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const totalProgress = useMemo(() => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
    if (totalTarget === 0) return { percentage: 0, current: 0, target: 0 };
    return {
        percentage: Math.round((totalCurrent / totalTarget) * 100),
        current: totalCurrent,
        target: totalTarget
    };
  }, [goals]);

  return (
    <div className="space-y-6 relative">
      <header>
        <h1 className="text-4xl font-black text-warm-white tracking-tight">Финансы</h1>
        <p className="text-md text-steel-gray mt-1">Дисциплина в деньгах - ключ к свободе.</p>
      </header>
      
      {goals.length > 0 && (
        <Card>
            <h2 className="text-xl font-bold text-warm-white mb-4 text-center">Общий прогресс</h2>
            <div className="flex justify-center items-center">
                <CircularProgressBar 
                    percentage={totalProgress.percentage}
                    size={150}
                    strokeWidth={10}
                />
            </div>
            <p className="text-center font-bold text-xl text-warm-white mt-4">${totalProgress.current.toLocaleString()} / ${totalProgress.target.toLocaleString()}</p>
        </Card>
      )}

      {goals.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-warm-white px-2">Ваши цели</h2>
            {goals.map(goal => (
                <Card key={goal.id}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-warm-white truncate">{goal.name}</h3>
                            <p className="text-sm text-steel-gray">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                        </div>
                        <button onClick={() => onRemoveGoal(goal.id)} className="text-steel-gray hover:text-[#E63946] text-2xl">&times;</button>
                    </div>
                    <div className="mt-3 mb-4">
                         <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-fire-gradient h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(goal.current / goal.target) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <button onClick={() => setGoalToUpdate(goal)} className="w-full py-2 bg-black/30 border border-gold/50 text-gold font-semibold rounded-lg hover:bg-black/40 transition-colors">
                        Обновить накопления
                    </button>
                </Card>
            ))}
        </div>
      )}
        
      {goals.length === 0 && (
        <div className="text-center py-16">
            <p className="text-steel-gray">У вас пока нет финансовых целей.</p>
            <p className="text-steel-gray">Нажмите "+", чтобы добавить первую.</p>
        </div>
      )}

        <button 
            onClick={() => setAddModalOpen(true)}
            className="fixed bottom-28 right-6 w-16 h-16 bg-fire-gradient text-black rounded-full shadow-lg flex items-center justify-center text-3xl hover:shadow-fire-glow transition-transform transform hover:scale-110 animate-pulse-fire"
        >
            +
        </button>

      {isAddModalOpen && <AddGoalModal onAddGoal={onAddGoal} onClose={() => setAddModalOpen(false)} />}

      {goalToUpdate && (
        <UpdateGoalModal 
            goal={goalToUpdate}
            onUpdate={(amount) => onUpdateGoal(goalToUpdate.id, amount)}
            onClose={() => setGoalToUpdate(null)}
        />
      )}
      <style>{`.text-warm-white{color:#F8F0E3}.text-gold{color:#FFD700}.text-steel-gray{color:#C0A080}.bg-fire-gradient{background-image:linear-gradient(to right, #E63946, #FF6B35, #FFD700)}.hover\\:shadow-fire-glow:hover{box-shadow:0 0 15px rgba(255,107,53,0.6)}.bg-glass-red{background-color:rgba(44,21,21,0.7)}.border-gold\\/30{border-color:rgba(255,215,0,0.3)}.border-gold\\/50{border-color:rgba(255,215,0,0.5)}.ring-gold:focus{--tw-ring-color:#FFD700}`}</style>
    </div>
  );
};

export default FinanceView;