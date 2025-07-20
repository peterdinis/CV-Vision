'use client';

import { FC, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileUploader } from '../uploads/FileUploader';
import { analyzeCVAction } from '@/actions/cvActions';
import { Badge } from '../ui/badge';

const HeroWrapper: FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);

    const { execute: analyzeCV, status: analyzingStatus } = useAction(
        analyzeCVAction,
        {
            onSuccess: (data) => {
                console.log('Analysis Result:', data);
                setAnalysis(data.data.analysis);
                toast.success('✅ CV analysis complete!');
            },
            onError: (err) => toast.error('❌ CV analysis failed: ' + err),
        }
    );

    const extractText = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        console.log('Extracting text from file:', file.name);

        const res = await fetch('/api/extract-text', {
            method: 'POST',
            body: formData,
        });

        console.log(
            'Response from text extraction:',
            res.json().then((res) => res)
        );

        if (!res.ok) {
            const { error } = await res.json();
            console.log('Error extracting text:', error);
            throw new Error(error || 'Failed to extract text');
        }

        const data = await res.json();
        return data.text as string;
    };

    const handleUploadAndAnalyze = async () => {
        if (!selectedFile) return;
        console.log('Selected file for analysis:', selectedFile.name);
        toast.message('📄 Extracting text from resume...');
        try {
            setIsExtracting(true);
            const extractedText = await extractText(selectedFile);
            console.log('Extracted Text:', extractedText);
            toast.success('📝 Text extracted successfully!');
            await analyzeCV({ content: extractedText });
        } catch (err) {
            toast.error((err as Error).message || '❌ Error extracting text');
        } finally {
            setIsExtracting(false);
        }
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
                                Supports PDF files. Get detailed analysis
                                instantly.
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
                                    onClick={handleUploadAndAnalyze}
                                    disabled={
                                        isExtracting ||
                                        analyzingStatus === 'executing'
                                    }
                                    className='mt-2'
                                >
                                    {isExtracting ||
                                    analyzingStatus === 'executing' ? (
                                        <Loader2 className='h-8 w-8 animate-spin' />
                                    ) : (
                                        'Submit for Analysis'
                                    )}
                                </Button>
                            </div>
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

                            {analysis && (
                                <div className='bg-muted text-foreground rounded p-4 text-left text-sm whitespace-pre-wrap'>
                                    <h4 className='mb-2 font-semibold'>
                                        Analysis Result:
                                    </h4>
                                    {analysis}
                                </div>
                            )}

                            {!analysis && (
                                <div className='flex flex-wrap justify-center gap-2 text-sm'>
                                    <Badge
                                        variant={'default'}
                                        className='rounded-full px-3 py-1 text-sky-100 dark:text-black'
                                    >
                                        Pros & Cons
                                    </Badge>
                                    <Badge
                                        variant={'destructive'}
                                        className='rounded-full px-3 py-1 text-sky-100 dark:text-black'
                                    >
                                        {' '}
                                        Expert Tips
                                    </Badge>
                                    <Badge
                                        variant={'outline'}
                                        className='rounded-full px-3 py-1 text-black dark:text-white'
                                    >
                                        {' '}
                                        Score Rating
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroWrapper;
