import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '@/components/Toast';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    const showToast = (msg: string) => {
        setMessage(msg);
        setVisible(true);
    };

    const hideToast = () => {
        setVisible(false);
        setMessage('');
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={message} visible={visible} onHide={hideToast} />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
