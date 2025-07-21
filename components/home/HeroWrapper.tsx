'use client';

import { FC, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileUploader } from '../uploads/FileUploader';
import { analyzeAndUploadCVAction } from '@/actions/cvActions';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/framer-variants';

type AnalysisResult = {
  pros: string[];
  cons: string[];
  tips: string[];
};

const parseAnalysis = (text: string): AnalysisResult => {
  const prosMatch = text.match(/Pros:\s*([\s\S]*?)(?=Cons:|Tips:|$)/i);
  const consMatch = text.match(/Cons:\s*([\s\S]*?)(?=Pros:|Tips:|$)/i);
  const tipsMatch = text.match(/Tips:\s*([\s\S]*?)(?=Pros:|Cons:|$)/i);

  const extractList = (block?: string) =>
    block
      ? block
          .split('\n')
          .map((line) => line.replace(/^[-•*]\s*/, '').trim())
          .filter(Boolean)
      : [];

  return {
    pros: extractList(prosMatch?.[1]),
    cons: extractList(consMatch?.[1]),
    tips: extractList(tipsMatch?.[1]),
  };
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
          <h1 className='from-primary mb-4 bg-gradient-to-r via-orange-900 to-red-800 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
            Analyze Your Resume with AI
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            Upload your resume and get instant feedback with detailed analysis,
            improvement suggestions, and professional tips.
          </p>
        </motion.div>

        <div className='grid gap-8 lg:grid-cols-2'>
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='space-y-6'
          >
            <div>
              <h2 className='mb-2 text-2xl font-bold'>Upload Resume</h2>
              <p className='text-muted-foreground'>
                Supports PDF files. Get detailed analysis instantly.
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
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='space-y-6'
          >
            <div className='from-muted/30 to-muted/10 border-muted-foreground/20 rounded-2xl border-2 border-dashed bg-gradient-to-br p-8 text-center'>
              <Brain className='text-muted-foreground mx-auto mb-4 h-16 w-16 animate-pulse' />
              <h3 className='mb-2 text-xl font-semibold'>Ready to Analyze</h3>
              <p className='text-muted-foreground mb-4'>
                Upload your resume to get started with AI-powered analysis
              </p>

              {analysis ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className='bg-muted text-foreground rounded p-4 text-left text-sm space-y-4'
                >
                  <h4 className='font-semibold mb-2'>Analysis Result:</h4>
                  {(() => {
                    const { pros, cons, tips } = parseAnalysis(analysis);
                    return (
                      <>
                        {pros.length > 0 && (
                          <div>
                            <h5 className='text-green-800 font-semibold mb-1'>
                              ✅ Pros:
                            </h5>
                            <ul className='list-disc list-inside space-y-1 text-green-800'>
                              {pros.map((item, idx) => (
                                <li key={`pro-${idx}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {cons.length > 0 && (
                          <div>
                            <h5 className='text-red-800 font-semibold mb-1'>
                              ❌ Cons:
                            </h5>
                            <ul className='list-disc list-inside space-y-1 text-red-800'>
                              {cons.map((item, idx) => (
                                <li key={`con-${idx}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {tips.length > 0 && (
                          <div>
                            <h5 className='text-orange-800 font-semibold mb-1'>
                              💡 Tips:
                            </h5>
                            <ul className='list-disc list-inside space-y-1 text-orange-800'>
                              {tips.map((item, idx) => (
                                <li key={`tip-${idx}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
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
