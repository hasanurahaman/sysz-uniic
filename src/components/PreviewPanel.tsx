import { Card } from './ui/Card';
import { Eye, Download, Copy, Check, FileArchive } from 'lucide-react';
import { Button } from './ui/Button';
import { useState, useEffect } from 'react';
import type { ConversionResult } from '../hooks/useImageConversion';
import { convertImage } from '../utils/imageUtils';

interface PreviewPanelProps {
    originalUrl?: string;
    convertedUrl?: string;
    convertedImage?: ConversionResult | null; // Keep for backward compatibility if needed, or refactor
    format?: string;
    onDownload?: () => void;
}

export function PreviewPanel({ convertedImage }: PreviewPanelProps) {
    const [copied, setCopied] = useState(false);

    // Cleanup object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (convertedImage?.url) {
                URL.revokeObjectURL(convertedImage.url);
            }
        };
    }, [convertedImage?.url]);

    const handleDownload = () => {
        if (!convertedImage) return;
        const link = document.createElement('a');
        link.href = convertedImage.url;

        // Safely extract extension from format
        let extension = 'png'; // default
        if (convertedImage.format) {
            const parts = convertedImage.format.split('/');
            extension = parts.length > 1 ? parts[1] : convertedImage.format;
            if (extension === 'jpeg') extension = 'jpg';
        }

        const originalNameWithoutExt = convertedImage.name.substring(0, convertedImage.name.lastIndexOf('.')) || convertedImage.name;
        link.download = `${originalNameWithoutExt}.${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = async () => {
        if (!convertedImage) return;
        try {
            let blobToCopy = convertedImage.blob;
            let formatToCopy = convertedImage.format;

            // Most browsers only support image/png for clipboard write.
            // If it's not PNG, convert it to PNG first.
            if (convertedImage.format !== 'image/png') {
                try {
                    blobToCopy = await convertImage(convertedImage.blob, 'image/png');
                    formatToCopy = 'image/png';
                } catch (conversionErr) {
                    console.warn('Failed to convert to PNG for clipboard, trying original format.', conversionErr);
                }
            }

            await navigator.clipboard.write([
                new ClipboardItem({
                    [formatToCopy]: blobToCopy,
                }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy image:', err);
            alert('Failed to copy image to clipboard. Browser might not support this format.');
        }
    };

    return (
        <Card className="min-h-[300px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Preview</h3>
                </div>
                {convertedImage && (
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={handleCopy}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-2 hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                        </Button>
                        <Button size="sm" onClick={handleDownload}>
                            <Download className="w-4 h-4" />
                            <span className="ml-2 hidden sm:inline">Download</span>
                        </Button>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-950/50 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-grid-gray-900/[0.05] dark:bg-grid-white/[0.05]" />
                {convertedImage ? (
                    <div className="relative max-w-full max-h-full flex flex-col items-center">
                        {convertedImage.format === 'application/zip' ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                                    <FileArchive className="w-16 h-16 text-white" strokeWidth={1.5} />
                                </div>
                                <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">ZIP Archive</p>
                            </div>
                        ) : (
                            <img
                                src={convertedImage.url}
                                alt="Converted preview"
                                className="max-w-full max-h-[400px] object-contain shadow-lg rounded-lg"
                            />
                        )}
                        <div className="mt-4 px-3 py-1 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                            {convertedImage.formattedSize} • {convertedImage.format ? (convertedImage.format.split('/')[1] || convertedImage.format).toUpperCase() : 'UNKNOWN'}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 dark:text-gray-600">
                        <p>Converted preview will appear here</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
