import HeroWrapper from '@/components/home/hero/HeroWrapper';
import SubMenu from '@/components/home/menu/SubMenu';
import { NextPage } from 'next';

const Homepage: NextPage = () => {
    return (
        <>
            <SubMenu />
            <HeroWrapper />
        </>
    );
};

export default Homepage;
