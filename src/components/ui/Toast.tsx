import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onDismiss: (id: string) => void;
}

export function Toast({ id, message, type, duration = 3000, onDismiss }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onDismiss(id), 300); // Wait for exit animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, id, onDismiss, type]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => onDismiss(id), 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        loading: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    };

    return (
        <div
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95"
            )}
            role="alert"
        >
            {icons[type]}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{message}</p>
            {type !== 'loading' && (
                <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            )}
        </div>
    );
}
