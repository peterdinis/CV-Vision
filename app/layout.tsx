import type { Metadata } from 'next';
import { Ubuntu} from 'next/font/google';
import './globals.css';
import Navigation from '@/components/shared/Navigation';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ScrollToTop } from '@/components/shared/ScrollToTop';

const ubuntu = Ubuntu({
    subsets: ['latin-ext'],
    weight: '700',
});

export const metadata: Metadata = {
    title: 'CV-Vision',
    description: 'Application for analysie CV',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={`${ubuntu} antialiased`}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navigation />
                    {children}
                    <ScrollToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}
