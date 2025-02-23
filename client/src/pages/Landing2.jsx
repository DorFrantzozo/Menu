import Iphone3D from "../components/animations/Iphone3D";
import Hero from "../components/Hero";
import NavBarLanding from "../components/nav/NavBarLanding";

const Landing2 = () => {
  return (
    <>
      <div className="flex justify-center mt-2 ">
        <NavBarLanding />
      </div>
      <div className="  ">
        <Iphone3D />
      </div>
      <Hero />
    </>
  );
};

export default Landing2;
