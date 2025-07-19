'use client';

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

export const FileUploader = ({
    onFileSelect,
    selectedFile,
    onRemoveFile,
}: FileUploaderProps) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (
                file &&
                (file.type === 'application/pdf' ||
                    file.type.startsWith('image/'))
            ) {
                onFileSelect(file);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
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
            <Card className='border-border border-2 border-dashed p-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 rounded-lg p-2'>
                            <FileText className='text-primary h-6 w-6' />
                        </div>
                        <div>
                            <p className='text-foreground font-medium'>
                                {selectedFile.name}
                            </p>
                            <p className='text-muted-foreground text-sm'>
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{' '}
                                MB
                            </p>
                        </div>
                    </div>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={onRemoveFile}
                        className='text-muted-foreground hover:text-destructive'
                    >
                        <X className='h-4 w-4' />
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card
            {...getRootProps()}
            className={`hover:border-primary/50 hover:bg-primary/5 animate-fade-in cursor-pointer border-2 border-dashed p-8 transition-all duration-300 hover:shadow-lg ${
                isDragActive
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-border'
            }`}
        >
            <input {...getInputProps()} />
            <div className='animate-slide-up text-center'>
                <div className='bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-200 hover:scale-110'>
                    <Upload className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-1 text-lg font-semibold'>
                    Upload Your Resume
                </h3>
                <p className='text-muted-foreground mb-2'>
                    <span className='text-foreground font-medium'>
                        Drag and drop your file here
                    </span>
                    , or click the button below
                </p>
                <Button variant='outline' onClick={open}>
                    Choose File
                </Button>
                <p className='text-muted-foreground mt-3 text-xs'>
                    Supports PDF and image files up to 10MB
                </p>
            </div>
        </Card>
    );
};
