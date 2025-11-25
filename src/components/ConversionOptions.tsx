import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { ColorPicker } from './ColorPicker';
import { Settings, Download, Loader2 } from 'lucide-react';

interface ConversionOptionsProps {
    onConvert: () => void;
    isConverting: boolean;
    progress?: number;
    fileCount: number;
    format: string;
    setFormat: (format: string) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    removeMetadata: boolean;
    setRemoveMetadata: (remove: boolean) => void;
}

export function ConversionOptions({
    onConvert,
    isConverting,
    fileCount,
    format,
    setFormat,
    backgroundColor,
    setBackgroundColor,
    removeMetadata,
    setRemoveMetadata
}: ConversionOptionsProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        // Show color picker automatically for JPEG (no transparency support)
        if (format === 'jpeg') {
            setShowColorPicker(true);
        } else {
            setShowColorPicker(false);
        }
    }, [format]);

    return (
        <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Conversion Options</h3>
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

                {/* Option to force background color even for transparent formats */}
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

                <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Remove Metadata
                        </label>
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                            checked={removeMetadata}
                            onChange={(e) => setRemoveMetadata(e.target.checked)}
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Privacy tip: Removing metadata helps protect your location and device info.
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                    className="w-full gap-2"
                    onClick={() => onConvert()}
                    disabled={isConverting}
                >
                    {isConverting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Converting...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            {fileCount > 1 ? `Convert All (${fileCount})` : 'Convert & Download'}
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
