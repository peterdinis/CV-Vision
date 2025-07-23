'use client';

import { FC, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { analyzeAndUploadCVAction } from '@/actions/cvActions';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion-variants';
import { parseAnalysis } from '@/utils/pdfAnalysis';
import HeroButtons from './HeroButtons';
import { FileUploader } from '@/components/uploads/FileUploader';
import HeroHeader from './HeroHeader';

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
                                Supports PDF files. Get detailed analysis
                                instantly.
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
                                        <Loader2 className='h-8 w-8 animate-spin' />
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
                                    className='bg-muted text-foreground space-y-4 rounded p-4 text-left text-sm'
                                >
                                    <h4 className='mb-2 font-semibold'>
                                        Analysis Result:
                                    </h4>
                                    {(() => {
                                        const { pros, cons, tips } =
                                            parseAnalysis(analysis);
                                        return (
                                            <>
                                                {pros.length > 0 && (
                                                    <div>
                                                        <h5 className='mb-1 font-semibold text-green-500 dark:text-green-200'>
                                                            ✅ Pros:
                                                        </h5>
                                                        <ul className='list-inside list-disc space-y-1 text-green-600 dark:text-green-300'>
                                                            {pros.map(
                                                                (item, idx) => (
                                                                    <li
                                                                        key={`pro-${idx}`}
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                {cons.length > 0 && (
                                                    <div>
                                                        <h5 className='mb-1 font-semibold text-red-500 dark:text-red-200'>
                                                            ❌ Cons:
                                                        </h5>
                                                        <ul className='list-inside list-disc space-y-1 text-red-600 dark:text-red-300'>
                                                            {cons.map(
                                                                (item, idx) => (
                                                                    <li
                                                                        key={`con-${idx}`}
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                {tips.length > 0 && (
                                                    <div>
                                                        <h5 className='mb-1 font-semibold text-orange-500 dark:text-orange-200'>
                                                            💡 Tips:
                                                        </h5>
                                                        <ul className='list-inside list-disc space-y-1 text-orange-600 dark:text-orange-300'>
                                                            {tips.map(
                                                                (item, idx) => (
                                                                    <li
                                                                        key={`tip-${idx}`}
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
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
