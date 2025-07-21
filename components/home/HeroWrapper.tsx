'use client';

import { FC, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileUploader } from '../uploads/FileUploader';
import { analyzeAndUploadCVAction } from '@/actions/cvActions';
import { Badge } from '../ui/badge';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};


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

    return (
        <section className='container mx-auto mt-20 px-6 py-8'>
            <div className='mx-auto max-w-6xl'>
                <motion.div
                    variants={fadeUp}
                    initial='hidden'
                    animate='visible'
                    className='mb-8 text-center'
                >
                    <h1 className='from-primary to-red-800 via-orange-900 mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                        Analyze Your Resume with AI
                    </h1>
                    <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
                        Upload your resume and get instant feedback with
                        detailed analysis, improvement suggestions, and
                        professional tips.
                    </p>
                </motion.div>

                <div className='grid gap-8 lg:grid-cols-2'>
                    <motion.div
                        custom={1}
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
                                    disabled={analyzingStatus === 'executing'}
                                    className='mt-2'
                                >
                                    {analyzingStatus === 'executing' ? (
                                        <Loader2 className='h-8 w-8 animate-spin' />
                                    ) : (
                                        'Submit for Analysis'
                                    )}
                                </Button>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUp}
                        initial='hidden'
                        animate='visible'
                        className='space-y-6'
                    >
                        <div className='from-muted/30 to-muted/10 border-muted-foreground/20 rounded-2xl border-2 border-dashed bg-gradient-to-br p-8 text-center'>
                            <Brain className='text-muted-foreground mx-auto mb-4 h-16 w-16 animate-pulse' />
                            <h3 className='mb-2 text-xl font-semibold'>
                                Ready to Analyze
                            </h3>
                            <p className='text-muted-foreground mb-4'>
                                Upload your resume to get started with
                                AI-powered analysis
                            </p>

                            {analysis ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className='bg-muted text-foreground rounded p-4 text-left text-sm whitespace-pre-wrap'
                                >
                                    <h4 className='mb-2 font-semibold'>
                                        Analysis Result:
                                    </h4>
                                    {analysis}
                                </motion.div>
                            ) : (
                                <div className='flex flex-wrap justify-center gap-2 text-sm'>
                                    <Badge
                                        variant='default'
                                        className='rounded-full px-3 py-1 text-sky-100 dark:text-black'
                                    >
                                        Pros & Cons
                                    </Badge>
                                    <Badge
                                        variant='destructive'
                                        className='rounded-full px-3 py-1 text-sky-100 dark:text-black'
                                    >
                                        Expert Tips
                                    </Badge>
                                    <Badge
                                        variant='outline'
                                        className='rounded-full px-3 py-1 text-black dark:text-white'
                                    >
                                        Score Rating
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroWrapper;
