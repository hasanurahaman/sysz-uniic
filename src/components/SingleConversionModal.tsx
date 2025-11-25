import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { ColorPicker } from './ColorPicker';
import type { ImageInfo } from '../hooks/useImageInfo';
import { Download, Loader2 } from 'lucide-react';

interface SingleConversionModalProps {
    image: ImageInfo;
    isOpen: boolean;
    onClose: () => void;
    onConvert: (image: ImageInfo, format: string, backgroundColor?: string) => Promise<void>;
    isConverting: boolean;
}

export function SingleConversionModal({
    image,
    isOpen,
    onClose,
    onConvert,
    isConverting
}: SingleConversionModalProps) {
    const [format, setFormat] = useState('png');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (format === 'jpeg') {
            setShowColorPicker(true);
        } else {
            setShowColorPicker(false);
        }
    }, [format]);

    const handleConvert = async () => {
        await onConvert(image, format, showColorPicker ? backgroundColor : undefined);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Convert ${image.name}`}>
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        {image.previewUrl && (
                            <img src={image.previewUrl} alt={image.name} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{image.name}</p>
                        <p className="text-sm text-gray-500">{image.formattedSize} • {image.type.split('/')[1].toUpperCase()}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Select
                        label="Target Format"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPG</option>
                        <option value="webp">WEBP</option>
                    </Select>

                    {format !== 'jpeg' && (
                        <div className="flex items-center justify-between py-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fill Background
                            </label>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                                checked={showColorPicker}
                                onChange={(e) => setShowColorPicker(e.target.checked)}
                            />
                        </div>
                    )}

                    {showColorPicker && (
                        <ColorPicker
                            label="Background Color"
                            color={backgroundColor}
                            onChange={setBackgroundColor}
                        />
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} disabled={isConverting}>
                        Cancel
                    </Button>
                    <Button onClick={handleConvert} disabled={isConverting} className="gap-2">
                        {isConverting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Converting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Convert
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
