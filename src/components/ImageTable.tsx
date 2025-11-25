import React from 'react';
import { Button } from './ui/Button';
import { Info, RefreshCw, FileImage, Trash2 } from 'lucide-react';
import type { ImageInfo } from '../hooks/useImageInfo';

interface ImageTableProps {
    images: ImageInfo[];
    onShowInfo: (image: ImageInfo) => void;
    onConvert: (image: ImageInfo) => void;
    onRemove: (index: number) => void;
}

export const ImageTable = React.memo(function ImageTable({ images, onShowInfo, onConvert, onRemove }: ImageTableProps) {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 w-24">Preview</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3 w-32">Size</th>
                        <th scope="col" className="px-6 py-3 w-24">Type</th>
                        <th scope="col" className="px-6 py-3 text-right w-40">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map((image, index) => (
                        <tr key={`${image.name}-${index}`} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4">
                                <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    {image.previewUrl ? (
                                        <img src={image.previewUrl} alt={image.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <FileImage className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate">
                                {image.name}
                            </td>
                            <td className="px-6 py-4">
                                {image.formattedSize}
                            </td>
                            <td className="px-6 py-4">
                                {image.type.split('/')[1].toUpperCase()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onShowInfo(image)}
                                        title="View Info"
                                    >
                                        <Info className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => onConvert(image)}
                                        title="Convert this image"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => onRemove(index)}
                                        title="Remove image"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
