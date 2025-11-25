import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
