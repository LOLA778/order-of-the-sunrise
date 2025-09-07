


import React from 'react';
import { UserData, NotificationSetting, Book, Level } from '../types';

interface SettingsProps {
  userData: UserData;
  onClose: () => void;
  onUpdateNotifications: (key: string, setting: NotificationSetting) => void;
  onSetWimHofVideo: (dataUrl: string) => void;
  onChangeLevel: (level: number) => void;
  allLevels: Level[];
}

const Settings: React.FC<SettingsProps> = ({
  userData,
  onClose,
  onUpdateNotifications,
  onSetWimHofVideo,
  onChangeLevel,
  allLevels,
}) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert("Файл слишком большой. Максимальный размер - 10MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                onSetWimHofVideo(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-40 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-glass-red backdrop-blur-lg border border-gold/30 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gold/20">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-warm-white">Настройки</h2>
                        <button onClick={onClose} className="text-steel-gray hover:text-warm-white text-3xl">&times;</button>
                    </div>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Notifications */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-warm-white">Уведомления</h3>
                        <div className="space-y-2">
                        {Object.entries(userData.notificationSettings).map(([key, setting]) => (
                             <div key={key} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                                <span className="font-medium text-steel-gray">{ {wakeUp: "Подъём", workout: "Тренировка", reading: "Чтение", reflection: "Рефлексия"}[key] }</span>
                                <div className="flex items-center gap-3">
                                    <input type="time" value={setting.time} onChange={(e) => onUpdateNotifications(key, { ...setting, time: e.target.value })} className="bg-black/30 border border-gold/30 rounded-md p-1 text-steel-gray focus:ring-gold focus:border-gold" />
                                    <label className="custom-checkbox-container scale-90">
                                      <input type="checkbox" checked={setting.enabled} onChange={(e) => onUpdateNotifications(key, { ...setting, enabled: e.target.checked })} className="hidden" />
                                      <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    
                    {/* Wim Hof Video */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-warm-white">Видео для Духа (Вим Хоф)</h3>
                        <p className="text-sm text-steel-gray mb-3">Загрузите короткое видео (до 10MB) для дыхательных практик.</p>
                        <input type="file" accept="video/*" onChange={handleFileChange} className="w-full text-sm text-steel-gray file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold/20 file:text-gold hover:file:bg-gold/30 cursor-pointer"/>
                    </div>

                    {/* Level Selector */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-warm-white">Смена Уровня (Админ)</h3>
                        <p className="text-sm text-steel-gray mb-3">Сбросит прогресс текущего уровня.</p>
                        <select value={userData.currentLevel} onChange={e => onChangeLevel(parseInt(e.target.value, 10))} className="w-full bg-black/30 border border-gold/30 text-warm-white p-3 rounded-lg focus:ring-gold focus:border-gold">
                            {allLevels.map(level => (
                                <option key={level.level} value={level.level} className="bg-[#1A0A0A]">Уровень {level.level}: {level.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
             <style>{`
                .text-warm-white { color: #F8F0E3; }
                .text-steel-gray { color: #C0A080; }
                .text-gold { color: #FFD700; }
                .bg-glass-red { background-color: rgba(44, 21, 21, 0.7); }
                .border-gold\\/30 { border-color: rgba(255, 215, 0, 0.3); }
                .border-gold\\/20 { border-color: rgba(255, 215, 0, 0.2); }
                .border-gold { border-color: #FFD700; }
                .ring-gold:focus { --tw-ring-color: #FFD700; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(0.8) sepia(1) hue-rotate(30deg) saturate(5);
                }
                
                .custom-checkbox-container {
                  display: block; position: relative; width: 28px; height: 28px; cursor: pointer;
                }
                .checkmark {
                  position: absolute; top: 0; left: 0; height: 28px; width: 28px; background-color: transparent; border: 2px solid #C0A080; border-radius: 6px; transition: all 0.2s;
                }
                .custom-checkbox-container input:checked ~ .checkmark {
                  background-image: linear-gradient(to right, #E63946, #FF6B35); border-color: transparent; box-shadow: 0 0 10px rgba(255, 107, 53, 0.6);
                }
                .checkmark:after {
                  content: ""; position: absolute; display: none; left: 9px; top: 4px; width: 8px; height: 14px; border: solid #1A0A0A; border-width: 0 3px 3px 0; transform: rotate(45deg);
                }
                .custom-checkbox-container input:checked ~ .checkmark:after {
                  display: block;
                }
            `}</style>
        </div>
    );
};

export default Settings;
