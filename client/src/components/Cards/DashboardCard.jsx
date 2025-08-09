import React from 'react'
import { motion } from 'framer-motion'

const DashboardCard = ({ array, name, icon, bgColor = "bg-zinc-100", iconColor = "text-zinc-700" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.05  }}
      className={`relative mt-10 w-[80%] h-40 p-5 rounded-xl shadow-md ${bgColor} border hover:shadow-xl transition-transform duration-300 ease-in-out`}
    >
      <div className="absolute top-4 left-4 hover:scale-105 transition-transform  bg-white rounded-full p-2 shadow-sm">
        {React.cloneElement(icon, { className: `w-6 h-6 md:w-10 md:h-10 ${iconColor}` })}
      </div>
      <div className="absolute top-4 right-4">
        <h1 className="text-black text-xl font-semibold">{name}</h1>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <h2 className="text-3xl text-black font-bold">
          {Array.isArray(array) ? array.length : array}
        </h2>
      </div>
    </motion.div>
  )
}

export default DashboardCard
