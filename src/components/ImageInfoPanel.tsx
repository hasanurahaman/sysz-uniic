import { Card } from './ui/Card';
import { FileImage, X } from 'lucide-react';
import { Button } from './ui/Button';
import type { ImageInfo } from '../hooks/useImageInfo';
import { useEffect } from 'react';

interface ImageInfoPanelProps {
    info: ImageInfo;
    onRemove: () => void;
}

export function ImageInfoPanel({ info, onRemove }: ImageInfoPanelProps) {
    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (info.previewUrl) {
                URL.revokeObjectURL(info.previewUrl);
            }
        };
    }, [info.previewUrl]);
    return (
        <Card className="p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                        {info.previewUrl ? (
                            <img
                                src={info.previewUrl}
                                alt={info.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FileImage className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs" title={info.name}>
                            {info.name}
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                            <p>Size: {info.formattedSize}</p>
                            <p>Dimensions: {info.width} x {info.height}</p>
                            <p>Type: {info.type}</p>
                            {info.hasMetadata && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 mt-1">
                                    EXIF Data Detected
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Remove image"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}
