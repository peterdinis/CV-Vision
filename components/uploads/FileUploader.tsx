"use client"

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export const FileUploader = ({ onFileSelect, selectedFile, onRemoveFile }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxSize: 10 * 1024 * 1024,
  });

  if (selectedFile) {
    return (
      <Card className="p-6 border-2 border-dashed border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemoveFile}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      {...getRootProps()}
      className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg animate-fade-in ${
        isDragActive ? 'border-primary bg-primary/10 scale-105' : 'border-border'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center animate-slide-up">
        <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-200 hover:scale-110">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Upload Your Resume</h3>
        <p className="text-muted-foreground mb-2">
          <span className="font-medium text-foreground">Drag and drop your file here</span>, or click the button below
        </p>
        <Button variant="outline" onClick={open}>
          Choose File
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Supports PDF and image files up to 10MB
        </p>
      </div>
    </Card>
  );
};
