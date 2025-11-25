import { useState, useCallback } from 'react';
import { convertImage, formatFileSize } from '../utils/imageUtils';
import JSZip from 'jszip';

export interface ConversionResult {
    blob: Blob;
    url: string;
    size: number;
    formattedSize: string;
    format: string;
    name: string;
}

export function useImageConversion() {
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ConversionResult | null>(null);

    const convert = useCallback(async (file: File, format: string, backgroundColor?: string) => {
        setIsConverting(true);
        setError(null);
        setResult(null);

        try {
            // Map simple format names to MIME types
            const mimeType = format.includes('/') ? format : `image/${format}`;

            const blob = await convertImage(file, mimeType, backgroundColor);
            const url = URL.createObjectURL(blob);

            setResult({
                blob,
                url,
                size: blob.size,
                formattedSize: formatFileSize(blob.size),
                format: mimeType,
                name: file.name,
            });
        } catch (err) {
            console.error(err);
            setError('Failed to convert image. Please try again.');
        } finally {
            setIsConverting(false);
        }
    }, []);

    const convertBatch = useCallback(async (files: File[], format: string, backgroundColor?: string) => {
        setIsConverting(true);
        setError(null);
        setResult(null);

        try {
            const zip = new JSZip();
            const mimeType = format.includes('/') ? format : `image/${format}`;
            const extension = mimeType.split('/')[1];

            // Process all files
            const promises = files.map(async (file) => {
                const blob = await convertImage(file, mimeType, backgroundColor);
                // Create a unique name: original_name.target_extension
                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const fileName = `${originalName}.${extension}`;
                zip.file(fileName, blob);
            });

            await Promise.all(promises);

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);

            setResult({
                blob: zipBlob,
                url,
                size: zipBlob.size,
                formattedSize: formatFileSize(zipBlob.size),
                format: 'application/zip',
                name: 'converted_images.zip',
            });

        } catch (err) {
            console.error(err);
            setError('Failed to batch convert images.');
        } finally {
            setIsConverting(false);
        }
    }, []);

    const reset = useCallback(() => {
        if (result?.url) {
            URL.revokeObjectURL(result.url);
        }
        setResult(null);
        setError(null);
    }, [result]);

    return {
        isConverting,
        progress: 0, // Placeholder until progress tracking is implemented
        convertedUrl: result?.url,
        convertedBlob: result?.blob,
        error,
        result,
        convert,
        convertBatch,
        reset,
    };
}
