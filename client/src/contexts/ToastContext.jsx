// src/contexts/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const Toast = ({ id, type, message, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />
    };

    const backgrounds = {
        success: 'bg-emerald-900/90 border-emerald-500/50',
        error: 'bg-red-900/90 border-red-500/50',
        info: 'bg-blue-900/90 border-blue-500/50',
        warning: 'bg-yellow-900/90 border-yellow-500/50'
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm animate-slide-in ${backgrounds[type]}`}
            role="alert"
        >
            {icons[type]}
            <span className="text-white text-sm font-medium flex-1">{message}</span>
            <button
                onClick={() => onClose(id)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, message }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const toast = {
        success: (message, duration) => addToast('success', message, duration),
        error: (message, duration) => addToast('error', message, duration),
        info: (message, duration) => addToast('info', message, duration),
        warning: (message, duration) => addToast('warning', message, duration)
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                {toasts.map(t => (
                    <Toast
                        key={t.id}
                        id={t.id}
                        type={t.type}
                        message={t.message}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
