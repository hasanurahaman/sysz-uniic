import { Card } from './ui/Card';
import { FileImage, Info, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import type { ImageInfo } from '../hooks/useImageInfo';

interface ImageGridProps {
    images: ImageInfo[];
    onShowInfo: (image: ImageInfo) => void;
    onConvert: (image: ImageInfo) => void;
}

export function ImageGrid({ images, onShowInfo, onConvert }: ImageGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
                <Card key={`${image.name}-${index}`} className="group relative overflow-hidden aspect-square">
                    {image.previewUrl ? (
                        <img
                            src={image.previewUrl}
                            alt={image.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <FileImage className="w-8 h-8 text-gray-400" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                        <p className="text-white text-xs font-medium truncate w-full px-2 mb-2">
                            {image.name}
                        </p>
                        <p className="text-gray-300 text-xs mb-3">
                            {image.formattedSize}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 text-xs gap-1"
                                onClick={() => onShowInfo(image)}
                            >
                                <Info className="w-3 h-3" />
                                Info
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                className="h-8 text-xs gap-1"
                                onClick={() => onConvert(image)}
                            >
                                <RefreshCw className="w-3 h-3" />
                                Convert
                            </Button>
                        </div>
                    </div>

                    {image.hasMetadata && (
                        <div className="absolute top-2 right-2">
                            <span className="flex h-2 w-2 rounded-full bg-yellow-400 ring-2 ring-black/50" title="Metadata detected" />
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
