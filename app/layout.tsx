import type { Metadata } from 'next';
import { Ubuntu_Sans } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/shared/Navigation';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const ubuntuSans = Ubuntu_Sans({
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
        <html lang='en'>
            <body className={`${ubuntuSans} antialiased`}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navigation />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
