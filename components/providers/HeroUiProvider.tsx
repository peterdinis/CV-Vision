"use client"

import { FC, ReactNode } from "react";
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";

type HeroUiProviderProps = {
    children?: ReactNode
}

const HeroUiProvider: FC<HeroUiProviderProps> = ({
    children
}) => {
    return (
        <HeroUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    )
}

export default HeroUiProvider