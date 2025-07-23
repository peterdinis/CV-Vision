import { FC } from "react";
import { de } from "zod/locales";
import { Badge } from "../ui/badge";

const HeroButtons: FC = () => {
    return (
        <div className='flex flex-wrap justify-center gap-2 text-sm'>
            <Badge
                variant='default'
                className='rounded-full px-3 py-1 text-sky-100 dark:text-black'
            >
                Pros & Cons
            </Badge>
            <Badge
                variant='destructive'
                className='rounded-full px-3 py-1 text-sky-100 dark:text-black'
            >
                Expert Tips
            </Badge>
            <Badge
                variant='outline'
                className='rounded-full px-3 py-1 text-black dark:text-white'
            >
                Score Rating
            </Badge>
        </div>
    )
}

export default HeroButtons;