import { createContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {toasts.map((toast) => (
                    <div key={toast.id} style={{
                        background: toast.type === 'error' ? '#d32f2f' : '#333',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        minWidth: '250px',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastContext;
