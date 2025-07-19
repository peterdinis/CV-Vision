import { FC } from 'react';
import { Brain, Target, Users, TrendingUp } from 'lucide-react';

const SubMenu: FC = () => {
    return (
        <div className='from-primary/5 to-accent/5 animate-fade-in border-b bg-gradient-to-r'>
            <div className='container mx-auto px-6 py-4'>
                <div className='flex flex-wrap justify-center gap-8 text-center'>
                    <div
                        className='animate-slide-up flex items-center gap-2'
                        style={{ animationDelay: '0.1s' }}
                    >
                        <Brain className='text-primary h-5 w-5' />
                        <div>
                            <div className='text-primary text-lg font-bold'>
                                AI-Powered
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                Advanced Analysis
                            </div>
                        </div>
                    </div>
                    <div
                        className='animate-slide-up flex items-center gap-2'
                        style={{ animationDelay: '0.2s' }}
                    >
                        <Target className='h-5 w-5 text-green-800' />
                        <div>
                            <div className='text-lg font-bold text-green-800'>
                                Instant
                            </div>
                            <div className='text-xs text-green-800'>
                                Results in Seconds
                            </div>
                        </div>
                    </div>
                    <div
                        className='animate-slide-up flex items-center gap-2'
                        style={{ animationDelay: '0.3s' }}
                    >
                        <Users className='h-5 w-5 text-red-800' />
                        <div>
                            <div className='text-lg font-bold text-red-800'>
                                HR-Approved
                            </div>
                            <div className='text-xs text-red-800'>
                                Expert Tips
                            </div>
                        </div>
                    </div>
                    <div
                        className='animate-slide-up flex items-center gap-2'
                        style={{ animationDelay: '0.4s' }}
                    >
                        <TrendingUp className='text-warning h-5 w-5' />
                        <div>
                            <div className='text-warning text-lg font-bold'>
                                Actionable
                            </div>
                            <div className='text-muted-foreground text-xs'>
                                Improvements
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubMenu;
