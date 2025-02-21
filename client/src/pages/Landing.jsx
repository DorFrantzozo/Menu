import Hero from "../components/Hero";
import Pricing from "../components/Pricing";

const Home = () => {
  return (
    <div className="text-white">
      <Hero />

      <hr className="border-emerald-400"></hr>
      <Pricing />
    </div>
  );
};

export default Home;
