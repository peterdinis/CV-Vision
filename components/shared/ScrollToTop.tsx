'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <Button
            onClick={scrollToTop}
            className='fixed right-8 bottom-8 rounded-full p-3 shadow-lg'
            aria-label='Scroll to top'
            variant='default'
        >
            <ArrowUp className='h-5 w-5' />
        </Button>
    );
}
