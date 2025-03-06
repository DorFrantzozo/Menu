import Hero from "../components/Hero";
import LandingPros from "../components/LandingPros";
import NavBarLanding from "../components/nav/NavBarLanding";
import Contact from "./Contact";

const Landing2 = () => {
  return (
    <>
      <div className=" min-h-screen">
        <NavBarLanding />
        <Hero />
        <div className="">
          <LandingPros />
        </div>
        <Contact />
      </div>
    </>
  );
};

export default Landing2;
