import React from 'react';
import { Input } from './ui/Input';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-10 w-14 p-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        type="text"
                        value={color.toUpperCase()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = e.target.value;
                            if (val.startsWith('#') && val.length <= 7) {
                                onChange(val);
                            } else if (!val.startsWith('#') && val.length <= 6) {
                                onChange('#' + val);
                            }
                        }}
                        placeholder="#FFFFFF"
                        className="uppercase"
                    />
                </div>
            </div>
        </div>
    );
}
