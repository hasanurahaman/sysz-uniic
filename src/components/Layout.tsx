import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { RequestFormModal } from './RequestFormModal';
import { MessageSquarePlus, Wrench, Bug } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [isToolModalOpen, setIsToolModalOpen] = useState(false);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <a href={import.meta.env.BASE_URL} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            U
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
                            Universal Image Converter
                        </h1>
                    </a>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden md:flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFeatureModalOpen(true)}
                                className="text-sm"
                            >
                                <MessageSquarePlus className="w-4 h-4 mr-2" />
                                Request Feature
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsToolModalOpen(true)}
                                className="text-sm"
                            >
                                <Wrench className="w-4 h-4 mr-2" />
                                Request Tool
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsBugModalOpen(true)}
                                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <Bug className="w-4 h-4 mr-2" />
                                Report Bug
                            </Button>
                        </div>
                        <div className="h-6 w-px bg-gray-200 dark:border-gray-800 hidden md:block" />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                © {new Date().getFullYear()} Utility Labs. All rights reserved.
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Professional, privacy-focused, ad-free tools.
                            </p>
                        </div>
                        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <a href="https://privacy.sysz.me" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
                            <a href="https://terms.sysz.me" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a>
                            <a href="https://about.sysz.me" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
                        </div>
                    </div>
                </div>
            </footer>

            <Modal
                isOpen={isFeatureModalOpen}
                onClose={() => setIsFeatureModalOpen(false)}
                title="Request a Feature"
            >
                <RequestFormModal
                    type="feature"
                    onClose={() => setIsFeatureModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isToolModalOpen}
                onClose={() => setIsToolModalOpen(false)}
                title="Request a New Tool"
            >
                <RequestFormModal
                    type="tool"
                    onClose={() => setIsToolModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isBugModalOpen}
                onClose={() => setIsBugModalOpen(false)}
                title="Report a Bug"
            >
                <RequestFormModal
                    type="bug"
                    onClose={() => setIsBugModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
