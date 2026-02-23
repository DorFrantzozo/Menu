import React from 'react';
import Hero from "../components/Hero";
import LandingPros from "../components/LandingPros";
import NavBarLanding from "../components/nav/NavBarLanding";
import Contact from "./Contact";
import { motion } from "framer-motion";

const Landing2 = () => {
  return (
    <div className="bg-white min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
      <NavBarLanding />
      <main>
        <Hero />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <LandingPros />
        </motion.div>

        {/* Optional separator or transition section can go here */}

        <div id="contact">
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default Landing2;
