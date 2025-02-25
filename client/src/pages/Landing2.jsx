import Hero from "../components/Hero";
import NavBarLanding from "../components/nav/NavBarLanding";

const Landing2 = () => {
  return (
    <>
      <div className="bg-black min-h-screen">
        <NavBarLanding />

        <Hero />
      </div>
    </>
  );
};

export default Landing2;
