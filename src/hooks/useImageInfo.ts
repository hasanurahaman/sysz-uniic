import { useState, useEffect } from 'react';
import { formatFileSize, getImageDimensions, getMimeType, detectMetadata } from '../utils/imageUtils';

export interface ImageInfo {
    name: string;
    size: number;
    formattedSize: string;
    type: string;
    width: number;
    height: number;
    previewUrl: string;
    file: File;
    hasMetadata: boolean;
}

export function useImageInfo(files: File[]) {
    const [info, setInfo] = useState<ImageInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (files.length === 0) {
            setInfo([]);
            return;
        }

        const loadInfo = async () => {
            setLoading(true);
            setError(null);
            try {
                const newInfo = await Promise.all(files.map(async (file) => {
                    const dimensions = await getImageDimensions(file);
                    const previewUrl = URL.createObjectURL(file);
                    const hasMetadata = await detectMetadata(file);

                    return {
                        name: file.name,
                        size: file.size,
                        formattedSize: formatFileSize(file.size),
                        type: getMimeType(file),
                        width: dimensions.width,
                        height: dimensions.height,
                        previewUrl,
                        file,
                        hasMetadata,
                    };
                }));

                setInfo(newInfo);
            } catch (err) {
                setError('Failed to load image information');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadInfo();

        return () => {
            info.forEach(i => {
                if (i.previewUrl) {
                    URL.revokeObjectURL(i.previewUrl);
                }
            });
        };
    }, [files]);

    return { info, loading, error };
}
