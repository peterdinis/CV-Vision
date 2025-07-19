'use client';

import { FC, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileUploader } from '../uploads/FileUploader';
import { analyzeCVAction, extractTextAction } from '@/actions/cvActions';

const HeroWrapper: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const { execute: extractText, status: extractingStatus } = useAction<
    { file: File },
    { text: string },
    Error,
    unknown
  >(extractTextAction, {
    onError: (err) => toast.error('Failed to extract text: ' + err.message),
  });

  const { execute: analyzeCV, status: analyzingStatus } = useAction<
    { content: string },
    { analysis: string },
    Error,
    unknown
  >(analyzeCVAction, {
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      toast.success('Analysis complete!');
    },
    onError: (err) => toast.error('Analysis failed: ' + err.message),
  });

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    // 1. Extract text from PDF (support PDF only for now)
    const extractionResult = await extractText({ file: selectedFile });

    if (!extractionResult || !extractionResult.text) {
      toast.error('No text extracted from resume');
      return;
    }

    // 2. Send extracted text to OpenAI for analysis
    await analyzeCV({ content: extractionResult.text });
  };

  return (
    <section className="container mx-auto mt-20 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="animate-fade-in mb-8 text-center">
          <h1 className="from-primary to-accent mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Analyze Your Resume with AI
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Upload your resume and get instant feedback with detailed analysis,
            improvement suggestions, and professional tips.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="animate-slide-up space-y-6" style={{ animationDelay: '0.2s' }}>
            <div>
              <h2 className="mb-2 text-2xl font-bold">Upload Resume</h2>
              <p className="text-muted-foreground">
                Supports PDF files. Get detailed analysis instantly.
              </p>
            </div>

            <FileUploader
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onRemoveFile={() => setSelectedFile(null)}
            />

            {selectedFile && (
              <div className="flex justify-end">
                <Button
                  onClick={handleUploadAndAnalyze}
                  disabled={extractingStatus === 'executing' || analyzingStatus === 'executing'}
                  className="mt-2"
                >
                  {(extractingStatus === 'executing' || analyzingStatus === 'executing') ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    'Submit for Analysis'
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="animate-slide-up space-y-6" style={{ animationDelay: '0.4s' }}>
            <div className="from-muted/30 to-muted/10 border-muted-foreground/20 animate-scale-in rounded-2xl border-2 border-dashed bg-gradient-to-br p-8 text-center">
              <Brain className="text-muted-foreground mx-auto mb-4 h-16 w-16 animate-pulse" />
              <h3 className="mb-2 text-xl font-semibold">Ready to Analyze</h3>
              <p className="text-muted-foreground mb-4">
                Upload your resume to get started with AI-powered analysis
              </p>

              {analysis && (
                <div className="whitespace-pre-wrap rounded bg-muted p-4 text-left text-sm text-foreground">
                  <h4 className="mb-2 font-semibold">Analysis Result:</h4>
                  {analysis}
                </div>
              )}

              {!analysis && (
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1">
                    Pros & Cons
                  </span>
                  <span className="bg-accent/10 text-accent rounded-full px-3 py-1">
                    Expert Tips
                  </span>
                  <span className="bg-success/10 text-success rounded-full px-3 py-1">
                    Score Rating
                  </span>
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
