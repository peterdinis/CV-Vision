'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion-variants';

const HeroHeader: FC = () => {
    return (
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
                Upload your resume and get instant feedback with detailed
                analysis, improvement suggestions, and professional tips.
            </p>
        </motion.div>
    );
};

export default HeroHeader;
