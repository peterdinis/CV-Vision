import { FC } from 'react';
import { Brain } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

const Navigation: FC = () => {
    return (
        <nav className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
            <div className='container mx-auto px-6'>
                <div className='flex h-16 items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='bg-primary/10 rounded-lg p-2'>
                            <Brain className='text-primary h-6 w-6' />
                        </div>
                        <div>
                            <h1 className='text-xl font-bold'>CV-Vision</h1>
                            <p className='text-muted-foreground text-xs'>
                                Resume Analysis Tool
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='text-muted-foreground hidden items-center gap-2 text-sm sm:flex'>
                            <Brain className='h-4 w-4' />
                            <span>AI-Powered Analysis</span>
                        </div>
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
