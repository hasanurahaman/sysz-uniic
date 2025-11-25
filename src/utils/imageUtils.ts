// import exifr from 'exifr'; // Commented out due to crash

export async function detectMetadata(file: File): Promise<boolean> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result) {
                resolve(false);
                return;
            }
            const view = new DataView(e.target.result as ArrayBuffer);
            // Check for JPEG EXIF (FF E1)
            if (view.getUint16(0) === 0xFFD8) {
                let offset = 2;
                while (offset < view.byteLength) {
                    if (view.getUint16(offset) === 0xFFE1) {
                        resolve(true);
                        return;
                    }
                    offset += 2 + view.getUint16(offset + 2);
                }
            }
            // Check for PNG chunks (e.g., eXIf, iTXt, tEXt, zTXt)
            // PNG signature is 8 bytes
            if (view.getUint32(0) === 0x89504E47 && view.getUint32(4) === 0x0D0A1A0A) {
                let offset = 8;
                while (offset < view.byteLength) {
                    const length = view.getUint32(offset);
                    const type = view.getUint32(offset + 4);
                    // eXIf = 0x65584966
                    if (type === 0x65584966) {
                        resolve(true);
                        return;
                    }
                    offset += 12 + length;
                }
            }

            resolve(false);
        };
        reader.onerror = () => resolve(false);
        // Read first 64KB which usually contains headers
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image'));
        };
        img.src = objectUrl;
    });
}

export function getMimeType(file: File): string {
    return file.type || 'unknown';
}

export function hasAlphaChannel(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
        // Assume JPEG has no alpha
        if (file.type === 'image/jpeg') {
            resolve(false);
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                resolve(false); // Default to false if context fails
                return;
            }

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Check for any pixel with alpha < 255
            for (let i = 3; i < data.length; i += 4) {
                if (data[i] < 255) {
                    URL.revokeObjectURL(objectUrl);
                    resolve(true);
                    return;
                }
            }

            URL.revokeObjectURL(objectUrl);
            resolve(false);
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image for alpha check'));
        };

        img.src = objectUrl;
    });
}

export function convertImage(
    file: Blob,
    format: string,
    backgroundColor?: string,
    quality = 0.92
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Failed to get canvas context'));
                return;
            }

            // Fill background if provided or if format doesn't support transparency (like JPEG)
            // If backgroundColor is provided, use it.
            // If not, and format is JPEG, default to white.
            if (backgroundColor) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (format === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(objectUrl);
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Conversion failed'));
                    }
                },
                format,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image for conversion'));
        };

        img.src = objectUrl;
    });
}
