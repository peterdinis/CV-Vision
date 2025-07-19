'use client';

import { FC, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { uploadCVAction } from '@/actions/cvActions';
import { toast } from 'sonner';
import { FileUploader } from '../uploads/FileUploader';

const HeroWrapper: FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { execute, result, status } = useAction(uploadCVAction, {
        onSuccess: (data) => {
            toast.success('Resume was uploaded');
            console.log('Upload success:', data);
        },
        onError: (error) => {
            console.error('Upload error:', error);
            toast.error('Failed to upload resume');
        },
    });

    const handleUpload = () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('resume', selectedFile);
        execute({});
    };

    return (
        <section className='container mx-auto mt-20 px-6 py-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='animate-fade-in mb-8 text-center'>
                    <h1 className='from-primary to-accent mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                        Analyze Your Resume with AI
                    </h1>
                    <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
                        Upload your resume and get instant feedback with
                        detailed analysis, improvement suggestions, and
                        professional tips.
                    </p>
                </div>

                <div className='grid gap-8 lg:grid-cols-2'>
                    <div
                        className='animate-slide-up space-y-6'
                        style={{ animationDelay: '0.2s' }}
                    >
                        <div>
                            <h2 className='mb-2 text-2xl font-bold'>
                                Upload Resume
                            </h2>
                            <p className='text-muted-foreground'>
                                Supports PDF and image files. Get detailed
                                analysis instantly.
                            </p>
                        </div>

                        <FileUploader
                            selectedFile={selectedFile}
                            onFileSelect={setSelectedFile}
                            onRemoveFile={() => setSelectedFile(null)}
                        />

                        {selectedFile && (
                            <div className='flex justify-end'>
                                <Button
                                    onClick={handleUpload}
                                    disabled={status === 'executing'}
                                    className='mt-2'
                                >
                                    {status === 'executing' ? (
                                        <Loader2 className='h-8 w-8 animate-spin' />
                                    ) : (
                                        'Submit for Analysis'
                                    )}
                                </Button>
                            </div>
                        )}

                        {result?.data && (
                            <p className='text-sm text-green-600'>
                                ✅ Uploaded <strong>{result.data.name}</strong>{' '}
                                ({(result.data.size / 1024).toFixed(1)} KB)
                            </p>
                        )}

                        {result?.serverError && (
                            <p className='text-sm text-red-600'>
                                ❌ {result.serverError}
                            </p>
                        )}
                    </div>

                    <div
                        className='animate-slide-up space-y-6'
                        style={{ animationDelay: '0.4s' }}
                    >
                        <div className='from-muted/30 to-muted/10 border-muted-foreground/20 animate-scale-in rounded-2xl border-2 border-dashed bg-gradient-to-br p-8 text-center'>
                            <Brain className='text-muted-foreground mx-auto mb-4 h-16 w-16 animate-pulse' />
                            <h3 className='mb-2 text-xl font-semibold'>
                                Ready to Analyze
                            </h3>
                            <p className='text-muted-foreground mb-4'>
                                Upload your resume to get started with
                                AI-powered analysis
                            </p>
                            <div className='flex flex-wrap justify-center gap-2 text-sm'>
                                <span className='bg-primary/10 text-primary rounded-full px-3 py-1'>
                                    Pros & Cons
                                </span>
                                <span className='bg-accent/10 text-accent rounded-full px-3 py-1'>
                                    Expert Tips
                                </span>
                                <span className='bg-success/10 text-success rounded-full px-3 py-1'>
                                    Score Rating
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroWrapper;
