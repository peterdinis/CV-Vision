'use client';

import { FC, useState } from 'react';
import { Brain } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Button } from '@/components/ui/button';
import { uploadCVAction } from '@/actions/cvActions';
import {toast} from "sonner"
import { FileUploader } from '../uploads/FileUploader';

const HeroWrapper: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { execute, result, status } = useAction(uploadCVAction, {
    onSuccess: (data) => {
      toast.success("Resume was uploaded");
      console.log('Upload success:', data);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error("Failed to upload resume");
    },
  });

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('resume', selectedFile);
    execute({});
  };

  return (
    <section className="container mx-auto px-6 py-8 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analyze Your Resume with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and get instant feedback with detailed analysis, improvement suggestions, and professional tips.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload Resume</h2>
              <p className="text-muted-foreground">
                Supports PDF and image files. Get detailed analysis instantly.
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
                  onClick={handleUpload}
                  disabled={status === 'executing'}
                  className="mt-2"
                >
                  {status === 'executing' ? 'Uploading...' : 'Submit for Analysis'}
                </Button>
              </div>
            )}

            {result?.data && (
              <p className="text-sm text-green-600">
                ✅ Uploaded <strong>{result.data.name}</strong> ({(result.data.size / 1024).toFixed(1)} KB)
              </p>
            )}

            {result?.serverError && (
              <p className="text-sm text-red-600">❌ {result.serverError}</p>
            )}
          </div>

          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 text-center border-2 border-dashed border-muted-foreground/20 animate-scale-in">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-muted-foreground mb-4">
                Upload your resume to get started with AI-powered analysis
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Pros & Cons</span>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full">Expert Tips</span>
                <span className="px-3 py-1 bg-success/10 text-success rounded-full">Score Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWrapper;
