
import React, {useState} from 'react';
import { Workout } from '../types';
import Card from './shared/Card';
import Restimer from './RestTimer';
import KatanaIcon from './icons/KatanaIcon';

interface WorkoutViewProps {
  workout: Workout;
  logStat: (statId: string, value: number) => void;
}

const ProgressLogger: React.FC<{ logStat: (statId: string, value: number) => void; }> = ({ logStat }) => {
    const [pushups, setPushups] = useState('');
    const [squats, setSquats] = useState('');

    const handleLog = () => {
        const pushupValue = parseInt(pushups, 10);
        const squatValue = parseInt(squats, 10);
        if (!isNaN(pushupValue) && pushupValue > 0) logStat('pushups', pushupValue);
        if (!isNaN(squatValue) && squatValue > 0) logStat('squats', squatValue);
        setPushups('');
        setSquats('');
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-warm-white mb-4">Запись Прогресса</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="pushups" className="text-steel-gray">Отжимания:</label>
                    <input 
                        id="pushups" 
                        type="number" 
                        value={pushups}
                        onChange={e => setPushups(e.target.value)}
                        placeholder="Кол-во"
                        className="w-24 bg-black/30 border border-gold/30 rounded-md p-2 text-center text-warm-white focus:ring-gold focus:border-gold" 
                    />
                </div>
                 <div className="flex items-center justify-between">
                    <label htmlFor="squats" className="text-steel-gray">Приседания:</label>
                    <input 
                        id="squats" 
                        type="number" 
                        value={squats}
                        onChange={e => setSquats(e.target.value)}
                        placeholder="Кол-во"
                        className="w-24 bg-black/30 border border-gold/30 rounded-md p-2 text-center text-warm-white focus:ring-gold focus:border-gold" 
                    />
                </div>
                <button onClick={handleLog} className="w-full mt-2 py-2 bg-fire-gradient text-black font-bold rounded-lg hover:shadow-fire-glow transition-shadow">
                    Записать
                </button>
            </div>
        </Card>
    );
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ workout, logStat }) => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl md:text-5xl font-black text-warm-white tracking-tight">Физика</h1>
        <p className="text-md text-steel-gray mt-1">{workout.day}</p>
      </header>

      <Card>
        <h2 className="text-xl font-bold text-warm-white mb-1">{workout.name}</h2>
        <p className="text-steel-gray mb-4">Продолжительность: ~{workout.duration}</p>
        
        <div className="flex items-center justify-center my-4" aria-hidden="true">
            <div className="flex-grow border-t border-gold/20"></div>
            <KatanaIcon className="w-8 h-8 mx-4 text-gold/50" />
            <div className="flex-grow border-t border-gold/20"></div>
        </div>
        
        <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                    <span className="text-steel-gray">{exercise.name}</span>
                    <span className="font-mono text-gold font-medium">{exercise.sets}</span>
                </div>
            ))}
        </div>
      </Card>

      <ProgressLogger logStat={logStat} />

      <Card>
          <Restimer />
      </Card>
      <style>{`
        .text-warm-white { color: #F8F0E3; }
        .text-steel-gray { color: #C0A080; }
        .text-gold { color: #FFD700; }
        .bg-fire-gradient { background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700); }
        .hover\\:shadow-fire-glow:hover { box-shadow: 0 0 15px rgba(255, 107, 53, 0.6); }
        .border-gold { border-color: #FFD700; }
        .ring-gold:focus { --tw-ring-color: #FFD700; }
        .border-gold\\/30 { border-color: rgba(255, 215, 0, 0.3); }
      `}</style>
    </div>
  );
};

export default WorkoutView;