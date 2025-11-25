import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitTrelloCard } from '../utils/trello';

interface RequestFormModalProps {
    type: 'feature' | 'tool' | 'bug';
    onClose: () => void;
}

export function RequestFormModal({ type, onClose }: RequestFormModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const getTitleLabel = () => {
        switch (type) {
            case 'feature': return 'Feature Title';
            case 'tool': return 'Tool Name';
            case 'bug': return 'Bug Title';
        }
    };

    const getTitlePlaceholder = () => {
        switch (type) {
            case 'feature': return "e.g., Add Dark Mode";
            case 'tool': return "e.g., PDF Merger";
            case 'bug': return "e.g., Conversion fails on Safari";
        }
    };

    const getDescriptionPlaceholder = () => {
        switch (type) {
            case 'feature': return "Describe what you'd like to see...";
            case 'tool': return "Describe the tool you need...";
            case 'bug': return "Describe the issue and how to reproduce it...";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        setIsSubmitting(true);
        setStatus('idle');

        try {
            await submitTrelloCard(type, {
                title,
                description,
                email: email.trim() || undefined
            });
            setStatus('success');
            // Reset form state for next time, but keep success view visible
            setTitle('');
            setDescription('');
            setEmail('');
        } catch (error) {
            console.error('Submission failed:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset status after closing animation would finish
        setTimeout(() => {
            setStatus('idle');
        }, 300);
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thank You!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Your request has been submitted successfully.
                    </p>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    If you need urgent help, contact <a href="mailto:support@sysz.me" className="text-blue-600 hover:underline">support@sysz.me</a>
                </p>
                <div className="pt-4">
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {getTitleLabel()} <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={getTitlePlaceholder()}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        placeholder={getDescriptionPlaceholder()}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email (Optional)
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="For updates on your request"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>Something went wrong. Please try again later.</p>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()} className="min-w-[100px]">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Submit Request'
                    )}
                </Button>
            </div>
        </form>
    );
}
