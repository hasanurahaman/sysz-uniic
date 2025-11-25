import { useState, useCallback, useEffect } from 'react';

interface UseImageUploadProps {
    onUpload: (files: File[]) => void;
}

export function useImageUpload({ onUpload }: UseImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        if (!file.type.startsWith('image/')) {
            return false;
        }
        return true;
    };

    const handleFiles = useCallback((files: FileList | File[]) => {
        const validFiles: File[] = [];
        let hasInvalidFile = false;

        Array.from(files).forEach(file => {
            if (validateFile(file)) {
                validFiles.push(file);
            } else {
                hasInvalidFile = true;
            }
        });

        if (hasInvalidFile) {
            setError('Some files were skipped because they are not images.');
        } else {
            setError(null);
        }

        if (validFiles.length > 0) {
            onUpload(validFiles);
        }
    }, [onUpload]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    }, [handleFiles]);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                handleFiles(e.clipboardData.files);
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [handleFiles]);

    return {
        isDragging,
        error,
        onDragOver,
        onDragLeave,
        onDrop,
        onFileInputChange,
    };
}
