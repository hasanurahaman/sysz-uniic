import { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { UploadArea } from './components/UploadArea';
import { ImageInfoPanel } from './components/ImageInfoPanel';
import { ConversionOptions } from './components/ConversionOptions';
import { PreviewPanel } from './components/PreviewPanel';
import { ImageTable } from './components/ImageTable';
import { SingleConversionModal } from './components/SingleConversionModal';
import { HeroHeader, HeroFeatures } from './components/Hero';

import { useImageInfo, type ImageInfo } from './hooks/useImageInfo';
import { useImageConversion } from './hooks/useImageConversion';
import { Button } from './components/ui/Button';
import { Plus, ShieldCheck } from 'lucide-react';
import { ToastProvider, useToast } from './context/ToastContext';

function AppContent() {
  console.log('AppContent rendering...');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [convertingImage, setConvertingImage] = useState<ImageInfo | null>(null);

  // Global conversion settings
  const [format, setFormat] = useState('png');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [removeMetadata, setRemoveMetadata] = useState(false);

  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const {
    info: imageInfos,
  } = useImageInfo(uploadedFiles);

  const {
    isConverting,
    progress,
    convertedUrl,
    result,
    convert,
    convertBatch,
    reset: resetConversion,
  } = useImageConversion();

  const handleUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    resetConversion();
    showToast(`Added ${files.length} image${files.length > 1 ? 's' : ''}`, 'info');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(Array.from(e.target.files));
    }
  };

  const handleAddMoreClick = () => {
    addMoreInputRef.current?.click();
  };

  const handleConvertAll = async () => {
    if (imageInfos.length === 0) return;

    const startTime = performance.now();
    showToast('Starting conversion...', 'loading', 10000); // 10 second timeout

    if (imageInfos.length === 1) {
      await convert(imageInfos[0].file, format, backgroundColor);
    } else {
      await convertBatch(imageInfos.map(i => i.file), format, backgroundColor);
    }

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    showToast(`Converted in ${duration}s`, 'success');
  };

  const handleSingleConvert = async (image: ImageInfo, targetFormat: string, targetBg?: string) => {
    const startTime = performance.now();
    await convert(image.file, targetFormat, targetBg);

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    showToast(`Converted in ${duration}s`, 'success');

    setConvertingImage(null); // Close modal after conversion
  };

  const openSingleConvertModal = (image: ImageInfo) => {
    setConvertingImage(image);
  };

  const handleRemoveSingle = (indexToRemove: number) => {
    const infoToRemove = imageInfos[indexToRemove];

    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));

    if (selectedImage === infoToRemove) {
      setSelectedImage(null);
    }
    if (convertingImage === infoToRemove) {
      setConvertingImage(null);
    }
    resetConversion();
    showToast('Image removed', 'info');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

        {uploadedFiles.length === 0 ? (
          <div className="py-8 sm:py-12 space-y-12">
            <div className="max-w-3xl mx-auto space-y-4">
              <UploadArea onUpload={handleUpload} />
              <div className="flex justify-center items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                <span>Your images never leave your device. Processing is 100% local.</span>
              </div>
            </div>
            <HeroHeader />
            <HeroFeatures />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Images ({uploadedFiles.length})
              </h2>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={addMoreInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*"
                />
                <Button variant="secondary" size="sm" onClick={handleAddMoreClick}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <ImageTable
                  images={imageInfos}
                  onShowInfo={setSelectedImage}
                  onConvert={openSingleConvertModal}
                  onRemove={handleRemoveSingle}
                />
              </div>

              <div className="space-y-6">
                <ConversionOptions
                  format={format}
                  setFormat={setFormat}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                  removeMetadata={removeMetadata}
                  setRemoveMetadata={setRemoveMetadata}
                  onConvert={handleConvertAll}
                  isConverting={isConverting}
                  progress={progress}
                  fileCount={imageInfos.length}
                />

                {selectedImage && (
                  <ImageInfoPanel
                    info={selectedImage}
                    onRemove={() => handleRemoveSingle(uploadedFiles.indexOf(selectedImage.file))}
                  />
                )}

                {convertedUrl && (
                  <PreviewPanel
                    originalUrl={uploadedFiles[0] ? URL.createObjectURL(uploadedFiles[0]) : undefined}
                    convertedUrl={convertedUrl}
                    format={format}
                    convertedImage={result}
                    onDownload={() => { }} // Handled inside PreviewPanel for now
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {convertingImage && (
        <SingleConversionModal
          image={convertingImage}
          isOpen={!!convertingImage}
          onClose={() => setConvertingImage(null)}
          onConvert={handleSingleConvert}
          isConverting={isConverting}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

<div className="max-w-3xl mx-auto mt-12 px-4">
  <h2 className="text-2xl font-semibold mb-3">Free Online Image Converter</h2>
  <p className="text-gray-400 leading-relaxed">
    SysZ Universal Image Converter is a fast, free, and private tool to convert images
    between JPG, PNG, WEBP, AVIF and more. All conversions happen directly inside your
    browser, ensuring your images are never uploaded to any server.

    You can batch convert multiple files at once, remove sensitive metadata, choose
    custom background colors, and export ZIP files for bulk downloads.
    Whether you are preparing images for design, websites, or social media, SysZ
    delivers a clean, ad-free, and professional experience.
  </p>
</div>
