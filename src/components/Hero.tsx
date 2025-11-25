import { Shield, Zap, Layers, Smartphone } from 'lucide-react';

export function HeroHeader() {
    return (
        <div className="space-y-6 animate-fade-in">


            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                    <Shield className="w-4 h-4" />
                    <span>Privacy First &bull; No Server Uploads &bull; 100% Free</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                    The Ultimate <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Image Converter
                    </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Transform your images instantly. Support for PNG, JPG, WEBP, HEIC, and more.
                    <br className="hidden sm:block" />
                    Batch convert, resize, and optimize directly in your browser.
                </p>
            </div>
        </div>
    );
}

export function HeroFeatures() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-8 animate-fade-in">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Powered by WebAssembly for near-native performance. Convert hundreds of images in seconds.
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-10 h-10 text-green-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">100% Private</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Your files never leave your device. All processing happens locally in your browser.
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <Layers className="w-10 h-10 text-purple-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Batch Processing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Drag & drop folders or multiple files. Download results individually or as a ZIP archive.
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <Smartphone className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Universal Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Works on Windows, Mac, Linux, iOS, and Android. No installation required.
                </p>
            </div>
        </div>
    );
}
