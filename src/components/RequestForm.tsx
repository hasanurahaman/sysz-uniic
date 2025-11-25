import React from 'react';
import { Button } from './ui/Button';

interface RequestFormProps {
    type: 'feature' | 'tool';
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function RequestForm({ type, onSubmit, onCancel }: RequestFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for submission logic
        onSubmit({});
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {type === 'feature' ? 'Feature Title' : 'Tool Name'}
                </label>
                <input
                    type="text"
                    id="title"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder={
                        type === 'feature'
                            ? 'e.g., Add support for HEIC'
                            : 'e.g., PDF Merger'
                    }
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Describe your idea..."
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Email (optional)
                </label>
                <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="For updates on your request"
                />
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
            </div>
        </form>
    );
}
