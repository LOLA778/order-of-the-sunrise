
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface ToastMessage {
  id: number;
  message: string;
}

interface ToastContextType {
  addToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="bg-glass-red backdrop-blur-md border border-gold/30 text-fire-orange font-bold py-2 px-4 rounded-lg shadow-lg animate-fade-in-down"
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        .bg-glass-red { background-color: rgba(44, 21, 21, 0.6); }
        .border-gold\\/30 { border-color: rgba(255, 215, 0, 0.3); }
        .text-fire-orange { color: #FF6B35; text-shadow: 0 0 5px rgba(255, 107, 53, 0.5); }
        
        @keyframes fadeInDown {
            0% {
                opacity: 0;
                transform: translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-down {
            animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
