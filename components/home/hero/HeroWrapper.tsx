'use client';

import { FC, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { analyzeAndUploadCVAction } from '@/actions/cvActions';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion-variants';
import HeroButtons from './HeroButtons';
import { FileUploader } from '@/components/uploads/FileUploader';
import HeroHeader from './HeroHeader';
import { formatAnalysisHTML } from '@/utils/fromatAnalysisHTML';

const HeroWrapper: FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const { execute: analyzeCV, status: analyzingStatus } = useAction(
        analyzeAndUploadCVAction,
        {
            onSuccess: (data) => {
                toast.success('✅ CV analysis complete!');
                setAnalysis(data.data.analysis);
            },
            onError: (err) => {
                toast.error('❌ CV analysis failed: ' + err);
            },
        }
    );

    const handleUploadAndAnalyze = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        try {
            toast.message('📄 Uploading and analyzing resume...');
            analyzeCV({ file: selectedFile });
        } catch (err) {
            toast.error((err as Error).message || '❌ Error uploading CV');
        }
    };

    const cleanFileUploader = () => {
        setSelectedFile(null);
        setAnalysis(null);
    };

    return (
        <section className='container mx-auto mt-20 px-6 py-8'>
            <div className='mx-auto max-w-6xl'>
                <HeroHeader />
                <div className='grid gap-8 lg:grid-cols-2'>
                    <motion.div
                        variants={fadeUp}
                        initial='hidden'
                        animate='visible'
                        className='space-y-6'
                    >
                        <div>
                            <h2 className='mb-2 text-2xl font-bold'>
                                Upload Resume
                            </h2>
                            <p className='text-muted-foreground'>
                                Supports PDF files. Get detailed analysis instantly.
                            </p>
                        </div>

                        <FileUploader
                            selectedFile={selectedFile}
                            onFileSelect={setSelectedFile}
                            onRemoveFile={cleanFileUploader}
                        />

                        {selectedFile && (
                            <div className='flex justify-end'>
                                <Button
                                    onClick={handleUploadAndAnalyze}
                                    disabled={analyzingStatus === 'executing'}
                                    className='mt-2'
                                >
                                    {analyzingStatus === 'executing' ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Submit for Analysis'
                                    )}
                                </Button>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial='hidden'
                        animate='visible'
                        className='space-y-6'
                    >
                        <div className='from-muted/30 to-muted/10 border-muted-foreground/20 rounded-2xl border-2 border-dashed bg-linear-to-br p-8 text-center'>
                            <Brain className='text-muted-foreground mx-auto mb-4 h-16 w-16 animate-pulse' />
                            <h3 className='mb-2 text-xl font-semibold'>
                                Ready to Analyze
                            </h3>
                            <p className='text-muted-foreground mb-4'>
                                Upload your resume to get started with AI-powered analysis
                            </p>

                            {analysis ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className='bg-muted text-foreground max-h-100 overflow-y-auto rounded p-4 text-left text-sm'
                                >
                                    <div 
                                        className="prose prose-sm max-w-none dark:prose-invert"
                                        dangerouslySetInnerHTML={{ 
                                            __html: formatAnalysisHTML(analysis) 
                                        }} 
                                    />
                                    
                                    <div className='mt-6 flex justify-center'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => {
                                                const element = document.createElement('a');
                                                const file = new Blob([analysis], { type: 'text/plain' });
                                                element.href = URL.createObjectURL(file);
                                                element.download = 'cv-analysis-report.txt';
                                                document.body.appendChild(element);
                                                element.click();
                                                document.body.removeChild(element);
                                            }}
                                        >
                                            📥 Download Analysis Report
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <HeroButtons />
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroWrapper;