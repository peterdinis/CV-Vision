import HeroWrapper from "@/components/home/HeroWrapper";
import SubMenu from "@/components/home/SubMenu";
import { NextPage } from "next";

const Homepage: NextPage = () => {
  return (
      <>
        <SubMenu />
        <HeroWrapper />
      </>
  )
}

export default Homepage