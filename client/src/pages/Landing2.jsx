import React from "react";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import LandingPros from "../components/LandingPros";
import NavBarLanding from "../components/nav/NavBarLanding";
import Contact from "./Contact";
import FAQ from "../components/Landing/FAQ";
import {motion} from "framer-motion";

const Landing2 = () => {
  return (
    <div className="bg-white mt-20 min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
      <NavBarLanding />
      <main>
        <Hero />

        <HowItWorks />

        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 1}}
          viewport={{once: true}}
        >
          <LandingPros />
        </motion.div>

        <HowItWorks />

        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 1}}
          viewport={{once: true}}
        >
          <FAQ />
        </motion.div>

        <div id="contact">
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default Landing2;
