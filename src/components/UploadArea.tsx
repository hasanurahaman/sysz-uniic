import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, FileUp, AlertCircle, Link as LinkIcon, Loader2, Plus } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { clsx } from 'clsx';
import { useImageUpload } from '../hooks/useImageUpload';

interface UploadAreaProps {
    onUpload: (files: File[]) => void;
}

export function UploadArea({ onUpload }: UploadAreaProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [urlInput, setUrlInput] = useState('');
    const [isLoadingUrl, setIsLoadingUrl] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const {
        isDragging,
        error: uploadError,
        onDragOver,
        onDragLeave,
        onDrop,
        onFileInputChange,
    } = useImageUpload({ onUpload });

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!urlInput.trim()) return;

        setIsLoadingUrl(true);
        setUrlError(null);

        try {
            const response = await fetch(urlInput);
            if (!response.ok) throw new Error('Failed to fetch image');

            const blob = await response.blob();
            if (!blob.type.startsWith('image/')) throw new Error('URL is not an image');

            const filename = urlInput.split('/').pop()?.split('?')[0] || 'image.jpg';
            const file = new File([blob], filename, { type: blob.type });

            onUpload([file]);
            setUrlInput('');
        } catch (err) {
            console.error(err);
            setUrlError('Failed to load image. Check URL or CORS restrictions.');
        } finally {
            setIsLoadingUrl(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card
                className={clsx(
                    'relative overflow-hidden border-2 border-dashed transition-colors group cursor-pointer',
                    isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={handleClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    accept="image/*"
                    className="hidden"
                    multiple
                />

                <div className="absolute inset-0 pointer-events-none bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />

                <div className="flex flex-col items-center justify-center py-12 px-4 text-center relative z-10">
                    <div className={clsx(
                        "h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300",
                        isDragging ? "scale-110 bg-blue-200 dark:bg-blue-800/50" : "bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110"
                    )}>
                        <Upload className={clsx(
                            "w-8 h-8",
                            isDragging ? "text-blue-700 dark:text-blue-300" : "text-blue-600 dark:text-blue-400"
                        )} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {isDragging ? 'Drop image here' : 'Upload Images'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                        Drag & drop your images here, or click to browse.
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Paste from clipboard</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        <div className="flex items-center gap-1.5">
                            <FileUp className="w-3.5 h-3.5" />
                            <span>Import from URL</span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or import from URL</span>
                </div>
            </div>

            <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type="url"
                        placeholder="Paste image URL here..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="pl-9"
                        disabled={isLoadingUrl}
                    />
                </div>
                <Button type="submit" disabled={isLoadingUrl || !urlInput.trim()} size="sm">
                    {isLoadingUrl ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                        </>
                    )}
                </Button>
            </form>

            {(uploadError || urlError) && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 px-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{uploadError || urlError}</span>
                </div>
            )}
        </div>
    );
}
