import Hero from "../components/Hero";
import LandingPros from "../components/LandingPros";
import NavBarLanding from "../components/nav/NavBarLanding";
import Contact from "./Contact";

const Landing2 = () => {
  return (
    <>
      <div className="bg-[#fffdf6] min-h-screen">
        <NavBarLanding />
        <Hero />
        <LandingPros />
        <Contact />
      </div>
    </>
  );
};

export default Landing2;
