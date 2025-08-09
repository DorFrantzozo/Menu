import { motion } from "framer-motion";

export default function DesignCard({ design, onSelect, onTry }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={design.img}
          alt={design.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {design.title}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3 className="text-lg font-semibold text-slate-800 mb-1 text-center">
          {design.desc}
        </h3>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onSelect}
            className="bg-gradient-to-br from-amber-400 to-orange-500
 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-medium"
          >
            בחר עיצוב זה
          </button>
          <button
            onClick={onTry}
            className="text-slate-500 hover:text-slate-700 text-sm underline"
          >
            לצפייה חיה
          </button>
        </div>
      </div>
    </motion.div>
  );
}
