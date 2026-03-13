import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardMockup from './Dashboard/DashboardMockup';
import MenuMockup from './MenuMockup';
import LandingQrCode from '../assets/img/LandingQrCode.png';

export default function Hero() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-24 overflow-hidden bg-white">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 -translate-x-1/4 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        className="max-w-7xl mx-auto px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Top Badge */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center mb-4 lg:mb-5"
        >
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm transition-all hover:scale-105 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-700 text-[10px] lg:text-[11px] font-black tracking-widest uppercase">הצטרפו למהפכה הדיגיטלית</span>
          </div>
        </motion.div>

        {/* Text Area */}
        <div className="text-center max-w-4xl mx-auto mb-8 lg:mb-10 px-4 md:px-0" dir="rtl">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-[5rem] font-black text-zinc-900 mb-4 lg:mb-5 tracking-tighter leading-tight lg:leading-[1.1]"
          >
            קחו שליטה מלאה על התפריט, <br />
            <span className="bg-gradient-to-l from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              והגדילו רווחים מיד
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-zinc-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto mb-6 lg:mb-7 leading-relaxed"
          >
            פלטפורמת התפריטים הדיגיטליים שחוסכת לכם זמן, מורידה עלויות הדפסה, ומגדילה את ממוצע ההזמנות - בלי אפליקציות ובלי המתנה לגרפיקאי.
          </motion.p>
          
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => navigate("/signup")}
              className="group mx-auto mb-6 relative px-8 py-4 lg:px-10 lg:py-4 bg-zinc-900 text-white rounded-[2rem] font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/10 overflow-hidden"
            >
              <span className="relative z-10">התחילו עכשיו</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
       
          </motion.div>
        </div>

        {/* Mockup Showcase */}
        <motion.div 
          variants={itemVariants}
          className="relative max-w-6xl mx-auto pt-0 lg:pt-0"
        >
          {/* Dashboard (Background) */}
          <motion.div 
            className="relative z-0 md:ms-40 lg:ms-48 scale-[0.7] md:scale-[0.8] lg:scale-[0.85] origin-top shadow-2xl rounded-[3rem] overflow-hidden bg-white mt-[-20px] lg:mt-[-40px]"
          >
             <DashboardMockup />
          </motion.div>

          {/* Smartphone (Foreground - Floating) */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20px] left-8 md:left-[80px] lg:left-[120px] z-20 w-[160px] md:w-[220px] lg:w-[260px]"
          >
            <div className="shadow-[0_30px_80px_rgba(0,0,0,0.25)] rounded-[3rem]">
              <MenuMockup />
            </div>
          </motion.div>

          {/* QR Code Card (Floating - No Overlap) */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[10%] left-[-10px] md:left-[-30px] lg:left-[-60px] z-30 bg-white p-3 md:p-4 rounded-2xl shadow-2xl border border-zinc-100 max-w-[120px] md:max-w-[150px] text-center"
          >
            <div className="bg-zinc-50 rounded-lg p-2 mb-2 overflow-hidden aspect-square flex items-center justify-center">
              <img src={LandingQrCode} alt="Menu QR Code" className="w-full h-full object-contain" />
            </div>
            <p className="text-[10px] lg:text-[11px] font-black text-zinc-900 leading-tight" dir="rtl">סרקו לצפייה <br /> בתפריט חי</p>
          </motion.div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-emerald-500/5 blur-[120px] rounded-full -z-10"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
