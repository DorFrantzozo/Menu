import Hero from "../components/Hero";
import Pricing from "../components/Pricing";

const Home = () => {
  return (
    <div className="text-white">
      <Hero />
   
      <hr className="border-lime-200"></hr>
      <Pricing />
    </div>
  );
};

export default Home;
